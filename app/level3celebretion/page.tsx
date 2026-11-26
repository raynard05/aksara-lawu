"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import {
  saveInventoryItems,
  getSavedInventoryItems,
  markLevelCompleted,
  unlockLevel,
} from "../lib/inventoryStorage";
import "./level3celebretion.css";

type CelebrationScene = "close" | "chest" | "done";

// Helper Web Audio API untuk efek suara interaktif tanpa dependensi file eksternal
function playCelebrationAudio(type: "tick" | "door" | "chest" | "victory") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "tick") {
      // Suara klik / detak halus saat menahan tombol
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === "door") {
      // Suara gesekan kayu pintu lemari terbuka
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "chest") {
      // Suara peti terbuka (dentang logam + gesekan kayu)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === "victory") {
      // Fanfare kemenangan ceria: C5 -> E5 -> G5 -> C6
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.22, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.35);
      });
    }
  } catch {
    // Ignore audio errors jika browser memblokir autoplay
  }
}

// Dialog awal dari Penjaga Warung (Bahasa Jawa Ngoko sesuai level3.txt poin 4)
const INITIAL_DIALOG_LIST: DialogItem[] = [
  {
    id: 1,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Kanggo mbukak lemari lan peti, pencet lan tahan tombol ing ngisor iki!",
  },
];

