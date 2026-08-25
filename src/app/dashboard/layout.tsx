import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in?redirect_url=/dashboard/my-courses')
  }
  return <>{children}</>
}
