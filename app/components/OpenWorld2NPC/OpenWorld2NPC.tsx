"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import "./openworld2-npc.css";

interface OpenWorld2NPCProps {
  x: number; // Persentase X (%)
  y: number; // Persentase Y (%)
  name: string;
  type: "penjaga" | "pendaki";
  avatarImg: string;
  isInteracting: boolean;
  showTriggerZone?: boolean;
  patrolDirection?: "kiri" | "kanan"; // Arah utama jalan patroli
  onClick?: () => void;
}

// Frame daftar file asset sprite untuk masing-masing NPC
const SPRITE_SETS = {
  penjaga: {
    diam: [
      "/openworld2/penjaga/diam1.webp",
      "/openworld2/penjaga/diam2.webp",
      "/openworld2/penjaga/diam3.webp",
      "/openworld2/penjaga/diam4.webp",
    ],
    interaksi: [
      "/openworld2/penjaga/interaksi1.webp",
      "/openworld2/penjaga/interaksi2.webp",
      "/openworld2/penjaga/interaksi3.webp",
      "/openworld2/penjaga/interaksi4.webp",
      "/openworld2/penjaga/interaksi5.webp",
    ],
    kiri: [
      "/openworld2/penjaga/kiri1.webp",
      "/openworld2/penjaga/kiri2.webp",
      "/openworld2/penjaga/kiri3.webp",
      "/openworld2/penjaga/kiri4.webp",
      "/openworld2/penjaga/kiri5.webp",
      "/openworld2/penjaga/kiri6.webp",
      "/openworld2/penjaga/kiri7.webp",
      "/openworld2/penjaga/kiri8.webp",
    ],
    kanan: [
      "/openworld2/penjaga/kanan1.webp",
      "/openworld2/penjaga/kanan2.webp",
      "/openworld2/penjaga/kanan3.webp",
      "/openworld2/penjaga/kanan4.webp",
      "/openworld2/penjaga/kanan5.webp",
      "/openworld2/penjaga/kanan6.webp",
      "/openworld2/penjaga/kanan7.webp",
      "/openworld2/penjaga/kanan8.webp",
    ],
  },
  pendaki: {
    diam: [
      "/openworld2/pendakiprofesional/diam1.webp",
      "/openworld2/pendakiprofesional/diam2.webp",
      "/openworld2/pendakiprofesional/diam3.webp",
    ],
    interaksi: [
      "/openworld2/pendakiprofesional/interaksi1.webp",
      "/openworld2/pendakiprofesional/interaksi2.webp",
      "/openworld2/pendakiprofesional/interaksi3.webp",
      "/openworld2/pendakiprofesional/interaksi4.webp",
      "/openworld2/pendakiprofesional/interaksi5.webp",
      "/openworld2/pendakiprofesional/interaksi6.webp",
    ],
    kiri: [
      "/openworld2/pendakiprofesional/kiri1.webp",
      "/openworld2/pendakiprofesional/kiri2.webp",
      "/openworld2/pendakiprofesional/kiri3.webp",
      "/openworld2/pendakiprofesional/kiri4.webp",
      "/openworld2/pendakiprofesional/kiri5.webp",
      "/openworld2/pendakiprofesional/kiri6.webp",
      "/openworld2/pendakiprofesional/kiri7.webp",
    ],
    kanan: [
      "/openworld2/pendakiprofesional/kanan1.webp",
      "/openworld2/pendakiprofesional/kanan2.webp",
      "/openworld2/pendakiprofesional/kanan3.webp",
      "/openworld2/pendakiprofesional/kanan4.webp",
      "/openworld2/pendakiprofesional/kanan5.webp",
      "/openworld2/pendakiprofesional/kanan6.webp",
      "/openworld2/pendakiprofesional/kanan7.webp",
    ],
  },
};

