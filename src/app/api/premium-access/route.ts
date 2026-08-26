import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ access: false, reason: 'unauthenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ access: false, reason: 'missing_slug' }, { status: 400 })
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      OR: [
        { courseSlug: slug },
        { courseId: slug }
      ],
      status: 'paid',
    },
    select: { id: true, courseName: true },
  })

  return NextResponse.json({
    access: !!purchase,
    courseName: purchase?.courseName ?? null,
  })
}
