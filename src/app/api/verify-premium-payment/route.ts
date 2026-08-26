import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/src/lib/prisma'

export const runtime = 'nodejs'

function timingSafeEqualHex(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a || '', 'hex')
  const bBuffer = Buffer.from(b || '', 'hex')
  if (aBuffer.length !== bBuffer.length) return false
  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) throw new Error('Missing Razorpay key secret')
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return timingSafeEqualHex(expected, signature)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const orderId: string   = typeof body?.razorpay_order_id   === 'string' ? body.razorpay_order_id   : ''
  const paymentId: string = typeof body?.razorpay_payment_id === 'string' ? body.razorpay_payment_id : ''
  const signature: string = typeof body?.razorpay_signature  === 'string' ? body.razorpay_signature  : ''

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 })
  }

  const purchase = await prisma.purchase.findUnique({ where: { orderId } })
  if (!purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }
  if (purchase.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Already paid — idempotent success
  if (purchase.status === 'paid') {
    return NextResponse.json({
      success: true,
      status: 'paid',
      courseSlug: purchase.courseSlug,
      redirectUrl: '/dashboard/my-courses',
    })
  }

  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    await prisma.purchase.update({ where: { orderId }, data: { status: 'failed' } })
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  const updated = await prisma.purchase.update({
    where: { orderId },
    data: { paymentId, status: 'paid' },
  })

  return NextResponse.json({
    success: true,
    status: updated.status,
    courseSlug: updated.courseSlug,
    redirectUrl: '/dashboard/my-courses',
  })
}
