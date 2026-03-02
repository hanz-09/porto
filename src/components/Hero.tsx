"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowDown, Mail, Download } from "lucide-react";
import Magnet from "./Magnet";
import Particles from "./Particles";

/* ─────────────────────────────────────────────────────────
   Marquee (single row, infinite, two directions)
───────────────────────────────────────────────────────── */
const MARQUEE_TEXT = [
  "FRONTEND DEVELOPER",
  "—",
  "FULLSTACK DEVELOPER WANNABE",
  "—",
  "UI ENTHUSIAST",
  "—",
  "WEB CRAFTSMAN",
  "—",
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  // To create a truly seamless infinite marquee, we duplicate the array enough times
  // so that moving it by exactly half its width (or -50%) perfectly lines up with its start.
  // Using 4 sets of the text guarantees we have enough content to fill the screen and loop without a visible jump.
  const base = [...MARQUEE_TEXT];
  const content = [...base, ...base, ...base, ...base];

  return (
    <div className="overflow-hidden select-none w-full flex">
      <motion.div
        className="flex gap-8 whitespace-nowrap min-w-max"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 170, repeat: Infinity, ease: "linear" }}
      >
        {content.map((word, i) => (
          <span
            key={i}
            className={`font-display font-black tracking-tight shrink-0 ${
              word === "—" ? "opacity-30" : ""
            }`}
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              /* Alternating solid / outline style per word */
              color: word === "—" ? "rgba(255,255,255,0.2)" : "transparent",
              WebkitTextStroke:
                word === "—"
                  ? "none"
                  : i % 2 === 0
                  ? "1px rgba(255,255,255,0.18)"
                  : "1px rgba(0,240,255,0.35)",
              textShadow:
                i % 2 !== 0 && word !== "—"
                  ? "0 0 40px rgba(0,240,255,0.15)"
                  : "none",
            }}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Live clock (WIB — Western Indonesia Time UTC+7)
───────────────────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tracking-widest tabular-nums"
      style={{ color: "rgba(255,255,255,0.35)" }}>
      WIB {time}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Mouse spotlight
───────────────────────────────────────────────────────── */
function MouseSpotlight() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 22 });
  const sy = useSpring(y, { stiffness: 80, damping: 22 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: "transparent",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: sx,
          top: sy,
          translateX: "-50%",
          translateY: "-50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,240,255,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven exit
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const yPercent = useTransform(scrollYProgress, [0, 1],    [0, -18]);
  const scale    = useTransform(scrollYProgress, [0, 0.8],  [1, 0.93]);

  // Stagger entrance variants
  const enter = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)" },
  };
  const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col overflow-hidden"
      style={{ background: "#060608" }}
    >
      {/* Global mouse spotlight */}
      <MouseSpotlight />

      {/* Interactive React Bits Particles Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Particles
          particleColors={["#ffffff", "#00f0ff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles
          disableRotation={false}
          className="absolute inset-0"
        />
      </div>

      {/* Noise Texture */}
      <div className="noise absolute inset-0 pointer-events-none z-0 opacity-40" aria-hidden />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(6,6,8,0.92) 100%)",
        }}
        aria-hidden
      />

      {/* Blue-edge glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,240,255,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Scroll exit wrapper */}
      <motion.div
        className="flex flex-col flex-1"
        style={{ opacity, y: yPercent, scale, transformOrigin: "center top" }}
      >
        {/* ── TOP BAR ── */}
        <div className="relative z-20 flex items-center justify-between px-7 pt-2 md:pt-4">
          {/* Logo / Name */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00f0ff, #2563eb)" }}
            >
              <span className="font-display font-black text-white text-xs">F</span>
            </div>
            <span className="font-display font-bold text-sm tracking-wide"
              style={{ color: "rgba(255,255,255,0.7)" }}>
              farhan.dev
            </span>
          </motion.div>

          {/* Live clock */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <LiveClock />
          </motion.div>
        </div>

        {/* ── MARQUEE ROW 1 (scroll right → left) ── */}
        <div className="relative z-10 mt-1 md:mt-2 opacity-100">
          <Marquee reverse={false} />
        </div>

        {/* ── CENTER CONTENT ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 gap-2 md:gap-4"
          style={{ marginTop: "-4rem", marginBottom: "-1rem" }}
        >
          {/* Available badge */}
          <motion.div variants={enter} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{
                background: "rgba(0,240,255,0.07)",
                border: "1px solid rgba(0,240,255,0.3)",
                color: "#00f0ff",
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Available for work
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={enter} transition={{ duration: 0.65 }}>
            <h1 className="font-display font-black leading-none tracking-tight"
              style={{ fontSize: "clamp(4rem, 12vw, 10rem)", color: "#ffffff" }}>
              Farhan 
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00f0ff 0%, #2563eb 50%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Zuhdi
              </span>
            </h1>
          </motion.div>

          {/* Role subtitle */}
          <motion.p
            variants={enter}
            transition={{ duration: 0.55 }}
            className="font-display text-base md:text-lg tracking-[0.25em] uppercase font-medium"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Frontend Developer &nbsp;·&nbsp; UI Enthusiast 
          </motion.p>



          {/* Circular Spinning Scroll Cue */}
          <motion.a
            href="#about"
            onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}
            initial="idle"
            animate="idle"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="flex flex-col items-center gap-3 mt-8 cursor-pointer group"
          >
            <span 
              className="text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
            </span>

            {/* Circular Ring */}
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center">
              {/* Outer dashed spinning ring that only spins on hover */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-white/20 group-hover:border-[#00f0ff]/60 transition-colors duration-500"
                variants={{
                  idle: { rotate: 0 },
                  hover: { rotate: 360, transition: { repeat: Infinity, duration: 8, ease: "linear" } }
                }}
              />
              
              {/* Inner glowing core that appears on hover */}
              <div className="absolute inset-1 rounded-full bg-transparent group-hover:bg-[#00f0ff]/10 blur-md transition-colors duration-500" />

              {/* Bouncing Arrow inside */}
              <motion.div 
                className="text-white/40 group-hover:text-[#00f0ff] z-10 transition-colors duration-300"
                variants={{
                  idle: { y: 0, opacity: 1 },
                  hover: { 
                    y: [0, 5, 0], 
                    opacity: [1, 0.6, 1],
                    transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                  }
                }}
              >
                <ArrowDown size={18} strokeWidth={2.5} />
              </motion.div>
            </div>
          </motion.a>
        </motion.div>

        {/* ── MARQUEE ROW 2 (opposite direction) ── */}
        <div className="relative z-10 mb-4 opacity-100">
          <Marquee reverse={true} />
        </div>
      </motion.div>
    </section>
  );
}
