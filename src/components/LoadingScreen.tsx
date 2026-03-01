"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Aurora to avoid SSR issues with WebGL
const Aurora = dynamic(() => import("./Aurora"), { ssr: false });

// "Hello" in 20 languages
const hellos = [
  { word: "Hello",      lang: "English" },
  { word: "Hola",       lang: "Spanish" },
  { word: "Bonjour",    lang: "French" },
  { word: "Ciao",       lang: "Italian" },
  { word: "こんにちは",  lang: "Japanese" },
  { word: "안녕하세요",  lang: "Korean" },
  { word: "你好",       lang: "Chinese" },
  { word: "Hallo",      lang: "German" },
  { word: "Привет",     lang: "Russian" },
  { word: "مرحبا",      lang: "Arabic" },
  { word: "Olá",        lang: "Portuguese" },
  { word: "Merhaba",    lang: "Turkish" },
  { word: "Hei",        lang: "Norwegian" },
  { word: "สวัสดี",     lang: "Thai" },
  { word: "Halo",       lang: "Indonesian" },
  { word: "Sawubona",   lang: "Zulu" },
];

// Duration config (ms)
const LOADING_DURATION = 2200; // fake progress bar fills in this time
const HELLO_INTERVAL   = 750;  // each word shows for Xms — long enough to read
const HELLO_ROUNDS     = 1;    // one full loop through all languages

interface SplitWordProps {
  word: string;
  lang: string;
}

/** Renders each character with a stagger entrance animation */
function SplitWord({ word, lang }: SplitWordProps) {
  const chars = word.split("");

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* NOTE: no overflow-hidden here — chars animate via y from outside */}
      <div className="flex flex-wrap justify-center">
        {chars.map((char, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
            transition={{
              duration: 0.18,
              delay: i * 0.022,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="font-display font-black inline-block"
            style={{
              fontSize: "clamp(2.8rem, 10vw, 7rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #ffffff 0%, rgba(200,200,255,0.9) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: chars.length * 0.022 }}
        className="text-xs tracking-[0.35em] uppercase"
        style={{ color: "rgba(160,180,255,0.7)", fontFamily: "inherit" }}
      >
        {lang}
      </motion.span>
    </div>
  );
}

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "hello" | "exit">("loading");
  const [helloIndex, setHelloIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Phase 1: animate progress bar
  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      setProgress(p);
      if (p < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("hello");
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Phase 2: cycle hello words
  useEffect(() => {
    if (phase !== "hello") return;

    const totalSteps = Math.ceil(hellos.length * HELLO_ROUNDS);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setHelloIndex((prev) => (prev + 1) % hellos.length);
      if (step >= totalSteps) {
        clearInterval(interval);
        // linger on the last word a bit longer before exit
        setTimeout(() => setPhase("exit"), 900);
      }
    }, HELLO_INTERVAL);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: trigger exit → parent removes this overlay
  useEffect(() => {
    if (phase === "exit") {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#050508" }}
        >
          {/* Aurora WebGL background */}
          <div className="absolute inset-0 opacity-60">
            <Aurora
              colorStops={["#00d4ff", "#7c3aed", "#f472b6"]}
              amplitude={1.2}
              blend={0.45}
            />
          </div>

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.85) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 w-full px-6">

            {/* LOADING PHASE */}
            <AnimatePresence mode="wait">
              {phase === "loading" && (
                <motion.div
                  key="loading-content"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-8"
                >
                  {/* Logo mark */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <span className="font-display font-black text-4xl text-white">F</span>
                    </div>
                    {/* Spinning ring */}
                    <div
                      className="absolute -inset-2 rounded-3xl border-2 border-transparent animate-spin-slow"
                      style={{
                        background:
                          "linear-gradient(#050508, #050508) padding-box, linear-gradient(90deg, #00d4ff, #7c3aed, #f472b6, #00d4ff) border-box",
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm tracking-[0.25em] uppercase text-white/40">
                      Loading portfolio
                    </p>

                    {/* Progress bar */}
                    <div className="w-48 h-[2px] rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background:
                            "linear-gradient(90deg, #00d4ff, #7c3aed, #f472b6)",
                        }}
                      />
                    </div>

                    <p className="text-xs text-white/25 tabular-nums">
                      {Math.round(progress)}%
                    </p>
                  </div>
                </motion.div>
              )}

              {/* HELLO PHASE */}
              {phase === "hello" && (
                <motion.div
                  key="hello-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex items-center justify-center"
                  style={{ minHeight: "200px", padding: "0 5vw" }}
                >
                  <AnimatePresence mode="wait">
                    <SplitWord
                      key={hellos[helloIndex].word + helloIndex}
                      word={hellos[helloIndex].word}
                      lang={hellos[helloIndex].lang}
                    />
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-glow-pulse pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full animate-glow-pulse pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)", animationDelay: "1s" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
