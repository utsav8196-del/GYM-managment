import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseDetail } from "@/components/course-detail"

interface CoursePageProps {
  params: { id: string }
}

const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured. Set it in Vercel environment variables.")
  }
  return apiUrl
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = params
  const apiUrl = getApiUrl()

  try {
    const res = await fetch(`${apiUrl}/courses/${id}`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      return {
        title: "Course Not Found | Zacson Fitness"
      }
    }

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
  const { id } = params

  try {
    const apiUrl = getApiUrl()
    const res = await fetch(`${apiUrl}/courses/${id}`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      notFound()
    }

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