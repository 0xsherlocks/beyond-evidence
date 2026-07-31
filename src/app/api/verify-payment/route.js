import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

function timingSafeEqualHex(a, b) {
  const aBuffer = Buffer.from(a || "", "hex");
  const bBuffer = Buffer.from(b || "", "hex");

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Missing Razorpay key secret");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return timingSafeEqualHex(expectedSignature, signature);
}

export async function POST(request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = typeof body?.razorpay_order_id === "string" ? body.razorpay_order_id : "";
  const paymentId = typeof body?.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const signature = typeof body?.razorpay_signature === "string" ? body.razorpay_signature : "";

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { orderId },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  if (purchase.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (purchase.status === "paid") {
    return NextResponse.json({
      success: true,
      status: "paid",
      courseId: purchase.courseId,
      packageId: purchase.packageId,
    });
  }

  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    await prisma.purchase.update({
      where: { orderId },
      data: { status: "failed" },
    });

    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const updatedPurchase = await prisma.purchase.update({
    where: { orderId },
    data: {
      paymentId,
      status: "paid",
    },
  });

  return NextResponse.json({
    success: true,
    status: updatedPurchase.status,
    courseId: updatedPurchase.courseId,
    packageId: updatedPurchase.packageId,
  });
}
