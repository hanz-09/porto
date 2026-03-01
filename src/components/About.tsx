"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Calendar, Briefcase, Coffee } from "lucide-react";
import BlurText from "./BlurText";
import ScrollReveal from "./ScrollReveal";
import TiltedCard from "./TiltedCard";

const stats = [
  { icon: Calendar, value: "2+", label: "Years Experience" },
  { icon: Briefcase, value: "20+", label: "Projects Done" },
  { icon: Coffee, value: "∞", label: "Cups of Coffee" },
  { icon: MapPin, value: "ID", label: "Based in Indonesia" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Label */}
        <ScrollReveal preset="fadeUp" className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent-cyan)" }}>
            Get to know me
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3" style={{ color: "var(--text-primary)" }}>
            About <span className="gradient-text">Me</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Avatar */}
          <ScrollReveal preset="fadeLeft" delay={0.1}>
            <div className="flex justify-center">
              <TiltedCard tiltStrength={10} glareOpacity={0.08}>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-linear-to-r from-cyan-500 via-violet-600 to-pink-500 animate-spin-slow opacity-60 blur-sm" />
                  <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-white/10">
                    <div className="w-full h-full bg-linear-to-br from-[#0d0d14] to-[#1a1a2e] flex items-center justify-center">
                      <span className="font-display font-bold text-7xl gradient-text">F</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -bottom-4 -right-4 glass-card rounded-2xl px-4 py-2 border border-cyan-500/20"
                  >
                    <span className="text-sm font-semibold" style={{ color: "var(--accent-cyan)" }}>Open to Work 🎯</span>
                  </motion.div>
                </div>
              </TiltedCard>
            </div>
          </ScrollReveal>

          {/* Text Content */}
          <div ref={ref} className="space-y-6">
            <ScrollReveal preset="fadeRight" delay={0.15}>
              <BlurText
                text="A passionate developer who loves to build things for the web."
                className="font-display font-bold text-2xl md:text-3xl"
                delay={0.05}
              />
            </ScrollReveal>

            <ScrollReveal preset="fadeRight" delay={0.2}>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal preset="fadeRight" delay={0.25}>
              <div className="flex flex-wrap gap-3">
                {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold glass-card border border-violet-500/20"
                    style={{ color: "var(--accent-violet)" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <ScrollReveal key={label} preset="slideUp3d" delay={i * 0.1}>
              <TiltedCard tiltStrength={12} glareOpacity={0.1} className="h-full">
                <div className="glass-card rounded-2xl p-5 flex flex-col items-center gap-2 border border-white/6 hover:border-cyan-500/20 transition-colors group h-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))" }}>
                    <Icon size={18} style={{ color: "var(--accent-cyan)" }} />
                  </div>
                  <span className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>{value}</span>
                  <span className="text-xs text-center leading-tight" style={{ color: "var(--text-muted)" }}>{label}</span>
                </div>
              </TiltedCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
