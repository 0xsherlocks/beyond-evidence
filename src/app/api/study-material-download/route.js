import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { sanityClient } from "@/src/sanity/client";

export const runtime = "nodejs";

export async function GET(request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  const packageId = searchParams.get("packageId") || "";
  const index = Number(searchParams.get("index"));

  if (!slug || !packageId || !Number.isInteger(index) || index < 0) {
    return NextResponse.json({ error: "Invalid download request" }, { status: 400 });
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
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }

  return NextResponse.redirect(url);
}
