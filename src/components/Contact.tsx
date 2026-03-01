"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import Magnet from "./Magnet";
import BlurText from "./BlurText";

const contactInfo = [
  { icon: Mail, label: "Email", value: "farhan@email.com", href: "mailto:farhan@email.com", color: "var(--accent-cyan)" },
  { icon: MapPin, label: "Location", value: "Indonesia 🇮🇩", href: "#", color: "var(--accent-violet)" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

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
    <section id="contact" className="section-padding relative overflow-hidden">
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal preset="fadeUp" className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent-cyan)" }}>
            Let&apos;s talk
          </span>
          <BlurText
            text="Get in Touch"
            className="font-display font-bold text-4xl md:text-5xl mt-3 justify-center"
            delay={0.07}
          />
          <p className="mt-4 text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Have a project in mind or just want to say hi? Feel free to reach out!
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-5 gap-10 items-start">
          {/* Contact Info */}
          <ScrollReveal preset="fadeLeft" delay={0.1} className="md:col-span-2 space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              I&apos;m currently open to full-time opportunities, freelance projects, and collaborations.
            </p>

            {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-white/6 hover:border-white/12 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}22` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                  <p className="font-medium text-sm group-hover:text-cyan-400 transition-colors" style={{ color: "var(--text-primary)" }}>
                    {value}
                  </p>
                </div>
              </motion.a>
            ))}

            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="glass-card rounded-2xl p-4 border border-green-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-400">Currently Available</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Open for new projects</p>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal preset="fadeRight" delay={0.15} className="md:col-span-3">
            {status === "sent" ? (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card rounded-2xl p-10 border border-green-500/20 flex flex-col items-center gap-4 text-center"
              >
                <CheckCircle2 size={48} className="text-green-400" />
                <h3 className="font-display font-bold text-xl" style={{ color: "var(--text-primary)" }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Thank you! I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => { setStatus("idle"); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-2 text-sm hover:underline"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-2xl p-6 md:p-8 border border-white/6 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        required
                        value={form[field.id as keyof typeof form]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or just say hi..."
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>

                {/* Magnetic Submit Button */}
                <Magnet strength={20} className="w-full">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white disabled:opacity-70 transition-all"
                    style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
                  >
                    {status === "loading" ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </motion.button>
                </Magnet>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
