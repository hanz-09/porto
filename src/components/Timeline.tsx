"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Briefcase, GraduationCap, Award, Code2 } from "lucide-react";
import BlurText from "./BlurText";

type TimelineItem = {
  year: string;
  title: string;
  place: string;
  description: string;
  type: "work" | "education" | "award" | "project";
  techs?: string[];
  highlight?: boolean;
};

const timelineItems: TimelineItem[] = [
  {
    year: "2024 – Present",
    title: "Frontend Developer",
    place: "Company Name ·  Full-time",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Building scalable web applications with React and Next.js. Collaborate closely with design team to deliver pixel-perfect UIs.",
    type: "work",
    techs: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlight: true,
  },
  {
    year: "2023",
    title: "Best Final Project Award",
    place: "University / Bootcamp",
    description:
      "Received recognition for an outstanding capstone project — a full-stack productivity application serving 200+ users.",
    type: "award",
    techs: ["React", "Node.js", "MongoDB"],
  },
  {
    year: "2022 – 2023",
    title: "Junior Frontend Developer",
    place: "Startup Name · Internship",
    description:
      "Contributed to building a B2B SaaS dashboard. Implemented responsive UI components and integrated REST APIs. Improved performance by 30%.",
    type: "work",
    techs: ["React", "JavaScript", "CSS"],
  },
  {
    year: "2019 – 2023",
    title: "Bachelor of Computer Science",
    place: "University Name",
    description:
      "Graduated with honors. Focused on Software Engineering and Human–Computer Interaction. GPA 3.8 / 4.0.",
    type: "education",
    highlight: false,
  },
  {
    year: "2021",
    title: "Freelance Web Developer",
    place: "Self-employed",
    description:
      "Built landing pages and company profiles for local businesses. Delivered 10+ projects on time.",
    type: "project",
    techs: ["HTML", "CSS", "JavaScript"],
  },
];

const typeConfig: Record<TimelineItem["type"], { icon: typeof Briefcase; color: string; bg: string }> = {
  work: { icon: Briefcase, color: "#00d4ff", bg: "rgba(0,212,255,0.12)" },
  education: { icon: GraduationCap, color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  award: { icon: Award, color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  project: { icon: Code2, color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
};

// Progress line that fills as user scrolls through this section
function TimelineProgressLine({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="w-full rounded-full"
        style={{
          height,
          background: "linear-gradient(180deg, #00d4ff, #7c3aed, #f472b6)",
          boxShadow: "0 0 12px rgba(0,212,255,0.5)",
        }}
      />
    </div>
  );
}

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const isLeft = index % 2 === 0;
  const { icon: Icon, color, bg } = typeConfig[item.type];

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-0 mb-12 md:mb-14">
      {/* Left side */}
      <div className={isLeft ? "pr-8 md:pr-12" : ""}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: -12 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformPerspective: 800 }}
            className="flex justify-end"
          >
            <TimelineCardContent item={item} color={color} bg={bg} Icon={Icon} />
          </motion.div>
        )}
      </div>

      {/* Center dot on the timeline */}
      <div className="flex flex-col items-center z-10 px-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.15, ease: "backOut" }}
          className="w-11 h-11 rounded-full flex items-center justify-center border-2 relative"
          style={{ background: bg, borderColor: color, boxShadow: `0 0 16px ${color}55` }}
        >
          <Icon size={16} style={{ color }} />
          {item.highlight && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </motion.div>
        {/* Year label (below dot on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-2 text-center"
        >
          <span className="text-[10px] font-bold tracking-wider whitespace-nowrap"
            style={{ color }}>
            {item.year}
          </span>
        </motion.div>
      </div>

      {/* Right side */}
      <div className={!isLeft ? "pl-8 md:pl-12" : ""}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: 12 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformPerspective: 800 }}
            className="flex justify-start"
          >
            <TimelineCardContent item={item} color={color} bg={bg} Icon={Icon} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function TimelineCardContent({
  item, color, bg, Icon,
}: {
  item: TimelineItem;
  color: string;
  bg: string;
  Icon: typeof Briefcase;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/6 hover:border-white/12 transition-colors group max-w-sm w-full"
      style={{ background: "rgba(10,10,18,0.8)" }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: bg }}>
          <Icon size={15} style={{ color }} />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-sm leading-tight text-foreground">
            {item.title}
          </h3>
          <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(160,160,200,0.6)" }}>
            {item.place}
          </p>
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(160,160,200,0.75)" }}>
        {item.description}
      </p>
      {item.techs && item.techs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.techs.map((t) => (
            <span key={t}
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: bg, color, border: `1px solid ${color}44` }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="timeline" className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#a78bfa" }}
          >
            My journey
          </motion.span>
          <BlurText
            text="Experience & Timeline"
            className="font-display font-bold text-4xl md:text-5xl mt-3 justify-center text-foreground"
            delay={0.07}
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-sm max-w-md mx-auto"
            style={{ color: "rgba(160,160,200,0.7)" }}
          >
            Scroll through my story — from student to developer.
          </motion.p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Animated progress line (desktop only) */}
          <div className="hidden md:block">
            <TimelineProgressLine containerRef={containerRef} />
          </div>

          {/* Mobile: single left-side line */}
          <div className="block md:hidden absolute left-5 top-0 bottom-0 w-[2px]"
            style={{ background: "linear-gradient(180deg, #00d4ff, #7c3aed, #f472b6)" }} />

          {timelineItems.map((item, i) => (
            <TimelineCard key={item.title} item={item} index={i} />
          ))}

          {/* End cap */}
          <div className="flex justify-center mt-4">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="w-4 h-4 rounded-full"
              style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
