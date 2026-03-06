"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ArrowRight, Dumbbell, Flame, HeartPulse, Loader2 } from "lucide-react"

type Service = {
  _id: string
  title: string
  description: string
  icon: string
  image?: string
  shortText?: string
  highlights?: string[]
}

type ServiceExtras = {
  image: string
  shortText: string
  highlights: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"

const iconMap = {
  Dumbbell,
  Flame,
  HeartPulse,
} as const

const serviceDefaults: Record<string, ServiceExtras> = {
  Dumbbell: {
    image: "/images/personal-training.jpg",
    shortText: "Strength and resistance coaching",
    highlights: ["1-on-1 Coaching", "Program Tracking", "Form Correction"],
  },
  Flame: {
    image: "/images/group-training.jpg",
    shortText: "Fat loss and conditioning blocks",
    highlights: ["HIIT Sessions", "Metabolic Training", "Weekly Targets"],
  },
  HeartPulse: {
    image: "/images/gallery-2.jpg",
    shortText: "Mobility, recovery, and wellness",
    highlights: ["Recovery Plans", "Mobility Work", "Lifestyle Support"],
  },
}

const fallbackExtras = Object.values(serviceDefaults)

const resolveImageSrc = (value: string | undefined, fallback: string) => {
  if (!value || !value.trim()) return fallback
  const normalized = value.trim().replace(/\\/g, "/")
  if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("data:")) {
    return normalized
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`
}

const normalizeHighlights = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, 3)
}

export function Services() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadServices = async () => {
      setLoading(true)
      setError("")
      try {
        let res: Response | null = null
        let data: { message?: string; data?: Service[] } = {}

        for (let attempt = 0; attempt < 2; attempt += 1) {
          res = await fetch(`${API_URL}/services`, { cache: "no-store" })
          try {
            data = await res.json()
          } catch {
            data = {}
          }

          if (res.status === 429 && attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 500))
            continue
          }

          break
        }

        if (!res) {
          throw new Error("Failed to load services")
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load services")
        }

        const list = Array.isArray(data.data) ? (data.data as Service[]) : []
        if (!cancelled) {
          setServices(list)
        }
      } catch (err: unknown) {
        if (cancelled) return
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to load services")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadServices()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="relative bg-background py-24 lg:py-32">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-background py-24 lg:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
            What I Offer
          </span>
          <h2 className="text-balance text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl">
            My Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Explore each training service with visuals, key benefits, and practical outcomes designed for real progress.
          </p>
        </motion.div>

        {error ? (
          <p className="text-center text-sm font-medium text-red-400">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No services available right now.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Dumbbell
              const extras = serviceDefaults[service.icon] || fallbackExtras[i % fallbackExtras.length]
              const imageSrc = resolveImageSrc(service.image, extras.image)
              const shortText = service.shortText || extras.shortText
              const highlights = normalizeHighlights(service.highlights)
              const featureList = highlights.length ? highlights : extras.highlights

              return (
                <motion.article
                  key={service._id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.12 * i }}
                  className="group overflow-hidden border border-border bg-card transition-all duration-500 hover:border-primary/50"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                    <Image
                      src={imageSrc}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                    <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 bg-background/70">
                      <Icon size={20} className="text-primary" strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold uppercase tracking-wide text-foreground">
                      {service.title}
                    </h3>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                      {shortText}
                    </p>
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {featureList.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center border border-border bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/appointment"
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:gap-4"
                    >
                      Book This Service
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
