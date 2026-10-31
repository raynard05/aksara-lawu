"use client";

import React, { useEffect, useState, useRef } from "react";
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

/**
 * FlyingBirds Component — Autonomous Organic Flight
 * Burung terbang secara dinamis dan acak melintasi layar open world.
 * - Memilih koordinat tujuan acak di layar (tengah, pepohonan, atap warung, langit).
 * - Menyesuaikan arah hadap (kiri/kanan) otomatis sesuai arah geraknya.
 * - Kadang terbang cepat melintas, berputar santai, atau hinggap sejenak di pepohonan.
 */
export default function FlyingBirds({ className = "" }: { className?: string }) {
  const [birds, setBirds] = useState<BirdState[]>([
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
  ]);

  const birdsRef = useRef<BirdState[]>(birds);
  birdsRef.current = birds;

  useEffect(() => {
    let animId: number;

    const tick = () => {
      const updated = birdsRef.current.map((b) => {
        let { x, y, targetX, targetY, speed, facing, pauseTimer } = b;

        // Jika sedang jeda melayang/hinggap sejenak
        if (pauseTimer > 0) {
          return { ...b, pauseTimer: pauseTimer - 1 };
        }

        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);

        // Jika sudah dekat dengan target acak, tentukan target baru secara acak
        if (dist < 1.5) {
          // Pilih target acak baru di area layar tengah (x: 5vw s/d 92vw, y: 25vh s/d 75vh)
          const newTargetX = 5 + Math.random() * 87;
          const newTargetY = 25 + Math.random() * 50;

          // Kadang burung berhenti sejenak (15% kemungkinan jeda 20-60 frame)
          const newPause = Math.random() < 0.2 ? Math.floor(25 + Math.random() * 50) : 0;
          const newSpeed = 0.13 + Math.random() * 0.12;

          return {
            ...b,
            targetX: newTargetX,
            targetY: newTargetY,
            speed: newSpeed,
            pauseTimer: newPause,
          };
        }

        // Gerakkan menuju target
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;

        const nextX = x + vx;
        const nextY = y + vy;

        // Tentukan arah hadap berdasarkan pergerakan horizontal
        if (Math.abs(vx) > 0.03) {
          facing = vx > 0 ? "right" : "left";
        }

        return {
          ...b,
          x: nextX,
          y: nextY,
          facing,
        };
      });

      setBirds(updated);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={`ow-birds-sky-container ${className}`} aria-hidden="true">
      {birds.map((b) => (
        <div
          key={b.id}
          className="ow-bird-entity"
          style={{
            transform: `translate3d(${b.x}vw, ${b.y}vh, 0)`,
          }}
        >
          <img
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
