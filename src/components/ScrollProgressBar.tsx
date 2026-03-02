"use client";

import { useScroll, motion, useSpring } from "framer-motion";

/**
 * ScrollProgressBar — thin gradient line at the very top of the viewport
 * that fills from left to right as the user scrolls the full page.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 9999,
        background: "linear-gradient(90deg, #00f0ff, #2563eb, #0ea5e9)",
        boxShadow: "0 0 10px rgba(0,240,255,0.7)",
      }}
    />
  );
}
