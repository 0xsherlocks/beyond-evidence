import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { sanityClient } from "@/src/sanity/client";
import { createSignedToken } from "@/src/lib/signedUrl";


export const runtime = "nodejs";

export async function GET(request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "";
  const packageId = searchParams.get("packageId") || "";

  if (!slug || !packageId) {
    return NextResponse.json({ error: "Missing slug or packageId" }, { status: 400 });
  }

  const allPurchases = await prisma.purchase.findMany({
    where: { userId, courseId: slug, status: "paid" },
    select: { packageId: true },
  });
  const purchasedPackageIds = allPurchases.map((p) => p.packageId);

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
    return NextResponse.json({ hasAccess: false, purchasedPackageIds });
  }

  const material = await sanityClient.fetch(
    `*[_type == "studyMaterial" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      packages[id == $packageId][0]{
        id,
        title,
        downloadLinks[]{title, url}
      }
    }`,
    { slug, packageId },
    { cache: "no-store" }
  );

  const selectedPackage = material?.packages;
  const downloadLinks = selectedPackage?.downloadLinks || [];

  return NextResponse.json({
    hasAccess: true,
    purchasedPackageIds,
    courseId: purchase.courseId,
    courseName: purchase.courseName,
    packageId: purchase.packageId,
    packageName: purchase.packageName,
    downloadLinks: downloadLinks.map((link, index) => {
      // Fresh short-lived signed token per link, bound to this user + resource.
      const token = createSignedToken({ userId, slug, packageId, index });
      return {
        title: link.title || `Document ${index + 1}`,
        url: `/api/study-material-download?slug=${encodeURIComponent(slug)}&packageId=${encodeURIComponent(packageId)}&index=${index}&token=${encodeURIComponent(token)}`,
      };
    }),
  });
}

