// Frontend/app/user/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { BookOpen, Calendar, CreditCard, Dumbbell, Loader2, ArrowRight, User2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gym-managment-two.vercel.app/api/v1"

type Course = {
  _id: string
  title: string
  description: string
  image?: string
  type?: "personal" | "group"
  price?: number
}

type Membership = {
  _id: string
  planName?: string
  status?: string
  startDate?: string
  endDate?: string
}

type Payment = {
  _id: string
  amount?: number
  createdAt?: string
}

export default function UserPage() {
  const { user, token, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [membership, setMembership] = useState<Membership | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (authLoading) return
    if (!token) router.push("/login")
  }, [authLoading, token, router])

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setLoading(true)
      setError("")
      try {
        const [courseRes, membershipRes, paymentRes] = await Promise.allSettled([
          fetch(`${API_URL}/courses`, { cache: "no-store" }),
          fetch(`${API_URL}/memberships/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API_URL}/payments/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ])

        if (courseRes.status === "fulfilled") {
          const data = await courseRes.value.json()
          if (active) setCourses(Array.isArray(data.data) ? data.data : [])
        }

        if (membershipRes.status === "fulfilled" && membershipRes.value.ok) {
          const data = await membershipRes.value.json()
          if (active) setMembership(data.data || null)
        }

        if (paymentRes.status === "fulfilled" && paymentRes.value.ok) {
          const data = await paymentRes.value.json()
          if (active) setPayments(Array.isArray(data.data) ? data.data : [])
        }
      } catch (err) {
        if (active) setError("Failed to load dashboard data")
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadData()
    return () => {
      active = false
    }
  }, [token])

  const topCourses = useMemo(() => courses.slice(0, 3), [courses])

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={36} />
          <p className="mt-4 text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </section>
    )
  }

  if (!token) return null

  return (
    <section className="relative min-h-screen bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">User Panel</p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-foreground">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your membership, explore classes, and keep your momentum high.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Profile</p>
                  <p className="text-xs text-muted-foreground">Personal account info</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <div><span className="text-foreground font-semibold">Name:</span> {user?.name || "Member"}</div>
                <div><span className="text-foreground font-semibold">Email:</span> {user?.email || "Not provided"}</div>
                <div><span className="text-foreground font-semibold">Role:</span> {user?.role || "user"}</div>
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Membership</p>
                  <p className="text-xs text-muted-foreground">Current plan status</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                {membership ? (
                  <>
                    <p>Plan: <span className="text-foreground font-semibold">{membership.planName || "Member Plan"}</span></p>
                    <p>Status: <span className="text-foreground font-semibold">{membership.status || "active"}</span></p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">You don’t have a linked plan yet.</p>
                    <Link href="/pricing" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      View Pricing <ArrowRight size={14} />
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Dumbbell size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Actions</p>
                  <p className="text-xs text-muted-foreground">Move fast</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/courses" className="border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary">
                  Explore Courses
                </Link>
                <Link href="/contact" className="border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">My Courses</p>
                  <p className="text-xs text-muted-foreground">Popular training programs</p>
                </div>
              </div>

              {error ? (
                <p className="mt-4 text-sm text-red-400">{error}</p>
              ) : topCourses.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No courses available right now.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {topCourses.map((course) => (
                    <div key={course._id} className="border border-border bg-secondary p-4">
                      <p className="text-sm font-semibold uppercase tracking-wide text-foreground">{course.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{course.description}</p>
                      {course.price ? (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">${course.price}</p>
                      ) : null}
                    </div>
                  ))}
                  <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    View All Courses <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            <div className="border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Payment History</p>
                  <p className="text-xs text-muted-foreground">Recent transactions</p>
                </div>
              </div>

              {payments.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No payments recorded yet.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {payments.slice(0, 3).map((p) => (
                    <div key={p._id} className="flex justify-between text-xs text-muted-foreground">
                      <span>${p.amount || 0}</span>
                      <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
