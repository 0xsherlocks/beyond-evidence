import type { ReactNode } from 'react'

/**
 * Reader layout — intentionally bare (no site header/footer).
 * The reader page manages its own full-screen layout.
 */
export default function ReaderLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
