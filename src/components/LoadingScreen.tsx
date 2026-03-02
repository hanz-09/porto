"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


// "Hello" in 20 languages
// "Hello" in 8 languages to keep the sequence short but sweet
const hellos = [
  { word: "Hello",      lang: "English" },
  { word: "Hola",       lang: "Spanish" },
  { word: "Bonjour",    lang: "French" },
  { word: "Ciao",       lang: "Italian" },
  { word: "こんにちは",  lang: "Japanese" },
  { word: "Hallo",      lang: "German" },
  { word: "안녕하세요",  lang: "Korean" },
  { word: "Halo",       lang: "Indonesian" },
];

// Duration config (ms)
const LOADING_DURATION = 4500; // fake progress bar fills in this time (slower, more realistic)
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
    let timeoutId: NodeJS.Timeout;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min((elapsed / LOADING_DURATION) * 100, 100);
      setProgress(p);
      if (p < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        timeoutId = setTimeout(() => {
          setPhase("hello");
        }, 1000);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Phase 2: cycle hello words
  useEffect(() => {
    if (phase !== "hello") return;

    const interval = setInterval(() => {
      setHelloIndex((prev) => {
        const next = prev + 1;
        if (next >= hellos.length) {
          clearInterval(interval);
          // linger on the last word a bit longer before exit
          setTimeout(() => setPhase("exit"), 900);
          return prev; // keep showing the last word while lingering
        }
        return next;
      });
    }, HELLO_INTERVAL);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: trigger exit → parent removes this overlay
  useEffect(() => {
    if (phase === "exit") {
      const t = setTimeout(onDone, 1000); // Wait 1s for the slide-up animation
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="loader"
          // We apply a rounded bottom border specifically during the exit animation
          initial={{ y: "0%", borderBottomLeftRadius: "0%", borderBottomRightRadius: "0%" }}
          exit={{ y: "-100%", borderBottomLeftRadius: "100%", borderBottomRightRadius: "100%" }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden origin-top"
          style={{ background: "#000000" }} // True black for max contrast during the slide-up reveal
        >
          {/* Pure CSS Animated Mesh Gradient Background (Mobile Stable) */}
          <div className="absolute inset-0 opacity-40 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px]"
              style={{ background: "#00d4ff" }}
              animate={{
                x: ["0%", "20%", "-10%", "0%"],
                y: ["0%", "10%", "-20%", "0%"],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px]"
              style={{ background: "#7c3aed" }}
              animate={{
                x: ["0%", "-25%", "15%", "0%"],
                y: ["0%", "-15%", "25%", "0%"],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-[20%] left-[10%] w-[80vw] h-[80vw] rounded-full mix-blend-screen filter blur-[120px]"
              style={{ background: "#f472b6" }}
              animate={{
                x: ["0%", "15%", "-25%", "0%"],
                y: ["0%", "-20%", "10%", "0%"],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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
                    <p className="text-sm tracking-[0.25em] relative uppercase text-white font-bold h-5 flex items-center justify-center w-full">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={
                            progress < 20
                              ? "init"
                              : progress < 50
                              ? "assets"
                              : progress < 85
                              ? "modules"
                              : progress < 99
                              ? "almost"
                              : "done"
                          }
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute whitespace-nowrap"
                        >
                          {progress < 20
                            ? "INITIALIZING CORE ENGINE"
                            : progress < 50
                            ? "LOADING HIGH-RES ASSETS"
                            : progress < 85
                            ? "COMPILING UI MODULES"
                            : progress < 99
                            ? "ALMOST DONE..."
                            : "HERE WE GO!"}
                        </motion.span>
                      </AnimatePresence>
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
