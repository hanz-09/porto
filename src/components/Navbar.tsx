"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Clock, Wrench, LayoutGrid, Mail, Rocket, Download } from "lucide-react";

const navLinks = [
  { label: "About",    href: "#about",    icon: User },
  { label: "Timeline", href: "#timeline", icon: Clock },
  { label: "Skills",   href: "#skills",   icon: Wrench },
  { label: "Projects", href: "#projects", icon: LayoutGrid },
  { label: "Contact",  href: "#contact",  icon: Mail },
];

/* ─────────────────────────────────────────────────────────
   Liquid glass CSS-in-JS helpers
───────────────────────────────────────────────────────── */
const liquidGlass = {
  /* Main pill glass surface */
  background: "rgba(255,255,255,0.055)",
  backdropFilter: "blur(28px) saturate(160%) brightness(1.08)",
  WebkitBackdropFilter: "blur(28px) saturate(160%) brightness(1.08)",
  /* Prismatic/iridescent edge: top highlight is brighter */
  border: "1px solid transparent",
  backgroundClip: "padding-box",
  /* Layered box shadows: inner highlight top + outer glow */
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.22)",   /* top inner shine */
    "inset 0 -1px 0 rgba(255,255,255,0.06)",   /* bottom inner */
    "inset 1px 0 0 rgba(255,255,255,0.1)",     /* left inner */
    "inset -1px 0 0 rgba(255,255,255,0.1)",    /* right inner */
    "0 8px 32px rgba(0,0,0,0.35)",             /* depth shadow */
    "0 0 0 1px rgba(255,255,255,0.09)",        /* outer border */
    "0 0 24px rgba(0,212,255,0.06)",           /* subtle cyan glow */
  ].join(", "),
} as React.CSSProperties;

/* Active link pill */
const activePillStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 8px rgba(0,212,255,0.15)",
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
          "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.5) 20%, rgba(167,139,250,0.6) 40%, rgba(244,114,182,0.5) 60%, rgba(0,212,255,0.4) 80%, transparent 100%)",
        opacity: 0.7,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Nav Item with Tooltip
───────────────────────────────────────────────────────── */
function NavItem({ link, isActive, onClick }: { link: typeof navLinks[0]; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const Icon = link.icon;

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        className="relative p-3 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)" }}
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
        <Icon size={18} className="relative z-10" />
      </button>

      {/* Tooltip Popover (opens UPWARDS) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full mb-4 flex flex-col items-center pointer-events-none z-50"
          >
            {/* Tooltip Body */}
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white whitespace-nowrap"
              style={{
                background: "rgba(30,30,35,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {link.label}
            </div>
            {/* Tooltip Arrow (pointing down) */}
            <div
              className="w-2.5 h-2.5 rotate-45 -mt-1.5 relative z-0"
              style={{
                background: "rgba(30,30,35,0.9)",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                borderRight: "1px solid rgba(255,255,255,0.15)",
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

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section via IntersectionObserver */
  useEffect(() => {
    const ids = ["hero", ...navLinks.map((l) => l.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis.length) setActiveSection(vis[0].target.id);
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
          style={{
            ...liquidGlass,
            padding: "8px 12px",
            borderRadius: "9999px",
          }}
          className="relative flex items-center gap-1.5"
        >
          {/* Iridescent top shimmer */}
          <IridescentEdge />

          {/* Nav links (Icons + Tooltips) */}
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              isActive={activeSection === link.href.slice(1)}
              onClick={() => scrollTo(link.href)}
            />
          ))}

          {/* Divider */}
          <div className="w-px h-6 mx-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />

          {/* CTA Actions */}
          <div className="flex items-center gap-1.5">
            {/* Resume CTA */}
            <motion.div
              className="relative flex items-center justify-center"
              initial="initial"
              whileHover="hover"
            >
              <motion.a
                href="/cv.pdf"
                whileTap={{ scale: 0.96 }}
                className="p-3 rounded-full text-white relative overflow-hidden transition-colors hover:bg-white/10"
                aria-label="Download Resume"
              >
                <Download size={18} className="relative z-10" />
              </motion.a>
              
              {/* Resume Tooltip */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: -15, scale: 0.9 },
                  hover: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full mb-4 flex flex-col items-center pointer-events-none z-50"
              >
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white whitespace-nowrap"
                  style={{
                    background: "rgba(30,30,35,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  Resume
                </div>
                <div
                  className="w-2.5 h-2.5 rotate-45 -mt-1.5 relative z-0"
                  style={{
                    background: "rgba(30,30,35,0.9)",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    borderRight: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Hire Me CTA */}
            <motion.div
              className="relative flex items-center justify-center"
              initial="initial"
              whileHover="hover"
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("#contact")}
                className="p-3 rounded-full text-white relative overflow-hidden"
                aria-label="Hire Me"
                style={{
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  boxShadow: "0 0 14px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                {/* Shine sweep on button */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 hover:opacity-100"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
                />
                <Rocket size={18} className="relative z-10" />
              </motion.button>

              {/* Hire Me Tooltip (opens UPWARDS) */}
              <motion.div
                variants={{
                  initial: { opacity: 0, y: -15, scale: 0.9 },
                  hover: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full mb-4 flex flex-col items-center pointer-events-none z-50"
              >
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide text-white whitespace-nowrap"
                  style={{
                    background: "rgba(30,30,35,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  Hire Me
                </div>
                <div
                  className="w-2.5 h-2.5 rotate-45 -mt-1.5 relative z-0"
                  style={{
                    background: "rgba(30,30,35,0.9)",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    borderRight: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

    </>
  );
}
