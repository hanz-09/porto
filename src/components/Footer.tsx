"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowUpRight, Heart } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  // Local time state
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(formatter.format(new Date()));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative w-full border-t border-white/10 bg-black/50 backdrop-blur-lg">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* pb-32 pushes content above the floating navigation dock */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-32 md:pb-36">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          
          {/* Left: Branding & Time */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-xs font-semibold tracking-widest uppercase text-white/50">
            <div className="flex items-center gap-1.5 transition-colors hover:text-white/80">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="w-1 h-1 rounded-full bg-white/20 mx-2" />
              <span>Built with <Heart size={12} className="inline text-pink-500 fill-pink-500 animate-pulse" /> by Han</span>
            </div>
          </div>

          {/* Right: Socials */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a 
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                  className="group flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
                >
                  <Icon size={14} className="group-hover:text-cyan-400 transition-colors" />
                  <span className="uppercase tracking-widest">{link.label}</span>
                  <ArrowUpRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-cyan-400 transition-all duration-300" />
                </motion.a>
              )
            })}
          </div>

        </motion.div>
      </div>
    </footer>
  );
}
