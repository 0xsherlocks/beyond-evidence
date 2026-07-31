import { NextResponse } from "next/server";
import crypto from "node:crypto";
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

function verifyWebhookSignature(rawBody, signature) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    throw new Error("Missing Razorpay webhook secret");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return timingSafeEqualHex(expectedSignature, signature);
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (error) {
    return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 });
  }

  if (event?.event !== "payment.captured") {
    return NextResponse.json({ success: true, ignored: true });
  }

  const payment = event?.payload?.payment?.entity;
  const orderId = payment?.order_id;
  const paymentId = payment?.id;

  if (!orderId || !paymentId) {
    return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { orderId },
  });

  if (!purchase) {
    return NextResponse.json({ success: true, ignored: true });
  }

  if (purchase.status === "paid") {
    return NextResponse.json({ success: true, status: "paid" });
  }

  await prisma.purchase.update({
    where: { orderId },
    data: {
      paymentId,
      status: "paid",
    },
  });

  return NextResponse.json({ success: true, status: "paid" });
}
