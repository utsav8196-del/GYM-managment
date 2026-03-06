import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Services } from "@/components/services"

export const metadata: Metadata = {
  title: "Services | Zacson Fitness",
  description:
    "Body building, muscle gain, and weight loss programs backed by science and real results.",
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="My Services"
        subtitle="Comprehensive fitness solutions with visual program overviews, expert coaching details, and practical plans for body building, muscle gain, fat loss, and total wellness."
        breadcrumb="Services"
      />
      <Services />
    </>
  )
}
