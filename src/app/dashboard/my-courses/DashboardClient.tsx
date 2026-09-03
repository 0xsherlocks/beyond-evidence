'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, GraduationCap, LogOut, ChevronRight, Clock, FileText, Loader2 } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { useState } from 'react'
import SecurePdfViewer from '@/src/components/SecurePdfViewer'

interface Course {
  id: string
  courseName: string
  courseSlug: string
  examType: string
  purchasedAt: string
  isStudyMaterial: boolean
  packageId: string | null
}

interface DashboardClientProps {
  userName: string
  userEmail: string
  userAvatar: string
  courses: Course[]
}

const EXAM_COLORS: Record<string, string> = {
  'UGC NET': 'bg-violet-100 text-violet-700 border-violet-200',
  'UPSC':    'bg-amber-100 text-amber-700 border-amber-200',
  'SSC':     'bg-emerald-100 text-emerald-700 border-emerald-200',
  'GATE':    'bg-blue-100 text-blue-700 border-blue-200',
  'State PSC': 'bg-pink-100 text-pink-700 border-pink-200',
}

export default function DashboardClient({ userName, userEmail, userAvatar, courses }: DashboardClientProps) {
  const { signOut } = useClerk()
  const [fetchingDocsFor, setFetchingDocsFor] = useState<string | null>(null)
  const [activeMaterial, setActiveMaterial] = useState<{ courseName: string; links: DocumentLink[] } | null>(null)
  const [activePdf, setActivePdf] = useState<DocumentLink | null>(null)

  const openStudyMaterial = async (course: Course) => {
    if (!course.packageId) return

    setFetchingDocsFor(course.id)
    try {
      const response = await fetch(
        `/api/study-material-access?slug=${encodeURIComponent(course.courseSlug)}&packageId=${encodeURIComponent(course.packageId)}`,
        { cache: 'no-store' },
      )
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to load your notes.')
      }
      if (!data?.downloadLinks?.length) {
        throw new Error('No documents have been added to this package yet.')
      }

      setActiveMaterial({ courseName: course.courseName, links: data.downloadLinks })
    } catch (error) {
      console.error('Error opening study material:', error)
      alert(error instanceof Error ? error.message : 'Unable to load your notes. Please try again.')
    } finally {
      setFetchingDocsFor(null)
    }
  }

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex min-h-screen font-sans" style={{ fontFamily: 'var(--font-body, Sora, sans-serif)' }}>
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="hidden md:flex w-72 flex-col gap-6 px-5 py-8 shrink-0" style={{ background: '#1a1a2e' }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#6C4EF6' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">Beyond Evidence</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl" style={{ background: 'rgba(108,78,246,0.15)' }}>
          {userAvatar ? (
            <Image src={userAvatar} alt={userName} width={40} height={40} className="rounded-full ring-2 ring-violet-500" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#6C4EF6' }}>
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{userName}</p>
            <p className="text-slate-400 text-xs truncate">{userEmail}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold px-3 mb-1">My Courses</p>
          {courses.length === 0 ? (
            <p className="text-slate-500 text-xs px-3">No courses yet.</p>
          ) : (
            courses.map((c) => (
              c.isStudyMaterial ? (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => void openStudyMaterial(c)}
                  disabled={fetchingDocsFor === c.id}
                  id={`sidebar-link-${c.courseSlug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left text-slate-300 hover:text-white text-xs transition-colors group disabled:opacity-60"
                  style={{ fontFamily: 'inherit' }}
                >
                  {fetchingDocsFor === c.id ? <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-violet-400" /> : <BookOpen className="w-3.5 h-3.5 shrink-0 text-violet-400 group-hover:text-violet-300" />}
                  <span className="truncate">{c.courseName}</span>
                </button>
              ) : (
                <Link
                  key={c.id}
                  href={`/reader/${c.courseSlug}`}
                  id={`sidebar-link-${c.courseSlug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white text-xs transition-colors group"
                  style={{ fontFamily: 'inherit' }}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0 text-violet-400 group-hover:text-violet-300" />
                  <span className="truncate">{c.courseName}</span>
                </Link>
              )
            ))
          )}
        </nav>

        {/* Sign Out */}
        <button
          id="dashboard-signout-btn"
          onClick={() => signOut({ redirectUrl: '/' })}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 bg-white">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-display" style={{ fontFamily: 'var(--font-display, Space Grotesk, sans-serif)' }}>
              My Courses
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''} purchased</p>
          </div>
          {/* Mobile avatar */}
          <div className="md:hidden">
            {userAvatar ? (
              <Image src={userAvatar} alt={userName} width={36} height={36} className="rounded-full ring-2 ring-violet-500" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#6C4EF6' }}>
                {initials}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 md:px-10 py-10">
          {courses.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)' }}>
                <GraduationCap className="w-10 h-10" style={{ color: '#6C4EF6' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-display, Space Grotesk, sans-serif)' }}>
                  No Courses Yet
                </h2>
                <p className="text-slate-500 max-w-sm">
                  You haven&apos;t purchased any premium notes yet. Explore our competitive exam packages to get started.
                </p>
              </div>
              <Link
                id="browse-courses-cta"
                href="/study-material"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: '#6C4EF6' }}
              >
                Browse Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onOpenStudyMaterial={openStudyMaterial} fetchingDocsFor={fetchingDocsFor} />
              ))}
            </div>
          )}
        </div>
      </main>

      {activeMaterial && (
        <DocumentPicker
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
          onOpenPdf={setActivePdf}
        />
      )}
      {activePdf && (
        <SecurePdfViewer
          url={activePdf.url}
          title={activePdf.title}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  )
}

