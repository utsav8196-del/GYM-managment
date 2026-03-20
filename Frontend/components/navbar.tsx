"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import {Particles} from "./particles";  


type NavChild = {
  label: string
  href: string
}

type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}

const navLinks = [
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
    ],
  },
  { label: "Contact", href: "/contact" },
] satisfies NavItem[]

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const isItemActive = (item: NavItem) =>
    isActive(item.href) || !!item.children?.some((child) => isActive(child.href))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setMobileDropdownOpen(null)
    setProfileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!profileMenuOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [profileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg shadow-primary/5"
          : "bg-transparent"
          }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-wider uppercase text-foreground">
              Zac<span className="text-primary">son</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => {
              const active = isItemActive(item)

              if (item.children?.length) {
                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${active ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                    </Link>

                    <div className="invisible absolute left-0 top-full z-50 mt-3 min-w-[180px] border border-border bg-card p-2 opacity-0 shadow-lg shadow-black/20 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`block px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${isActive(child.href)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-primary"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${active ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  aria-label="Open user menu"
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground transition-transform duration-300 hover:scale-105"
                >
                  {getInitials(user.name)}
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full z-50 mt-3 w-48 border border-border bg-card p-2 shadow-lg shadow-black/20"
                    >
                      {user.role === "admin" ? (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setProfileMenuOpen(false)}
                            className="block w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                          >
                            Admin Panel
                          </Link>
                          <Link
                            href="/admin/services"
                            onClick={() => setProfileMenuOpen(false)}
                            className="block w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                          >
                            Services
                          </Link>
                          <Link
                            href="/admin/appointments"
                            onClick={() => setProfileMenuOpen(false)}
                            className="block w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                          >
                            Appointments
                          </Link>
                        </>
                      ) : (
                        <Link
                          href="/staff"
                          onClick={() => setProfileMenuOpen(false)}
                          className="block w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                        >
                          Staff Panel
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false)
                          logout()
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                Login
              </Link>
            )}

            <Link
              href="/appointment"
              className="rounded-none bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80"
            >
              Book Now
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 lg:hidden text-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </motion.header> 

     

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background/98 backdrop-blur-sm lg:hidden"
          >
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 flex items-center gap-3 border border-border bg-card/80 px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  {getInitials(user.name)}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{user.role}</p>
                </div>
              </motion.div>
            )}

            {navLinks.map((item, i) => {
              const active = isItemActive(item)
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="w-full max-w-xs text-center"
                >
                  {item.children?.length ? (
                    <div className="space-y-3">
                      <div className="mx-auto flex items-center justify-center gap-2">
                        <Link
                          href={item.href}
                          className={`text-2xl font-semibold uppercase tracking-widest transition-colors ${active ? "text-primary" : "text-foreground hover:text-primary"
                            }`}
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() =>
                            setMobileDropdownOpen((prev) => (prev === item.label ? null : item.label))
                          }
                          aria-label={`Toggle ${item.label} menu`}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${mobileDropdownOpen === item.label ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                      </div>

                      {mobileDropdownOpen === item.label && (
                        <div className="space-y-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={`block text-lg font-medium uppercase tracking-wider transition-colors ${isActive(child.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                                }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-2xl font-semibold uppercase tracking-widest transition-colors ${active ? "text-primary" : "text-foreground hover:text-primary"
                        }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              )
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-2 flex items-center gap-4"
            >
              {user ? (
                <>
                  {user.role === "admin" ? (
                    <>
                      <Link
                        href="/admin"
                        className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                      >
                        Admin
                      </Link>
                      <Link
                        href="/admin/services"
                        className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                      >
                        Services
                      </Link>
                      <Link
                        href="/admin/appointments"
                        className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                      >
                        Appointments
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/staff"
                      className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                    >
                      Staff
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                >
                  Login
                </Link>
              )}

              <Link
                href="/appointment"
                className="rounded-none bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80"
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
