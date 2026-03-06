import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Blog } from "@/components/blog"

export const metadata: Metadata = {
  title: "Blog | Zacson Fitness",
  description:
    "Fitness tips, nutrition guides, and training insights from professional trainer Zacson.",
}

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Our Blog"
        subtitle="Expert fitness tips, nutrition guides, and training insights to help you stay informed and motivated on your fitness journey."
        breadcrumb="Blog"
      />
      <Blog />
    </>
  )
}
