import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import DashboardClient from './DashboardClient'

export default async function MyCoursesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in?redirect_url=/dashboard/my-courses')

  const user = await currentUser()

  const purchases = await prisma.purchase.findMany({
    where: { userId, status: 'paid' },
    orderBy: { createdAt: 'desc' },
  })

  const courses = purchases.map((p) => ({
    id: p.id,
    courseName: p.courseName,
    courseSlug: p.courseSlug || p.courseId,
    examType: p.examType || 'UGC NET',
    purchasedAt: p.createdAt.toISOString(),
  }))

  return (
    <DashboardClient
      userName={user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? 'Student'}
      userEmail={user?.emailAddresses?.[0]?.emailAddress ?? ''}
      userAvatar={user?.imageUrl ?? ''}
      courses={courses}
    />
  )
}
