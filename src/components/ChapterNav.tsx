"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Chapter = {
  id: string;
  label: string;
  color: string;
};

const chapters: Chapter[] = [
  { id: "hero",     label: "Home",     color: "#00f0ff" },
  { id: "about",    label: "About",    color: "#2563eb" },
  { id: "timeline", label: "Timeline", color: "#a78bfa" },
  { id: "skills",   label: "Skills",   color: "#0ea5e9" },
  { id: "projects", label: "Projects", color: "#fbbf24" },
  { id: "contact",  label: "Contact",  color: "#4ade80" },
];

/**
 * ChapterNav — floating dot navigation on the right side.
 * Each dot represents a section. Hover shows label. Click scrolls to section.
 * Active dot is highlighted based on IntersectionObserver.
 */
export default function ChapterNav() {
  const [active, setActive] = useState("hero");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Use the entry with the highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { threshold: [0.2, 0.5], rootMargin: "-10% 0px -10% 0px" }
    );

    chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-end"
      aria-label="Section navigation"
    >
      {chapters.map((ch) => {
        const isActive = active === ch.id;
        const isHovered = hoveredId === ch.id;

        return (
          <div
            key={ch.id}
            className="relative flex items-center justify-end gap-2"
            onMouseEnter={() => setHoveredId(ch.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Label */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18 }}
                  className="text-[10px] font-bold tracking-widest uppercase select-none rounded-full px-2 py-0.5"
                  style={{
                    color: ch.color,
                    background: `${ch.color}18`,
                    border: `1px solid ${ch.color}44`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {ch.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <button
              onClick={() => scrollTo(ch.id)}
              aria-label={`Go to ${ch.label}`}
              className="relative flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: isActive ? 12 : 7,
                height: isActive ? 12 : 7,
                background: isActive ? ch.color : "rgba(var(--foreground-rgb, 255,255,255), 0.2)",
                boxShadow: isActive ? `0 0 10px ${ch.color}99` : "none",
              }}
            >
              {/* Ring on active */}
              {isActive && (
                <motion.span
                  layoutId="chapter-ring"
                  className="absolute rounded-full border"
                  style={{
                    inset: -3,
                    borderColor: ch.color,
                    opacity: 0.5,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