function OpenWorld2NPCComponent({
  x,
  y,
  name,
  type,
  avatarImg,
  isInteracting,
  showTriggerZone = true,
  patrolDirection,
  onClick,
}: OpenWorld2NPCProps) {
  const currentSet = SPRITE_SETS[type] || SPRITE_SETS.penjaga;
  const [spriteSrc, setSpriteSrc] = useState<string>(currentSet.diam[0]);
  const [offsetXPct, setOffsetXPct] = useState<number>(0);

  // Arah patroli utama: Pak Agus default 'kanan', Rinda default 'kiri'
  const primaryDirection: "kiri" | "kanan" =
    patrolDirection || (type === "penjaga" ? "kanan" : "kiri");

  // Animasi Siklus Patroli & Interaksi
  useEffect(() => {
    let animTimer: NodeJS.Timeout | null = null;
    let frameIdx = 0;

    if (isInteracting) {
      // Saat interaksi aktif: putar animasi interaksi (tangan ke depan)
      const interaksiFrames = currentSet.interaksi;
      animTimer = setInterval(() => {
        frameIdx = (frameIdx + 1) % interaksiFrames.length;
        setSpriteSrc(interaksiFrames[frameIdx]);
      }, 180);
    } else {
      // Siklus patroli santai:
      // - Pak Agus (kanan): Diam -> Jalan ke KANAN -> Diam -> Jalan kembali ke KIRI
      // - Rinda (kiri): Diam -> Jalan ke KIRI -> Diam -> Jalan kembali ke KANAN
      let phase: "diam1" | "primary" | "diam2" | "return" = "diam1";
      let stepCount = 0;
      let currentOffset = 0;

      animTimer = setInterval(() => {
        if (phase === "diam1") {
          frameIdx = (frameIdx + 1) % currentSet.diam.length;
          setSpriteSrc(currentSet.diam[frameIdx]);
          stepCount++;
          if (stepCount >= 12) {
            phase = "primary";
            stepCount = 0;
            frameIdx = 0;
          }
        } else if (phase === "primary") {
          if (primaryDirection === "kanan") {
            // Agus: berjalan ke KANAN
            frameIdx = (frameIdx + 1) % currentSet.kanan.length;
            setSpriteSrc(currentSet.kanan[frameIdx]);
            currentOffset += 0.12;
          } else {
            // Rinda: berjalan ke KIRI
            frameIdx = (frameIdx + 1) % currentSet.kiri.length;
            setSpriteSrc(currentSet.kiri[frameIdx]);
            currentOffset -= 0.12;
          }
          setOffsetXPct(currentOffset);
          stepCount++;
          if (stepCount >= 16) {
            phase = "diam2";
            stepCount = 0;
            frameIdx = 0;
          }
        } else if (phase === "diam2") {
          frameIdx = (frameIdx + 1) % currentSet.diam.length;
          setSpriteSrc(currentSet.diam[frameIdx]);
          stepCount++;
          if (stepCount >= 10) {
            phase = "return";
            stepCount = 0;
            frameIdx = 0;
          }
        } else if (phase === "return") {
          if (primaryDirection === "kanan") {
            // Agus: kembali ke KIRI ke titik semula
            frameIdx = (frameIdx + 1) % currentSet.kiri.length;
            setSpriteSrc(currentSet.kiri[frameIdx]);
            currentOffset -= 0.12;
          } else {
            // Rinda: kembali ke KANAN ke titik semula
            frameIdx = (frameIdx + 1) % currentSet.kanan.length;
            setSpriteSrc(currentSet.kanan[frameIdx]);
            currentOffset += 0.12;
          }
          setOffsetXPct(currentOffset);
          stepCount++;
          if (stepCount >= 16) {
            phase = "diam1";
            stepCount = 0;
            frameIdx = 0;
            setOffsetXPct(0);
          }
        }
      }, 160);
    }

    return () => {
      if (animTimer) clearInterval(animTimer);
    };
  }, [isInteracting, currentSet, primaryDirection]);

  return (
    <div
      className="ow2-npc-entity"
      style={{
        left: `${x + offsetXPct}%`,
        top: `${y}%`,
        transform: "translate(-50%, -100%)",
      }}
      onClick={onClick}
    >
      {/* Zona Pemicu Lingkaran Kuning Berdenyut */}
      {showTriggerZone && <div className="ow2-npc-trigger-zone" />}

      {/* Nametag Nama & Avatar Karakter */}
      <div className="ow2-npc-nametag">
        <img
          src={avatarImg}
          alt={name}
          className="ow2-npc-nametag-icon"
          draggable={false}
        />
        <span className="ow2-npc-nametag-text">{name}</span>
      </div>

      {/* Sprite Karakter */}
      <div className="ow2-npc-sprite-wrap">
        <img
          src={spriteSrc}
          alt={name}
          className="ow2-npc-sprite-img"
          draggable={false}
        />
        <div className="ow2-npc-shadow" />
      </div>
    </div>
  );
}

// Mengikuti POIN 6 OPTIMASI_OPENWORLD.txt: Bungkus dengan React.memo
export default memo(OpenWorld2NPCComponent);

