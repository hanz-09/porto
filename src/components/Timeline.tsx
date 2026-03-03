"use client";

/**
 * Timeline — Clean · Interactive · Spotlight-Scroll
 * 
 * Design pillars:
 *  1. SCROLL SPOTLIGHT — the card currently in the viewport center is fully
 *     lit and large; others shrink + dim = cinematic depth of field without blur.
 *  2. MOUSE-PARALLAX TILT — every card tracks the cursor independently,
 *     giving a premium, tactile "touchable" 3D feel RIGHT NOW (not just hover).
 *  3. HORIZONTAL CHIP TABS — a sticky mini-navigation shows which chapter
 *     you're on, and clicking jumps directly to that card.
 *  4. LAYERED NUMBER — giant ghost index number floats behind each card.
 *  5. STACKED BRAND COLORS — each type has its own gradient left border.
 */

import {
  useRef,
  useCallback,
  MouseEvent,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Briefcase, GraduationCap, Award, Code2, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────── */
type TItem = {
  year: string;
  title: string;
  place: string;
  description: string;
  type: "work" | "education" | "award" | "project";
  techs?: string[];
  highlight?: boolean;
};

const items: TItem[] = [
  {
    year: "Aug 2022 – Present",
    title: "Bachelor of Computer Engineering",
    place: "Batam State Polytechnic · Multimedia Engineering Technology",
    description:
      "Focusing on UI/UX Design, Web Development, Multimedia Systems, and Human–Computer Interaction. Current GPA: 3.84 / 4.00.",
    type: "education",
  },
  {
    year: "Jul 2025 – Mar 2026",
    title: "Front-End Developer Intern",
    place: "Folxcode · On-Site",
    description:
      "Developed scalable front-end features using Angular to build reusable UI components. Integrated REST APIs, improving overall performance, responsiveness, and user experience optimization.",
    type: "work",
    techs: ["Angular", "REST API", "UI Components"],
    highlight: true,
  },
  {
    year: "Aug 2024 – Dec 2024",
    title: "Web Developer & UI/UX Designer",
    place: "Infinite Learning Indonesia · Remote",
    description:
      "Built backend architecture using Node.js, Express, Sequelize, and MySQL. Designed RESTful APIs, implemented authentication, and optimized database queries before converting the system cross-platform.",
    type: "work",
    techs: ["Node.js", "Express", "Sequelize", "MySQL"],
  },
  {
    year: "Mar 2023 - Jan 2024",
    title: "Freelance Front-End Developer",
    place: "Freelance · Remote",
    description:
      "Worked independently to design and build custom landing pages and web applications for various clients. Ensured responsive design, optimal performance, and high-quality UI/UX tailored to client specifications.",
    type: "work",
    techs: ["ReactJS", "NextJS", "UI/UX", "Tailwind CSS"],
  }
];

const getCfg = (theme?: string): Record<
  TItem["type"],
  { icon: typeof Briefcase; label: string; color: string; bg: string; border: string; gradient: string; glow: string; centerBg: string; lineGlow: string }
> => {
  const isLight = theme === 'light';
  return {
    work:      { 
      icon: Briefcase,     
      label: "Work",      
      color: isLight ? "#2563eb" : "#00f0ff", 
      bg: isLight ? "rgba(37,99,235,0.12)" : "#00f0ff12",
      border: isLight ? "rgba(37,99,235,0.3)" : "#00f0ff30",
      gradient: isLight ? "from-[#2563eb] to-[#0ea5e9]" : "from-[#00f0ff] to-[#0ea5e9]", 
      glow: isLight ? "rgba(37,99,235,0.35)" : "rgba(var(--accent-cyan-rgb, 0,240,255),0.35)",
      centerBg: isLight ? "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 100%)" : "radial-gradient(circle, #00f0ff22 0%, #00f0ff08 100%)",
      lineGlow: isLight ? "rgba(37,99,235,0.4)" : "#00f0ff40"
    },
    education: { 
      icon: GraduationCap, 
      label: "Education", 
      color: isLight ? "#1d4ed8" : "#3b82f6", 
      bg: isLight ? "rgba(29,78,216,0.12)" : "#3b82f612",
      border: isLight ? "rgba(29,78,216,0.3)" : "#3b82f630",
      gradient: isLight ? "from-[#1d4ed8] to-[#3b82f6]" : "from-[#3b82f6] to-[#2563eb]", 
      glow: isLight ? "rgba(29,78,216,0.35)" : "rgba(59,130,246,0.35)",
      centerBg: isLight ? "radial-gradient(circle, rgba(29,78,216,0.15) 0%, rgba(29,78,216,0.05) 100%)" : "radial-gradient(circle, #3b82f622 0%, #3b82f608 100%)",
      lineGlow: isLight ? "rgba(29,78,216,0.4)" : "#3b82f640"
    },
    award:     { 
      icon: Award,         
      label: "Award",     
      color: isLight ? "#0369a1" : "#06b6d4", 
      bg: isLight ? "rgba(3,105,161,0.12)" : "#06b6d412",
      border: isLight ? "rgba(3,105,161,0.3)" : "#06b6d430",
      gradient: isLight ? "from-[#0369a1] to-[#0891b2]" : "from-[#06b6d4] to-[#0891b2]", 
      glow: isLight ? "rgba(3,105,161,0.35)" : "rgba(6,182,212,0.35)",
      centerBg: isLight ? "radial-gradient(circle, rgba(3,105,161,0.15) 0%, rgba(3,105,161,0.05) 100%)" : "radial-gradient(circle, #06b6d422 0%, #06b6d408 100%)",
      lineGlow: isLight ? "rgba(3,105,161,0.4)" : "#06b6d440"
    },
    project:   { 
      icon: Code2,         
      label: "Project",   
      color: isLight ? "#2563eb" : "#60a5fa", 
      bg: isLight ? "rgba(37,99,235,0.12)" : "#60a5fa12",
      border: isLight ? "rgba(37,99,235,0.3)" : "#60a5fa30",
      gradient: isLight ? "from-[#2563eb] to-[#3b82f6]" : "from-[#60a5fa] to-[#3b82f6]", 
      glow: isLight ? "rgba(37,99,235,0.35)" : "rgba(96,165,250,0.35)",
      centerBg: isLight ? "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 100%)" : "radial-gradient(circle, #60a5fa22 0%, #60a5fa08 100%)",
      lineGlow: isLight ? "rgba(37,99,235,0.4)" : "#60a5fa40"
    },
  };
};

/* ─────────────────────────────────────────────────────────
   Mouse-parallax card — tracks cursor independently
───────────────────────────────────────────────────────── */
function ParallaxCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -14;
    const ry = ((x - r.width  / 2) / r.width ) *  14;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    glare.style.background = `radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%, rgba(var(--foreground-rgb, 255,255,255), 0.1) 0%, transparent 65%)`;
    glare.style.opacity = "1";
  }, []);

  const onLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    glare.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
      style={{ transition: "transform 0.12s ease" }}
    >
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-100 z-20"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Single timeline item
───────────────────────────────────────────────────────── */
function TimelineItem({ item, index }: { item: TItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();

  // Scroll-spotlight: track distance from viewport center to scale/dim
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawScale = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.55, 0.75, 1], [0.9, 1, 1, 1, 1, 0.9]);
  const rawDim   = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.55, 0.75, 1], [0.4, 1, 1, 1, 1, 0.4]);
  const scale = useSpring(rawScale, { stiffness: 55, damping: 20 });
  const opacity = useSpring(rawDim, { stiffness: 55, damping: 20 });

  const { color, bg, border, gradient, glow, centerBg, lineGlow, icon: Icon, label } = getCfg(resolvedTheme)[item.type];
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={`flex gap-6 md:gap-10 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-start`}
    >
      {/* ── Card side ── */}
      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, x: isEven ? -60 : 60, y: 20 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ParallaxCard>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: resolvedTheme === 'light'
                  ? "linear-gradient(145deg, rgba(255,255,255, 0.75) 0%, rgba(248,250,252, 0.5) 100%)"
                  : "linear-gradient(145deg, rgba(var(--foreground-rgb, 255,255,255), 0.03) 0%, rgba(var(--foreground-rgb, 255,255,255), 0.01) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: resolvedTheme === 'light'
                  ? "1px solid rgba(15,23,42, 0.06)"
                  : "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.07)",
                boxShadow: resolvedTheme === 'light'
                  ? "0 24px 64px -12px rgba(15,23,42, 0.1), inset 0 1px 0 rgba(255,255,255, 1)"
                  : "0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(var(--foreground-rgb, 255,255,255), 0.04) inset",
              }}
            >
              {/* Colored left accent bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b ${gradient}`}
                style={{ boxShadow: `4px 0 20px ${glow}` }}
              />

              {/* Ghost number */}
              <div
                className="absolute -right-3 -top-4 font-display font-black select-none pointer-events-none leading-none z-0"
                style={{
                  fontSize: "8rem",
                  color: resolvedTheme === 'light' ? `${color}15` : `${color}06`,
                  lineHeight: 1,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10 p-6 md:p-8 pl-8 md:pl-10">
                {/* Top row: type chip + year */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      color,
                    }}
                  >
                    <Icon size={10} />
                    {label}
                    {item.highlight && (
                      <span
                        className="w-1.5 h-1.5 rounded-full ml-0.5"
                        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                      />
                    )}
                  </span>
                  <span
                    className="font-display font-black text-xl"
                    style={{ color: resolvedTheme === 'light' ? `${color}` : `${color}50`, opacity: resolvedTheme === 'light' ? 0.6 : 1 }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Title + place */}
                <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-1 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm mb-4 font-medium" style={{ color: "rgba(var(--foreground-rgb, 255,255,255), 0.6)" }}>
                  {item.place}
                </p>

                {/* Description */}
                <p className="text-sm leading-[1.8]" style={{ color: "rgba(var(--foreground-rgb, 255,255,255), 0.8)" }}>
                  {item.description}
                </p>

                {/* Tech tags */}
                {item.techs && item.techs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {item.techs.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-3 py-1 rounded-full font-bold"
                        style={{
                          background: bg,
                          border: `1px solid ${border}`,
                          color,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ParallaxCard>
        </motion.div>
      </div>

      {/* ── Center node ── */}
      <div className="flex flex-col items-center shrink-0 pt-6 gap-2 relative">
        {/* Connector line above (hidden for first item) */}
        {index > 0 && (
          <div
            className="absolute bottom-full w-px"
            style={{
              top: -80,
              background: `linear-gradient(to bottom, transparent, ${lineGlow})`,
            }}
          />
        )}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Outer ring */}
          {item.highlight && (
            <motion.div
              className="absolute rounded-full -inset-2"
              style={{ border: `1px solid ${color}30` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
          )}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: centerBg,
              border: `1.5px solid ${color}`,
              boxShadow: `0 0 20px ${glow}, inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), ${resolvedTheme === 'light' ? 0.8 : 0.15})`,
            }}
          >
            <Icon size={18} style={{ color }} />
          </div>
        </motion.div>

        {/* Connector line below (hidden for last item) */}
        {index < items.length - 1 && (
          <div
            className="w-px flex-1 min-h-[60px]"
            style={{
              background: `linear-gradient(to bottom, ${lineGlow}, transparent)`,
            }}
          />
        )}
      </div>

      {/* ── Mirror side (empty, keeps symmetry on desktop) ── */}
      <div className="flex-1 min-w-0 hidden md:block" aria-hidden />
    </motion.div>
  );
}





/* ─────────────────────────────────────────────────────────
   Main section
───────────────────────────────────────────────────────── */
export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  // Section-level scroll enter/exit
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sOpacity = useTransform(scrollYProgress, [0, 0.08, 0.88, 1], [0, 1, 1, 0]);
  const sY       = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [80, 0, 0, -60]);
  const sScale   = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.95, 1, 1, 0.96]);

  return (
    <motion.section
      id="timeline"
      ref={sectionRef}
      style={{ opacity: sOpacity, y: sY, scale: sScale }}
      className="relative py-24 md:py-36 overflow-hidden"
    >
      {/* Faint ambient glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600, left: "-10%", top: "15%",
            background: resolvedTheme === 'light'
              ? "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(var(--accent-cyan-rgb, 0,240,255),0.06) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500, right: "-8%", bottom: "20%",
            background: resolvedTheme === 'light'
              ? "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
        />
      </div>

      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.06), transparent)" }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="inline-block text-xs font-black uppercase mb-4"
            style={{ color: "#a78bfa" }}
          >
            — My Journey
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-5xl md:text-7xl leading-none tracking-tight text-foreground mb-4"
          >
            Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-sm"
            style={{ color: "rgba(var(--foreground-rgb, 255,255,255), 0.3)" }}
          >
            Scroll to trace my journey. Hover the cards — they respond.
          </motion.p>
        </div>

        {/* ── Items ── */}
        <div className="space-y-10 md:space-y-16">
          {items.map((item, i) => (
            <TimelineItem key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* ── End cap ── */}
        <div className="flex items-center justify-center mt-16 gap-4">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.06))" }} />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{
              background: resolvedTheme === 'light' ? "rgba(37,99,235,0.08)" : "rgba(var(--accent-cyan-rgb, 0,240,255),0.08)",
              border: resolvedTheme === 'light' ? "1px solid rgba(37,99,235,0.25)" : "1px solid rgba(var(--accent-cyan-rgb, 0,240,255),0.2)",
              color: resolvedTheme === 'light' ? "#2563eb" : "#00f0ff",
            }}
          >
            <ChevronRight size={12} />
            <span>More ahead</span>
          </motion.div>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.06))" }} />
        </div>

      </div>
    </motion.section>
  );
}
