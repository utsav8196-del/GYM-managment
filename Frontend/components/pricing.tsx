"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Check, Loader2 } from "lucide-react"

type Plan = {
  _id: string
  name: string
  durationDays: number
  price: number
  features: string[]
  description?: string
}

const pricingImages = [
  "/images/personal-training.jpg",
  "/images/group-training.jpg",
  "/images/hero-trainer.jpg",
]

const pickPricingImage = (durationDays: number, index: number) => {
  if (durationDays <= 90) return pricingImages[0]
  if (durationDays <= 180) return pricingImages[1]
  if (durationDays > 180) return pricingImages[2]
  return pricingImages[index % pricingImages.length]
}

export function Pricing() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadPlans = async () => {
      setError("")
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`)
        const payload = await res.json()
        if (!res.ok) throw new Error(payload.message || "Failed to load pricing plans")

        if (!cancelled) {
          const list = Array.isArray(payload.data) ? (payload.data as Plan[]) : []
          setPlans(list)
        }
      } catch (err: unknown) {
        if (cancelled) return
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to load pricing plans")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadPlans()

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

  // Format plans to match frontend structure
  const formattedPlans = plans.map((plan, index) => ({
    duration: plan.durationDays === 90 ? "3 Months" : plan.durationDays === 180 ? "6 Months" : plan.durationDays === 365 ? "12 Months" : `${Math.round(plan.durationDays / 30)} Months`,
    price: `$${plan.price}`,
    period: "/month",
    label: plan.name,
    features: plan.features,
    description: plan.description || "Complete gym access with guided support and structured progress.",
    image: pickPricingImage(plan.durationDays, index),
    featured: plan.name.toLowerCase().includes("popular"),
  }))

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-background" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Plans     
          </span>
          <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Choose a membership with training structure, accountability, and results-driven coaching.
          </p>
        </motion.div>

        {error ? (
          <p className="text-center text-sm font-medium text-red-400">{error}</p>
        ) : formattedPlans.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No pricing plans available right now.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {formattedPlans.map((plan, i) => (
              <motion.div
                key={`${plan.label}-${plan.duration}`}
                initial={{ opacity: 0, y: 60 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className={`group relative flex h-full flex-col overflow-hidden border text-center transition-all duration-500 ${
                  plan.featured
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {plan.featured && (
                  <div className="absolute left-0 right-0 top-0 z-20 bg-primary py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                    {plan.label}
                  </div>
                )}

                <div className={`relative aspect-[16/10] overflow-hidden border-b border-border ${plan.featured ? "mt-6" : ""}`}>
                  <Image
                    src={plan.image}
                    alt={`${plan.duration} pricing plan`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
                </div>

                <div className="flex h-full flex-col p-8">
                  <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                      {plan.duration}
                    </p>
                    <div className="mb-3 flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>

                    <div className="mb-8 space-y-4">
                      {plan.features.map((feature: string) => (
                        <div key={feature} className="flex items-center gap-3 text-left">
                          <Check size={16} className="shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className={`mt-auto inline-block w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/80"
                        : "border border-border text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Join Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
