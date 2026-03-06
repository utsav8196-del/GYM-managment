"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export function Courses() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data.data))
      .finally(() => setLoading(false))
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

  return (
    <section className="relative py-24 lg:py-32 bg-secondary" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {courses.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 60 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="group relative overflow-hidden bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
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
      </div>
    </section>
  )
}