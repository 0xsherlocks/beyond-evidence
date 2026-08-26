import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import { getPremiumCourseBySlug } from '@/src/sanity/queries'
import ReaderClient from './ReaderClient'

interface ReaderPageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { courseSlug } = await params
  const { userId } = await auth()

  // Session check — redirect to login if not authenticated
  if (!userId) {
    redirect(`/sign-in?redirect_url=/reader/${courseSlug}`)
  }

  // Access control — check if user has a paid purchase for this slug
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      OR: [
        { courseSlug: courseSlug },
        { courseId: courseSlug }
      ],
      status: 'paid',
    },
    select: { id: true },
  })

  if (!purchase) {
    redirect('/study-material?toast=purchase_required')
  }

  const course = await getPremiumCourseBySlug(courseSlug)
  if (!course) redirect('/study-material')

  const user = await currentUser()
  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? 'user@beyond.evidence'

  return <ReaderClient course={course} userEmail={userEmail} />
}
