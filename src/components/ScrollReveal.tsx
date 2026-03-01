"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

type Preset = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur" | "slideUp3d";

interface ScrollRevealProps {
  children: ReactNode;
  preset?: Preset;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const presets: Record<Preset, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.82 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(16px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slideUp3d: {
    hidden: { opacity: 0, y: 60, rotateX: 18, transformPerspective: 800 },
    visible: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 800 },
  },
};

/**
 * ScrollReveal — reusable scroll-triggered entrance animation wrapper.
 * Wraps any content and animates it into view when it enters the viewport.
 */
export default function ScrollReveal({
  children,
  preset = "fadeUp",
  delay = 0,
  duration = 0.65,
  className = "",
  once = true,
  amount = 0.25,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      variants={presets[preset]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
