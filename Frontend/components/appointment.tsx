"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Dumbbell,
  Users,
  HeartPulse,
  Flame,
} from "lucide-react"

const trainingTypes = [
  {
    id: "personal",
    icon: Dumbbell,
    title: "Personal Training",
    duration: "60 min",
    description: "One-on-one coaching tailored to your goals.",
  },
  {
    id: "group",
    icon: Users,
    title: "Group Session",
    duration: "45 min",
    description: "High-energy small-group training for all levels.",
  },
  {
    id: "cardio",
    icon: HeartPulse,
    title: "Cardio & HIIT",
    duration: "45 min",
    description: "Burn fat and boost endurance with interval training.",
  },
  {
    id: "strength",
    icon: Flame,
    title: "Strength Program",
    duration: "75 min",
    description: "Build raw power with progressive overload sessions.",
  },
]

const timeSlots = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type Step = 1 | 2 | 3 | 4

export function Appointment() {
  const { ref, isVisible } = useScrollAnimation(0.05)

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const [step, setStep] = useState<Step>(1)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const daysInMonth = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  )
  const firstDay = useMemo(
    () => getFirstDayOfMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  function prevMonth() {
    if (
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
      return
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  function isDateDisabled(day: number) {
    const d = new Date(currentYear, currentMonth, day)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t || d.getDay() === 0
  }

  function formatDate(day: number) {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          date: selectedDate,
          time: selectedTime,
          ...formState,
        }),
      })

      if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 4000)
      }
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  function resetForm() {
    setStep(1)
    setSelectedType(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setFormState({ name: "", email: "", phone: "", notes: "" })
    setStatus("idle")
  }

  const stepLabels = ["Service", "Date & Time", "Details", "Confirm"]

  return (
    <section className="relative py-24 lg:py-32 bg-secondary" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Book a Session
          </span>
          <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground lg:text-5xl text-balance">
            Schedule Your Appointment
          </h2>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {stepLabels.map((label, i) => {
              const stepNum = (i + 1) as Step
              const isActive = step === stepNum
              const isComplete = step > stepNum || status === "success"
              return (
                <div key={label} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center text-sm font-bold transition-all duration-300 ${isComplete
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "border-2 border-primary text-primary"
                          : "border border-border text-muted-foreground"
                        }`}
                    >
                      {isComplete ? <Check size={16} /> : stepNum}
                    </div>
                    <span
                      className={`hidden text-[10px] font-semibold uppercase tracking-wider sm:block ${isActive
                        ? "text-primary"
                        : isComplete
                          ? "text-foreground"
                          : "text-muted-foreground"
                        }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`h-px w-8 sm:w-16 transition-colors duration-300 ${step > stepNum ? "bg-primary" : "bg-border"
                        }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="border border-border bg-card p-6 sm:p-10"
        >
          <AnimatePresence mode="wait">
            {/* Success Screen */}
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-6 py-12 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center bg-primary/10">
                  <Check size={36} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-wide text-foreground">
                  Appointment Booked
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your{" "}
                  {trainingTypes.find((t) => t.id === selectedType)?.title}{" "}
                  session has been scheduled for{" "}
                  <span className="text-foreground">{selectedDate}</span> at{" "}
                  <span className="text-foreground">{selectedTime}</span>. We
                  will send a confirmation to{" "}
                  <span className="text-foreground">{formState.email}</span>.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-4 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80"
                >
                  Book Another
                </button>
              </motion.div>
            ) : (
              <>
                {/* STEP 1 -- Select Training Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                      Select a Training Type
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {trainingTypes.map((type) => {
                        const active = selectedType === type.id
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`group flex items-start gap-4 border p-5 text-left transition-all duration-300 cursor-pointer ${active
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                              }`}
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-300 ${active
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                                }`}
                            >
                              <type.icon size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                                {type.title}
                              </h4>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {type.duration} &middot; {type.description}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button
                        disabled={!selectedType}
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 -- Date & Time */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                      Pick a Date & Time
                    </h3>

                    <div className="grid gap-8 lg:grid-cols-2">
                      {/* Calendar */}
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <button
                            onClick={prevMonth}
                            aria-label="Previous month"
                            className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {MONTHS[currentMonth]} {currentYear}
                          </span>
                          <button
                            onClick={nextMonth}
                            aria-label="Next month"
                            className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary cursor-pointer"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                          {DAYS.map((d) => (
                            <div
                              key={d}
                              className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                            >
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* Day grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const dateStr = formatDate(day)
                            const disabled = isDateDisabled(day)
                            const active = selectedDate === dateStr
                            return (
                              <button
                                key={day}
                                disabled={disabled}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`flex h-10 items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer ${disabled
                                  ? "text-muted-foreground/30 cursor-not-allowed"
                                  : active
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                                  }`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div>
                        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Available Slots{" "}
                          {selectedDate && (
                            <span className="text-primary">
                              &middot; {selectedDate}
                            </span>
                          )}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((slot) => {
                            const active = selectedTime === slot
                            return (
                              <button
                                key={slot}
                                disabled={!selectedDate}
                                onClick={() => setSelectedTime(slot)}
                                className={`flex items-center justify-center gap-1.5 border py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${!selectedDate
                                  ? "border-border/50 text-muted-foreground/30 cursor-not-allowed"
                                  : active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-foreground hover:border-primary hover:text-primary"
                                  }`}
                              >
                                <Clock size={12} />
                                {slot}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 -- Personal Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                      Your Details
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="appt-name"
                          className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          <User size={13} /> Full Name
                        </label>
                        <input
                          id="appt-name"
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="appt-email"
                          className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          <Mail size={13} /> Email Address
                        </label>
                        <input
                          id="appt-email"
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="appt-phone"
                          className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          <Phone size={13} /> Phone Number
                        </label>
                        <input
                          id="appt-phone"
                          type="tel"
                          required
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              phone: e.target.value,
                            })
                          }
                          className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="appt-notes"
                          className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          <CalendarDays size={13} /> Notes (Optional)
                        </label>
                        <input
                          id="appt-notes"
                          type="text"
                          value={formState.notes}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              notes: e.target.value,
                            })
                          }
                          className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                          placeholder="Any injuries or goals to mention?"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button
                        disabled={
                          !formState.name ||
                          !formState.email ||
                          !formState.phone
                        }
                        onClick={() => setStep(4)}
                        className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Review <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 -- Confirm */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-wider text-foreground">
                      Confirm Appointment
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          label: "Training Type",
                          value:
                            trainingTypes.find((t) => t.id === selectedType)
                              ?.title ?? "",
                          icon: Dumbbell,
                        },
                        {
                          label: "Date",
                          value: selectedDate ?? "",
                          icon: CalendarDays,
                        },
                        {
                          label: "Time",
                          value: selectedTime ?? "",
                          icon: Clock,
                        },
                        {
                          label: "Name",
                          value: formState.name,
                          icon: User,
                        },
                        {
                          label: "Email",
                          value: formState.email,
                          icon: Mail,
                        },
                        {
                          label: "Phone",
                          value: formState.phone,
                          icon: Phone,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-4 border border-border p-4"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10">
                            <item.icon size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {formState.notes && (
                      <div className="mt-4 border border-border p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Notes
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          {formState.notes}
                        </p>
                      </div>
                    )}

                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-sm font-medium text-red-400"
                      >
                        Something went wrong. Please try again.
                      </motion.p>
                    )}

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={status === "loading"}
                        className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80 disabled:opacity-50"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />{" "}
                            Booking...
                          </>
                        ) : (
                          <>
                            <Check size={16} /> Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
