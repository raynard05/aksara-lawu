"use client";

import React, { useEffect, useState } from "react";
import "./hpbar.css";

interface HpBarProps {
  /**
   * Jumlah HP saat ini (0 sampai maxHp)
   */
  currentHp: number;
  /**
   * Jumlah maksimal HP (default 100 atau 4 kesempatan = 100)
   */
  maxHp?: number;
  /**
   * Trigger getar saat salah menjawab
   */
  isShaking?: boolean;
  /**
   * Avatar key dari penyimpanan (misal "avatar1.webp", "avatar2.webp", dst.)
   */
  avatarId?: string;
  className?: string;
}

export default function HpBar({
  currentHp,
  maxHp = 100,
  isShaking = false,
  avatarId,
  className = "",
}: HpBarProps) {
  const [resolvedAvatarNum, setResolvedAvatarNum] = useState<number>(1);

  // Deteksi avatar pemain yang dipilih di cemoro sewu (avatar1, avatar2, avatar3, avatar4)
  useEffect(() => {
    try {
      let av = avatarId;
      if (!av) {
        av =
          sessionStorage.getItem("aksara_lawu_selected_avatar") ||
          localStorage.getItem("aksara_lawu_selected_avatar") ||
          "avatar1.webp";
      }

      // Ambil angka dari string avatar (misal: "avatar3.webp" -> 3, "hp3" -> 3)
      const match = av.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num >= 1 && num <= 4) {
          setResolvedAvatarNum(num);
          return;
        }
      }
      setResolvedAvatarNum(1);
    } catch {
      setResolvedAvatarNum(1);
    }
  }, [avatarId]);

  // Persentase HP untuk bar progress
  const clampedHp = Math.max(0, Math.min(currentHp, maxHp));
  const hpPercentage = (clampedHp / maxHp) * 100;

  return (
    <div
      className={`hpbar-container ${isShaking ? "hpbar-shake" : ""} ${className}`}
      aria-label={`HP Pemain: ${clampedHp} dari ${maxHp}`}
    >
      {/* 1. Avatar Bulat Lingkaran di Kiri Menempel ke Bar */}
      <div className="hpbar-avatar-wrapper">
        <img
          src={`/assets/hp_bar/hp${resolvedAvatarNum}.png`}
          alt={`Avatar Pemain HP ${resolvedAvatarNum}`}
          className="hpbar-avatar-img"
          draggable={false}
        />
      </div>

      {/* 2. Papan Bar Kayu Coklat (assets/hp_bar/bar.png) */}
      <div className="hpbar-board-wrap">
        <img
          src="/assets/hp_bar/bar.png"
          alt="HP Bar Background"
          className="hpbar-board-bg"
          draggable={false}
        />

        {/* Teks HP / Nilai HP di atas bar */}
        <div className="hpbar-header-row">
          {/* Angka HP: misal "80 / 100" */}
          <span className="hpbar-score-text">
            {clampedHp} / {maxHp}
          </span>
        </div>

        {/* Track Bar Hijau */}
        <div className="hpbar-track">
          <div
            className="hpbar-fill"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