interface DocumentLink {
  title?: string
  url: string
}

function CourseCard({
  course,
  onOpenStudyMaterial,
  fetchingDocsFor,
}: {
  course: Course
  onOpenStudyMaterial: (course: Course) => Promise<void>
  fetchingDocsFor: string | null
}) {
  const badgeClass = EXAM_COLORS[course.examType] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  const date = new Date(course.purchasedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div
      id={`course-card-${course.courseSlug}`}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300"
    >
      {/* Gradient Banner */}
      <div className="relative h-28 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 60%, #6C4EF6 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <BookOpen className="w-10 h-10 text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Badge */}
        <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${badgeClass}`}>
          {course.examType}
        </span>

        {/* Title */}
        <h2 className="font-bold text-slate-900 text-base leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-display, Space Grotesk, sans-serif)' }}>
          {course.courseName}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Clock className="w-3 h-3" />
          <span>Purchased {date}</span>
        </div>

        {/* CTA */}
        {course.isStudyMaterial ? (
          <button
            id={`open-notes-${course.courseSlug}`}
            type="button"
            onClick={() => void onOpenStudyMaterial(course)}
            disabled={fetchingDocsFor === course.id}
            className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:cursor-wait disabled:opacity-60"
            style={{ background: '#6C4EF6' }}
          >
            {fetchingDocsFor === course.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            Open Notes
          </button>
        ) : (
          <Link
            id={`open-notes-${course.courseSlug}`}
            href={`/reader/${course.courseSlug}`}
            className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
            style={{ background: '#6C4EF6' }}
          >
            <BookOpen className="w-4 h-4" />
            Open Notes
          </Link>
        )}
      </div>
    </div>
  )
}

function DocumentPicker({ material, onClose, onOpenPdf }: {
  material: { courseName: string; links: DocumentLink[] }
  onClose: () => void
  onOpenPdf: (link: DocumentLink) => void
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Select a document">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Your notes</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{material.courseName}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900">Close</button>
        </div>
        <div className="space-y-2">
          {material.links.map((link, index) => (
            <button key={`${link.url}-${index}`} type="button" onClick={() => onOpenPdf(link)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
              <FileText className="h-5 w-5 shrink-0 text-violet-600" />
              {link.title || `Document ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
