"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

/**
 * BlurText — word-by-word blur + fade + slide reveal on scroll.
 * Inspired by reactbits.dev/text-animations/blur-text
 */
export default function BlurText({
  text,
  className = "",
  delay = 0.06,
  threshold = 0.3,
  once = true,
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });

  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap gap-x-[0.28em] ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(10px)" }
          }
          transition={{
            duration: 0.55,
            delay: i * delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
