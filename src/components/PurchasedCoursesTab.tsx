'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'

interface CourseItem {
  id: string
  courseName: string
  courseSlug: string
  examType: string
  purchasedAt: string
}

export default function PurchasedCoursesTab() {
  const [courses, setCourses] = useState<CourseItem[]>([])
  const [loading, setLoading] = useState(true)

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
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          My Purchased Courses & Notes
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your full competitive exam notes, reader platform, and study materials.
        </p>
      </div>

      {courses.length === 0 ? (
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
                <a
                  href={`/reader/${course.courseSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Open Notes
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
