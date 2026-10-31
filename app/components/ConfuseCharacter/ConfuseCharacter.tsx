"use client";

import React, { useState, useEffect } from "react";
import "./confuse-character.css";

interface ConfuseCharacterProps {
  x?: number; // Posisi persentase horizontal (%)
  y?: number; // Posisi persentase vertikal (%)
  name?: string;
  onClick?: () => void;
  className?: string;
  poseIntervalMs?: number;
  showTriggerZone?: boolean;
}

const CONFUSE_FRAMES = [
  "/character/confusecharacter/1.png",
  "/character/confusecharacter/2.png",
  "/character/confusecharacter/3.png",
];

export default function ConfuseCharacter({
  x = 60,
  y = 48,
  name = "Pendaki Bingung",
  onClick,
  className = "",
  poseIntervalMs = 800,
  showTriggerZone = true,
}: ConfuseCharacterProps) {
  const [frameIndex, setFrameIndex] = useState<number>(0);

  // Animasi pergantian frame pose bingung secara halus
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % CONFUSE_FRAMES.length);
    }, poseIntervalMs);

    return () => clearInterval(timer);
  }, [poseIntervalMs]);

  return (
    <div
      className={`confuse-char-entity ${className}`.trim()}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={name}
      title="Klik kanggo komunikasi karo pendaki sing bingung"
    >
      {/* Range Lingkaran Merah Interaksi */}
      {showTriggerZone && <div className="confuse-char-trigger-zone" aria-hidden="true" />}

      {/* Nametag Pendaki Bingung dengan Big ? Emoji di dalamnya */}
      <div className="confuse-char-nametag">
        <span className="confuse-char-nametag-emoji">❓</span>
        <span className="confuse-char-nametag-text">{name}</span>
      </div>

      {/* Sprite Karakter dengan Animasi Frame Bingung */}
      <div className="confuse-char-sprite-wrap">
        <img
          src={CONFUSE_FRAMES[frameIndex]}
          alt={name}
          className="confuse-char-sprite"
          draggable={false}
        />
        {/* Bayangan di tanah */}
        <div className="confuse-char-shadow" />
        {/* Lingkaran merah kecil di bawah kaki karakter */}
        <div className="confuse-char-hitbox" />
      </div>
    </div>
  );
}
