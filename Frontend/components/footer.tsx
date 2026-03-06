"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ArrowUp, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
]

export function Footer() {
  const { ref, isVisible } = useScrollAnimation(0.1)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-card py-16" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold uppercase tracking-wider text-foreground">
            Zac<span className="text-primary">son</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="h-px w-full max-w-md bg-border" />

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((platform) => (
              <a
                key={platform.label}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.label}
                className="flex h-10 w-10 items-center justify-center border border-border text-xs font-bold text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <platform.Icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground">
            {"Copyright"} {new Date().getFullYear()} Zacson Fitness. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/80 hover:scale-110 cursor-pointer"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  )
}
