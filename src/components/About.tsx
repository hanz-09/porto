"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Code2, Palette, Zap, Globe } from "lucide-react";
import ProfileCard from "./ProfileCard";
import TextType from "./TextType";

/* ─────────────────────────────────────────────────────────
   Tech data
───────────────────────────────────────────────────────── */
const techs = [
  { icon: Code2,   label: "React / Next.js",  desc: "Primary framework" },
  { icon: Palette, label: "Tailwind CSS",      desc: "Styling system" },
  { icon: Zap,     label: "TypeScript",        desc: "Type safety"},
  { icon: Globe,   label: "Node.js / REST",    desc: "Backend basics" },
];

/* ─────────────────────────────────────────────────────────
   Reveal — strong spring-physics scroll animation
   Each element fades in from 60px below and has a scale pop
───────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
  fromLeft = false,
  fromRight = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  fromLeft?: boolean;
  fromRight?: boolean;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.35 1"],
  });

  // Use stronger transforms
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rawY       = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const rawX       = useTransform(
    scrollYProgress,
    [0, 1],
    [fromLeft ? -80 : fromRight ? 80 : 0, 0]
  );
  const rawScale   = useTransform(scrollYProgress, [0, 0.6, 1], [0.88, 0.98, 1]);

  const opacity = useSpring(rawOpacity, { stiffness: 50, damping: 16 });
  const y       = useSpring(rawY,       { stiffness: 50, damping: 16 });
  const x       = useSpring(rawX,       { stiffness: 50, damping: 16 });
  const scale   = useSpring(rawScale,   { stiffness: 50, damping: 16 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x, scale }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   About Section
───────────────────────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Section-level scroll-in / scroll-out — large transforms so it's very noticeable
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.82, 1],
    [0, 1, 1, 0]
  );
  const sectionY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [100, 0, 0, -80]
  );
  const sectionScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0.93, 1, 1, 0.95]
  );

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      style={{ opacity: sectionOpacity, y: sectionY, scale: sectionScale }}
      className="relative py-16 md:py-24 lg:py-36 overflow-hidden"
    >
      {/* ── Background decorations ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 60%, rgba(0,212,255,0.04) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 80% 30%, rgba(124,58,237,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Section label ── */}
        <Reveal className="text-center mb-16 md:mb-24">
          <span
            className="inline-block text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: "#00d4ff" }}
          >
            — Get to know me
          </span>
          <h2
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-none tracking-tight"
            style={{ color: "#ffffff" }}
          >
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f472b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Me
            </span>
          </h2>
        </Reveal>

        {/* ── Two-col: Profile Card | Text ── */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">

          {/* Left — Profile Card slides in from left */}
          <Reveal fromLeft delay={0.05}>
            <ProfileCard />
          </Reveal>

          {/* Right — Text content slides in from right */}
          <div className="space-y-8">
            <Reveal fromRight delay={0.1}>
              <h3
                className="font-display font-bold text-2xl md:text-3xl leading-snug"
                style={{ color: "#ffffff" }}
              >
                A passionate developer who loves to{" "}
                <TextType
                  words={[
                    "craft beautiful things.",
                    "build for the web.",
                    "solve hard problems.",
                    "write clean code.",
                    "create great UX.",
                  ]}
                  typingSpeed={70}
                  deletingSpeed={40}
                  pauseAfterType={2000}
                  className="font-display font-bold"
                  textStyle={{
                    background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  cursorClassName="bg-[#00d4ff] mx-[2px]"
                />
              </h3>
            </Reveal>

            <Reveal fromRight delay={0.15}>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.5)" }}>
                <p>
                  Hai! Aku Farhan, seorang <strong className="text-white/80">Frontend Developer</strong> berbasis di Malang, Indonesia. Aku suka mengubah ide-ide kreatif menjadi pengalaman web yang interaktif, cepat, dan memanjakan mata.
                </p>
                <p>
                  Spesialisiku ada di ekosistem <strong className="text-white/80">React & Next.js</strong> — dari membangun UI yang responsif hingga mengoptimasi performa dan aksesibilitas. Setiap piksel itu penting bagiku.
                </p>
              </div>
            </Reveal>

            {/* Tech stack chips */}
            <Reveal fromRight delay={0.2}>
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Tech I Work With
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {techs.map(({ icon: Icon, label, desc }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(0,212,255,0.25)";
                        el.style.background = "rgba(0,212,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "rgba(255,255,255,0.07)";
                        el.style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(0,212,255,0.1)" }}
                      >
                        <Icon size={14} style={{ color: "#00d4ff" }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white/80 truncate">{label}</div>
                        <div className="text-[10px] text-white/30 truncate">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
