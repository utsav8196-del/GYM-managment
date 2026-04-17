"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ArrowRight, Dumbbell, Flame, HeartPulse, Loader2, Plus, Save, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gym-managment-two.vercel.app/api/v1"

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
  const { user, token } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    icon: 'Dumbbell' as 'Dumbbell' | 'Flame' | 'HeartPulse',
    image: '',
    shortText: '',
    highlightsText: '',
    order: '0'
  })
  const [submitting, setSubmitting] = useState(false)

  const validateAddForm = () => {
    if (addForm.title.trim().length < 3) return 'Title must be at least 3 characters long'
    if (addForm.description.trim().length < 10) return 'Description must be at least 10 characters long'
    if (!['Dumbbell', 'Flame', 'HeartPulse'].includes(addForm.icon)) return 'Choose a valid icon'
    if (!Number.isFinite(Number(addForm.order))) return 'Order must be a valid number'
    return ''
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'admin') return

    const validationError = validateAddForm()
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
        icon: addForm.icon,
        image: addForm.image.trim(),
        shortText: addForm.shortText.trim(),
        highlights: addForm.highlightsText
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
          .slice(0, 6),
        order: Number(addForm.order),
      }

      const res = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to add service')
      }

      // Add the new service to the list
      const newService = await res.json()
      setServices(prev => [...prev, newService.data])

      // Reset form
      setAddForm({
        title: '',
        description: '',
        icon: 'Dumbbell',
        image: '',
        shortText: '',
        highlightsText: '',
        order: '0'
      })
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service')
    } finally {
      setSubmitting(false)
    }
  }

  // fetch logic extracted so it can be reused by event listener
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

      // debug: log raw API payload in case data structure is unexpected
      console.log('Services API response:', data)

      // handle cases where payload might not nest under `data`
      let list: Service[] = []
      if (Array.isArray(data.data)) {
        list = data.data as Service[]
      } else if (Array.isArray(data)) {
        // some imports or copies might return the array directly
        list = data as unknown as Service[]
      } else {
        console.warn('Unexpected services payload structure', data)
      }

      setServices(list)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to load services")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    void loadServices()

    const handler = () => {
      if (!cancelled) loadServices()
    }

    window.addEventListener('servicesModified', handler)
    return () => {
      cancelled = true
      window.removeEventListener('servicesModified', handler)
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-1 text-center"
        >
        </motion.div>

        {user && user.role === 'admin' && showAddForm && (
          <div className="mb-8 border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-foreground">Add New Service</h3>
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
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Icon</label>
                  <select
                    value={addForm.icon}
                    onChange={(e) => setAddForm(prev => ({ ...prev, icon: e.target.value as typeof addForm.icon }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Flame">Flame</option>
                    <option value="HeartPulse">HeartPulse</option>
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
                  placeholder="Write service details..."
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Short Text</label>
                  <input
                    value={addForm.shortText}
                    onChange={(e) => setAddForm(prev => ({ ...prev, shortText: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Strength and resistance coaching"
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
              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Image URL</label>
                <input
                  value={addForm.image}
                  onChange={(e) => setAddForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="/images/personal-training.jpg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">Highlights</label>
                <textarea
                  value={addForm.highlightsText}
                  onChange={(e) => setAddForm(prev => ({ ...prev, highlightsText: e.target.value }))}
                  rows={2}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="One per line or comma separated"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 disabled:opacity-70"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {submitting ? 'Adding...' : 'Add Service'}
              </button>
            </form>
          </div>
        )}

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
                  animate={{ opacity: 1, y: 0 }}
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
