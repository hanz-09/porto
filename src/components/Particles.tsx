"use client";

import React, { useRef, useEffect } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

interface ParticlesProps {
  particleColors?: string[];
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string; // Add className
}

type Particle = {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
};

export default function Particles({
  particleColors = ["#ffffff"],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = true,
  alphaParticles = true,
  disableRotation = false,
  pixelRatio,
  className = "",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rotation = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Keep track of configs without restarting the animation loop
  const config = useRef({
    moveParticlesOnHover,
    alphaParticles,
    disableRotation,
    speed,
  });

  useEffect(() => {
    config.current = { moveParticlesOnHover, alphaParticles, disableRotation, speed };
  }, [moveParticlesOnHover, alphaParticles, disableRotation, speed]);

  const dpr = typeof window !== "undefined" ? pixelRatio || window.devicePixelRatio || 1 : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    startAnimation();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particleCount, particleColors, particleSpread, particleBaseSize]);

  useEffect(() => {
    if (config.current.moveParticlesOnHover && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      mouse.current.x = x;
      mouse.current.y = y;
    }
  }, [mousePosition.x, mousePosition.y]);

  const initCanvas = () => {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current) return;

    canvasSize.current.w = canvasContainerRef.current.offsetWidth;
    canvasSize.current.h = canvasContainerRef.current.offsetHeight;
    canvasRef.current.width = canvasSize.current.w * dpr;
    canvasRef.current.height = canvasSize.current.h * dpr;
    canvasRef.current.style.width = `${canvasSize.current.w}px`;
    canvasRef.current.style.height = `${canvasSize.current.h}px`;
    context.current.scale(dpr, dpr);

    // Initialize particles in a 3D volume
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      const spreadFactor = particleSpread / 10;
      const x = (Math.random() - 0.5) * canvasSize.current.w * 1.5 * spreadFactor;
      const y = (Math.random() - 0.5) * canvasSize.current.h * 1.5 * spreadFactor;
      const z = (Math.random() - 0.5) * 2000 * spreadFactor;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const size = (Math.random() * particleBaseSize) / 50 + 0.5;
      particles.current.push({ x, y, z, color, size });
    }
  };

  const animate = () => {
    if (!context.current || !canvasSize.current.w) return;

    context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);

    const centerX = canvasSize.current.w / 2;
    const centerY = canvasSize.current.h / 2;

    if (!config.current.disableRotation) {
      rotation.current += config.current.speed * 0.01;
    }

    let mouseOffsetX = 0;
    let mouseOffsetY = 0;
    if (config.current.moveParticlesOnHover) {
      mouseOffsetX = mouse.current.x * 0.2;
      mouseOffsetY = mouse.current.y * 0.2;
    }

    particles.current.forEach((p) => {
      const cosY = Math.cos(rotation.current);
      const sinY = Math.sin(rotation.current);

      const rotX = p.x * cosY - p.z * sinY;
      const rotZ = p.z * cosY + p.x * sinY;

      const adjustedX = rotX - mouseOffsetX;
      const adjustedY = p.y - mouseOffsetY;

      const fov = 800; // Field of view equivalent
      const cameraZ = 1000;
      const zPos = rotZ + cameraZ;

      if (zPos < 10) return; // Behind camera

      const scale = fov / zPos;
      const projX = centerX + adjustedX * scale;
      const projY = centerY + adjustedY * scale;

      const projectedSize = p.size * scale;

      context.current!.beginPath();
      context.current!.arc(projX, projY, projectedSize, 0, Math.PI * 2);

      if (config.current.alphaParticles) {
        // Depth-based fading
        const alpha = Math.max(0, Math.min(1, 1 - (zPos - fov) / 2000));
        context.current!.globalAlpha = alpha;
      } else {
        context.current!.globalAlpha = 1;
      }

      context.current!.fillStyle = p.color;
      context.current!.fill();
    });

    animationFrameId.current = window.requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animate();
  };

  return (
    <div className={`pointer-events-none ${className}`} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
