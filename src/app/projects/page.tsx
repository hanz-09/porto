"use client";

import { useRef, useCallback, MouseEvent, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Github, ExternalLink, ArrowUpRight, Star, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
type GitHubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stars: number;
  updatedAt: string;
};

type Project = {
  id: number;
  title: string;
  description: string;
  techs: string[];
  github: string;
  live: string | null;
  accent: string;
  glow: string;
  year: string;
  language: string | null;
  stars: number;
};

/* ─────────────────────────────────────────────────────────
   Accent palette
───────────────────────────────────────────────────────── */
const ACCENTS = [
  { color: "var(--accent-cyan)", glow: "rgba(var(--accent-cyan-rgb, 0,240,255),0.12)" },
  { color: "#3b82f6", glow: "rgba(59,130,246,0.12)" },
  { color: "#0ea5e9", glow: "rgba(14,165,233,0.12)" },
  { color: "#2563eb", glow: "rgba(37,99,235,0.12)" },
  { color: "#06b6d4", glow: "rgba(6,182,212,0.12)" },
  { color: "#60a5fa", glow: "rgba(96,165,250,0.12)" },
  { color: "#38bdf8", glow: "rgba(56,189,248,0.12)" },
  { color: "#818cf8", glow: "rgba(129,140,248,0.12)" },
];

function mapRepo(repo: GitHubRepo, index: number): Project {
  const { color, glow } = ACCENTS[index % ACCENTS.length];
  const year = new Date(repo.updatedAt).getFullYear().toString();
  const techs = [
    ...(repo.language ? [repo.language] : []),
    ...repo.topics
      .filter((t) => t !== repo.language?.toLowerCase())
      .slice(0, 4),
  ].slice(0, 5);

  const title = repo.name.replace(/-/g, " ").replace(/_/g, " ");

  return {
    id: repo.id,
    title,
    description: repo.description || `Explore the source code, structure, and implementation details for the ${title} project.`,
    techs: techs.length > 0 ? techs : ["Code"],
    github: repo.html_url,
    live: repo.homepage || null,
    accent: color,
    glow,
    year,
    language: repo.language,
    stars: repo.stars,
  };
}

/* ─────────────────────────────────────────────────────────
   Mouse-tilt hook
───────────────────────────────────────────────────────── */
function useTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -8;
    const ry = ((x - r.width  / 2) / r.width ) *  8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
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

  return { cardRef, glareRef, onMove, onLeave };
}

