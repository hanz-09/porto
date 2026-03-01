"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowDown, Download, Mail } from "lucide-react";
import Magnet from "./Magnet";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

const roles = ["Frontend Developer", "UI Enthusiast", "React Specialist", "Next.js Developer"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Blob parallax offsets (different layers = different depth)
  const blob1X = useTransform(springX, [-300, 300], [-30, 30]);
  const blob1Y = useTransform(springY, [-300, 300], [-20, 20]);
  const blob2X = useTransform(springX, [-300, 300], [20, -20]);
  const blob2Y = useTransform(springY, [-300, 300], [10, -10]);
  const textX  = useTransform(springX, [-300, 300], [-6, 6]);
  const textY  = useTransform(springY, [-300, 300], [-4, 4]);

  // Typing effect
  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIndex]);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise"
    >
      {/* Background: parallax blobs */}
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-glow-pulse pointer-events-none"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)" }} />
      </motion.div>
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        aria-hidden
      >
        <div className="w-full h-full rounded-full animate-glow-pulse" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)", animationDelay: "2s" }} />

      </motion.div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-4 h-4 rounded-full bg-cyan-400/60 animate-float pointer-events-none" aria-hidden />
      <div className="absolute bottom-32 left-16 w-3 h-3 rounded-full bg-violet-400/60 animate-float pointer-events-none" style={{ animationDelay: "2s" }} aria-hidden />
      <div className="absolute top-1/2 right-12 w-2 h-2 rounded-full bg-pink-400/60 animate-float pointer-events-none" style={{ animationDelay: "1s" }} aria-hidden />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      {/* Content — subtle mouse parallax on text layer */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-24 text-center w-full"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm border border-cyan-500/20" style={{ color: "var(--accent-cyan)" }}>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Available for work
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(3rem,9vw,6.5rem)", color: "var(--text-primary)" }}>
              Hi, I&apos;m{" "}
              <span className="gradient-text-shimmer">Farhan</span>
            </h1>
          </motion.div>

          {/* Typing */}
          <motion.div variants={itemVariants}>
            <p className="font-display text-2xl md:text-3xl font-semibold h-10" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--text-primary)" }}>{displayed}</span>
              <span className="animate-blink" style={{ color: "var(--accent-cyan)" }}>|</span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p variants={itemVariants} className="max-w-xl text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            I craft beautiful, performant web experiences with modern technologies.
            Passionate about clean code, stunning UI, and seamless user journeys.
          </motion.p>

          {/* CTA Buttons — Magnetic */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <Magnet strength={30}>
              <motion.a
                href="#contact"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Mail size={18} />
                Contact Me
              </motion.a>
            </Magnet>
            <Magnet strength={30}>
              <motion.a
                href="/cv.pdf"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold glass-card border border-white/10 hover:border-cyan-500/40 transition-all"
                style={{ color: "var(--text-primary)" }}
              >
                <Download size={18} />
                Download CV
              </motion.a>
            </Magnet>
          </motion.div>

          {/* Social Links — Magnetic */}
          <motion.div variants={itemVariants} className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Magnet key={label} strength={25}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full glass-card border border-white/10 hover:border-cyan-500/30 flex items-center justify-center transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  whileHover={{ color: "var(--accent-cyan)" } as Parameters<typeof motion.a>[0]["whileHover"]}
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              </Magnet>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
