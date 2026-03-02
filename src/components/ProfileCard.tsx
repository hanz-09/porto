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
  bio = "Crafting pixel-perfect interfaces & delightful web experiences using React and modern tooling.",
  avatarLetter = "F",
  githubUrl = "https://github.com",
  linkedinUrl = "https://linkedin.com",
  instagramUrl = "https://instagram.com",
  emailUrl = "mailto:hello@farhan.dev",
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
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 65%)`;
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
          background: "radial-gradient(ellipse at 60% 40%, rgba(0,212,255,0.35) 0%, rgba(124,58,237,0.25) 50%, transparent 75%)",
        }}
      />

      {/* Card Shell */}
      <div
        className="relative rounded-[32px] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
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
            background: "linear-gradient(135deg, #0c0c18 0%, #0a0a14 100%)",
          }}
        >
          {/* Grid lines texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Cyan accent bar at the top */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #00d4ff, #7c3aed, transparent)" }}
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
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed, #f472b6)",
                  filter: "blur(4px)",
                }}
              />
              <div
                className="relative w-24 h-24 rounded-full overflow-hidden"
                style={{
                  border: "2px solid rgba(255,255,255,0.08)",
                }}
              >
                <Image
                  src="/images/ProfilePicture.webp"
                  alt="Farhan Zuhdi"
                  fill
                  unoptimized
                  className="object-cover object-center"
                  priority
                />
                {/* Gloss */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-full"
                  style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }}
                />
              </div>

              {/* Online dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#0d0d1a] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] animate-pulse" />
              </div>
            </div>

            {/* "Open to Work" badge (top-right of the body section) */}
            <div
              className="mb-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
              style={{
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "#00d4ff",
              }}
            >
              Open to Work
            </div>
          </div>

          {/* Name + Title */}
          <h3 className="text-xl font-display font-bold text-white leading-tight mb-0.5">
            {name}
          </h3>
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: "#00d4ff" }}
          >
            {title}
          </p>

          {/* Bio */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
            {bio}
          </p>

          {/* Divider */}
          <div
            className="h-px w-full mb-6"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
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
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#00d4ff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.4)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 14px rgba(0,212,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
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
            className="block w-full text-center py-3 rounded-xl text-sm font-bold text-white relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
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
