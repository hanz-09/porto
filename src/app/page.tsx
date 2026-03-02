"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ChapterNav from "@/components/ChapterNav";

// LoadingScreen uses WebGL + dynamic imports, load client-side only
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loading Overlay */}
      <LoadingScreen onDone={() => setLoaded(true)} />

      {/* Main Content — reveal after loader exits */}
      <AnimatePresence>
        {loaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Global scroll-driven UI */}
            <ScrollProgressBar />

            <Navbar />
            <Hero />
            <About />
            <Timeline />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
