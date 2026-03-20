"use client";

import React from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Dumbbell,
  Trophy,
  Target,
  Zap,
  Activity,
} from "lucide-react";

// ---------- Animation Variants (extended) ----------
const blobVariants: Variants = {
  animate: (custom: number) => ({
    x: [-40, 60, -30, 40, -20],
    y: [20, -30, 40, -20, 30],
    scale: [1, 1.3, 0.8, 1.2, 1],
    transition: {
      duration: 12 + custom * 3,
      repeat: Infinity,
      ease: "linear",
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  }),
};

// Parallax effect for background elements
const useParallax = (speed: number) => {
  const { scrollY } = useScroll();
  return useTransform(scrollY, (y) => y * speed);
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const chipVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    rotate: -10,
    scale: 0.5,
    transition: { delay: i * 0.1 },
  }),
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  hover: {
    scale: 1.2,
    rotate: 5,
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
    transition: { type: "spring", stiffness: 300 },
  },
};

const linkVariants: Variants = {
  hover: { y: -2 },
};

const underlineVariants: Variants = {
  hidden: { width: 0 },
  hover: { width: "100%", transition: { duration: 0.2, ease: "easeOut" } },
};

const socialVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.2,
    y: -6,
    boxShadow: "0 10px 20px -5px hsl(var(--primary)/0.5)",
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
  tap: { scale: 0.9 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const rippleVariants: Variants = {
  hover: {
    scale: 1.5,
    opacity: [0, 0.5, 0],
    transition: { duration: 0.6 },
  },
};

const backToTopVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  hover: { scale: 1.2, rotate: 360 },
  tap: { scale: 0.8 },
};

const glowRingVariants: Variants = {
  animate: {
    scale: [1, 1.4, 1],
    opacity: [0.6, 0, 0.6],
    transition: { duration: 2, repeat: Infinity },
  },
};

// Floating animation for hex grid
const floatingGridVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

// ---------- Data ----------
const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter, brand: "twitter" },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram, brand: "instagram" },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook, brand: "facebook" },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube, brand: "youtube" },
];

const brandHoverClass = {
  twitter: "hover:text-[#1DA1F2]",
  facebook: "hover:text-[#1877F2]",
  youtube: "hover:text-[#FF0000]",
  instagram:
    "hover:text-white hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]",
};

const chips = [
  { icon: Dumbbell, text: "Strength" },
  { icon: Target, text: "Focus" },
  { icon: Zap, text: "Power" },
  { icon: Activity, text: "Cardio" },
  { icon: Trophy, text: "Results" },
];

// ---------- Custom Hook for Back to Top ----------
const useScrollToTop = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return { opacity, scrollToTop };
};

// ---------- Component ----------
export function Footer() {
  const { opacity, scrollToTop } = useScrollToTop();
  const gridY = useParallax(0.05); // subtle parallax for hex grid

  return (
    <footer className="relative overflow-hidden bg-background py-16 border-t border-border">
      {/* ---------- GYM-THEMED BACKGROUND ELEMENTS ---------- */}

      {/* 1. Hexagon grid with parallax and floating */}
      <motion.div
        style={{ y: gridY }}
        variants={floatingGridVariants}
        animate="animate"
        className="absolute inset-0 opacity-10 pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 2 L55 16 L55 44 L30 58 L5 44 L5 16 Z' fill='none' stroke='%23ffffff' stroke-width='0.5' /%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* 2. Sweeping neon light */}
      <motion.div
        className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl pointer-events-none"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* 3. Dumbbell pattern with its own subtle float */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='8' width='16' height='8' rx='1' /%3E%3Crect x='8' y='5' width='8' height='14' rx='1' /%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 4. Chaotic blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-20 top-10 h-[280px] w-[280px] rounded-full bg-red-500/20 blur-[100px]"
          variants={blobVariants}
          animate="animate"
          custom={0}
        />
        <motion.div
          className="absolute right-[-80px] top-20 h-[320px] w-[320px] rounded-full bg-yellow-500/20 blur-[120px]"
          variants={blobVariants}
          animate="animate"
          custom={1}
        />
      </div>

      {/* ---------- MAIN CONTENT with staggered children ---------- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-7xl px-6"
      >
        <div className="flex flex-col items-center gap-9">
          {/* Logo (item) */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="text-3xl font-black uppercase tracking-widest text-foreground">
              Zac<span className="text-primary">son</span>
            </Link>
          </motion.div>

          {/* Chips (item) */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3">
            {chips.map((chip, i) => (
              <motion.div
                key={chip.text}
                custom={i}
                variants={chipVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground cursor-default"
              >
                <chip.icon size={14} />
                {chip.text}
              </motion.div>
            ))}
          </motion.div>

          {/* Links (item) */}
          <motion.nav variants={itemVariants} className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {footerLinks.map((link) => (
              <motion.div key={link.label} variants={linkVariants} whileHover="hover">
                <Link
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground relative group"
                >
                  {link.label}
                  <motion.span
                    className="absolute left-0 -bottom-1 h-[2px] bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                    variants={underlineVariants}
                    initial="hidden"
                    whileHover="hover"
                  />
                  <motion.span
                    className="absolute right-0 -bottom-1 h-[2px] bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                    variants={underlineVariants}
                    initial="hidden"
                    whileHover="hover"
                    transition={{ delay: 0.1 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Divider (item) */}
          <motion.div
            variants={itemVariants}
            className="h-px w-full max-w-xl bg-gradient-to-r from-transparent via-primary/70 to-transparent"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Social Icons (item) */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            {socialLinks.map((platform) => (
              <motion.a
                key={platform.label}
                href={platform.href}
                variants={socialVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate="pulse" // subtle continuous pulse
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground overflow-hidden ${brandHoverClass[platform.brand]}`}
              >
                <platform.Icon size={16} />
                <motion.span
                  className="absolute inset-0 rounded-xl border-2 border-primary"
                  variants={rippleVariants}
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover="hover"
                />
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright (item) */}
          <motion.p variants={itemVariants} className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} Zacson Fitness
          </motion.p>
        </div>
      </motion.div>

      {/* Back to Top Button with bounce entrance */}
      <motion.button
        onClick={scrollToTop}
        style={{ opacity }}
        variants={backToTopVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <ArrowUp size={16} strokeWidth={3} />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          variants={glowRingVariants}
          animate="animate"
        />
      </motion.button>
    </footer>
  );
}