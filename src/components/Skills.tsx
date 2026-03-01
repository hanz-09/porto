"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import Magnet from "./Magnet";
import BlurText from "./BlurText";

type Skill = { name: string; level: number; color: string };
type Category = { title: string; emoji: string; skills: Skill[] };

const categories: Category[] = [
  {
    title: "Frontend",
    emoji: "🎨",
    skills: [
      { name: "React / Next.js", level: 90, color: "#00d4ff" },
      { name: "TypeScript", level: 85, color: "#7c3aed" },
      { name: "Tailwind CSS", level: 92, color: "#38bdf8" },
      { name: "HTML & CSS", level: 95, color: "#f472b6" },
    ],
  },
  {
    title: "Tools & Others",
    emoji: "🛠️",
    skills: [
      { name: "Git & GitHub", level: 88, color: "#f472b6" },
      { name: "Figma", level: 75, color: "#a78bfa" },
      { name: "Node.js", level: 70, color: "#4ade80" },
      { name: "REST API", level: 82, color: "#00d4ff" },
    ],
  },
];

function SkillBar({ name, level, color, delay }: Skill & { delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{name}</span>
        <span className="text-xs font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

const techIcons = [
  { name: "React", emoji: "⚛️" },
  { name: "Next.js", emoji: "▲" },
  { name: "TypeScript", emoji: "📘" },
  { name: "JavaScript", emoji: "💛" },
  { name: "Tailwind", emoji: "🌊" },
  { name: "CSS", emoji: "🎨" },
  { name: "HTML", emoji: "🧱" },
  { name: "Git", emoji: "🌿" },
  { name: "Figma", emoji: "🖼️" },
  { name: "Node.js", emoji: "🟢" },
  { name: "REST API", emoji: "🔌" },
  { name: "VS Code", emoji: "💻" },
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal preset="fadeUp" className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent-violet)" }}>
            What I work with
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3" style={{ color: "var(--text-primary)" }}>
            My <span className="gradient-text">Skills</span>
          </h2>
        </ScrollReveal>

        {/* Skill bars */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((cat, ci) => (
            <ScrollReveal key={cat.title} preset="slideUp3d" delay={ci * 0.15}>
              <div className="glass-card rounded-2xl p-6 border border-white/6 hover:border-violet-500/20 transition-colors h-full">
                <h3 className="font-display font-bold text-lg mb-6" style={{ color: "var(--text-primary)" }}>
                  {cat.emoji} {cat.title}
                </h3>
                <div className="space-y-5">
                  {cat.skills.map((skill, si) => (
                    <SkillBar key={skill.name} {...skill} delay={0.2 + si * 0.1} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Tech Icon Cloud — each pill is Magnetic */}
        <ScrollReveal preset="blur" delay={0.2}>
          <div className="glass-card rounded-2xl p-8 border border-white/6">
            <p className="text-center text-sm font-medium tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
              Technologies I use
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {techIcons.map((tech, i) => (
                <ScrollReveal key={tech.name} preset="scale" delay={0.05 * i}>
                  <Magnet strength={18}>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/8 hover:border-cyan-500/30 transition-all cursor-default"
                      style={{ color: "var(--text-secondary)" }}>
                      <span>{tech.emoji}</span>
                      <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                  </Magnet>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