/* ─────────────────────────────────────────────────────────
   Shimmer skeleton card
───────────────────────────────────────────────────────── */
function SkeletonCard({ resolvedTheme }: { resolvedTheme?: string }) {
  return (
    <div className={`h-64 rounded-2xl overflow-hidden relative ${resolvedTheme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-foreground/5 border-foreground/10'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(105deg, transparent 40%, rgba(var(--foreground-rgb, 255,255,255), 0.04) 50%, transparent 60%)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="h-2 w-16 rounded-full bg-foreground/5" />
        <div className="h-5 w-3/4 rounded-full bg-foreground/5" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded-full bg-foreground/3" />
          <div className="h-3 w-5/6 rounded-full bg-foreground/3" />
          <div className="h-3 w-4/6 rounded-full bg-foreground/3" />
        </div>
        <div className="flex gap-2 pt-2">
          {[48, 64, 40].map((w, i) => (
            <div key={i} className="h-5 rounded-full bg-foreground/3" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Featured hero card
───────────────────────────────────────────────────────── */
function FeaturedCard({ project, resolvedTheme }: { project: Project; resolvedTheme?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { cardRef, glareRef, onMove, onLeave } = useTilt();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6"
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative rounded-3xl overflow-hidden cursor-default"
        style={{ transition: "transform 0.12s ease" }}
      >
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-100"
          style={{ opacity: 0 }}
        />

        <div
          className="relative min-h-[300px] md:min-h-[360px] flex flex-col md:flex-row items-stretch overflow-hidden"
          style={{
            background: resolvedTheme === 'light' ? "rgba(255,255,255, 0.7)" : "rgba(var(--background-rgb, 8,8,16), 0.94)",
            backdropFilter: resolvedTheme === 'light' ? "blur(20px)" : "none",
            border: `1px solid ${project.accent}22`,
            boxShadow: resolvedTheme === 'light' ? `0 40px 80px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,1)` : `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${project.glow}`,
          }}
        >
          {/* Left art panel */}
          <div
            className="relative md:w-2/5 min-h-[160px] md:min-h-0 overflow-hidden shrink-0"
            style={{ background: `radial-gradient(ellipse at 50% 50%, ${project.accent}18 0%, transparent 70%)` }}
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center select-none pointer-events-none font-black"
              style={{ fontSize: "12rem", color: `${project.accent}07`, lineHeight: 1 }}
            >
              {project.title.charAt(0).toUpperCase()}
            </div>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }} />
            <div className="absolute top-0 bottom-0 left-0 w-px" style={{ background: `linear-gradient(180deg, ${project.accent}, transparent)` }} />
            <motion.div
              className="absolute rounded-full"
              style={{ width: 180, height: 180, top: "50%", left: "50%", marginTop: -90, marginLeft: -90, background: `radial-gradient(circle, ${project.accent}30 0%, transparent 70%)`, filter: "blur(30px)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase"
              style={{ background: `${project.accent}18`, border: `1px solid ${project.accent}35`, color: project.accent }}
            >
              {project.year}
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col justify-between p-8 md:p-10 flex-1">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: "rgba(255,230,0,0.08)", border: "1px solid rgba(255,230,0,0.2)", color: "#fbbf24" }}>
                  ★ Top Project
                </span>
                {project.stars > 0 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-foreground/50 dark:text-foreground/30">
                    <Star size={12} className="fill-current" style={{ color: "#fbbf24" }} />
                    {project.stars}
                  </span>
                )}
                {project.language && (
                  <span className="text-xs font-semibold text-foreground/70 dark:text-foreground/60">
                    {project.language}
                  </span>
                )}
              </div>

              <h3 className="font-display font-black text-3xl md:text-4xl leading-tight text-foreground mb-4 capitalize" style={{ textShadow: resolvedTheme === 'light' ? "none" : `0 0 40px ${project.accent}40` }}>
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed mb-6 text-foreground/80 dark:text-foreground/80">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.techs.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
                    style={{ background: `${project.accent}12`, border: `1px solid ${project.accent}30`, color: project.accent }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {project.live && (
                <motion.a href={project.live} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-foreground"
                  style={{ background: `linear-gradient(135deg, ${project.accent}cc, #2563eb)` }}>
                  <ExternalLink size={14} /> Live Demo <ArrowUpRight size={14} />
                </motion.a>
              )}
              <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border ${resolvedTheme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-foreground/5 border-foreground/10 text-foreground/70 hover:bg-foreground/10'}`}>
                <Github size={14} /> View Code
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Regular project card
───────────────────────────────────────────────────────── */
function ProjectCard({ project, index, resolvedTheme }: { project: Project; index: number; resolvedTheme?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { cardRef, glareRef, onMove, onLeave } = useTilt();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.08 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={() => { onLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        className="relative h-full rounded-2xl overflow-hidden cursor-default"
        style={{ transition: "transform 0.12s ease" }}
      >
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-100"
          style={{ opacity: 0 }}
        />

        <div
          className="relative h-full flex flex-col p-6 rounded-2xl"
          style={{
            background: resolvedTheme === 'light' ? "linear-gradient(145deg, rgba(255,255,255, 0.6) 0%, rgba(248,250,252, 0.3) 100%)" : "rgba(var(--background-rgb, 9,9,18), 0.9)",
            backdropFilter: resolvedTheme === 'light' ? "blur(20px)" : "none",
            border: resolvedTheme === 'light' ? `1px solid ${hovered ? project.accent + "50" : "rgba(15,23,42,0.06)"}` : `1px solid ${hovered ? project.accent + "30" : "rgba(var(--foreground-rgb, 255,255,255), 0.07)"}`,
            boxShadow: resolvedTheme === 'light' && hovered ? `0 24px 64px -12px rgba(15,23,42, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)` : hovered ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${project.glow}` : resolvedTheme === 'light' ? '0 10px 30px rgba(15,23,42,0.05)' : "0 10px 30px rgba(0,0,0,0.3)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.accent}${hovered ? "60" : "25"}, transparent)`, transition: "background 0.3s" }} />
          <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full" style={{ background: `linear-gradient(180deg, transparent, ${project.accent}, transparent)`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />

          <div
            className="absolute right-4 bottom-4 font-black select-none pointer-events-none"
            style={{ fontSize: "5rem", color: `${project.accent}05`, lineHeight: 1 }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="flex items-start justify-between mb-4 gap-2">
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: project.accent + "80" }}>
              {project.year}
            </span>
            <div className="flex items-center gap-2">
              {project.stars > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-foreground/40 dark:text-foreground/25">
                  <Star size={10} style={{ fill: "#fbbf24", color: "#fbbf24" }} /> {project.stars}
             </span>
              )}
              {project.language && (
                <span className="text-[10px] font-semibold text-foreground/40 dark:text-foreground/20">
                  {project.language}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-display font-bold text-base leading-tight mb-3 capitalize transition-colors duration-300" style={{ color: hovered ? project.accent : "var(--color-foreground)" }}>
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed flex-1 mb-4 line-clamp-3 text-foreground/60 dark:text-foreground/40">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techs.slice(0, 4).map((t) => (
              <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${resolvedTheme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-foreground/5 border-foreground/10 text-foreground/40'}`}>
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
              style={{ color: hovered ? project.accent : (resolvedTheme === 'light' ? "rgba(15,23,42, 0.5)" : "rgba(var(--foreground-rgb, 255,255,255), 0.3)") }}
              onClick={(e) => e.stopPropagation()}>
              <Github size={12} /> Code
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                style={{ color: hovered ? project.accent : (resolvedTheme === 'light' ? "rgba(15,23,42, 0.5)" : "rgba(var(--foreground-rgb, 255,255,255), 0.3)") }}
                onClick={(e) => e.stopPropagation()}>
                <ExternalLink size={12} /> Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Projects Page Component
───────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos: GitHubRepo[] = await res.json();
      setProjects(repos.map(mapRepo));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // Extract featured project (first in array)
  const featured = projects[0] ?? null;

  return (
    <main className="min-h-screen pt-12 pb-36 relative overflow-hidden bg-background">
      <motion.section
        id="projects-page-content"
        ref={sectionRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-12"
      >
        {/* Ambient blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div className="absolute rounded-full" style={{ width: 600, height: 600, left: "-10%", top: "5%", background: "radial-gradient(circle, rgba(var(--accent-cyan-rgb, 0,240,255),0.05) 0%, transparent 70%)", filter: "blur(50px)" }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }} />
          <motion.div className="absolute rounded-full" style={{ width: 500, height: 500, right: "-8%", bottom: "15%", background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Heading */}
          <div className="text-center mb-20">
            <motion.span initial={{ opacity: 0, letterSpacing: "0.8em" }} whileInView={{ opacity: 1, letterSpacing: "0.4em" }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="inline-block text-xs font-black uppercase mb-4" style={{ color: "#0ea5e9" }}>
              — Archive
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-none tracking-tight text-foreground mb-6">
              Full <span style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 55%, var(--accent-cyan) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Portfolio</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="text-xl max-w-2xl mx-auto text-foreground/50 dark:text-foreground/40">
              A complete list of open-source work and side projects directly pulled from my GitHub repositories.
            </motion.p>
          </div>

          {/* Error state */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <p className="text-sm mb-4" style={{ color: "rgba(255,100,100,0.8)" }}>Failed to load projects: {error}</p>
              <button onClick={fetchProjects} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "rgba(var(--foreground-rgb, 255,255,255), 0.05)", border: "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.1)", color: "rgba(var(--foreground-rgb, 255,255,255), 0.6)" }}>
                <RefreshCw size={14} /> Retry
              </button>
            </motion.div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-6">
              <SkeletonCard resolvedTheme={resolvedTheme} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} resolvedTheme={resolvedTheme} />)}
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && projects.length > 0 && (
            <>
              {featured && <FeaturedCard project={featured} resolvedTheme={resolvedTheme} />}
              {projects.length > 1 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                  {projects.slice(1).map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} resolvedTheme={resolvedTheme} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: "rgba(var(--foreground-rgb, 255,255,255), 0.3)" }}>No public repositories found.</p>
            </div>
          )}

          {/* GitHub CTA */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="text-center mt-24">
            <motion.a
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? ""}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-bold relative overflow-hidden border ${resolvedTheme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-foreground/5 border-foreground/10 text-foreground/70'}`}
            >
              <Github size={18} />
              <span className="relative z-10">Follow me on GitHub</span>
              <ArrowUpRight size={16} className="relative z-10" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
