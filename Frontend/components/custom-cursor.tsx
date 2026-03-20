// Frontend/components/custom-cursor.tsx
"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    if (!isFinePointer) return

    setEnabled(true)

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let raf = 0
    let hovering = false

    const update = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
        dotRef.current.style.opacity = hovering ? "0" : "1"
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
        ringRef.current.style.transform = hovering
          ? "translate(-50%, -50%) scale(1.6)"
          : "translate(-50%, -50%) scale(1)"
        ringRef.current.style.opacity = hovering ? "1" : "0.8"
      }

      raf = requestAnimationFrame(update)
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      hovering = !!target?.closest(
        "a, button, [role='button'], input, textarea, select, label, svg, [data-cursor]"
      )
    }

    const onOut = () => {
      hovering = false
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)

    raf = requestAnimationFrame(update)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  )
}
