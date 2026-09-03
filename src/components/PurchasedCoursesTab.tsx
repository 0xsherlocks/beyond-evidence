'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, GraduationCap, ArrowRight, Loader2, FileText, ChevronLeft } from 'lucide-react'
import SecurePdfViewer from '@/src/components/SecurePdfViewer'

interface CourseItem {
  id: string
  courseName: string
  courseSlug: string
  examType: string
  purchasedAt: string
  isStudyMaterial?: boolean
  packageId?: string | null
}

export default function PurchasedCoursesTab() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // States for handling Study Material PDFs
  const [fetchingDocsFor, setFetchingDocsFor] = useState<string | null>(null)
  const [activeMaterial, setActiveMaterial] = useState<{ courseName: string; links: { title?: string, url?: string }[] } | null>(null)
  const [activePdf, setActivePdf] = useState<{ url: string; title?: string } | null>(null)

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch('/api/my-purchases', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setCourses(data.courses || [])
        }
      } catch (err) {
        console.error('Error fetching purchases:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPurchases()
  }, [])

  const handleOpenStudyMaterial = async (course: CourseItem) => {
    setFetchingDocsFor(course.id)
    try {
      const res = await fetch(`/api/study-material-access?slug=${encodeURIComponent(course.courseSlug)}&packageId=${encodeURIComponent(course.packageId || '')}`)
      if (res.ok) {
        const data = await res.json()
        if (data.downloadLinks && data.downloadLinks.length > 0) {
          setActiveMaterial({ courseName: course.courseName, links: data.downloadLinks })
        } else {
          alert('No documents found for this package.')
        }
      }
    } catch (err) {
      console.error(err)
      alert('Unable to load documents.')
    } finally {
      setFetchingDocsFor(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
        <span className="text-sm font-medium">Loading your purchased courses...</span>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        {activeMaterial ? (
          <button 
            onClick={() => setActiveMaterial(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors text-sm font-bold mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to My Courses
          </button>
        ) : null}
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          {activeMaterial ? activeMaterial.courseName : 'My Purchased Courses & Notes'}
        </h2>
        {!activeMaterial && (
          <p className="text-xs text-slate-500 mt-1">
            Access your full competitive exam notes, reader platform, and study materials.
          </p>
        )}
      </div>

      {activeMaterial ? (
        <div className="space-y-3">
          {activeMaterial.links.map((link, idx) => (
            <button
              key={`${link.url}-${idx}`}
              type="button"
              onClick={() => link.url && setActivePdf({ url: link.url, title: link.title || `Document ${idx + 1}` })}
              className="w-full flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 transition-all hover:border-purple-600 hover:text-purple-600 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-500" />
                <span>{link.title || `Document ${idx + 1}`}</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-slate-200">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Purchased Courses Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Once you purchase competitive exam notes, your full-screen reader links will appear right here.
          </p>
          <Link
            href="/study-material"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
          >
            Explore Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-2">
                  {course.examType}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                  {course.courseName}
                </h3>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Paid & Active</span>
                {course.isStudyMaterial ? (
                  <button
                    onClick={() => handleOpenStudyMaterial(course)}
                    disabled={fetchingDocsFor === course.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {fetchingDocsFor === course.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <BookOpen className="w-3.5 h-3.5" />
                    )}
                    Open Notes
                  </button>
                ) : (
                  <a
                    href={`/reader/${course.courseSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Open Reader
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
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
