"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Loader2 } from "lucide-react"

type GalleryItem = {
  _id: string
  title: string
  image: string
}

const fallbackGalleryImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/group-training.jpg",
  "/images/personal-training.jpg",
]

const resolveImageSrc = (value: string | undefined, fallback: string) => {
  if (!value || !value.trim()) return fallback
  const normalized = value.trim().replace(/\\/g, "/")
  if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("data:")) {
    return normalized
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`
}

export function Gallery() {
  const { ref, isVisible } = useScrollAnimation(0.05)
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadGallery = async () => {
      setError("")
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`)
        const payload = await res.json()
        if (!res.ok) throw new Error(payload.message || "Failed to load gallery")

        if (!cancelled) {
          const list = Array.isArray(payload.data) ? (payload.data as GalleryItem[]) : []
          setImages(list)
        }
      } catch (err: unknown) {
        if (cancelled) return
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to load gallery")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadGallery()

    return () => {
      cancelled = true
    }
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Gallery
          </span>
          <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
            Training Moments
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Visual highlights from sessions, transformations, and day-to-day gym energy.
          </p>
        </motion.div>

        {error ? (
          <p className="text-center text-sm font-medium text-red-400">{error}</p>
        ) : images.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No gallery images found yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group relative aspect-square cursor-pointer overflow-hidden"
              >
                <Image
                  src={resolveImageSrc(item.image, fallbackGalleryImages[i % fallbackGalleryImages.length])}
                  alt={item.title || "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-all duration-500 group-hover:bg-primary/70">
                  <span className="translate-y-4 text-lg font-bold uppercase tracking-wider text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
