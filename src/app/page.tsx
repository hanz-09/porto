"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import Quote from "@/components/Quote";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ChapterNav from "@/components/ChapterNav";
import { useAppState } from "@/components/AppStateProvider";

export default function Home() {
  const { hasLoaded } = useAppState();

  return (
    <>
      <AnimatePresence>
        {hasLoaded && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Global scroll-driven UI */}
            <ScrollProgressBar />

            <Hero />
            <About />
            <Timeline />
            <Skills />
            <Quote />
            <Contact />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
