'use client'

import { useEffect, useState } from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { BookOpen, ChevronRight, Menu, X, Lock, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Unit {
  unitTitle: string
  content: any[]
}

interface Course {
  _id: string
  title: string
  slug: string
  examType: string
  units: Unit[]
}

interface ReaderClientProps {
  course: Course
  userEmail: string
}

// ── Portable Text components ──────────────────────────────────────────────────
const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-slate-800">{children}</p>,
    h1: ({ children }) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4 font-display">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 mt-6 mb-3 font-display">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-slate-800 mt-5 mb-2 font-display">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-violet-500 pl-4 my-4 text-slate-600 italic bg-violet-50 py-2 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-slate-800 pl-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-800 pl-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    highlight: ({ children }) => <mark className="bg-yellow-100 px-0.5 rounded">{children}</mark>,
    link: ({ children, value }) => (
      <span className="text-violet-600 font-medium cursor-default" title="Links disabled in secure reader">
        {children}
      </span>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = value?.asset?.url
      if (!src) return null
      return (
        <figure className="my-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 relative">
            <Image src={src} alt={value.alt ?? 'Course image'} width={900} height={500}
              className="w-full h-auto object-cover" style={{ userSelect: 'none', pointerEvents: 'none' }} />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-slate-400 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
}

export default function ReaderClient({ course, userEmail }: ReaderClientProps) {
  const [activeUnit, setActiveUnit] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── Security: disable right-click, Ctrl+S, Ctrl+P, Ctrl+U ────────────────
  useEffect(() => {
    const blockContext = (e: MouseEvent) => e.preventDefault()
    const blockKeys = (e: KeyboardEvent) => {
      if (e.ctrlKey && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('keydown', blockKeys)
    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])

  const unit = course.units?.[activeUnit]

  const EXAM_COLORS: Record<string, string> = {
    'UGC NET': '#7c3aed',
    'UPSC':    '#d97706',
    'SSC':     '#059669',
    'GATE':    '#2563eb',
    'State PSC': '#db2777',
  }
  const accentColor = EXAM_COLORS[course.examType] ?? '#6C4EF6'

  return (
    <>
      {/* ── Print Kill ── */}
      <style>{`
        @media print { body { display: none !important; } }
        * { user-select: none !important; -webkit-user-select: none !important; }
        img { pointer-events: none !important; -webkit-user-drag: none !important; }
      `}</style>

      {/* ── Diagonal Email Watermark ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            transform: 'rotate(-35deg)',
            opacity: 0.07,
            fontSize: 'clamp(14px, 2.5vw, 22px)',
            fontWeight: 700,
            color: '#1a1a2e',
            whiteSpace: 'nowrap',
            letterSpacing: '0.08em',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {userEmail} &nbsp;&nbsp; {userEmail} &nbsp;&nbsp; {userEmail}
        </span>
      </div>

      <div className="flex flex-col h-screen overflow-hidden bg-slate-50" style={{ fontFamily: 'var(--font-body, Sora, sans-serif)' }}>

        {/* ── Top Navbar ──────────────────────────────────────────────────── */}
        <header className="shrink-0 flex items-center gap-4 px-4 md:px-6 py-3 border-b border-slate-200 bg-white shadow-sm z-50">
          {/* Mobile sidebar toggle */}
          <button
            id="reader-sidebar-toggle"
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle chapter navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Logo / back link */}
          <Link href="/dashboard/my-courses" id="reader-back-to-dashboard"
            className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#6C4EF6' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-xs text-slate-400 group-hover:text-violet-600 transition-colors font-medium">
              Dashboard
            </span>
          </Link>

          {/* Divider */}
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block" />

          {/* Course title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-900 truncate" style={{ fontFamily: 'var(--font-display, Space Grotesk, sans-serif)' }}>
              {course.title}
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: accentColor }}>{course.examType}</span>
          </div>

          {/* Security badge + email */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{userEmail}</span>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">

          {/* ── Chapter Sidebar ──────────────────────────────────────────── */}
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            </div>
          )}

          <aside
            id="reader-chapter-sidebar"
            className={`
              fixed md:relative z-40 md:z-auto top-0 md:top-auto left-0 h-full md:h-auto
              w-72 shrink-0 flex flex-col overflow-hidden
              transition-transform duration-300 md:translate-x-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            style={{ background: '#1a1a2e', paddingTop: sidebarOpen ? '4rem' : 0 }}
          >
            <div className="px-4 py-5 border-b border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Chapters &amp; Units
              </p>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2">
              {(course.units ?? []).map((unit, idx) => (
                <button
                  key={idx}
                  id={`chapter-nav-${idx}`}
                  onClick={() => { setActiveUnit(idx); setSidebarOpen(false) }}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg mb-1 transition-all text-sm ${
                    activeUnit === idx
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  style={activeUnit === idx ? { background: '#6C4EF6' } : {}}
                >
                  <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{unit.unitTitle}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Content Area ──────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 md:px-10 py-10">
              {/* Unit header */}
              {unit ? (
                <>
                  <div className="mb-8 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5" style={{ color: accentColor }} />
                      <span className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: accentColor }}>
                        Unit {activeUnit + 1} of {course.units?.length ?? 1}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900"
                      style={{ fontFamily: 'var(--font-display, Space Grotesk, sans-serif)' }}>
                      {unit.unitTitle}
                    </h2>
                  </div>

                  {/* Portable Text content */}
                  <article className="prose-custom text-slate-800 text-[0.95rem] leading-7">
                    {unit.content?.length > 0 ? (
                      <PortableText value={unit.content} components={portableComponents} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <BookOpen className="w-12 h-12 opacity-30" />
                        <p className="text-sm">Content coming soon for this unit.</p>
                      </div>
                    )}
                  </article>

                  {/* Prev / Next navigation */}
                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200 gap-4">
                    <button
                      id="reader-prev-unit"
                      disabled={activeUnit === 0}
                      onClick={() => setActiveUnit(v => v - 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white hover:opacity-90"
                      style={{ background: '#6C4EF6' }}
                    >
                      ← Previous
                    </button>
                    <span className="text-slate-400 text-xs">
                      {activeUnit + 1} / {course.units?.length ?? 1}
                    </span>
                    <button
                      id="reader-next-unit"
                      disabled={activeUnit >= (course.units?.length ?? 1) - 1}
                      onClick={() => setActiveUnit(v => v + 1)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white hover:opacity-90"
                      style={{ background: '#6C4EF6' }}
                    >
                      Next →
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <BookOpen className="w-14 h-14 opacity-20" />
                  <p className="text-lg font-semibold">No chapters added yet.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
