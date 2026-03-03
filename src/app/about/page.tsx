"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Code2, Award, Sparkles, GraduationCap, Globe, 
  MessagesSquare, ChevronDown, Rocket, ShieldCheck,
  Settings, Gamepad2
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import Particles from "@/components/Particles";

/* ─────────────────────────────────────────────────────────
   Data (Sourced carefully from CV)
───────────────────────────────────────────────────────── */
const experiences = [
  {
    title: "Front-End Developer Intern",
    company: "Folxcode",
    period: "Jul 2025 – Mar 2026",
    location: "On-Site",
    desc: [
      "Developed scalable front-end features using Angular to build reusable UI components.",
      "Integrated REST APIs, improving overall performance, responsiveness, and user experience optimization."
    ]
  },
  {
    title: "Web Developer & UI/UX Designer",
    company: "Infinite Learning Indonesia",
    period: "Aug 2024 – Dec 2024",
    location: "Remote",
    desc: [
      "Built backend architecture using Node.js, Express, Sequelize, and MySQL.",
      "Designed RESTful APIs, implemented authentication, and optimized database queries before converting the system cross-platform.",
      "Implemented standard security practices such as password hashing and input validation to maintain the integrity and security of user data."
    ]
  },
  {
    title: "IoT & Android Mobile Developer",
    company: "Batam State Polytechnic",
    period: "Jan 2024 – Jul 2024",
    location: "Batam, Indonesia | Hybrid",
    desc: [
      "Developed a cross-platform mobile application using Flutter (Dart) to monitor the battery status of IoT-based devices in real-time.",
      "Using ESP8266 as a microcontroller to measure battery data (voltage, current, power level) and send it to the cloud.",
      "Integrating the application with Firebase Realtime Database to store and display sensor data directly in the mobile application.",
      "Connecting IoT devices with the application using the Blynk Platform as a data and notification hub.",
      "Designing the UI/UX of the application to be informative and easy to use, equipped with data visualization such as graphs and battery status indicators."
    ]
  },
  {
    title: "Freelance Front-End Developer",
    company: "Freelance",
    period: "Mar 2023 - Jan 2024",
    location: "Remote",
    desc: [
      "Worked independently to design and build custom landing pages and web applications for various clients.",
      "Ensured responsive design, optimal performance, and high-quality UI/UX tailored to client specifications.",
      "Maintained clear communication with stakeholders to gather requirements and deliver projects on schedule."
    ]
  }
];

const projects = [
  {
    title: "Turbo Bajaj Rush (Android)",
    period: "Jan 2025 - Present",
    desc: "An Indonesian-inspired arcade racing game built with C# and Unity."
  },
  {
    title: "Agroverse E-Commerce (Website)",
    period: "Agu 2024 – Dec 2024",
    desc: "A farmer's online shop website built with ReactJS."
  },
  {
    title: "Ceker (Android)",
    period: "Jan 2024 – Jul 2024",
    desc: "Battery monitoring mobile application built using Flutter and Firebase."
  }
];

const skills = {
  languages: ["English (Intermediate)", "Indonesia (Proficient)"],
  soft: ["Team Collaboration", "Time Management", "Critical Thinking", "Problem Solving"],
  hard: ["ReactJS", "NextJS", "PHP", "Laravel", "Figma", "Flutter", "Adobe Premiere Pro", "Adobe Photoshop"]
};

const certs = [
  "MSIB Certificate Infinite Learning Indonesia (2024)",
  "Certificate of Internship Infinite Learning Indonesia (2024)"
];

/* ─────────────────────────────────────────────────────────
   Bento Grid Reusable Card
───────────────────────────────────────────────────────── */
const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className={`p-8 rounded-3xl bg-foreground/5 border border-foreground/10 backdrop-blur-md overflow-hidden relative group/bento ${className}`}
  >
    {children}
  </motion.div>
);

