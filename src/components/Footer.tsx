"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowUp, Code2, Heart } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/6">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">farhan.dev</span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-(--text-muted) hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social + Back-to-top */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-9 h-9 rounded-full glass-card border border-white/8 hover:border-cyan-500/30 flex items-center justify-center text-(--text-muted) hover:text-(--accent-cyan) transition-all"
                aria-label={label}
              >
                <Icon size={16} />
              </motion.a>
            ))}

            <motion.button
              whileHover={{ scale: 1.1, y: -2, boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="ml-2 w-9 h-9 rounded-full bg-linear-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-white/4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-(--text-muted)">
          <p>
            © {new Date().getFullYear()} Farhan Zuhdi. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-pink-500 fill-pink-500 mx-0.5" /> using Next.js & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
