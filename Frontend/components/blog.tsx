"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Calendar, ArrowRight, Loader2 } from "lucide-react"

type BlogPost = {
  _id: string
  title: string
  category?: string
  excerpt?: string
  image?: string
  publishedAt?: string
}

const fallbackBlogImages = [
  "/images/blog-1.jpg",
  "/images/blog-2.jpg",
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
]

const resolveImageSrc = (value: string | undefined, fallback: string) => {
  if (!value || !value.trim()) return fallback
  const normalized = value.trim().replace(/\\/g, "/")
  if (normalized.startsWith("http://") || normalized.startsWith("https://") || normalized.startsWith("data:")) {
    return normalized
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`
}

export function Blog() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadPosts = async () => {
      setError("")
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`)
        const payload = await res.json()
        if (!res.ok) throw new Error(payload.message || "Failed to load blog posts")

        if (!cancelled) {
          const list = Array.isArray(payload.data) ? (payload.data as BlogPost[]) : []
          setPosts(list)
        }
      } catch (err: unknown) {
        if (cancelled) return
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to load blog posts")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadPosts()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 lg:py-32 bg-background">
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-24 lg:py-32 bg-background" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Latest
          </span>
          <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
            From Blog
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Practical training insights, nutrition ideas, and gym strategies with visual inspiration.
          </p>
        </motion.div>

        {error ? (
          <p className="text-center text-sm font-medium text-red-400">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No blog posts found yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 60 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="group cursor-pointer overflow-hidden border border-border bg-card transition-all duration-500 hover:border-primary/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={resolveImageSrc(post.image, fallbackBlogImages[i % fallbackBlogImages.length])}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    {post.category || "Fitness"}
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt || "Read this article for practical fitness strategies and training insights."}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 group-hover:gap-4">
                    Read More <ArrowRight size={14} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
