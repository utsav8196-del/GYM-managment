"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
  ArrowRight,
  Dumbbell,
  Flame,
  HeartPulse,
  Users,
  ImageIcon,
  CreditCard,
  CalendarDays,
} from "lucide-react"

const featureCards = [
  {
    icon: Dumbbell,
    title: "Our Courses",
    description:
      "Personalized one-on-one and high-energy group training programs built for every fitness level.",
    href: "/courses",
    image: "/images/personal-training.jpg",
  },
  {
    icon: Flame,
    title: "Our Services",
    description:
      "Body building, muscle gain, and weight loss programs backed by science and real results.",
    href: "/services",
    image: "/images/gallery-2.jpg",
  },
  {
    icon: CreditCard,
    title: "Pricing Plans",
    description:
      "Flexible 3, 6, and 12-month plans designed to fit your commitment and budget.",
    href: "/pricing",
    image: "/images/gallery-1.jpg",
  },
]

const quickLinks = [
  {
    icon: CalendarDays,
    title: "Appointment",
    description: "Book a session online now",
    href: "/appointment",
  },
  {
    icon: ImageIcon,
    title: "Gallery",
    description: "See our training in action",
    href: "/gallery",
  },
  {
    icon: Users,
    title: "About Me",
    description: "12+ years of elite coaching",
    href: "/about",
  },
  {
    icon: HeartPulse,
    title: "Blog",
    description: "Tips, guides, and fitness news",
    href: "/blog",
  },
]

export function HomePreview() {
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.05)
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1)
  const { ref: linksRef, isVisible: linksVisible } = useScrollAnimation(0.1)

  return (
    <>
      {/* Feature Cards Section */}
      <section className="relative py-24 lg:py-32 bg-secondary" ref={cardsRef}>
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={cardsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
              What We Offer
            </span>
            <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
              Explore Our Programs
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 60 }}
                animate={cardsVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
              >
                <Link href={card.href} className="group block overflow-hidden border border-border bg-card transition-all duration-500 hover:border-primary/50">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center bg-primary/90">
                      <card.icon size={22} className="text-primary-foreground" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
                      {card.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 group-hover:gap-4">
                      Learn More <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-primary py-20" ref={ctaRef}>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 32%, transparent 32%, transparent 68%, rgba(255,255,255,0.1) 68%, rgba(255,255,255,0.1) 70%, transparent 70%)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 text-3xl font-bold uppercase tracking-tight text-primary-foreground lg:text-5xl text-balance"
          >
            Ready to Transform Your Body?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-10 text-base leading-relaxed text-primary-foreground/80 lg:text-lg"
          >
            Join hundreds of clients who have achieved their dream physique. Start your journey today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/appointment"
              className="inline-block bg-background px-8 py-4 text-sm font-bold uppercase tracking-wider text-foreground transition-all duration-300 hover:bg-background/90 hover:scale-105"
            >
              Book Now
            </Link>
            <Link
              href="/pricing"
              className="inline-block border-2 border-primary-foreground/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              View Plans
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="relative py-24 lg:py-32 bg-background" ref={linksRef}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 40 }}
                animate={linksVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Link
                  href={link.href}
                  className="group flex items-center gap-5 border border-border bg-card p-6 transition-all duration-500 hover:border-primary/50 hover:bg-card/80"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-border rounded-full transition-all duration-500 group-hover:border-primary group-hover:bg-primary/10">
                    <link.icon
                      size={24}
                      className="text-muted-foreground transition-colors duration-500 group-hover:text-primary"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={18}
                    className="ml-auto shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