/* ─────────────────────────────────────────────────────────
   Interactive Experience Card
───────────────────────────────────────────────────────── */
const ExpandableExperience = ({ exp, index }: { exp: typeof experiences[0], index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
      className="p-6 md:p-8 rounded-3xl bg-foreground/5 border border-foreground/10 hover:border-(--accent-cyan)/50 transition-colors cursor-pointer group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-start gap-4">
         <div>
           <h3 className="font-display font-bold text-xl md:text-2xl group-hover:text-(--accent-cyan) transition-colors">{exp.title}</h3>
           <p className="text-foreground/60 text-xs md:text-sm font-mono mt-2 uppercase tracking-tight flex flex-wrap gap-2 items-center">
             <span className="font-semibold text-(--accent-cyan)/80">{exp.company}</span>
             <span className="opacity-50">•</span>
             <span>{exp.period}</span>
           </p>
         </div>
         <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center transition-colors ${isOpen ? 'bg-(--accent-cyan) text-black' : 'bg-foreground/10 text-foreground'}`}>
           <ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ul className="mt-6 space-y-4 pt-6 border-t border-foreground/10">
              {exp.desc.map((bullet: string, i: number) => (
                 <li key={i} className="flex gap-4 text-sm text-foreground/75 leading-relaxed">
                   <Sparkles size={16} className="text-(--accent-cyan) shrink-0 mt-0.5" />
                   <span>{bullet}</span>
                 </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-dvh flex flex-col pt-32 pb-32 overflow-hidden selection:bg-(--accent-cyan)/30">
      
      {/* ── Background Animations ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <Particles
          particleColors={resolvedTheme === 'light' ? ["#94a3b8", "#38bdf8"] : ["#ffffff", "#00f0ff"]}
          particleCount={180}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles
          disableRotation={false}
        />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(var(--accent-cyan-rgb, 0,240,255), 0.08) 0%, transparent 70%)"
        }}
      />

      <div className="max-w-5xl mx-auto w-full px-6 relative z-10 flex flex-col gap-24">
        
        {/* ── BENTO GRID HERO ── */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          
          <BentoCard className="md:col-span-2 md:row-span-2 p-0! border-none! relative h-[450px] md:h-auto overflow-hidden group">
            <Image 
              src={resolvedTheme === 'light' ? "/images/ProfilePictureLight.webp" : "/images/ProfilePicture.webp"}
              alt="Farhan Zuhdi CV Photo" 
              fill 
              className="object-cover object-[center_30%] hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2">
                Farhan Zuhdi
              </h1>
              <p className="text-(--accent-cyan) font-mono text-xs md:text-sm tracking-wide flex items-center gap-2">
                 <Rocket size={14}/> Frontend Dev & Multimedia Tech
              </p>
            </div>
          </BentoCard>

          {/* 2. Abstract Description (Span 2x1) */}
          <BentoCard className="md:col-span-2 md:row-span-1 flex flex-col justify-center" delay={0.1}>
            <Sparkles className="text-(--accent-cyan) mb-6" size={28} />
            <p className="text-foreground/85 text-lg leading-relaxed">
              I blend technical expertise with a keen eye for design to build scalable, responsive, and user-centered digital products. I focus on bridging the gap between <strong className="text-foreground font-black">aesthetics</strong> and <strong className="text-foreground font-black">engineering</strong>.
            </p>
          </BentoCard>

          {/* 3. Education / GPA (Span 1x1) */}
          <BentoCard className="md:col-span-1 md:row-span-1 flex flex-col justify-between" delay={0.2}>
            <div className="w-12 h-12 rounded-full bg-(--accent-cyan)/10 flex items-center justify-center text-(--accent-cyan) border border-(--accent-cyan)/20 shadow-[0_0_20px_rgba(var(--accent-cyan-rgb,0,240,255),0.1)]">
              <GraduationCap size={24} />
            </div>
            <div className="mt-8">
              <div className="text-4xl font-display font-black text-foreground mb-1 tracking-tighter">3.84</div>
              <p className="text-foreground/50 text-[10px] font-mono uppercase tracking-widest mb-2">GPA / 4.00</p>
              <p className="text-sm font-bold text-foreground/80 leading-tight">Batam State Polytechnic</p>
            </div>
          </BentoCard>

          {/* 4. Location / Availability (Span 1x1) */}
          <BentoCard className="md:col-span-1 md:row-span-1 flex flex-col justify-center items-center text-center gap-4 bg-linear-to-b from-transparent to-foreground/5" delay={0.3}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-foreground/20"
            >
              <Globe size={48} strokeWidth={1.5} />
            </motion.div>
            <div>
              <p className="font-bold text-lg mb-2">Batam, ID</p>
              <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-emerald-200" />
                Available
              </div>
            </div>
          </BentoCard>

        </section>

        {/* ── EXPERIENCE (Cinematic Expanders) ── */}
        <section className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-black flex items-center gap-4 mb-4"
          >
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Briefcase size={24} />
            </div>
            Experience
          </motion.h2>
          
          <div className="flex flex-col gap-4">
            {experiences.map((exp, i) => (
              <ExpandableExperience key={i} exp={exp} index={i} />
            ))}
          </div>
        </section>

        {/* ── ARSENAL (Bento style skills) ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3 mb-2">
            <h2 className="font-display text-3xl font-black flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                 <Code2 size={24} />
              </div>
              Arsenal & Languages
            </h2>
          </div>

          <BentoCard className="flex flex-col gap-6" delay={0.1}>
            <h3 className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-foreground/50 border-b border-foreground/10 pb-4">
              <Settings size={14}/> Technical
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.hard.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg border border-foreground/10 bg-foreground/5 text-xs font-bold hover:bg-(--accent-cyan) hover:text-black transition-all cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="flex flex-col gap-6" delay={0.2}>
            <h3 className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-foreground/50 border-b border-foreground/10 pb-4">
              <MessagesSquare size={14}/> Abstract
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.soft.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg border border-foreground/10 bg-foreground/5 text-xs font-bold text-foreground/80 hover:bg-foreground hover:text-background transition-all cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </BentoCard>

          <BentoCard className="flex flex-col gap-6" delay={0.3}>
            <h3 className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 text-foreground/50 border-b border-foreground/10 pb-4">
              <Globe size={14}/> Languages
            </h3>
            <div className="flex flex-col gap-3">
              {skills.languages.map(lang => {
                 const [name, level] = lang.split(' (');
                 return (
                   <div key={name} className="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-foreground/5">
                     <span className="font-bold text-sm tracking-wide">{name}</span>
                     <span className="text-[10px] uppercase font-bold tracking-widest text-(--accent-cyan)">
                       {level.replace(')', '')}
                     </span>
                   </div>
                 );
              })}
            </div>
          </BentoCard>
        </section>

        {/* ── PROJECTS & CERTIFICATIONS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-6 mt-12 pb-20">
          
          {/* Projects Mini-Grid */}
          <section className="space-y-6">
            <h2 className="font-display text-3xl font-black flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Gamepad2 size={24} />
              </div>
              Projects
            </h2>
            <div className="flex flex-col gap-4">
              {projects.map((proj, i) => (
                <BentoCard key={proj.title} delay={i*0.1} className="group hover:border-(--accent-cyan)/50 cursor-pointer p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-(--accent-cyan) transition-colors">{proj.title}</h3>
                      <p className="text-foreground/70 text-sm">{proj.desc}</p>
                    </div>
                    <span className="text-[10px] shrink-0 font-mono font-bold tracking-widest uppercase text-foreground/40 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/5">
                      {proj.period}
                    </span>
                  </div>
                </BentoCard>
              ))}
            </div>
          </section>

          {/* Certifications List */}
          <section className="space-y-6">
            <h2 className="font-display text-3xl font-black flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              Certifications
            </h2>
            <div className="space-y-4">
              {certs.map((cert, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-start gap-4 p-5 rounded-3xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm group hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <p className="text-foreground/80 text-sm font-medium leading-relaxed group-hover:text-foreground transition-colors mt-0.5">
                    {cert}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <BentoCard className="mt-8 flex flex-col items-center justify-center text-center gap-4 py-8 border-dashed bg-transparent" delay={0.4}>
               <Sparkles className="text-foreground/20" size={32}/>
               <p className="font-bold text-foreground/60 text-sm max-w-[200px]">More journey details on the way.</p>
            </BentoCard>

          </section>

        </div>

      </div>
    </div>
  );
}
