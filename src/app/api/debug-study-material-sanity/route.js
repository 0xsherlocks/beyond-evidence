import { NextResponse } from "next/server";
import { sanityClient, projectId, dataset } from "@/src/sanity/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const docs = await sanityClient.fetch(
      `*[_type == "studyMaterial"] | order(order asc){
        _id,
        title,
        "slug": slug.current,
        order
      }`,
      {},
      { cache: "no-store" }
    );

    return NextResponse.json({
      projectId,
      dataset,
      hasToken: Boolean(process.env.SANITY_API_TOKEN),
      count: docs.length,
      docs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        projectId,
        dataset,
        hasToken: Boolean(process.env.SANITY_API_TOKEN),
        error: error?.message || "Unknown Sanity error",
      },
      { status: 500 }
    );
  }
}
