import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { About } from "@/components/about"

export const metadata: Metadata = {
  title: "About | Zacson Fitness",
  description:
    "Learn about Zacson - over 12 years of elite fitness coaching experience, 850+ happy clients, and a passion for transforming lives.",
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Me"
        subtitle="Over a decade of professional fitness training dedicated to transforming lives through disciplined training, science-backed nutrition, and unwavering commitment."
        breadcrumb="About"
      />
      <About />
    </>
  )
}
