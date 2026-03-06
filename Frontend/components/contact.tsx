"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    lines: ["123 Fitness Avenue", "New York, NY 10001"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["(90) 277 278 2566", "(78) 267 256 2578"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@zacson.com", "support@zacson.com"],
  },
]

export function Contact() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })


      if (res.ok) {
        setStatus("success")
        setFormState({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setStatus("idle"), 4000)
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 4000)
      }
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <section className="relative py-24 lg:py-32 bg-secondary" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Get In Touch
          </span>
          <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
            Contact Me
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-5 border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10">
                  <info.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-foreground">
                    {info.title}
                  </h4>
                  {info.lines.map((line) => (
                    <p key={line} className="text-sm text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                placeholder="How can I help you?"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full resize-none border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                placeholder="Tell me about your fitness goals..."
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
              {status === "success" && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium text-green-500"
                >
                  Message sent successfully!
                </motion.span>
              )}
              {status === "error" && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium text-red-400"
                >
                  Something went wrong. Please try again.
                </motion.span>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
