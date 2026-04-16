"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Check, ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

type Course = {
  _id: string
  title: string
  description: string
  image: string
  type: "personal" | "group"
  order: number
  prices: {
    lower: number
    medium: number
    higher: number
  }
}

interface CourseDetailProps {
  course: Course
}

const pricingTiers = [
  {
    name: "Basic",
    key: "lower" as const,
    description: "Perfect for beginners starting their fitness journey",
    features: [
      "Access to basic equipment",
      "Group fitness classes",
      "Locker room access",
      "Basic nutrition guidance"
    ]
  },
  {
    name: "Standard",
    key: "medium" as const,
    description: "Ideal for those looking to build consistency",
    features: [
      "All Basic features",
      "Personal trainer consultation",
      "Advanced equipment access",
      "Custom workout plans",
      "Progress tracking"
    ]
  },
  {
    name: "Premium",
    key: "higher" as const,
    description: "Complete transformation package for serious athletes",
    features: [
      "All Standard features",
      "1-on-1 personal training sessions",
      "Nutrition coaching",
      "Supplements guidance",
      "Priority booking",
      "VIP amenities"
    ]
  }
]

export function CourseDetail({ course }: CourseDetailProps) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleEnroll = (tier: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    // TODO: Implement enrollment logic
    alert(`Enrolling in ${tier} tier for ${course.title}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft size={16} />
              Back to Courses
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {course.description}
            </p>
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-wider rounded">
                {course.type === 'personal' ? 'Personal Training' : 'Group Training'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 lg:py-32 bg-background" ref={ref}>
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Pricing Options
            </span>
            <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
              Choose Your Plan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Select the perfect pricing tier that matches your goals and commitment level.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, i) => {
              const price = course.prices[tier.key]
              const isSelected = selectedTier === tier.key

              return (
                <motion.div
                  key={tier.key}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 * i }}
                  className={`group relative overflow-hidden border text-center transition-all duration-500 cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                  onClick={() => setSelectedTier(tier.key)}
                >
                  {isSelected && (
                    <div className="absolute left-0 right-0 top-0 z-20 bg-primary py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                      Selected
                    </div>
                  )}

                  <div className={`relative p-8 ${isSelected ? "mt-6" : ""}`}>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-foreground mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tier.description}
                    </p>

                    <div className="mb-6 flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-foreground">${price}</span>
                      <span className="text-lg text-muted-foreground">/month</span>
                    </div>

                    <div className="mb-8 space-y-3">
                      {tier.features.map((feature: string) => (
                        <div key={feature} className="flex items-center gap-3 text-left">
                          <Check size={16} className="shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEnroll(tier.name)
                      }}
                      className={`inline-block w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary/80"
                          : "border border-border text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {user ? 'Enroll Now' : 'Login to Enroll'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}