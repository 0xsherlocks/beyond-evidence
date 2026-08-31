import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId, status: 'paid' },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    courses: purchases.map((p) => ({
      id: p.id,
      courseName: p.courseName,
      courseSlug: p.courseSlug || p.courseId,
      examType: p.examType || 'UGC NET',
      purchasedAt: p.createdAt,
    })),
  })
}
