"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface PageHeroProps {
  title: string
  subtitle: string
  breadcrumb: string
}

export function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-secondary">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--primary)_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--primary)_0%,_transparent_40%)] opacity-[0.05]" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-primary via-primary/50 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-32 text-center">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-label="Breadcrumb"
          className="mb-6 flex items-center justify-center gap-2 text-sm"
        >
          <Link
            href="/"
            className="font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            Home
          </Link>
          <ChevronRight size={14} className="text-muted-foreground" />
          <span className="font-medium uppercase tracking-wider text-primary">
            {breadcrumb}
          </span>
        </motion.nav>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-4 text-5xl font-bold uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  )
}
