import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Pricing } from "@/components/pricing"

export const metadata: Metadata = {
  title: "Pricing | Zacson Fitness",
  description:
    "Flexible 3, 6, and 12-month membership plans designed to fit your commitment and budget.",
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="Pricing Plans"
        subtitle="Flexible membership options designed to match your goals, commitment level, and budget. Find the perfect plan for your fitness journey."
        breadcrumb="Pricing"
      />
      <Pricing />
    </>
  )
}
