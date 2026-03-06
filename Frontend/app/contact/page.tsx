import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Contact } from "@/components/contact"

export const metadata: Metadata = {
  title: "Contact | Zacson Fitness",
  description:
    "Get in touch with Zacson. Reach out for training inquiries, membership questions, or general information.",
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Me"
        subtitle="Have questions about training programs, memberships, or anything else? Reach out and let's start your transformation today."
        breadcrumb="Contact"
      />
      <Contact />
    </>
  )
}
