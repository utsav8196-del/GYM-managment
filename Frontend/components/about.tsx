"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation, useCountUp } from "@/hooks/use-scroll-animation"

const stats = [
  { value: 12, suffix: "+", label: "Years Experience" },
  { value: 850, suffix: "+", label: "Happy Clients" },
  { value: 24, suffix: "/7", label: "Support Available" },
  { value: 15, suffix: "+", label: "Awards Won" },
]

export function About() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section className="relative py-24 lg:py-32 bg-secondary" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/about-trainer.jpg"
                alt="Professional fitness trainer portrait"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Accent element */}
            <div className="absolute -bottom-4 -right-4 h-full w-full border-2 border-primary/30 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
              About Me
            </span>
            <h2 className="mb-6 text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
              About Me
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              With over a decade of experience in professional fitness training,
              I have dedicated my career to transforming lives through
              disciplined training, science-backed nutrition, and unwavering
              commitment to each client{"'"}s unique goals.
            </p>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              My philosophy centers on building sustainable habits rather than
              quick fixes. Every program I design is rooted in progressive
              overload principles, functional movement patterns, and holistic
              wellness to ensure long-term success for every individual.
            </p>
            <Link
              href="/courses"
              className="inline-block bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80"
            >
              My Courses
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: { value: number; suffix: string; label: string }
  index: number
  isVisible: boolean
}) {
  const count = useCountUp(stat.value, 2000, isVisible)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="border border-border bg-card p-8 text-center transition-all duration-300 hover:border-primary/40"
    >
      <div className="mb-2 text-4xl font-bold text-primary lg:text-5xl">
        {count}
        {stat.suffix}
      </div>
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {stat.label}
      </p>
    </motion.div>
  )
}
