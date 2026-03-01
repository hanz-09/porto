"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useSpring } from "framer-motion";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;     // degrees of max tilt
  glareOpacity?: number;     // 0–1
  scaleOnHover?: number;
}

/**
 * TiltedCard — CSS perspective + spring physics 3D card tilt with glare sheen.
 * Inspired by reactbits.dev/components/tilted-card
 */
export default function TiltedCard({
  children,
  className = "",
  tiltStrength = 14,
  glareOpacity = 0.12,
  scaleOnHover = 1.03,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const rotateX = useSpring(0, { stiffness: 240, damping: 22, mass: 0.6 });
  const rotateY = useSpring(0, { stiffness: 240, damping: 22, mass: 0.6 });
  const scale   = useSpring(1,  { stiffness: 240, damping: 22, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0–1
    const py = (e.clientY - rect.top)  / rect.height;  // 0–1

    rotateY.set((px - 0.5) * tiltStrength * 2);
    rotateX.set((0.5 - py) * tiltStrength * 2);
    setGlare({ x: px * 100, y: py * 100, opacity: glareOpacity });
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => scale.set(scaleOnHover)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Glare sheen overlay */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity * 2}) 0%, transparent 60%)`,
            transition: "opacity 0.2s",
            borderRadius: "inherit",
          }}
        />
      </div>
    </motion.div>
  );
}