export default function Level3CelebrationPage() {
  const router = useRouter();

  // State alur adegan: "close" -> "chest" -> "done"
  const [scene, setScene] = useState<CelebrationScene>("close");

  // State dialog pemandu awal di halaman bgclose
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  // State logika tombol tahan (hold button)
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);

  // State modal kartu kemenangan
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const HOLD_DURATION_MS = 1200; // Durasi menahan tombol hingga penuh (1.2 detik)

  // Helper trigger confetti saat peti terbuka di scene "done"
  const triggerConfettiCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        zIndex: 999,
      });
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { x: 0.15, y: 0.65 },
        zIndex: 999,
      });
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { x: 0.85, y: 0.65 },
        zIndex: 999,
      });
    } catch {
      // Ignore confetti errors
    }
  }, []);

  // Handler saat tombol tahan mencapai 100%
  const handleHoldComplete = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);

    if (scene === "close") {
      playCelebrationAudio("door");
      setScene("chest");
    } else if (scene === "chest") {
      playCelebrationAudio("chest");
      setScene("done");

      // Di scene "done": picu confetti, simpan kartu ke inventory, lalu tampilkan modal reward
      setTimeout(() => {
        playCelebrationAudio("victory");
        triggerConfettiCelebration();

        // Simpan Kartu Akses Level 4 ke inventory & tandai Level 3 selesai
        try {
          const currentItems = getSavedInventoryItems();
          if (!currentItems.includes("cardlevel4")) {
            saveInventoryItems([...currentItems, "cardlevel4"]);
          }
          markLevelCompleted(3);
          unlockLevel(4);
        } catch {
          // ignore
        }

        setShowVictoryModal(true);
      }, 400);
    }
  }, [scene, triggerConfettiCelebration]);

  // Loop penambahan progress tombol tahan
  useEffect(() => {
    if (isHolding) {
      holdStartTimeRef.current = Date.now();
      let lastTick = 0;

      holdIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
        setHoldProgress(progress);

        // Mainkan suara detak setiap 180ms
        if (elapsed - lastTick >= 180) {
          playCelebrationAudio("tick");
          lastTick = elapsed;
        }

        if (progress >= 100) {
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
          handleHoldComplete();
        }
      }, 25);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
      setHoldProgress(0);
    }

    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    };
  }, [isHolding, handleHoldComplete]);

  // Event handlers untuk tombol tahan
  const startHolding = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isDialogOpen || scene === "done") return;
    setIsHolding(true);
  };

  const stopHolding = () => {
    setIsHolding(false);
  };

  // Navigasi lanjut ke peta setelah tuntas
  const handleContinueToMaps = () => {
    setShowVictoryModal(false);
    try {
      // Posisikan avatar di titik 4 (Pos 4: Nata Aksara Jawa)
      sessionStorage.setItem("aksara_lawu_current_waypoint", "4");
    } catch {
      // ignore
    }
    router.push("/maps");
  };

  return (
    <main
      className="l3c-root"
      aria-label="Halaman Selebrasi Level 3 - Pos 3: Warung Ngaso"
    >
      <div className="l3c-viewport">
        {/* Layer 1: Pintu Lemari Tertutup (bgclose.webp) */}
        <div
          className={`l3c-bg-layer l3c-bg-close ${
            scene === "close" ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={scene !== "close"}
        />

        {/* Layer 2: Lemari Terbuka dengan Peti Tertutup (bgchest.webp) */}
        <div
          className={`l3c-bg-layer l3c-bg-chest ${
            scene === "chest" ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={scene !== "chest"}
        />

        {/* Layer 3: Peti Terbuka dan Berkilau Selesai (done.webp) */}
        <div
          className={`l3c-bg-layer l3c-bg-done ${
            scene === "done" ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={scene !== "done"}
        />

        {/* Ambient Glow Hangat */}
        <div className="l3c-ambient-glow" />

        {/* Header Banner Pos 3 */}
        <header className="l3c-top-banner" aria-label="Label Lokasi">
          <span className="l3c-top-dot" aria-hidden="true" />
          <span className="l3c-top-title">POS 3: WARUNG NGASO — SELEBRASI</span>
        </header>

        {/* Tombol Tahan di Bawah Banner Cokelat (Hanya tampil pada scene close & chest) */}
        {scene !== "done" && !isDialogOpen && (
          <div className="l3c-hold-btn-wrapper">
            <button
              type="button"
              className={`l3c-hold-btn ${isHolding ? "l3c-holding" : ""}`}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
              onTouchCancel={stopHolding}
              aria-label={scene === "close" ? "Bukak Lemari" : "Bukak Peti"}
              title={scene === "close" ? "Pencet lan tahan kanggo mbukak lemari" : "Pencet lan tahan kanggo mbukak peti"}
            >
              {/* Progress bar pengisi */}
              <div
                className="l3c-hold-fill"
                style={{ width: `${holdProgress}%` }}
                aria-hidden="true"
              />

              {/* Teks Tombol */}
              <span className="l3c-hold-text">
                {scene === "close" ? "Bukak Lemari" : "Bukak Peti"}
              </span>
            </button>
          </div>
        )}

        {/* Dialog Awal dari Penjaga Warung (Bahasa Jawa Ngoko) */}
        {isDialogOpen && (
          <DialogPopup
            key="l3c-initial-dialog"
            isOpen={isDialogOpen}
            dialogs={INITIAL_DIALOG_LIST}
            initialDelayMs={0}
            instantText={false}
            focusBackdrop={true}
            containerClassName="dialog-popup-level3-mobile-lift"
            lastButtonText="Siap ➔"
            onComplete={() => setIsDialogOpen(false)}
          />
        )}

        {/* Modal Pop Up Kartu Level 4 (Tampil di scene done.webp, persis gaya Level 2) */}
        {showVictoryModal && (
          <div
            className="l3c-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mangayubagya Kasil Entuk Kartu Level 4"
          >
            <div className="l3c-victory-modal-card">
              <h2 className="l3c-victory-title">Mangayubagya, Kowe Kasil!</h2>

              <div className="l3c-victory-card-wrapper">
                <img
                  src="/assets/inventory/cardlevel4.png"
                  alt="Kartu Akses Level 4"
                  className="l3c-victory-card-img"
                  draggable={false}
                />
              </div>

              <p className="l3c-victory-desc">
                Cek panyimpenan kanggo entuk informasi luwih jangkep babagan Pos 4!
              </p>

              <button
                type="button"
                className="l3c-btn-victory-continue"
                onClick={handleContinueToMaps}
                aria-label="Lanjut menyang Peta"
              >
                Lanjut menyang Peta →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

