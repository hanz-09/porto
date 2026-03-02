"use client";

/**
 * Projects — GitHub API Integration
 *
 * Data flow:
 *  Client component fetches /api/github on mount → maps GitHub repo fields
 *  to the Project type → renders the same cinematic UI.
 *
 * Loading state: shimmer skeleton cards (no layout shift).
 * Error state: graceful fallback with retry.
 */

import { useRef, useCallback, MouseEvent, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { Github, ExternalLink, ArrowUpRight, Star, RefreshCw } from "lucide-react";

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
   Accent palette — cycles through these for visual variety
───────────────────────────────────────────────────────── */
const ACCENTS = [
  { color: "#00d4ff", glow: "rgba(0,212,255,0.12)" },
  { color: "#a78bfa", glow: "rgba(167,139,250,0.12)" },
  { color: "#f472b6", glow: "rgba(244,114,182,0.12)" },
  { color: "#4ade80", glow: "rgba(74,222,128,0.12)" },
  { color: "#fb923c", glow: "rgba(251,146,60,0.12)" },
  { color: "#facc15", glow: "rgba(250,204,21,0.12)" },
  { color: "#38bdf8", glow: "rgba(56,189,248,0.12)" },
  { color: "#e879f9", glow: "rgba(232,121,249,0.12)" },
];

function mapRepo(repo: GitHubRepo, index: number): Project {
  const { color, glow } = ACCENTS[index % ACCENTS.length];
  const year = new Date(repo.updatedAt).getFullYear().toString();
  // Build techs: language first, then topics
  const techs = [
    ...(repo.language ? [repo.language] : []),
    ...repo.topics
      .filter((t) => t !== repo.language?.toLowerCase())
      .slice(0, 4),
  ].slice(0, 5);

  return {
    id: repo.id,
    title: repo.name.replace(/-/g, " ").replace(/_/g, " "),
    description: repo.description,
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

  return { cardRef, glareRef, onMove, onLeave };
}

/* ─────────────────────────────────────────────────────────
   Shimmer skeleton card (loading state)
───────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="h-64 rounded-2xl overflow-hidden relative"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="h-2 w-16 rounded-full bg-white/5" />
        <div className="h-5 w-3/4 rounded-full bg-white/5" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded-full bg-white/3" />
          <div className="h-3 w-5/6 rounded-full bg-white/3" />
          <div className="h-3 w-4/6 rounded-full bg-white/3" />
        </div>
        <div className="flex gap-2 pt-2">
          {[48, 64, 40].map((w, i) => (
            <div key={i} className="h-5 rounded-full bg-white/3" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Featured hero card (first / most-starred project)
───────────────────────────────────────────────────────── */
function FeaturedCard({ project }: { project: Project }) {
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
            background: "rgba(8,8,16,0.94)",
            border: `1px solid ${project.accent}22`,
            boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${project.glow}`,
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
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <Star size={12} className="fill-current" style={{ color: "#fbbf24" }} />
                    {project.stars}
                  </span>
                )}
                {project.language && (
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {project.language}
                  </span>
                )}
              </div>

              <h3 className="font-display font-black text-3xl md:text-4xl leading-tight text-white mb-4 capitalize" style={{ textShadow: `0 0 40px ${project.accent}40` }}>
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${project.accent}cc, #7c3aed)` }}>
                  <ExternalLink size={14} /> Live Demo <ArrowUpRight size={14} />
                </motion.a>
              )}
              <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
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
function ProjectCard({ project, index }: { project: Project; index: number }) {
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
            background: "rgba(9,9,18,0.9)",
            border: `1px solid ${hovered ? project.accent + "30" : "rgba(255,255,255,0.07)"}`,
            boxShadow: hovered ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${project.glow}` : "0 10px 30px rgba(0,0,0,0.3)",
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
                <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <Star size={10} style={{ fill: "#fbbf24", color: "#fbbf24" }} /> {project.stars}
                </span>
              )}
              {project.language && (
                <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {project.language}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-display font-bold text-base leading-tight mb-3 capitalize transition-colors duration-300" style={{ color: hovered ? project.accent : "#ffffff" }}>
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed flex-1 mb-4 line-clamp-3" style={{ color: "rgba(255,255,255,0.38)" }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techs.slice(0, 4).map((t) => (
              <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.38)" }}>
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
              style={{ color: hovered ? project.accent : "rgba(255,255,255,0.3)" }}
              onClick={(e) => e.stopPropagation()}>
              <Github size={12} /> Code
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                style={{ color: hovered ? project.accent : "rgba(255,255,255,0.3)" }}
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
   Main export
───────────────────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Section scroll spring
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const sOpacity = useTransform(scrollYProgress, [0, 0.07, 0.88, 1], [0, 1, 1, 0]);
  const rawY     = useTransform(scrollYProgress, [0, 0.07, 0.92, 1], [80, 0, 0, -60]);
  const rawScale = useTransform(scrollYProgress, [0, 0.07, 0.92, 1], [0.95, 1, 1, 0.96]);
  const sY       = useSpring(rawY,     { stiffness: 55, damping: 20, mass: 0.8 });
  const sScale   = useSpring(rawScale, { stiffness: 55, damping: 20, mass: 0.8 });

  const featured = projects[0] ?? null;
  const rest = projects.slice(1);

  return (
    <motion.section
      id="projects"
      ref={sectionRef}
      style={{ opacity: sOpacity, y: sY, scale: sScale }}
      className="relative py-16 md:py-24 lg:py-36 overflow-hidden"
    >
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute rounded-full" style={{ width: 600, height: 600, left: "-10%", top: "5%", background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)", filter: "blur(50px)" }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }} />
        <motion.div className="absolute rounded-full" style={{ width: 500, height: 500, right: "-8%", bottom: "15%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }} />
      </div>
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0, letterSpacing: "0.8em" }} whileInView={{ opacity: 1, letterSpacing: "0.4em" }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="inline-block text-xs font-black uppercase mb-4" style={{ color: "#f472b6" }}>
            — What I&apos;ve Built
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-4xl sm:text-5xl md:text-7xl leading-none tracking-tight text-white mb-4">
            My{" "}
            <span style={{ background: "linear-gradient(135deg, #f472b6 0%, #7c3aed 55%, #00d4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Projects
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Pulled live from GitHub. Hover the cards to explore.
          </motion.p>
        </div>

        {/* Error state */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <p className="text-sm mb-4" style={{ color: "rgba(255,100,100,0.8)" }}>Failed to load projects: {error}</p>
            <button onClick={fetchProjects} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              <RefreshCw size={14} /> Retry
            </button>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-6">
            <SkeletonCard />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && projects.length > 0 && (
          <>
            {/* Featured */}
            {featured && <FeaturedCard project={featured} />}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No public repositories found.</p>
          </div>
        )}

        {/* GitHub CTA */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="text-center mt-14">
          <motion.a
            href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            <motion.span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)" }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
            <Github size={16} />
            <span className="relative z-10">View All Projects on GitHub</span>
            <ArrowUpRight size={14} className="relative z-10" />
          </motion.a>
        </motion.div>

      </div>
    </motion.section>
  );
}
