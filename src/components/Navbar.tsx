"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LayoutGrid } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Home",     href: "/",         icon: Home },
  { label: "Projects", href: "/projects", icon: LayoutGrid },
];

/* ─────────────────────────────────────────────────────────
   Liquid glass CSS-in-JS helpers
───────────────────────────────────────────────────────── */
const liquidGlass = {
  /* Main pill glass surface */
  background: "rgba(var(--foreground-rgb, 255,255,255), 0.055)",
  backdropFilter: "blur(28px) saturate(160%) brightness(1.08)",
  WebkitBackdropFilter: "blur(28px) saturate(160%) brightness(1.08)",
  /* Prismatic/iridescent edge: top highlight is brighter */
  border: "1px solid transparent",
  backgroundClip: "padding-box",
  /* Layered box shadows: inner highlight top + outer glow */
  boxShadow: [
    "inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.22)",   /* top inner shine */
    "inset 0 -1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.06)",   /* bottom inner */
    "inset 1px 0 0 rgba(var(--foreground-rgb, 255,255,255), 0.1)",     /* left inner */
    "inset -1px 0 0 rgba(var(--foreground-rgb, 255,255,255), 0.1)",    /* right inner */
    "0 8px 32px rgba(0,0,0,0.35)",             /* depth shadow */
    "0 0 0 1px rgba(var(--foreground-rgb, 255,255,255), 0.09)",        /* outer border */
    "0 0 24px rgba(var(--accent-cyan-rgb, 0,240,255),0.06)",           /* subtle cyan glow */
  ].join(", "),
} as React.CSSProperties;

/* Active link pill */
const activePillStyle: React.CSSProperties = {
  background: "rgba(var(--foreground-rgb, 255,255,255), 0.12)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.2), 0 0 8px rgba(var(--accent-cyan-rgb, 0,240,255),0.15)",
};

/* ─────────────────────────────────────────────────────────
   Iridescent shimmer line
───────────────────────────────────────────────────────── */
function IridescentEdge() {
  return (
    <div
      aria-hidden
      className="absolute top-0 left-4 right-4 h-px rounded-full pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(var(--accent-cyan-rgb, 0,240,255),0.5) 20%, rgba(167,139,250,0.6) 40%, rgba(14,165,233,0.5) 60%, rgba(var(--accent-cyan-rgb, 0,240,255),0.4) 80%, transparent 100%)",
        opacity: 0.7,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Nav Item with Tooltip
───────────────────────────────────────────────────────── */
import { MotionValue, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

function NavItem({
  link,
  isActive,
  onClick,
  mouseX,
}: {
  link: typeof navLinks[0];
  isActive: boolean;
  onClick: () => void;
  mouseX: MotionValue<number>;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = link.icon;
  const ref = useRef<HTMLButtonElement>(null);

  // Calculate distance from mouse to the center of this button
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Transform distance into a width size (base 48px, max 64px)
  const widthSync = useTransform(distance, [-100, 0, 100], [48, 64, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  // Transform distance into an icon scale (base 1, max 1.25)
  const iconScaleSync = useTransform(distance, [-100, 0, 100], [1, 1.25, 1]);
  const iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div
      className="relative flex items-end justify-center h-[48px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        ref={ref}
        onClick={onClick}
        className="relative flex items-center justify-center rounded-full transition-colors duration-200"
        style={{
          width,
          height: width, // Keep it perfectly circular
          color: isActive ? "var(--color-foreground)" : "rgba(var(--foreground-rgb, 255,255,255), 0.55)",
        }}
        aria-label={link.label}
      >
        {isActive && (
          <motion.span
            layoutId="nav-active"
            className="absolute inset-0 rounded-full"
            style={activePillStyle}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          />
        )}
        <motion.div style={{ scale: iconScale }} className="relative z-10 shrink-0 flex items-center justify-center">
          <Icon size={18} />
        </motion.div>
      </motion.button>

      {/* Tooltip Popover (opens UPWARDS) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-[calc(100%+12px)] flex flex-col items-center pointer-events-none z-50 rounded-xl"
            style={{ left: "50%", x: "-50%" }}
          >
            {/* Tooltip Body */}
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-foreground whitespace-nowrap"
              style={{
                background: "rgba(var(--background-rgb, 30,30,35), 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {link.label}
            </div>
            {/* Pointer Triangle */}
            <div
              className="w-2 h-2 rotate-45 -mt-1 relative z-0"
              style={{
                background: "rgba(var(--background-rgb, 30,30,35), 0.95)",
                borderBottom: "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.12)",
                borderRight: "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.12)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  
  // Mouse position tracker for the Dock effect
  const mouseX = useMotionValue(Infinity);
  const router = useRouter();
  const pathname = usePathname();

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section via IntersectionObserver */
  useEffect(() => {
    // Only observe sections if we are on the home page
    if (pathname !== "/") return;

    const ids = ["hero", ...navLinks.filter(l => l.href.startsWith("#")).map((l) => l.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis.length && vis[0].target.id) {
          setActiveSection(vis[0].target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    );
    ids.forEach((id) => { 
      const el = document.getElementById(id); 
      if (el) observer.observe(el); 
    });
    return () => observer.disconnect();
  }, [pathname]);

  const handleNavigation = useCallback((href: string) => {
    setMobileOpen(false);

    if (href.startsWith("/")) {
      router.push(href);
    } else {
      // It's a hash link
      if (pathname !== "/") {
        router.push(`/${href}`);
      } else {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router, pathname]);

  return (
    <>
      {/* ── Universal Pill Navbar ── */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 2.5 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-100 w-max max-w-[95vw]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          style={{
            ...liquidGlass,
            padding: "8px 12px",
            borderRadius: "9999px",
          }}
          className="relative flex items-end gap-2 h-[64px]"
        >
          {/* Iridescent top shimmer */}
          <IridescentEdge />

          {/* Nav links (Icons + Tooltips) */}
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              isActive={activeSection === link.href.slice(1) || pathname === link.href}
              onClick={() => handleNavigation(link.href)}
              mouseX={mouseX}
            />
          ))}

          {/* Divider */}
          <div className="w-px h-8 mx-2 rounded-full self-center" style={{ background: "rgba(var(--foreground-rgb, 255,255,255), 0.15)" }} />

          {/* CTA Actions */}
          <div className="flex items-center gap-1.5 self-center">
            {/* Theme Toggle */}
            <ThemeToggle />


          </div>
        </div>
      </motion.nav>

    </>
  );
}
