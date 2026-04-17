// Frontend/components/custom-cursor.tsx
"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    // Make sure elements exist
    if (!dot || !ring) {
      console.warn("Custom cursor elements not found")
      return
    }

    // Set initial positions to center of screen
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf: number | null = null
    let hovering = false

    // Initialize positions immediately
    dot.style.left = `${mouseX}px`
    dot.style.top = `${mouseY}px`
    dot.style.opacity = "1"

    ring.style.left = `${ringX}px`
    ring.style.top = `${ringY}px`
    ring.style.opacity = "0.8"

    const update = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      // Update dot position
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
      dot.style.opacity = hovering ? "0" : "1"

      // Update ring position and animation
      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`

      if (hovering) {
        ring.style.transform = "scale(1.5)"
        ring.style.opacity = "1"
      } else {
        ring.style.transform = "scale(1)"
        ring.style.opacity = "0.8"
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

    // Hide default cursor
    document.documentElement.style.cursor = "none"
    document.body.style.cursor = "none"

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)

    raf = requestAnimationFrame(update)

    return () => {
      document.documentElement.style.cursor = "auto"
      document.body.style.cursor = "auto"
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 2147483647,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#e84545",
          boxShadow: "0 0 8px rgba(232, 69, 69, 0.6)",
          left: "50vw",
          top: "50vh",
          marginLeft: "-4px",
          marginTop: "-4px",
          opacity: 1,
          transition: "opacity 0.15s ease",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 2147483646,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "2px solid #e84545",
          boxShadow: "0 0 16px rgba(232, 69, 69, 0.4), inset 0 0 8px rgba(232, 69, 69, 0.2)",
          left: "50vw",
          top: "50vh",
          marginLeft: "-18px",
          marginTop: "-18px",
          opacity: 0.8,
          transform: "scale(1)",
          transition: "transform 0.18s ease, opacity 0.2s ease",
        }}
      />
    </>
  )
}
