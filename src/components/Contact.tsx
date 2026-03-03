"use client";

/**
 * Contact — Complete Redesign (No WebGL/Lanyard)
 *
 * Left: Glowing floating contact cards with mouse-tracking hover effects
 * Right: Modern glassmorphism contact form with cinematic hover effects
 */

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Loader2, Sparkles, Github, Linkedin, Instagram } from "lucide-react";
import { useTheme } from "next-themes";
import Magnet from "./Magnet";

const contactInfo = [
  { icon: Mail, label: "Email", value: "farhanzuhdi400@gmail.com", href: "mailto:farhanzuhdi400@gmail.com", color: "var(--accent-cyan)" },
  { icon: MapPin, label: "Location", value: "Batam, Indonesia 🇮🇩", href: "#", color: "#2563eb" },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/hanz-09", color: "var(--color-foreground)" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/f4rh4n-zuhd1", color: "#0a66c2" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com", color: "#e1306c" },
];

// Reusable Tilt Card with Mouse Spotlight
function GlowingCard({ children, className = "", resolvedTheme }: { children: React.ReactNode; className?: string; resolvedTheme?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-colors ${resolvedTheme === 'light' ? 'bg-white/60 border-slate-900/10 hover:bg-white/90 shadow-xl' : 'bg-foreground/2 border-foreground/10 hover:bg-foreground/4'} ${className} group`}
      style={{ backdropFilter: "blur(10px)" }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 212, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, amount: 0.2 });
  const { resolvedTheme } = useTheme();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Section scroll spring matches other sections
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const sOpacity = useTransform(scrollYProgress, [0, 0.07, 0.88, 1], [0, 1, 1, 0]);
  const rawY     = useTransform(scrollYProgress, [0, 0.07, 0.92, 1], [80, 0, 0, -60]);
  const rawScale = useTransform(scrollYProgress, [0, 0.07, 0.92, 1], [0.95, 1, 1, 0.96]);
  const sY       = useSpring(rawY,     { stiffness: 55, damping: 20, mass: 0.8 });
  const sScale   = useSpring(rawScale, { stiffness: 55, damping: 20, mass: 0.8 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((res) => setTimeout(res, 1500));
    setStatus("sent");
  };

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      style={{ opacity: sOpacity, y: sY, scale: sScale }}
      className="relative pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-36 min-h-dvh flex items-center overflow-hidden"
    >
      {/* Abstract Background Elements */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute rounded-full" style={{ width: 600, height: 600, right: "-10%", top: "5%", background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} animate={{ x: [0, -30, 0], y: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }} />
        <motion.div className="absolute rounded-full" style={{ width: 500, height: 500, left: "-8%", bottom: "5%", background: "radial-gradient(circle, rgba(var(--accent-cyan-rgb, 0,240,255),0.05) 0%, transparent 70%)", filter: "blur(40px)" }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }} />
      </div>
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.06), transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* ── Heading ── */}
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0, letterSpacing: "0.8em" }} whileInView={{ opacity: 1, letterSpacing: "0.4em" }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="inline-flex items-center gap-2 text-xs font-black uppercase mb-4" style={{ color: "var(--accent-cyan)" }}>
            <Sparkles size={12} /> Let&apos;s Connect
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 40, filter: "blur(12px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-4xl sm:text-5xl md:text-7xl leading-none tracking-tight text-foreground mb-4">
            Get in{" "}
            <span style={{ background: "linear-gradient(135deg, var(--accent-cyan) 0%, #2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Touch
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="text-sm max-w-md mx-auto text-foreground/60 dark:text-foreground/40">
            Have a project in mind, want to hire me, or just want to chat? Reach out via the form or find me on my social networks.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* ── Left Side: Interactive Contact Info & Socials ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Direct Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <a key={label} href={href} className="block outline-none">
                  <GlowingCard resolvedTheme={resolvedTheme} className="p-6 h-full flex flex-col justify-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border border-foreground/5 bg-foreground/5" style={{ color }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 dark:text-foreground/40 block mb-1">{label}</span>
                      <span className="text-sm font-bold text-foreground group-hover:text-(--accent) transition-colors" style={{ '--accent': color } as React.CSSProperties}>{value}</span>
                    </div>
                  </GlowingCard>
                </a>
              ))}
            </div>

            {/* Social Links Panel */}
            <GlowingCard resolvedTheme={resolvedTheme} className="p-8 mt-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/60 dark:text-foreground/40 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Social Profiles
              </h3>
              <div className="flex flex-col gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all group/social ${resolvedTheme === 'light' ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-foreground/1 hover:bg-foreground/5 border-foreground/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 group-hover/social:scale-110 transition-transform" style={{ color: resolvedTheme === 'light' && social.label === 'GitHub' ? '#2563eb' : social.color }}>
                        <social.icon size={18} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{social.label}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-foreground/10 text-foreground/50 dark:text-foreground/30 group-hover/social:text-foreground group-hover/social:bg-foreground/10 transition-all -rotate-45 group-hover/social:rotate-[-30deg]">
                      →
                    </div>
                  </a>
                ))}
              </div>
            </GlowingCard>
            
          </motion.div>

          {/* ── Right Side: Premium Contact Form ── */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 40 }}
            animate={formInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col relative"
          >
            {/* Availability Badge */}
            <div className="flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-green-500/20 w-max bg-green-500/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600 dark:bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-green-400 uppercase tracking-widest">Available for hire</span>
            </div>

            <div className={`relative rounded-3xl p-8 md:p-10 border ${resolvedTheme === 'light' ? 'border-slate-900/10 bg-white/70 shadow-2xl backdrop-blur-2xl' : 'border-foreground/10 bg-background/40 backdrop-blur-xl shadow-2xl'}`}>
              {status === "sent" ? (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full py-16"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="font-display font-black text-3xl text-foreground mb-3">Message Sent!</h3>
                  <p className="text-sm mb-8 text-foreground/60">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all hover:-translate-y-1 border ${resolvedTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-foreground/5 border-foreground/10 text-foreground'}`}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2 relative">
                      <label htmlFor="name" className={`block text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${focusedField === 'name' ? 'text-(--accent-cyan)' : 'text-foreground/60 dark:text-foreground/40'}`}>
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Input Your Name"
                        className="w-full bg-transparent border-b border-slate-300 dark:border-foreground/20 px-0 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-0 placeholder-slate-500 dark:placeholder-foreground/50 transition-colors rounded-none"
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2 relative">
                      <label htmlFor="email" className={`block text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${focusedField === 'email' ? 'text-(--accent-cyan)' : 'text-foreground/60 dark:text-foreground/40'}`}>
                        Your Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Input Your Email"
                        className="w-full bg-transparent border-b border-slate-300 dark:border-foreground/20 px-0 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-0 placeholder-slate-500 dark:placeholder-foreground/50 transition-colors rounded-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 relative mt-4">
                    <label htmlFor="message" className={`block text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${focusedField === 'message' ? 'text-(--accent-cyan)' : 'text-foreground/60 dark:text-foreground/40'}`}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Input Your Message"
                      className="w-full bg-transparent border-b border-slate-300 dark:border-foreground/20 px-0 py-3 text-sm text-foreground focus:outline-none focus:border-cyan-400 focus:ring-0 placeholder-slate-500 dark:placeholder-foreground/50 transition-colors resize-none rounded-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 pt-6 border-t border-foreground/5 flex items-center justify-between">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/30 hidden sm:block">
                      Secure connection
                    </p>
                    <Magnet strength={15}>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={status === "loading"}
                        className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-shadow relative overflow-hidden group disabled:opacity-70 text-white ${resolvedTheme === 'light' ? 'shadow-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'hover:shadow-[0_0_40px_rgba(var(--accent-cyan-rgb, 0,240,255),0.4)]'}`}
                        style={{ background: resolvedTheme === 'light' ? "linear-gradient(135deg, #2563eb, #0ea5e9)" : "linear-gradient(135deg, var(--accent-cyan), #2563eb)" }}
                      >
                        {/* Shimmer on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--foreground-rgb, 255,255,255), 0.2), transparent)" }} />
                        
                        {status === "loading" ? (
                          <><Loader2 size={18} className="animate-spin" /> Transmitting</>
                        ) : (
                          <><Send size={18} className="translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Shoot an Email</>
                        )}
                      </motion.button>
                    </Magnet>
                  </div>
                </form>
              )}
            </div>

            {/* Background glowing halo behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
