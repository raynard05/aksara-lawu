"use client";

import React from "react";
import "./flying-eagle.css";

export type EagleFlightMode = "cross" | "soar" | "hover" | "map-circle";

interface FlyingEagleProps {
  mode?: EagleFlightMode;
  showRoute?: boolean; // Tampilkan garis lingkaran merah penanda rute terbang
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FlyingEagle Component
 * Menampilkan animasi elang terbang realistis dari file GIF transparan
 * (/eagle/eagle_fly.gif) yang dihasilkan dari sprite sheet assets/eagle/eagle.png.
 * 
 * Mode terbang:
 * - "map-circle": Terbang melingkari area papan peta (maps.webp) dengan rute panduan merah
 * - "cross": Meluncur diagonal melintasi angkasa dari kiri atas ke kanan bawah
 * - "soar": Berputar anggun di atas langit pegunungan (circling)
 * - "hover": Melayang stabil di tempat dengan desiran angin lembut
 */
export default function FlyingEagle({
  mode = "map-circle",
  showRoute = true,
  className = "",
  style,
}: FlyingEagleProps) {
  const getModeClass = () => {
    switch (mode) {
      case "map-circle":
        return "eagle-path-map-circle";
      case "soar":
        return "eagle-path-soar";
      case "hover":
        return "eagle-path-hover";
      case "cross":
      default:
        return "eagle-path-cross";
    }
  };

  // Jika mode map-circle, render orbit melingkari peta di dalam container peta
  if (mode === "map-circle") {
    return (
      <div className={`eagle-map-orbit-container ${className}`} style={style} aria-hidden="true">
        {/* Garis lintasan lingkaran/elips merah penanda rute terbang elang */}
        {showRoute && (
          <div className="eagle-map-route-indicator" title="Rute Lingkaran Elang">
            <span className="eagle-map-route-label">RUTE ELANG</span>
          </div>
        )}

        {/* Elang bergerak mengikuti orbit lingkaran di atas peta */}
        <div className="eagle-map-orbit-track">
          <div className="eagle-map-flyer">
            <img
              src="/eagle/eagle_fly.gif"
              alt="Elang Jawa Mabur"
              className="eagle-img"
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="eagle-sky-container" aria-hidden="true">
      <div
        className={`eagle-entity ${getModeClass()} ${className}`}
        style={style}
      >
        <img
          src="/eagle/eagle_fly.gif"
          alt="Elang Jawa Mabur"
          className="eagle-img"
          draggable={false}
        />
      </div>
    </div>
  );
}
