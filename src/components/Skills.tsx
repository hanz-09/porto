"use client";

/**
 * Skills — Total Redesign
 *
 * Components used / inspired by reactbits.dev:
 *  1. InfiniteMarquee  — two rows scrolling in opposite directions (reactbits.dev/components/infinite-scroll)
 *  2. Mouse-parallax tilt on each featured skill card (reactbits.dev/components/tilt)
 *  3. Spotlight card  — cursor-following spotlight on the card grid (reactbits.dev/components/spotlight-card)
 *  4. Section-level scroll entrance/exit matching the rest of the site
 *
 * Logos: real SVGs via Devicons CDN (cdn.jsdelivr.net/gh/devicons/devicon)
 * so there are no emoji placeholders anywhere.
 */

import { useRef, useCallback, MouseEvent, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────
   Tech logo data  (devicon CDN)
───────────────────────────────────────────────────────── */
const cdn = (name: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

type Tech = {
  name: string;
  logo: string;
  color: string;
  desc: string;
};

/** Row 1 */
const row1: Tech[] = [
  { name: "React",      logo: cdn("react"),                         color: "#61DAFB", desc: "UI Library" },
  { name: "Next.js",    logo: cdn("nextjs", "original"),            color: "var(--color-foreground)", desc: "React Framework" },
  { name: "TypeScript", logo: cdn("typescript"),                    color: "#3178C6", desc: "Type Safety" },
  { name: "JavaScript", logo: cdn("javascript"),                    color: "#F7DF1E", desc: "Core Language" },
  { name: "Tailwind",   logo: cdn("tailwindcss", "original-wordmark"), color: "#38BDF8", desc: "Utility CSS" },
  { name: "HTML5",      logo: cdn("html5"),                         color: "#E34F26", desc: "Markup" },
  { name: "CSS3",       logo: cdn("css3"),                          color: "#1572B6", desc: "Styling" },
  { name: "Figma",      logo: cdn("figma"),                         color: "#F24E1E", desc: "Design & Proto" },
];

/** Row 2 */
const row2: Tech[] = [
  { name: "Node.js",    logo: cdn("nodejs"),                        color: "#339933", desc: "Backend Runtime" },
  { name: "Git",        logo: cdn("git"),                           color: "#F05032", desc: "Version Control" },
  { name: "GitHub",     logo: cdn("github"),                        color: "var(--color-foreground)", desc: "Code Hosting" },
  { name: "VS Code",    logo: cdn("vscode", "plain"),               color: "#007ACC", desc: "Code Editor" },
  { name: "Angular",    logo: cdn("angularjs", "original"),         color: "#DD0031", desc: "Frontend Framework" },
];

/* ─────────────────────────────────────────────────────────
   Featured skill cards (the ones that get the tilt effect)
───────────────────────────────────────────────────────── */
type FeaturedSkill = {
  name: string;
  logo: string;
  color: string;
  level: number;
  desc: string;
};

const featured: FeaturedSkill[] = [
  {
    name: "React & Next.js",
    logo: cdn("react"),
    color: "#61DAFB",
    level: 90,
    desc: "Primary framework. From SSR/SSG to complex state management.",
  },
  {
    name: "TypeScript",
    logo: cdn("typescript"),
    color: "#3178C6",
    level: 85,
    desc: "Type-safe codebases, generics, strict modern patterns.",
  },
  {
    name: "Tailwind CSS",
    logo: cdn("tailwindcss", "original-wordmark"),
    color: "#38BDF8",
    level: 92,
    desc: "Utility-first styling — rapid, consistent, responsive.",
  },
  {
    name: "Figma",
    logo: cdn("figma"),
    color: "#F24E1E",
    level: 84,
    desc: "Design collaboration, prototyping and developer handoff.",
  },
  {
    name: "Angular",
    logo: cdn("angularjs", "original"),
    color: "#DD0031",
    level: 90,
    desc: "Component-based framework used during internship projects.",
  },
  {
    name: "Git & GitHub",
    logo: cdn("git"),
    color: "#F05032",
    level: 88,
    desc: "Branching, PR workflows, CI/CD pipeline management.",
  },
];

/* All tech combined for single row */
const allTech: Tech[] = [...row1, ...row2];

/* ─────────────────────────────────────────────────────────
   Infinite marquee
   ‒ CSS animation (no framer-motion) so animationDuration changes
     without restarting the loop.
   ‒ Hover row  → slows to 5× speed
   ‒ Hover item → full color + scale + popover
───────────────────────────────────────────────────────── */
function MarqueeRow() {
  const doubled = [...allTech, ...allTech];
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();

  const slowDown = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const speedUp = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  return (
    <>
      {/* keyframes injected once */}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div
        className="py-8 relative"
        style={{ overflowX: "clip", overflowY: "visible" }}
        onMouseEnter={slowDown}
        onMouseLeave={() => { speedUp(); setHoveredIdx(null); }}
      >
        {/* Side fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10"
          style={{ background: resolvedTheme === 'light' ? "linear-gradient(to right, #f8fafc, transparent)" : "linear-gradient(to right, var(--bg-primary), transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10"
          style={{ background: resolvedTheme === 'light' ? "linear-gradient(to left, #f8fafc, transparent)" : "linear-gradient(to left, var(--bg-primary), transparent)" }} />

        <div
          ref={trackRef}
          className="marquee-track flex gap-12 w-max items-center"
        >
          {doubled.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="relative shrink-0 cursor-default flex justify-center"
              style={{
                zIndex: hoveredIdx === i ? 50 : "auto",
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Popover */}
              {hoveredIdx === i && (
                <div
                  className="absolute bottom-full left-1/2 mb-4 z-50 pointer-events-none flex flex-col items-center"
                  style={{ 
                    animation: "tooltipPop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    transformOrigin: "bottom center"
                  }}
                >
                  <style>{`
                    @keyframes tooltipPop {
                      from { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
                      to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
                    }
                  `}</style>
                  <div
                    className="px-3 py-2 rounded-xl text-center whitespace-nowrap"
                    style={{
                      background: resolvedTheme === 'light' ? "rgba(255,255,255, 0.9)" : "rgba(var(--background-rgb, 9,9,16), 0.95)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: resolvedTheme === 'light' ? `1px solid ${tech.color}50` : `1px solid ${tech.color}40`,
                      boxShadow: resolvedTheme === 'light' ? `0 8px 32px rgba(15,23,42,0.1), 0 0 20px ${tech.color}30` : `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${tech.color}20`,
                    }}
                  >
                    <p className="text-xs font-black text-foreground leading-tight">{tech.name}</p>
                    <p className="text-[10px] font-semibold mt-0.5" style={{ color: tech.color }}>
                      {tech.desc}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div
                    style={{
                      width: 0, height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: `5px solid ${tech.color}40`,
                    }}
                  />
                </div>
              )}

              {/* Logo */}
              <div 
                className="w-12 h-12 relative transition-all duration-300 pointer-events-none"
                style={{
                  filter: hoveredIdx === i ? "none" : "grayscale(1) opacity(0.35)",
                  transform: hoveredIdx === i ? "scale(1.3)" : "scale(1)",
                }}
              >
                <Image src={tech.logo} alt={tech.name} fill unoptimized className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Featured skill card with mouse-tilt + spotlight
───────────────────────────────────────────────────────── */
function SkillCard({ skill, index }: { skill: FeaturedSkill; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const { resolvedTheme } = useTheme();

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -10;
    const ry = ((x - r.width  / 2) / r.width ) *  10;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`;
    glare.style.background = resolvedTheme === 'light' 
        ? `radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%, rgba(255,255,255, 0.8) 0%, transparent 65%)`
        : `radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%, rgba(var(--foreground-rgb, 255,255,255), 0.09) 0%, transparent 65%)`;
    glare.style.opacity = "1";
  }, [resolvedTheme]);

  const onLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    glare.style.opacity = "0";
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative h-full rounded-2xl overflow-hidden"
        style={{ transition: "transform 0.12s ease" }}
      >
        {/* Glare */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-2xl z-20 transition-opacity duration-100"
          style={{ opacity: 0 }}
        />

        {/* Card body */}
        <div
          className="relative h-full p-6 rounded-2xl"
          style={{
            background: resolvedTheme === 'light' ? "linear-gradient(145deg, rgba(255,255,255, 0.6) 0%, rgba(248,250,252, 0.3) 100%)" : "rgba(var(--background-rgb, 9,9,16), 0.90)",
            backdropFilter: resolvedTheme === 'light' ? "blur(20px)" : "none",
            WebkitBackdropFilter: resolvedTheme === 'light' ? "blur(20px)" : "none",
            border: resolvedTheme === 'light' ? `1px solid ${skill.color}50` : `1px solid ${skill.color}18`,
            boxShadow: resolvedTheme === 'light' 
                ? `0 24px 48px -12px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.8)` 
                : `0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.04)`,
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${skill.color}80, transparent)` }}
          />

          {/* Ghost level number */}
          <div
            className="absolute right-4 bottom-4 font-display font-black select-none pointer-events-none"
            style={{ fontSize: "5rem", color: `${skill.color}06`, lineHeight: 1 }}
          >
            {skill.level}
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative"
              style={{
                background: resolvedTheme === 'light' ? `${skill.color}15` : `${skill.color}12`,
                border: resolvedTheme === 'light' ? `1px solid ${skill.color}40` : `1px solid ${skill.color}25`,
                boxShadow: resolvedTheme === 'light' ? `0 4px 14px ${skill.color}20` : `0 0 20px ${skill.color}20`,
              }}
            >
              <div className="w-7 h-7 relative">
                <Image
                  src={skill.logo}
                  alt={skill.name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground leading-tight">{skill.name}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-5 relative z-10 text-foreground/70 dark:text-foreground/40">
            {skill.desc}
          </p>

          {/* Level bar */}
          <div className="space-y-1.5 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/50 dark:text-foreground/20">
                Proficiency
              </span>
              <span className="text-xs font-black" style={{ color: skill.color }}>
                {skill.level}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(var(--foreground-rgb, 255,255,255), 0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.level}%` } : {}}
                transition={{ duration: 1.2, delay: 0.3 + (index % 3) * 0.08, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${skill.color}60, ${skill.color})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────── */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sOpacity = useTransform(scrollYProgress, [0, 0.07, 0.88, 1], [0, 1, 1, 0]);
  const rawY     = useTransform(scrollYProgress, [0, 0.07, 0.92, 1], [80, 0, 0, -60]);
  const rawScale = useTransform(scrollYProgress, [0, 0.07, 0.92, 1], [0.95, 1, 1, 0.96]);
  const sY       = useSpring(rawY,     { stiffness: 55, damping: 20, mass: 0.8 });
  const sScale   = useSpring(rawScale, { stiffness: 55, damping: 20, mass: 0.8 });

  return (
    <motion.section
      id="skills"
      ref={sectionRef}
      style={{ opacity: sOpacity, y: sY, scale: sScale }}
      className="relative py-16 md:py-24 lg:py-36 overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700, right: "-15%", top: "10%",
            background: "radial-gradient(circle, rgba(var(--accent-cyan-rgb, 0,240,255),0.05) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600, left: "-12%", bottom: "10%",
            background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 24, ease: "easeInOut" }}
        />
      </div>

      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="inline-block text-xs font-black uppercase mb-4"
            style={{ color: "var(--accent-cyan)" }}
          >
            — What I Work With
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-4xl sm:text-5xl md:text-7xl leading-none tracking-tight text-foreground mb-4"
          >
            My{" "}
            <span
              className="bg-clip-text text-transparent bg-linear-to-br from-(--accent-cyan) via-[#2563eb] to-[#0ea5e9]"
            >
              Skills
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm text-foreground/60 dark:text-foreground/30"
          >
            Technologies I reach for every day — and some I'm still mastering.
          </motion.p>
        </div>

        {/* ── Marquee row ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-20"
        >
          <MarqueeRow />
        </motion.div>

        {/* ── Featured skill cards (tilt + spotlight) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <p
            className="text-center text-xs font-black tracking-widest uppercase mb-10 text-foreground/50 dark:text-foreground/20"
          >
            Featured Stack
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>

      </div>
    </motion.section>
  );
}
