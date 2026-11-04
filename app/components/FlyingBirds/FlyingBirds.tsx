"use client";

import React, { useEffect, useRef, memo } from "react";
import "./flying-birds.css";

interface BirdState {
  id: number;
  x: number;       // Posisi horizontal saat ini (vw)
  y: number;       // Posisi vertikal saat ini (vh)
  targetX: number; // Tujuan terbang X (vw)
  targetY: number; // Tujuan terbang Y (vh)
  speed: number;   // Kecepatan terbang
  facing: "left" | "right";
  scale: number;   // Variasi ukuran kedalaman perspektif
  opacity: number;
  pauseTimer: number; // Jeda hinggap/melayang di pohon sejenak
}

const INITIAL_BIRDS: BirdState[] = [
  {
    id: 1,
    x: 10,
    y: 42,
    targetX: 45,
    targetY: 48,
    speed: 0.18,
    facing: "right",
    scale: 1,
    opacity: 1,
    pauseTimer: 0,
  },
  {
    id: 2,
    x: 85,
    y: 38,
    targetX: 55,
    targetY: 34,
    speed: 0.14,
    facing: "left",
    scale: 0.88,
    opacity: 0.95,
    pauseTimer: 0,
  },
  {
    id: 3,
    x: 50,
    y: 65,
    targetX: 75,
    targetY: 52,
    speed: 0.16,
    facing: "right",
    scale: 0.94,
    opacity: 1,
    pauseTimer: 20,
  },
];

/**
 * FlyingBirds Component — Autonomous Organic Flight (GPU Direct DOM Optimized)
 * Burung terbang secara dinamis tanpa memicu re-render React (Zero React State).
 * Manipulasi koordinat langsung ke DOM style transform translate3d di GPU compositor thread.
 */
function FlyingBirds({ className = "" }: { className?: string }) {
  const birdsDataRef = useRef<BirdState[]>(
    INITIAL_BIRDS.map((b) => ({ ...b }))
  );
  const birdEntityRefs = useRef<(HTMLDivElement | null)[]>([]);
  const birdSpriteRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    let animId: number;

    const tick = () => {
      const birds = birdsDataRef.current;

      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];

        // Jika sedang jeda melayang/hinggap sejenak
        if (b.pauseTimer > 0) {
          b.pauseTimer -= 1;
          continue;
        }

        const dx = b.targetX - b.x;
        const dy = b.targetY - b.y;
        const dist = Math.hypot(dx, dy);

        // Jika sudah dekat dengan target acak, tentukan target baru secara acak
        if (dist < 1.5) {
          b.targetX = 5 + Math.random() * 87;
          b.targetY = 25 + Math.random() * 50;
          b.pauseTimer = Math.random() < 0.2 ? Math.floor(25 + Math.random() * 50) : 0;
          b.speed = 0.13 + Math.random() * 0.12;
          continue;
        }

        // Gerakkan menuju target
        const vx = (dx / dist) * b.speed;
        const vy = (dy / dist) * b.speed;

        b.x += vx;
        b.y += vy;

        // Tentukan arah hadap berdasarkan pergerakan horizontal
        const prevFacing = b.facing;
        if (Math.abs(vx) > 0.03) {
          b.facing = vx > 0 ? "right" : "left";
        }

        // Update DOM transform langsung tanpa React re-render
        const entityEl = birdEntityRefs.current[i];
        if (entityEl) {
          entityEl.style.transform = `translate3d(${b.x}vw, ${b.y}vh, 0)`;
        }

        if (prevFacing !== b.facing) {
          const spriteEl = birdSpriteRefs.current[i];
          if (spriteEl) {
            spriteEl.style.transform = b.facing === "right" ? "scaleX(-1)" : "scaleX(1)";
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={`ow-birds-sky-container ${className}`} aria-hidden="true">
      {INITIAL_BIRDS.map((b, idx) => (
        <div
          key={b.id}
          ref={(el) => {
            birdEntityRefs.current[idx] = el;
          }}
          className="ow-bird-entity"
          style={{
            transform: `translate3d(${b.x}vw, ${b.y}vh, 0)`,
          }}
        >
          <img
            ref={(el) => {
              birdSpriteRefs.current[idx] = el;
            }}
            src="/bird/bird_fly.gif"
            alt=""
            className={`ow-bird-sprite ${b.facing === "left" ? "face-left" : "face-right"}`}
            style={{
              transform: b.facing === "right" ? "scaleX(-1)" : "scaleX(1)",
              width: `${6.6 * b.scale}vh`,
              height: `${6.6 * b.scale}vh`,
              opacity: b.opacity,
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export default memo(FlyingBirds);
