import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Gallery } from "@/components/gallery"

export const metadata: Metadata = {
  title: "Gallery | Zacson Fitness",
  description:
    "See our training moments in action. Strength training, personal coaching, group sessions, and more.",
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Capturing the intensity, dedication, and triumph of every training session. See the results in action."
        breadcrumb="Gallery"
      />
      <Gallery />
    </>
  )
}
