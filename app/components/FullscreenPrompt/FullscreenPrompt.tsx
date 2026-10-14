"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import "./fullscreen-prompt.css";

import chibiSrc from "../../../assets/character/chibi.png";

export default function FullscreenPrompt() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  /* Cek apakah browser support fullscreen API */
  const isSupported =
    typeof document !== "undefined" &&
    (document.documentElement.requestFullscreen !== undefined ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document.documentElement as any).webkitRequestFullscreen !== undefined);

  /* Tampilkan overlay hanya jika belum fullscreen */
  useEffect(() => {
    if (!isSupported) return;

    const checkFullscreen = () => {
      const isFull =
        !!document.fullscreenElement ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(document as any).webkitFullscreenElement;
      setVisible(!isFull);
    };

    checkFullscreen();

    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
    };
  }, [isSupported]);

  /* Handler: tap/klik → request fullscreen → fade-out overlay */
  const handleTap = useCallback(async () => {
    if (!isSupported) return;

    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (el as any).webkitRequestFullscreen();
      }
    } catch {
      /* User mungkin menolak — tetap dismiss overlay */
    }

    /* Jalankan animasi fade-out dulu, baru hide */
    setHiding(true);
    setTimeout(() => {
      setVisible(false);
      setHiding(false);
    }, 420);
  }, [isSupported]);

  if (!visible) return null;

  return (
    <div
      className={`fsp-overlay${hiding ? " fsp-hiding" : ""}`}
      onClick={handleTap}
      role="button"
      aria-label="Tutul kanggo mlebu layar kebak"
    >
      <div className="fsp-card">
        <Image
            src={chibiSrc}
            alt="Karakter chibi petualang"
            className="fsp-icon"
            width={160}
            height={160}
            priority
          />
        <h2 className="fsp-title">TUTUL KANGGO MIWITI</h2>
        <p className="fsp-sub">Pencet ngendi wae kanggo mlebu layar kebak</p>
        <div className="fsp-tap-ring" aria-hidden="true" />
      </div>
    </div>
  );
}
