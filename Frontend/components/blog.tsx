"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Calendar, ArrowRight, Clock, Tag, TrendingUp } from "lucide-react"

type BlogPost = {
  _id: string
  title: string
  category?: string
  excerpt?: string
  image?: string
  publishedAt?: string
  author?: string
  readTime?: number
}

const fallbackBlogPosts: BlogPost[] = [
  {
    _id: "1",
    title: "Complete Guide to Gym Nutrition",
    category: "Nutrition",
    excerpt: "Master the fundamentals of nutrition to accelerate your fitness goals. Learn about macros, meal timing, and supplements.",
    image: "/images/blog-1.jpg",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: "John Trainer",
    readTime: 8,
  },
  {
    _id: "2",
    title: "Progressive Overload Training Secrets",
    category: "Training",
    excerpt: "Discover how to continuously challenge your muscles and break through plateaus with proven training techniques.",
    image: "/images/blog-2.jpg",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Mike Coach",
    readTime: 6,
  },
  {
    _id: "3",
    title: "Recovery & Rest Days for Peak Performance",
    category: "Recovery",
    excerpt: "Why rest days are crucial for muscle growth. Learn the science behind recovery and optimize your training schedule.",
    image: "/images/gallery-1.jpg",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Sarah Fit",
    readTime: 7,
  },
  {
    _id: "4",
    title: "Transformation Stories: From Zero to Hero",
    category: "Motivation",
    excerpt: "Real member transformations that will inspire you. See what dedication and consistency can achieve.",
    image: "/images/gallery-2.jpg",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Lisa Weight",
    readTime: 5,
  },
  {
    _id: "5",
    title: "Home Workout Routines That Actually Work",
    category: "Training",
    excerpt: "No gym equipment? No problem. Effective home workout routines for all fitness levels.",
    image: "/images/group-training.jpg",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Alex Strength",
    readTime: 9,
  },
  {
    _id: "6",
    title: "Mental Health & Fitness Connection",
    category: "Wellness",
    excerpt: "How exercise boosts mental health. Science-backed tips for using fitness as your therapy.",
    image: "/images/personal-training.jpg",
    publishedAt: new Date().toISOString(),
    author: "Emma Mind",
    readTime: 10,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export function Blog() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [posts, setPosts] = useState<BlogPost[]>(fallbackBlogPosts)
  const [loading, setLoading] = useState(true)

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)))

  useEffect(() => {
    let cancelled = false

    const loadPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`)
        const payload = await res.json()

        if (res.ok && Array.isArray(payload.data)) {
          const list = payload.data as BlogPost[]
          if (!cancelled && list.length > 0) {
            setPosts(list)
          }
        }
      } catch (err) {
        // Use fallback posts
        if (!cancelled) {
          setPosts(fallbackBlogPosts)
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

  const featuredPost = posts[0]

  if (loading && posts.length === 0) {
    return (
      <section className="relative w-full py-32 bg-background">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full py-32 lg:py-48 bg-gradient-to-b from-background via-background to-secondary/10" ref={ref}>
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mb-20 text-center"
        >
          <motion.span
            className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.4em] text-primary flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TrendingUp size={16} /> Latest Stories
          </motion.span>
          <motion.h2
            className="text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Fitness <span className="text-primary">Insights</span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Expert tips, training guides, and nutrition advice to transform your fitness journey.
          </motion.p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-primary/5 rounded-3xl overflow-hidden border border-primary/20 p-8 lg:p-12 backdrop-blur-sm"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <Image
                src={featuredPost.image || "/images/blog-1.jpg"}
                alt={featuredPost.title}
                fill
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                quality={90}
                priority
              />
              <div className="absolute top-4 left-4 bg-primary/90 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-md">
                Featured
              </div>
            </div>
            <div>
              <motion.span
                className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                ◆ {featuredPost.category || "Fitness"} ◆
              </motion.span>
              <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground mb-4 leading-tight">
                {featuredPost.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                {featuredPost.excerpt || "Discover insights that will transform your fitness journey."}
              </p>
              <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  {featuredPost.publishedAt
                    ? new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  {featuredPost.readTime || 5} min read
                </div>
              </div>
              <Link
                href={`/blog/${featuredPost._id}`}
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                Read Full Article
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {posts.map((post, i) => (
              <motion.article
                key={post._id}
                variants={itemVariants}
                className="group cursor-pointer h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={post.image || "/images/blog-1.jpg"}
                    alt={post.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                    <Tag size={12} />
                    {post.category || "Fitness"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-primary" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Recent"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-primary" />
                      {post.readTime || 5} min
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {post.excerpt || "Read this article for practical fitness strategies."}
                  </p>

                  {/* Author (optional) */}
                  {post.author && (
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      By {post.author}
                    </div>
                  )}

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post._id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider hover:gap-3 transition-all duration-300 pt-2"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg text-muted-foreground">No blog posts found matching your filters.</p>
          </motion.div>
        )}

        {/* Stats Section */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-4 md:gap-8 bg-primary/5 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-primary/10"
          >
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-black text-primary mb-2">{posts.length}+</h3>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Blog Posts</p>
            </div>
            <div className="text-center border-l border-r border-primary/20">
              <h3 className="text-2xl md:text-4xl font-black text-primary mb-2">{categories.length - 1}</h3>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Categories</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-black text-primary mb-2">7+</h3>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Min Read</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
