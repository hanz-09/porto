"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import TiltedCard from "./TiltedCard";
import ScrollReveal from "./ScrollReveal";
import BlurText from "./BlurText";

type Project = {
  title: string;
  description: string;
  techs: string[];
  github: string;
  live: string;
  featured?: boolean;
  gradient: string;
  accent: string;
};

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua fullstack.",
    techs: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    gradient: "from-cyan-500/20 to-violet-600/20",
    accent: "#00d4ff",
  },
  {
    title: "Dashboard Analytics",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur dashboard.",
    techs: ["React", "Recharts", "Zustand", "REST API"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    gradient: "from-violet-600/20 to-pink-500/20",
    accent: "#7c3aed",
  },
  {
    title: "Blog Platform",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo CRUD blog.",
    techs: ["Next.js", "MDX", "Tailwind CSS"],
    github: "https://github.com",
    live: "https://example.com",
    gradient: "from-pink-500/20 to-orange-400/20",
    accent: "#f472b6",
  },
  {
    title: "Task Management App",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim task manager.",
    techs: ["React", "TypeScript", "Firebase"],
    github: "https://github.com",
    live: "https://example.com",
    gradient: "from-cyan-500/20 to-green-400/20",
    accent: "#4ade80",
  },
  {
    title: "Portfolio Template",
    description: "Lorem ipsum dolor sit amet adipiscing elit. Quisque sit amet accumsan tortor. Portfolio minimalist clean.",
    techs: ["Next.js", "Framer Motion", "Tailwind"],
    github: "https://github.com",
    live: "https://example.com",
    gradient: "from-orange-400/20 to-yellow-400/20",
    accent: "#fb923c",
  },
  {
    title: "Weather App",
    description: "Nulla facilisi. Cras consectetur felis id metus ornare, ac faucibus magna aliquet. Weather API integration.",
    techs: ["React", "OpenWeather API", "CSS"],
    github: "https://github.com",
    live: "https://example.com",
    gradient: "from-blue-500/20 to-cyan-500/20",
    accent: "#60a5fa",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal preset="fadeUp" delay={index * 0.08}>
      <TiltedCard tiltStrength={8} glareOpacity={0.1} className="h-full">
        <div
          className="group relative glass-card rounded-2xl overflow-hidden border border-white/6 hover:border-white/14 transition-colors h-full flex flex-col"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Card Gradient Header */}
          <div className={`relative h-44 bg-linear-to-br ${project.gradient} flex items-center justify-center overflow-hidden shrink-0`}>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <span className="relative font-display font-bold text-5xl opacity-20 text-white">
              {project.title.charAt(0)}
            </span>
            {/* Accent glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(ellipse at center, ${project.accent}22 0%, transparent 70%)` }}
            />

            {project.featured && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                <Star size={10} className="fill-yellow-400" />
                Featured
              </div>
            )}

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center gap-3"
            >
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
                transition={{ delay: 0.04 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/20 text-white text-sm font-semibold hover:border-cyan-500/50 transition-colors"
              >
                <Github size={14} /> Code
              </motion.a>
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={hovered ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
                transition={{ delay: 0.09 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
              >
                <ExternalLink size={14} /> Live Demo
              </motion.a>
            </motion.div>
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-3 flex flex-col flex-1">
            <h3
              className="font-display font-bold text-lg transition-colors"
              style={{ color: hovered ? project.accent : "var(--text-primary)" }}
            >
              {project.title}
            </h3>
            <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: "var(--text-secondary)" }}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.techs.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-full border border-white/8 font-medium"
                  style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TiltedCard>
    </ScrollReveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal preset="fadeUp" className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent-pink)" }}>
            What I&apos;ve built
          </span>
          <BlurText
            text="My Projects"
            className="font-display font-bold text-4xl md:text-5xl mt-3 justify-center"
            delay={0.08}
          />
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Hover a card to see links. Click to explore.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <ScrollReveal preset="fadeUp" delay={0.3} className="text-center mt-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-white/10 hover:border-cyan-500/30 text-sm font-semibold transition-all"
            style={{ color: "var(--text-secondary)" }}
          >
            <Github size={16} />
            View More on GitHub
            <ExternalLink size={14} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
