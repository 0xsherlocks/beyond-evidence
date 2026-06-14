'use client'

import dynamic from 'next/dynamic'

const StudioPage = dynamic(
  () => import('../StudioComponent'),
  { ssr: false }
)

export default function Page() {
  return <StudioPage />
}
