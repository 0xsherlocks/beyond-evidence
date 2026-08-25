import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/src/lib/prisma'
import { sanityClient } from '@/src/sanity/client'

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5

const rateLimitStore: Map<string, { count: number; startedAt: number }> =
  (globalThis as any).__premiumOrderRateLimitStore ??
  new Map();
;(globalThis as any).__premiumOrderRateLimitStore = rateLimitStore

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(userId)
  if (!entry || now - entry.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(userId, { count: 1, startedAt: now })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count += 1
  return true
}

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing Razorpay API credentials')
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!checkRateLimit(userId)) {
    return NextResponse.json(
      { error: 'Too many order requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const courseSlug: string = typeof body?.courseSlug === 'string' ? body.courseSlug : ''
  if (!courseSlug) {
    return NextResponse.json({ error: 'Missing courseSlug' }, { status: 400 })
  }

  // Fetch course from Sanity to verify price server-side
  const course = await sanityClient.fetch(
    `*[_type == "premiumCourse" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, examType, price, isPremium
    }`,
    { slug: courseSlug },
    { cache: 'no-store' }
  )

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const priceAmount = Number(course.price)
  if (!Number.isFinite(priceAmount) || priceAmount <= 0) {
    return NextResponse.json({ error: 'Course price is not configured' }, { status: 400 })
  }

  // Check for existing paid purchase (idempotency)
  const existing = await prisma.premiumPurchase.findFirst({
    where: { userId, courseSlug, status: 'paid' },
    select: { id: true },
  })
  if (existing) {
    return NextResponse.json({ alreadyPurchased: true }, { status: 200 })
  }

  const razorpay = getRazorpayClient()
  const amountInPaise = Math.round(priceAmount * 100)
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `premium_${Date.now()}`,
    notes: { userId, courseId: course._id, courseSlug, examType: course.examType },
  })

  const purchase = await prisma.premiumPurchase.create({
    data: {
      userId,
      courseId: course._id,
      courseSlug,
      courseName: course.title,
      examType: course.examType,
      amount: Math.round(priceAmount),
      orderId: order.id,
      status: 'pending',
    },
  })

  return NextResponse.json({
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    purchaseId: purchase.id,
    courseId: course._id,
    courseSlug,
    courseName: course.title,
    examType: course.examType,
  })
}
