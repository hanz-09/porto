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
    year: "2019",
    title: "Bachelor of Computer Science",
    place: "University Name",
    description:
      "Graduated with honours. Focused on Software Engineering and Human–Computer Interaction. GPA 3.8 / 4.0.",
    type: "education",
  },
  {
    year: "2021",
    title: "Freelance Web Developer",
    place: "Self-employed",
    description:
      "Delivered 10+ landing pages and company profiles for local businesses. Translated design mockups into responsive, production-ready code.",
    type: "project",
    techs: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2022",
    title: "Junior Frontend Developer",
    place: "Startup Name · Internship",
    description:
      "Built a B2B SaaS dashboard from scratch, integrated REST APIs, and improved page load performance by 30% through code splitting and lazy loading.",
    type: "work",
    techs: ["React", "JavaScript", "CSS Modules"],
  },
  {
    year: "2024",
    title: "Frontend Developer",
    place: "Company Name · Full-time",
    description:
      "Building scalable web applications with React and Next.js. Collaborating closely with designers to ship pixel-perfect UIs at production scale.",
    type: "work",
    techs: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlight: true,
  },
];

const cfg: Record<
  TItem["type"],
  { icon: typeof Briefcase; label: string; color: string; gradient: string; glow: string }
> = {
  work:      { icon: Briefcase,     label: "Work",      color: "#00d4ff", gradient: "from-[#00d4ff] to-[#0284c7]", glow: "rgba(0,212,255,0.35)" },
  education: { icon: GraduationCap, label: "Education", color: "#a78bfa", gradient: "from-[#a78bfa] to-[#7c3aed]", glow: "rgba(167,139,250,0.35)" },
  award:     { icon: Award,         label: "Award",     color: "#fbbf24", gradient: "from-[#fbbf24] to-[#f59e0b]", glow: "rgba(251,191,36,0.35)" },
  project:   { icon: Code2,         label: "Project",   color: "#f472b6", gradient: "from-[#f472b6] to-[#ec4899]", glow: "rgba(244,114,182,0.35)" },
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
    glare.style.background = `radial-gradient(circle at ${(x/r.width)*100}% ${(y/r.height)*100}%, rgba(255,255,255,0.1) 0%, transparent 65%)`;
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

  // Scroll-spotlight: track distance from viewport center to scale/dim
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawScale = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.55, 0.75, 1], [0.9, 1, 1, 1, 1, 0.9]);
  const rawDim   = useTransform(scrollYProgress, [0, 0.25, 0.45, 0.55, 0.75, 1], [0.4, 1, 1, 1, 1, 0.4]);
  const scale = useSpring(rawScale, { stiffness: 55, damping: 20 });
  const opacity = useSpring(rawDim, { stiffness: 55, damping: 20 });

  const { color, gradient, glow, icon: Icon, label } = cfg[item.type];
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
                background: "rgba(9,9,16,0.92)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04) inset`,
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
                  color: `${color}06`,
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
                      background: `${color}12`,
                      border: `1px solid ${color}30`,
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
                    style={{ color: `${color}50` }}
                  >
                    {item.year}
                  </span>
                </div>

                {/* Title + place */}
                <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-1 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm mb-4 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {item.place}
                </p>

                {/* Description */}
                <p className="text-sm leading-[1.8]" style={{ color: "rgba(255,255,255,0.5)" }}>
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
                          background: `${color}10`,
                          border: `1px solid ${color}25`,
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
              background: `linear-gradient(to bottom, transparent, ${color}40)`,
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
              background: `radial-gradient(circle, ${color}22 0%, ${color}08 100%)`,
              border: `1.5px solid ${color}`,
              boxShadow: `0 0 20px ${glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
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
              background: `linear-gradient(to bottom, ${color}40, transparent)`,
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
            background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500, right: "-8%", bottom: "20%",
            background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
        />
      </div>

      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
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
            className="font-display font-black text-5xl md:text-7xl leading-none tracking-tight text-white mb-4"
          >
            Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.3)" }}
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
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06))" }} />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#00d4ff",
            }}
          >
            <ChevronRight size={12} />
            <span>More ahead</span>
          </motion.div>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.06))" }} />
        </div>

      </div>
    </motion.section>
  );
}
