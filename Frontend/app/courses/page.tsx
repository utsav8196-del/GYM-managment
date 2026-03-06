import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Courses } from "@/components/courses"

export const metadata: Metadata = {
  title: "Courses | Zacson Fitness",
  description:
    "Explore our personal training and group training courses. Tailored programs for every fitness level.",
}

export default function CoursesPage() {
  return (
    <>
      <PageHero
        title="Our Courses"
        subtitle="Personalized one-on-one and high-energy group training programs designed to transform your body and push your limits."
        breadcrumb="Courses"
      />
      <Courses />
    </>
  )
}
