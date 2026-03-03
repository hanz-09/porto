"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { Quote as QuoteIcon } from "lucide-react";

const QUOTE = "Design is not just what it looks like and feels like. Design is how it works.";
const AUTHOR = "Steve Jobs";

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  // Scroll animations for a cinematic reveal
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Soft fade in and scale up as user scrolls into the section
  const sOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const rawY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);
  const rawScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);

  const sY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const sScale = useSpring(rawScale, { stiffness: 60, damping: 20 });

  // Track global scroll direction (1 = down, -1 = up)
  const [direction, setDirection] = useState(1);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (current) => {
    const prev = scrollY.getPrevious() || 0;
    if (current > prev) setDirection(1);
    else if (current < prev) setDirection(-1);
  });

  // Word-by-word animation variants
  const words = QUOTE.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (dir: number = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.12, 
        delayChildren: 0.4,
        staggerDirection: dir,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        mass: 0.8,
      },
    },
    hidden: (dir: number = 1) => ({
      opacity: 0,
      y: 40 * dir,
      rotateX: 45 * dir,
      filter: "blur(12px)",
    }),
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity: sOpacity, y: sY, scale: sScale }}
      className="relative py-24 md:py-36 lg:py-48 overflow-hidden flex items-center justify-center min-h-[60vh]"
    >
      {/* Ambient background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 800,
            height: 800,
            background: "radial-gradient(circle, rgba(var(--accent-cyan-rgb, 0,240,255), 0.03) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        {/* Subtle grid line separator */}
        <div className="absolute top-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.05), transparent)" }} />
        <div className="absolute bottom-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.05), transparent)" }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Large decorative quote icon */}
        <motion.div
            custom={direction}
            variants={{
              hidden: (dir: number) => ({ opacity: 0, scale: 0.5, rotate: -25 * dir, y: 30 * dir, filter: "blur(10px)" }),
              visible: { opacity: 1, scale: 1, rotate: 0, y: 0, filter: "blur(0px)", transition: { duration: 1.2, type: "spring", bounce: 0.4 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="mb-12 flex justify-center perspective-1000"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-5 rounded-3xl relative group"
            style={{
              background: resolvedTheme === "light" ? "rgba(255,255,255,0.5)" : "rgba(var(--background-rgb, 8,8,16), 0.5)",
              border: `1px solid rgba(var(--foreground-rgb, 255,255,255), 0.1)`,
              boxShadow: resolvedTheme === "light" ? "0 20px 40px rgba(0,0,0,0.05)" : "0 20px 40px rgba(0,0,0,0.3)",
              backdropFilter: "blur(12px)",
            }}
          >
              <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <QuoteIcon size={56} strokeWidth={1} style={{ color: "var(--accent-cyan)", opacity: 0.9 }} className="relative z-10 drop-shadow-lg" />
            </motion.div>
        </motion.div>

        {/* Animated Text */}
        <motion.h2
          className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tight text-foreground mb-12 flex flex-wrap justify-center gap-x-3 gap-y-2"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          custom={direction}
        >
          {words.map((word, index) => (
            <motion.span key={index} variants={child} custom={direction} className="inline-block relative">
              {/* Highlight specific words for emphasis */}
              {word === "Design" || word === "works." ? (
                <span
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 55%, var(--accent-cyan) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: 700,
                  }}
                >
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.h2>

        {/* Author Line */}
        <motion.div
          custom={direction}
          variants={{
            hidden: (dir: number) => ({ opacity: 0, y: 20 * dir }),
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="w-12 h-px bg-foreground/30" />
          <span className="font-bold tracking-widest uppercase text-sm" style={{ color: "var(--accent-cyan)" }}>
            {AUTHOR}
          </span>
          <div className="w-12 h-px bg-foreground/30" />
        </motion.div>
      </div>
    </motion.section>
  );
}
