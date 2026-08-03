import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { sanityClient } from "@/src/sanity/client";
import { watermarkPdf } from "@/src/lib/watermark";
import { verifySignedToken } from "@/src/lib/signedUrl";
import { logAccess } from "@/src/lib/accessLog";

export const runtime = "nodejs";

// Guard against watermarking huge files in memory (25 MB).
const MAX_PDF_BYTES = 25 * 1024 * 1024;

export async function GET(request) {
  const { userId } = await auth();

  if (!userId) {
    await logAccess({ outcome: "denied", reason: "unauthenticated" }, request);
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  const packageId = searchParams.get("packageId") || "";
  const index = Number(searchParams.get("index"));
  const token = searchParams.get("token") || "";

  if (!slug || !packageId || !Number.isInteger(index) || index < 0) {
    await logAccess({ userId, slug, packageId, index, outcome: "denied", reason: "invalid_request" }, request);
    return NextResponse.json({ error: "Invalid download request" }, { status: 400 });
  }

  // Verify the short-lived signed token and ensure it matches this request +
  // the authenticated user (prevents replay/sharing of the viewer URL).
  const verified = verifySignedToken(token);
  if (
    !verified.valid ||
    verified.payload.userId !== userId ||
    verified.payload.slug !== slug ||
    verified.payload.packageId !== packageId ||
    verified.payload.index !== index
  ) {
    const reason = verified.valid ? "token_mismatch" : `token_${verified.reason}`;
    await logAccess({ userId, slug, packageId, index, outcome: "denied", reason }, request);
    return NextResponse.json({ error: "Link expired or invalid. Please reopen the document." }, { status: 403 });
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      courseId: slug,
      packageId,
      status: "paid",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!purchase) {
    await logAccess({ userId, slug, packageId, index, outcome: "denied", reason: "not_paid" }, request);
    return NextResponse.json({ error: "Paid purchase required" }, { status: 403 });
  }

  const material = await sanityClient.fetch(
    `*[_type == "studyMaterial" && slug.current == $slug][0]{
      packages[id == $packageId][0]{
        downloadLinks[]{url}
      }
    }`,
    { slug, packageId },
    { cache: "no-store" }
  );

  const url = material?.packages?.downloadLinks?.[index]?.url;

  if (!url) {
    await logAccess(
      { userId, purchaseId: purchase.id, slug, packageId, index, outcome: "denied", reason: "not_found" },
      request
    );
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }

  // Fetch the source PDF server-side (the raw URL is never exposed to client).
  let sourceBytes;
  try {
    const sourceResponse = await fetch(url, { cache: "no-store" });
    if (!sourceResponse.ok) {
      throw new Error(`Source responded ${sourceResponse.status}`);
    }

    const contentLength = Number(sourceResponse.headers.get("content-length") || 0);
    if (contentLength && contentLength > MAX_PDF_BYTES) {
      await logAccess(
        { userId, purchaseId: purchase.id, slug, packageId, index, outcome: "denied", reason: "too_large" },
        request
      );
      return NextResponse.json({ error: "Document is too large to serve securely." }, { status: 413 });
    }

    sourceBytes = await sourceResponse.arrayBuffer();
    if (sourceBytes.byteLength > MAX_PDF_BYTES) {
      await logAccess(
        { userId, purchaseId: purchase.id, slug, packageId, index, outcome: "denied", reason: "too_large" },
        request
      );
      return NextResponse.json({ error: "Document is too large to serve securely." }, { status: 413 });
    }
  } catch (error) {
    await logAccess(
      { userId, purchaseId: purchase.id, slug, packageId, index, outcome: "error", reason: "source_fetch_failed" },
      request
    );
    return NextResponse.json({ error: "Unable to retrieve the document." }, { status: 502 });
  }

  // Resolve buyer identity for the watermark.
  let name = "";
  let email = "";
  try {
    const user = await currentUser();
    name = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "";
    email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";
  } catch {
    // Non-fatal: fall back to purchase id only in the watermark.
  }

  // Watermark fresh per request — never cached, uniquely traceable to buyer.
  let stamped;
  try {
    stamped = await watermarkPdf({
      pdfBytes: sourceBytes,
      name,
      email,
      purchaseId: purchase.id,
    });
  } catch (error) {
    await logAccess(
      { userId, purchaseId: purchase.id, slug, packageId, index, outcome: "error", reason: "watermark_failed" },
      request
    );
    return NextResponse.json({ error: "Unable to prepare the document." }, { status: 502 });
  }

  await logAccess(
    { userId, purchaseId: purchase.id, slug, packageId, index, outcome: "served" },
    request
  );

  // Serve inline so the in-browser viewer renders it instead of downloading.
  return new NextResponse(Buffer.from(stamped), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="document-${index + 1}.pdf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
