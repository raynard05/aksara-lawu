"use client";

import React, { memo } from "react";
import "./spot-target.css";

interface SpotTargetProps {
  id: number;
  x: number; // Persentase X (%)
  y: number; // Persentase Y (%)
  isRepaired: boolean;
  resultImage: string; // "/openworld2/arah1.webp" atau "/openworld2/arah2.webp"
  label: string;
  isPlayerNear?: boolean;
  onClick?: () => void;
}

function SpotTargetComponent({
  id,
  x,
  y,
  isRepaired,
  resultImage,
  label,
  isPlayerNear = false,
  onClick,
}: SpotTargetProps) {
  return (
    <div
      className={`ow2-spot-container ${isPlayerNear ? "ow2-spot-near" : ""}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={!isRepaired && isPlayerNear ? onClick : undefined}
      aria-label={`${label} ${isRepaired ? "(Wis Kasang)" : "(Kudu Didandani)"}`}
    >
      {/* Jika belum diperbaiki: Tampilkan zona kuning & icon segitiga terbalik bounce */}
      {!isRepaired ? (
        <>
          {/* Zona Lingkaran Kuning Pemicu Interaksi */}
          <div className="ow2-spot-zone" />

          {/* Label Status */}
          <div className="ow2-spot-label">
            <span>{label}</span>
          </div>

          {/* Ikon Target Segitiga Terbalik Bounce */}
          <div className="ow2-spot-target-icon-wrap">
            <img
              src="/labirin_pendakian/target.webp"
              alt="Titik Pasang Papan Arah"
              className="ow2-spot-target-icon"
              draggable={false}
            />
          </div>

          {/* Base Puing Kayu Rusak */}
          <div className="ow2-spot-broken-base" />
        </>
      ) : (
        /* Jika sudah diperbaiki: Tampilkan Papan Pituduh Arah (arah1.webp / arah2.webp) */
        <div className="ow2-spot-sign-wrap">
          <div className="ow2-spot-label ow2-spot-label-fixed">
            <span>✓ {label}</span>
          </div>
          <img
            src={resultImage}
            alt={label}
            className="ow2-spot-sign-img"
            draggable={false}
          />
          <div className="ow2-spot-sign-shadow" />
        </div>
      )}
    </div>
  );
}

// Mengikuti POIN 6 OPTIMASI_OPENWORLD.txt: Bungkus dengan React.memo
export default memo(SpotTargetComponent);

