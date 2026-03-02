"use client";

/**
 * TextType — Faithful recreation of reactbits.dev/text-animations/text-type
 *
 * Cycles through an array of words, typing each character out one-by-one,
 * pausing, then erasing — with a blinking cursor throughout.
 */

import { useEffect, useState } from "react";

interface TextTypeProps {
  words: string[];
  /** ms between each character typed */
  typingSpeed?: number;
  /** ms between each character erased */
  deletingSpeed?: number;
  /** ms to pause after finishing typing a word */
  pauseAfterType?: number;
  /** ms to pause after finishing erasing a word */
  pauseAfterDelete?: number;
  className?: string;
  cursorClassName?: string;
  /** Inline style applied to the text span — use this for gradient text */
  textStyle?: React.CSSProperties;
}

export default function TextType({
  words,
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseAfterType = 1600,
  pauseAfterDelete = 400,
  className = "",
  cursorClassName = "",
  textStyle,
}: TextTypeProps) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "pauseDelete">("typing");
  const [charIndex, setCharIndex] = useState(0);
  const [blink, setBlink] = useState(true);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const word = words[wordIndex % words.length];

    if (phase === "typing") {
      if (charIndex < word.length) {
        const id = setTimeout(() => {
          setDisplayed(word.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, typingSpeed);
        return () => clearTimeout(id);
      } else {
        const id = setTimeout(() => setPhase("pausing"), pauseAfterType);
        return () => clearTimeout(id);
      }
    }

    if (phase === "pausing") {
      setPhase("deleting");
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        const id = setTimeout(() => {
          setDisplayed(word.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, deletingSpeed);
        return () => clearTimeout(id);
      } else {
        const id = setTimeout(() => {
          setPhase("pauseDelete");
        }, pauseAfterDelete);
        return () => clearTimeout(id);
      }
    }

    if (phase === "pauseDelete") {
      setWordIndex((i) => (i + 1) % words.length);
      setPhase("typing");
    }
  }, [phase, charIndex, wordIndex, words, typingSpeed, deletingSpeed, pauseAfterType, pauseAfterDelete]);

  return (
    <span
      className={`inline-flex items-baseline gap-px ${className}`}
      style={{ minHeight: "1.2em" }}
    >
      <span style={textStyle}>{displayed}</span>
      <span
        aria-hidden
        className={`inline-block w-[2px] rounded-full ${cursorClassName}`}
        style={{
          height: "0.88em",
          opacity: blink ? 1 : 0,
          transition: "opacity 0.1s",
          verticalAlign: "baseline",
          marginBottom: "0.05em",
        }}
      />
    </span>
  );
}
