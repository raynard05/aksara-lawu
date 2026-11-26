"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ArrowLeft } from "lucide-react";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import "./openworld3-tugu.css";

type TuguScene = "kosong" | "done";

const PAK_AGUS_DONE_DIALOGS: DialogItem[] = [
  {
    id: 1,
    speakerName: "Pak Agus (Penjaga Pos)",
    character: "/openworld2/penjagapos.webp",
    text: "Slamet ya pendaki!",
  },
  {
    id: 2,
    speakerName: "Pak Agus (Penjaga Pos)",
    character: "/openworld2/penjagapos.webp",
    text: "Saiki tugune wis jangkep!",
  },
  {
    id: 3,
    speakerName: "Pak Agus (Penjaga Pos)",
    character: "/openworld2/penjagapos.webp",
    text: "Akses menyang Warung Ngaso wis kebukak!",
  },
];

function playTuguAudio(type: "tick" | "victory") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(340, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.1;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    }
  } catch {
    // ignore
  }
}

export default function OpenWorld3TuguPage() {
  const router = useRouter();

  const [scene, setScene] = useState<TuguScene>("kosong");
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isDoneDialogOpen, setIsDoneDialogOpen] = useState<boolean>(false);
  const [showFinishButton, setShowFinishButton] = useState<boolean>(false);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdProgressRef = useRef<number>(0);

  // Preload kedua background tugukosong_rev & tugudone
  useEffect(() => {
    [
      "/openworld3/tugukosong_rev.webp",
      "/openworld3/tugudone.webp",
      "/openworld2/penjagapos.webp",
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const stopHolding = useCallback(() => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (holdProgressRef.current < 100) {
      holdProgressRef.current = 0;
      setHoldProgress(0);
    }
  }, []);

  const completeTugu = useCallback(() => {
    stopHolding();
    playTuguAudio("victory");
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.58 },
    });

    try {
      sessionStorage.setItem("aksara_lawu_ow3_tugu_done", "true");
      localStorage.setItem("aksara_lawu_ow3_tugu_done", "true");
    } catch {
      // ignore
    }

    setScene("done");
    setIsDoneDialogOpen(true);
  }, [stopHolding]);

  const startHolding = useCallback(() => {
    if (scene !== "kosong") return;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    setIsHolding(true);
    holdProgressRef.current = 0;
    setHoldProgress(0);

    let tickCounter = 0;
    holdIntervalRef.current = setInterval(() => {
      holdProgressRef.current += 3.5;
      tickCounter += 1;

      if (tickCounter % 4 === 0) {
        playTuguAudio("tick");
      }

      if (holdProgressRef.current >= 100) {
        holdProgressRef.current = 100;
        setHoldProgress(100);
        completeTugu();
      } else {
        setHoldProgress(holdProgressRef.current);
      }
    }, 50);
  }, [scene, completeTugu]);

  const handleFinishTugu = () => {
    try {
      sessionStorage.setItem("aksara_lawu_ow3_tugu_done", "true");
      localStorage.setItem("aksara_lawu_ow3_tugu_done", "true");
    } catch {
      // ignore
    }
    router.push("/openworld3");
  };

  return (
    <main
      className="ow3t-root"
      aria-label="Halaman Njangkepi Tugu Lawu"
    >
      <div className="ow3t-viewport">
        {/* Background tugukosong_rev & tugudone dengan transisi halus */}
        <div
          className="ow3t-bg-layer ow3t-bg-kosong"
          style={{ opacity: scene === "kosong" ? 1 : 0 }}
          aria-hidden="true"
        />
        <div
          className="ow3t-bg-layer ow3t-bg-done"
          style={{ opacity: scene === "done" ? 1 : 0 }}
          aria-hidden="true"
        />

        {/* Tombol Balik saat belum selesai */}
        {scene === "kosong" && (
          <button
            type="button"
            className="ow3t-back-btn"
            onClick={() => router.push("/openworld3")}
            aria-label="Balik menyang Open World 3"
            title="Balik menyang Open World 3"
          >
            <ArrowLeft className="ow3t-back-icon" />
            <span>Balik</span>
          </button>
        )}

        {/* Tombol Tahan "Jangkepi Tugu" di banner bawah saat scene kosong */}
        {scene === "kosong" && (
          <div className="ow3t-bottom-btn-wrapper">
            <button
              type="button"
              className={`ow3t-hold-btn ${isHolding ? "ow3t-holding" : ""}`}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              onTouchCancel={stopHolding}
              aria-label="Jangkepi Tugu"
              title="Pencet lan tahan kanggo njangkepi Tugu Lawu"
            >
              <div
                className="ow3t-hold-fill"
                style={{ width: `${holdProgress}%` }}
                aria-hidden="true"
              />
              <span className="ow3t-hold-text">Jangkepi Tugu</span>
            </button>
          </div>
        )}

        {/* Dialog Pak Agus di tugudone dengan delay 1.2 detik (1200ms) */}
        {scene === "done" && isDoneDialogOpen && (
          <DialogPopup
            key="ow3t-pak-agus-done-dialog"
            isOpen={true}
            dialogs={PAK_AGUS_DONE_DIALOGS}
            initialDelayMs={1200}
            instantText={false}
            focusBackdrop={true}
            lastButtonText="Tutup ➔"
            onComplete={() => {
              setIsDoneDialogOpen(false);
              setShowFinishButton(true);
            }}
          />
        )}

        {/* Tombol Selesai (Rampung) di bagian bawah setelah dialog Pak Agus selesai */}
        {scene === "done" && showFinishButton && (
          <div className="ow3t-bottom-btn-wrapper">
            <button
              type="button"
              className="ow3t-done-btn"
              onClick={handleFinishTugu}
              aria-label="Rampung lan balik menyang Open World 3"
            >
              Rampung
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

