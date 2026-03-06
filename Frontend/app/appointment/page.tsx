import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { Appointment } from "@/components/appointment"

export const metadata: Metadata = {
  title: "Book Appointment | Zacson Fitness",
  description:
    "Schedule your personal training, group session, or fitness consultation with Zacson. Pick a date, time, and service that works for you.",
}

export default function AppointmentPage() {
  return (
    <>
      <PageHero
        title="Book Appointment"
        subtitle="Choose your preferred training type, select an available date and time, and secure your spot in just a few steps."
        breadcrumb="Appointment"
      />
      <Appointment />
    </>
  )
}
