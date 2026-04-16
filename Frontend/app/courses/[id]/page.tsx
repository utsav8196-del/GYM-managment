import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseDetail } from "@/components/course-detail"

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
      cache: 'no-store'
    })
    const data = await res.json()
    const course = data.data

    if (!course) {
      return {
        title: "Course Not Found | Zacson Fitness"
      }
    }

    return {
      title: `${course.title} | Zacson Fitness`,
      description: course.description
    }
  } catch {
    return {
      title: "Course | Zacson Fitness"
    }
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
      cache: 'no-store'
    })
    const data = await res.json()
    const course = data.data

    if (!course) {
      notFound()
    }

    return <CourseDetail course={course} />
  } catch {
    notFound()
  }
}