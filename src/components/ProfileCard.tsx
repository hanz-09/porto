"use client";

/**
 * ProfileCard — faithfully recreated from reactbits.dev/components/profile-card
 * 
 * Features:
 *  - 3D mouse-tracking tilt (CSS perspective + rotateX/Y)
 *  - Radial glare that follows the cursor
 *  - Inner glow ring on the avatar
 *  - Ambient background glow that pulses
 *  - Social links with hover micro-animations
 */

import { useRef, useCallback, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ProfileCardProps {
  name?: string;
  title?: string;
  bio?: string;
  avatarLetter?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  emailUrl?: string;
}

export default function ProfileCard({
  name = "Farhan Zuhdi",
  title = "Frontend Developer",
  bio = "Multimedia Engineering Technology student with a passion for creating scalable, responsive, and user-centered digital experiences.",
  avatarLetter = "F",
  githubUrl = "https://github.com/hanz-09",
  linkedinUrl = "https://linkedin.com/in/f4rh4n-zuhd1",
  instagramUrl = "https://instagram.com",
  emailUrl = "mailto:farhanzuhdi400@gmail.com",
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      const glare = glareRef.current;
      if (!card || !glare) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Tilt — max ±15deg
      const rotateX = ((y - cy) / cy) * -12;
      const rotateY = ((x - cx) / cx) * 12;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;

      // Glare position
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(var(--foreground-rgb, 255,255,255), 0.12) 0%, transparent 65%)`;
      glare.style.opacity = "1";
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    glare.style.opacity = "0";
  }, []);

  const socials = [
    { icon: Github,    label: "GitHub",    href: githubUrl },
    { icon: Linkedin,  label: "LinkedIn",  href: linkedinUrl },
    { icon: Instagram, label: "Instagram", href: instagramUrl },
    { icon: Mail,      label: "Email",     href: emailUrl },
  ];

  /* ─────────────────────────────────────────────────────────
     Light & dark mode check
  ───────────────────────────────────────────────────────── */
  const { resolvedTheme } = useTheme();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.1s ease" }}
      className="relative w-full max-w-[340px] mx-auto select-none"
    >
      {/* Ambient glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-4 rounded-[44px] opacity-40 blur-2xl pointer-events-none"
        style={{
          background: resolvedTheme === 'light' 
            ? "radial-gradient(ellipse at 60% 40%, rgba(37,99,235,0.4) 0%, rgba(14,165,233,0.3) 50%, transparent 75%)"
            : "radial-gradient(ellipse at 60% 40%, rgba(var(--accent-cyan-rgb, 0,240,255),0.35) 0%, rgba(37,99,235,0.25) 50%, transparent 75%)",
        }}
      />

      {/* Floating Hover Indicator */}
      <motion.div
        className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-xl pointer-events-none"
        style={{
          background: resolvedTheme === 'light' ? "#ffffff" : "var(--bg-secondary)",
          border: resolvedTheme === 'light' ? "1px solid rgba(15,23,42,0.1)" : "1px solid rgba(255,255,255,0.1)",
          color: resolvedTheme === 'light' ? "#0f172a" : "var(--color-foreground)",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-bold tracking-wide uppercase">Hover Me</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </motion.div>

      {/* Card Shell */}
      <div
        className="relative rounded-[32px] overflow-hidden"
        style={{
          background: resolvedTheme === 'light'
            ? "linear-gradient(145deg, rgba(255,255,255, 0.7) 0%, rgba(248,250,252, 0.4) 100%)"
            : "linear-gradient(145deg, rgba(var(--foreground-rgb, 255,255,255), 0.05) 0%, rgba(var(--foreground-rgb, 255,255,255), 0.01) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: resolvedTheme === 'light'
            ? "1px solid rgba(255,255,255, 0.6)"
            : "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.08)",
          boxShadow: resolvedTheme === 'light'
            ? "0 32px 64px -12px rgba(15,23,42, 0.15), inset 0 1px 0 rgba(255,255,255, 0.8), 0 0 0 1px rgba(15,23,42, 0.02)"
            : "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(var(--foreground-rgb, 255,255,255), 0.08)",
        }}
      >
        {/* Glare overlay */}
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[32px] transition-opacity duration-100"
          style={{ opacity: 0, zIndex: 2 }}
        />

        {/* Top banner with gradient */}
        <div
          className="relative h-28 w-full"
          style={{
            background: resolvedTheme === 'light'
              ? "linear-gradient(135deg, rgba(2,132,199,0.1) 0%, rgba(37,99,235,0.05) 100%)"
              : "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
          }}
        >
          {/* Grid lines texture */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: resolvedTheme === 'light'
                ? "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)"
                : "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              opacity: resolvedTheme === 'light' ? 1 : 0.04,
            }}
          />
          {/* Cyan accent bar at the top */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #00f0ff, #2563eb, transparent)" }}
          />
        </div>

        {/* Avatar — straddles banner + body */}
        <div className="relative px-8 pb-8" style={{ zIndex: 1 }}>
          <div className="relative -mt-14 mb-5 flex items-end justify-between">
            {/* Avatar bubble */}
            <div className="relative">
              {/* Glowing ring */}
              <div
                className="absolute -inset-[3px] rounded-full opacity-80"
                style={{
                  background: resolvedTheme === 'light'
                    ? "linear-gradient(135deg, #0ea5e9, #2563eb, #3b82f6)"
                    : "linear-gradient(135deg, #00f0ff, #2563eb, #0ea5e9)",
                  filter: "blur(4px)",
                }}
              />
              <div
                className="relative w-24 h-24 rounded-full overflow-hidden"
                style={{
                  border: resolvedTheme === 'light'
                    ? "4px solid #ffffff"
                    : "2px solid rgba(var(--foreground-rgb, 255,255,255), 0.08)",
                  boxShadow: resolvedTheme === 'light' ? "0 4px 14px rgba(0,0,0,0.1)" : "none",
                }}
              >
                <Image
                  src={resolvedTheme === 'light' ? "/images/ProfilePictureLight.webp" : "/images/ProfilePicture.webp"}
                  alt="Farhan Zuhdi"
                  fill
                  unoptimized
                  className="object-cover object-center pointer-events-none"
                  priority
                />
                {/* Gloss */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-full"
                  style={{ background: resolvedTheme === 'light' ? "linear-gradient(145deg, rgba(255,255,255, 0.4) 0%, transparent 60%)" : "linear-gradient(145deg, rgba(var(--foreground-rgb, 255,255,255), 0.08) 0%, transparent 60%)" }}
                />
              </div>

              {/* Online dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#0d0d1a] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse" />
              </div>
            </div>

            {/* "Open to Work" badge (top-right of the body section) */}
            <div
              className={`mb-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors`}
              style={{
                background: resolvedTheme === 'light' ? "rgba(37,99,235,0.1)" : "rgba(var(--accent-cyan-rgb, 0,240,255),0.1)",
                border: resolvedTheme === 'light' ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(var(--accent-cyan-rgb, 0,240,255),0.25)",
                color: resolvedTheme === 'light' ? "#2563eb" : "#00f0ff",
              }}
            >
              Open to Work
            </div>
          </div>

          {/* Name + Title */}
          <h3 className="text-xl font-display font-bold text-foreground leading-tight mb-0.5">
            {name}
          </h3>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: resolvedTheme === 'light' ? "var(--foreground-rgb)" : "#00f0ff" }}
          >
            {title}
          </p>

          {/* Bio */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(var(--foreground-rgb, 255,255,255), 0.45)" }}>
            {bio}
          </p>

          {/* Divider */}
          <div
            className="h-px w-full mb-6"
            style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.08), transparent)" }}
          />

          {/* Social Row */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {socials.map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/50 transition-colors"
                style={{
                  background: resolvedTheme === 'light' ? "rgba(15,23,42, 0.03)" : "rgba(var(--foreground-rgb, 255,255,255), 0.04)",
                  border: resolvedTheme === 'light' ? "1px solid rgba(15,23,42, 0.08)" : "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = resolvedTheme === 'light' ? "#2563eb" : "#00f0ff";
                  (e.currentTarget as HTMLElement).style.borderColor = resolvedTheme === 'light' ? "rgba(37,99,235,0.4)" : "rgba(var(--accent-cyan-rgb, 0,240,255),0.4)";
                  (e.currentTarget as HTMLElement).style.background = resolvedTheme === 'light' ? "rgba(37,99,235,0.05)" : "rgba(var(--accent-cyan-rgb, 0,240,255),0.05)";
                  (e.currentTarget as HTMLElement).style.boxShadow = resolvedTheme === 'light' ? "0 0 14px rgba(37,99,235,0.2)" : "0 0 14px rgba(var(--accent-cyan-rgb, 0,240,255),0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(var(--foreground-rgb, 255,255,255), 0.5)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--foreground-rgb, 255,255,255), 0.08)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(var(--foreground-rgb, 255,255,255), 0.04)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </div>

          {/* CTA button */}
          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`block w-full text-center py-3 rounded-xl text-sm font-bold relative overflow-hidden transition-shadow ${resolvedTheme === 'light' ? 'text-white' : 'text-foreground'}`}
            style={{
              background: resolvedTheme === 'light' 
                ? "linear-gradient(135deg, #2563eb, #0ea5e9)" 
                : "linear-gradient(135deg, rgba(var(--accent-cyan-rgb, 0,240,255),0.15), rgba(37,99,235,0.15))",
              border: resolvedTheme === 'light' ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(var(--foreground-rgb, 255,255,255), 0.1)",
              boxShadow: resolvedTheme === 'light' ? "0 8px 20px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.2)" : "none",
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(var(--foreground-rgb, 255,255,255), 0.1) 50%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5 }}
            />
            <span className="relative z-10">Let&apos;s Work Together</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}
