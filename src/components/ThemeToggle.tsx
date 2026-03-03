"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10" />
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = (e: React.MouseEvent) => {
    const newTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Ambil koordinat titik klik secara presisi di layar
    const x = e.clientX;
    const y = e.clientY;

    // Kalkulasi jarak terjauh ke ujung layar
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        [
          // Membesar seperti percikan air (ripple impact) langsung dari tombol
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 800, // Ditingkatkan agar lebih santai dan mengalir
          easing: "cubic-bezier(0.65, 0, 0.35, 1)", // Ease-in-out yang sangat mulus (seperti air membasahi permukaan)
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
      style={{
        background: isDark ? "rgba(var(--foreground-rgb, 255,255,255), 0.05)" : "rgba(0,0,0,0.05)",
        border: isDark ? "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.1)" : "1px solid rgba(0,0,0,0.1)",
        color: isDark ? "var(--color-foreground)" : "#0f172a",
        boxShadow: isDark 
          ? "inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.1)" 
          : "inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.5), 0 2px 5px rgba(0,0,0,0.05)",
      }}
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon (Light Mode) */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0.5 : 1,
            opacity: isDark ? 0 : 1,
            rotate: isDark ? -90 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute text-orange-500"
        >
          <Sun size={18} />
        </motion.div>

        {/* Moon Icon (Dark Mode) */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0.5,
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute text-cyan-400"
        >
          <Moon size={18} />
        </motion.div>
      </div>
    </motion.button>
  );
}
