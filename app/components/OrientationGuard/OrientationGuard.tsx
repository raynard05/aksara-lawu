"use client";

import { useEffect, useState } from "react";
import { Smartphone, RotateCw } from "lucide-react";
import "./orientation-guard.css";

export default function OrientationGuard() {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  useEffect(() => {
    // Fungsi cek apakah orientasi saat ini adalah portrait
    const checkOrientation = () => {
      // Prioritaskan window.matchMedia untuk akurasi media query
      const isPortraitMedia = window.matchMedia("(orientation: portrait)").matches;
      // Sebagai penguat tambahan, cek rasio lebar vs tinggi
      const isPortraitAspect = window.innerHeight > window.innerWidth;

      setIsPortrait(isPortraitMedia || isPortraitAspect);
    };

    checkOrientation();

    // Event listener untuk perubahan orientasi layar & resize
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches || window.innerHeight > window.innerWidth);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      // Fallback browser lama
      mediaQuery.addListener(handleMediaChange);
    }

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Jika bukan mode portrait, sembunyikan screen guard
  if (!isPortrait) return null;

  return (
    <aside
      className="og-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-label="Pèngetan Orientasi Layar"
    >
      <div className="og-card">
        {/* Ornamen sudut bingkai kayu */}
        <span className="og-corner-ornament og-corner-tl" aria-hidden="true" />
        <span className="og-corner-ornament og-corner-tr" aria-hidden="true" />
        <span className="og-corner-ornament og-corner-bl" aria-hidden="true" />
        <span className="og-corner-ornament og-corner-br" aria-hidden="true" />

        {/* Wadah Animasi Rotasi HP */}
        <div className="og-device-anim-wrapper" aria-hidden="true">
          <Smartphone className="og-phone-icon" strokeWidth={2} />
        </div>

        {/* Judul & Pesan Teks Bahasa Jawa */}
        <h2 className="og-title">Miringna Perangkat</h2>
        <p className="og-message">
          Miringna perangkatmu kanggo dolanan game iki, amarga game Aksara Lawu lumaku luwih apik ing{" "}
          <span className="og-highlight">mode landscape</span>.
        </p>

        {/* Badge Penunjuk Mode Landscape */}
        <div className="og-badge">
          <RotateCw className="og-badge-icon" strokeWidth={2.5} />
          <span>MODE LANDSCAPE</span>
        </div>
      </div>
    </aside>
  );
}
