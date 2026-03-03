"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProfileCard from "./ProfileCard";
import TextType from "./TextType";
import { useTheme } from "next-themes";


import Link from "next/link";
/* ─────────────────────────────────────────────────────────
   Reveal — strong spring-physics scroll animation
   Each element fades in from 60px below and has a scale pop
───────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
  fromLeft = false,
  fromRight = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  fromLeft?: boolean;
  fromRight?: boolean;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.35 1"],
  });

  // Use stronger transforms
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rawY       = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const rawX       = useTransform(
    scrollYProgress,
    [0, 1],
    [fromLeft ? -80 : fromRight ? 80 : 0, 0]
  );
  const rawScale   = useTransform(scrollYProgress, [0, 0.6, 1], [0.88, 0.98, 1]);

  const opacity = useSpring(rawOpacity, { stiffness: 50, damping: 16 });
  const y       = useSpring(rawY,       { stiffness: 50, damping: 16 });
  const x       = useSpring(rawX,       { stiffness: 50, damping: 16 });
  const scale   = useSpring(rawScale,   { stiffness: 50, damping: 16 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x, scale }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   About Section
───────────────────────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  // Section-level scroll-in / scroll-out — large transforms so it's very noticeable
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.82, 1],
    [0, 1, 1, 0]
  );
  const sectionY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [100, 0, 0, -80]
  );
  const sectionScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0.93, 1, 1, 0.95]
  );

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      style={{ opacity: sectionOpacity, y: sectionY, scale: sectionScale }}
      className="relative py-16 md:py-24 lg:py-36 overflow-hidden"
    >
      {/* ── Background decorations ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 60%, rgba(var(--accent-cyan-rgb, 0,240,255),0.04) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 80% 30%, rgba(37,99,235,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Section label ── */}
        <Reveal className="text-center mb-16 md:mb-24">
          <span
            className="inline-block text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: resolvedTheme === 'light' ? "#2563eb" : "var(--accent-cyan)" }}
          >
            — Get to know me
          </span>
          <h2
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-none tracking-tight text-foreground"
          >
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent-cyan) 0%, #2563eb 50%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Me
            </span>
          </h2>
        </Reveal>

        {/* ── Two-col: Profile Card | Text ── */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">

          {/* Left — Profile Card slides in from left */}
          <Reveal fromLeft delay={0.05}>
            <ProfileCard />
          </Reveal>

          {/* Right — Text content slides in from right */}
          <div className="space-y-8">
            <Reveal fromRight delay={0.1}>
              <h3
                className="font-display font-bold text-2xl md:text-3xl leading-snug text-foreground"
              >
                A passionate developer who loves to{" "}
                <TextType
                  words={[
                    "craft beautiful things.",
                    "build scalable web apps.",
                    "optimize user experiences.",
                    "design intuitive UI/UX.",
                    "develop cross-platform tech.",
                  ]}
                  typingSpeed={70}
                  deletingSpeed={40}
                  pauseAfterType={2000}
                  className="font-display font-bold"
                  textStyle={{
                    background: "linear-gradient(90deg, var(--accent-cyan), #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  cursorClassName="bg-[var(--accent-cyan)] mx-[2px]"
                />
              </h3>
            </Reveal>

            <Reveal fromRight delay={0.15}>
              <div className="space-y-4 text-[15px] leading-[1.8] text-foreground/70 dark:text-foreground/75">
                <p>
                  Hello! I'm Farhan, a <strong className="text-foreground/80">Frontend Developer</strong> and Multimedia Engineering Technology student. I blend technical expertise with a keen eye for design to build scalable, responsive, and user-centered digital products.
                </p>
                <p>
                  My work spans across modern web applications, UI/UX design, and interactive multimedia. I focus on bridging the gap between aesthetics and engineering.
                </p>
              </div>
            </Reveal>

            {/* View Full Profile Button */}
            <Reveal fromRight delay={0.2}>
              <div className="pt-2">
                <Link href="/about">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 relative overflow-hidden cursor-pointer"
                    style={{
                      background: resolvedTheme === 'light' ? "#2563eb" : "rgba(var(--accent-cyan-rgb, 0,240,255), 0.1)",
                      color: resolvedTheme === 'light' ? "#ffffff" : "var(--accent-cyan)",
                      border: resolvedTheme === 'light' ? "none" : "1px solid rgba(var(--accent-cyan-rgb, 0,240,255), 0.3)",
                    }}
                  >
                    <span className="relative z-10">View Full Profile</span>
                    <ArrowRight 
                      size={16} 
                      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
                    />
                    {resolvedTheme !== 'light' && (
                      <div className="absolute inset-0 bg-(--accent-cyan) opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    )}
                  </motion.div>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
