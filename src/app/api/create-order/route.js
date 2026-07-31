import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { sanityClient } from "@/src/sanity/client";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;

const rateLimitStore =
  globalThis.__createOrderRateLimitStore ||
  new Map();

globalThis.__createOrderRateLimitStore = rateLimitStore;

function checkRateLimit(userId) {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now - entry.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(userId, { count: 1, startedAt: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Missing Razorpay API credentials");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function getStudyMaterialPackage(slug, packageId) {
  const material = await sanityClient.fetch(
    `*[_type == "studyMaterial" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      packages[]{id, title, priceAmount}
    }`,
    { slug },
    { cache: "no-store" }
  );

  const selectedPackage = material?.packages?.find((pkg) => pkg.id === packageId);

  return { material, selectedPackage };
}

export async function POST(request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!checkRateLimit(userId)) {
    return NextResponse.json(
      { error: "Too many order requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const slug = typeof body?.slug === "string" ? body.slug : "";
  const packageId = typeof body?.packageId === "string" ? body.packageId : "";

  if (!slug || !packageId) {
    return NextResponse.json({ error: "Missing slug or packageId" }, { status: 400 });
  }

  const { material, selectedPackage } = await getStudyMaterialPackage(slug, packageId);

  if (!material || !selectedPackage) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const priceAmount = Number(selectedPackage.priceAmount);

  if (!Number.isFinite(priceAmount) || priceAmount <= 0) {
    return NextResponse.json({ error: "Package price is not configured" }, { status: 400 });
  }

  const razorpay = getRazorpayClient();
  const amountInPaise = Math.round(priceAmount * 100);
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `purchase_${Date.now()}`,
    notes: {
      userId,
      courseId: material.slug,
      packageId: selectedPackage.id,
    },
  });

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      courseId: material.slug,
      courseName: material.title,
      packageId: selectedPackage.id,
      packageName: selectedPackage.title,
      amount: Math.round(priceAmount),
      orderId: order.id,
      status: "pending",
    },
  });

  return NextResponse.json({
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    purchaseId: purchase.id,
    courseId: material.slug,
    courseName: material.title,
    packageId: selectedPackage.id,
    packageName: selectedPackage.title,
  });
}
