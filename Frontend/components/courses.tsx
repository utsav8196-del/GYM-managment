"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ArrowRight, Loader2, Plus, X, Save } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

export function Courses() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    type: 'personal' as 'personal' | 'group',
    image: '',
    order: '0'
  })
  const [error, setError] = useState('')

  const loadCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/courses`, { cache: 'no-store' })
      const data = await res.json()
      setCourses(Array.isArray(data.data) ? data.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()

    const handler = () => loadCourses()
    window.addEventListener('coursesModified', handler)
    return () => window.removeEventListener('coursesModified', handler)
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 lg:py-32 bg-secondary">
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </section>
    )
  }

  const validateForm = () => {
    if (addForm.title.trim().length < 3) return 'Title must be at least 3 characters'
    if (addForm.description.trim().length < 10) return 'Description must be at least 10 characters'
    if (!['personal', 'group'].includes(addForm.type)) return 'Choose a valid type'
    return ''
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'admin') return

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const payload = {
        title: addForm.title.trim(),
        description: addForm.description.trim(),
        image: addForm.image.trim(),
        type: addForm.type,
        order: Number(addForm.order),
      }

      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to add course')
      }

      const newCourse = await res.json()
      setCourses(prev => [...prev, newCourse.data])

      setAddForm({
        title: '',
        description: '',
        type: 'personal',
        image: '',
        order: '0'
      })
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add course')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative py-24 lg:py-32 bg-secondary" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">


        {user && user.role === 'admin' && showAddForm && (
          <div className="mb-8 border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-foreground">Add New Course</h3>
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                  <input
                    value={addForm.title}
                    onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Personal Training"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
                  <select
                    value={addForm.type}
                    onChange={(e) => setAddForm(prev => ({ ...prev, type: e.target.value as 'personal' | 'group' }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="personal">Personal</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Course details..."
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Image URL</label>
                  <input
                    value={addForm.image}
                    onChange={(e) => setAddForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="/images/course.jpg"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Order</label>
                  <input
                    type="number"
                    value={addForm.order}
                    onChange={(e) => setAddForm(prev => ({ ...prev, order: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 disabled:opacity-70"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {submitting ? 'Adding...' : 'Add Course'}
              </button>
            </form>
          </div>
        )}

        {error && !showAddForm && <p className="mb-6 text-center text-sm text-red-400">{error}</p>}
        {courses.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No courses available right now.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                className="group relative overflow-hidden bg-card"
              >
                <div className="relative h-36 w-full overflow-hidden sm:h-40">
                  <Image
                    src={course.image.startsWith('http') ? course.image : `/${course.image}`}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>
                <div className="relative p-8">
                  <h3 className="mb-3 text-2xl font-bold uppercase tracking-wide text-foreground">
                    {course.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 group-hover:gap-4"
                  >
                    View Courses <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}