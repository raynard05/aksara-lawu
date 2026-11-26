"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { ArrowLeft, Shuffle, RotateCcw } from "lucide-react";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import {
  getSavedInventoryItems,
  saveInventoryItems,
} from "../lib/inventoryStorage";
import "./openworld3-game.css";

type MarbleId = "merah" | "kuning" | "hijau";
type GamePhase = "preview" | "covering" | "shuffling" | "guessing" | "result";

interface MarbleInfo {
  id: MarbleId;
  label: string;
  image: string;
}

const MARBLES: MarbleInfo[] = [
  { id: "merah", label: "Kelereng Abang", image: "/openworld3/kelerengmerah.webp" },
  { id: "kuning", label: "Kelereng Kuning", image: "/openworld3/kelerengkuning.webp" },
  { id: "hijau", label: "Kelereng Ijo", image: "/openworld3/kelerenghijau.webp" },
];

// Target kelereng tiap ronde:
// Ronde 1 -> Hijau (index 2)
// Ronde 2 -> Merah (index 0)
// Ronde 3 -> Kuning (index 1)
const ROUND_TARGETS: Record<1 | 2 | 3, number> = {
  1: 2,
  2: 0,
  3: 1,
};

// Dialog pembuka Mbah Kakek sebelum Ronde 1 dimulai
const KAKEK_START_DIALOGS: DialogItem[] = [
  {
    id: 1,
    speakerName: "Mbah Kakek",
    character: "/openworld3/si_embah.webp",
    characterHalfBody: true,
    text: "Siap-siapa kanggo ngadhepi tantanganku.....",
  },
  {
    id: 2,
    speakerName: "Mbah Kakek",
    character: "/openworld3/si_embah.webp",
    characterHalfBody: true,
    text: "Uhuk, uhuk...",
  },
];

// 3 Posisi X (%) di atas meja dengan gap yang jelas
const SLOT_X_POS = [28, 50, 72] as const;

// Aset angka 1, 2, 3 dari /pos1/
const NUMBER_ASSETS = [
  { slot: 0, src: "/pos1/1.png", alt: "Nomer 1" },
  { slot: 1, src: "/pos1/2.png", alt: "Nomer 2" },
  { slot: 2, src: "/pos1/3.png", alt: "Nomer 3" },
] as const;

function playShellAudio(type: "slide" | "win" | "wrong") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "slide") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "win") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.1;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // ignore
  }
}

export default function OpenWorld3GamePage() {
  const router = useRouter();

  const [isIntroDialogOpen, setIsIntroDialogOpen] = useState<boolean>(true);
  const [round, setRound] = useState<1 | 2 | 3>(1);

  // Posisi slot (0 | 1 | 2) untuk masing-masing kelereng & gelas [merah, kuning, hijau]
  const [marbleSlots, setMarbleSlots] = useState<number[]>([0, 1, 2]);
  const [phase, setPhase] = useState<GamePhase>("preview");
  const [pickedSlot, setPickedSlot] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const setupRound = useCallback(
    (targetRound: 1 | 2 | 3) => {
      clearTimers();
      setRound(targetRound);
      setMarbleSlots([0, 1, 2]);
      setPickedSlot(null);
      setIsWin(false);
      setShowResultModal(false);
      setPhase("preview");
    },
    [clearTimers]
  );

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const targetMarbleIdx = ROUND_TARGETS[round];
  const targetMarble = MARBLES[targetMarbleIdx];

  // Mulai fase menutup gelas dan mengacak posisi
  const handleStartShuffle = () => {
    if (isIntroDialogOpen || phase !== "preview") return;
    setPhase("covering");

    const coverTimer = setTimeout(() => {
      setPhase("shuffling");
      const totalSwaps = 4 + round; // Ronde 1: 5x, Ronde 2: 6x, Ronde 3: 7x
      let currentSlots = [...marbleSlots];

      for (let step = 0; step < totalSwaps; step++) {
        const swapTimer = setTimeout(() => {
          const a = Math.floor(Math.random() * 3);
          let b = Math.floor(Math.random() * 3);
          while (b === a) {
            b = Math.floor(Math.random() * 3);
          }

          const nextSlots = [...currentSlots];
          const idxA = nextSlots.indexOf(a);
          const idxB = nextSlots.indexOf(b);
          nextSlots[idxA] = b;
          nextSlots[idxB] = a;
          currentSlots = nextSlots;

          setMarbleSlots(nextSlots);
          playShellAudio("slide");

          if (step === totalSwaps - 1) {
            const doneTimer = setTimeout(() => {
              setPhase("guessing");
            }, 420);
            timersRef.current.push(doneTimer);
          }
        }, step * 430);

        timersRef.current.push(swapTimer);
      }
    }, 550);

    timersRef.current.push(coverTimer);
  };

  // Saat pemain menebak gelas atau klik angka 1 / 2 / 3
  const handlePickSlot = (slot: number) => {
    if (phase !== "guessing") return;
    setPickedSlot(slot);
    setPhase("result");

    const won = slot === marbleSlots[targetMarbleIdx];
    setIsWin(won);
    setShowResultModal(false);

    if (won) {
      playShellAudio("win");
      if (round === 3) {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
        });

        // Simpan Keping Tugu 2 ke sistem & inventory setelah Ronde 3 menang
        try {
          sessionStorage.setItem("aksara_lawu_ow3_has_keping2", "true");
          localStorage.setItem("aksara_lawu_ow3_has_keping2", "true");
          const currentItems = getSavedInventoryItems();
          if (!currentItems.includes("keping2")) {
            saveInventoryItems([...currentItems, "keping2"]);
          }
        } catch {
          // ignore
        }
      }
    } else {
      playShellAudio("wrong");
    }

    // Beri jeda 1.3 detik agar pemain sempat melihat hasil tebakannya di meja sebelum pop-up muncul
    const modalTimer = setTimeout(() => {
      setShowResultModal(true);
    }, 1300);
    timersRef.current.push(modalTimer);
  };

  const cupsLifted = phase === "preview" || phase === "result";

  return (
    <main
      className="ow3g-root"
      aria-label="Halaman Tantangan Gelas Kelereng - Mbah Kakek"
    >
      <div className="ow3g-viewport">
        {/* Tombol Balik ke Tugu */}
        <button
          type="button"
          className="ow3g-back-btn"
          onClick={() => router.push("/openworld3")}
          aria-label="Balik menyang Tugu"
          title="Balik menyang Tugu"
        >
          <ArrowLeft className="ow3g-back-icon" />
          <span>Balik menyang Tugu</span>
        </button>

        {/* Banner Instruksi, Ronde & Target Kelereng */}
        <div className="ow3g-prompt-banner" aria-live="polite">
          <span className="ow3g-round-badge">RONDE {round} / 3</span>
          <img
            src={targetMarble.image}
            alt={targetMarble.label}
            className="ow3g-prompt-target-img"
            draggable={false}
          />
          <span className="ow3g-prompt-text">
            {phase === "preview" &&
              `Eling-elingen panggonane ${targetMarble.label}!`}
            {phase === "covering" && "Gelas ditutupake..."}
            {phase === "shuffling" && "Gelas lagi diacak, gatekna terus!"}
            {phase === "guessing" &&
              `Endi gelas sing nutupi ${targetMarble.label}?`}
            {phase === "result" &&
              (isWin
                ? `Bener! Ronde ${round} kasil ditaklukkan!`
                : `Salah! Ulangi Ronde ${round} nganti kasil.`)}
          </span>
        </div>

        {/* Stage Meja: 3 Kelereng (Merah, Kuning, Hijau) & 3 Gelas Penutup */}
        <div className="ow3g-table-stage">
          {MARBLES.map((marble, idx) => {
            const slot = marbleSlots[idx];
            const isTarget = idx === targetMarbleIdx;

            return (
              <React.Fragment key={marble.id}>
                {/* Kelereng di atas meja (disembunyikan penuh saat gelas menutup) */}
                <div
                  className="ow3g-marble-slot"
                  style={{
                    left: `${SLOT_X_POS[slot]}%`,
                    opacity: cupsLifted ? 1 : 0,
                  }}
                >
                  {phase === "preview" && isTarget && (
                    <div className="ow3g-marble-target-ring" />
                  )}
                  <img
                    src={marble.image}
                    alt={marble.label}
                    className="ow3g-marble-img"
                    draggable={false}
                  />
                </div>

                {/* Gelas Penutup */}
                <div
                  className={`ow3g-cup-slot ${
                    cupsLifted ? "ow3g-cup-lifted" : ""
                  } ${phase === "guessing" ? "ow3g-cup-clickable" : ""}`}
                  style={{ left: `${SLOT_X_POS[slot]}%` }}
                  onClick={() => phase === "guessing" && handlePickSlot(slot)}
                >
                  <img
                    src="/openworld3/gelas.webp"
                    alt={`Gelas ${slot + 1}`}
                    className="ow3g-cup-img"
                    draggable={false}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Tombol Mulai Acak Gelas saat fase preview (setelah dialog pembuka selesai) */}
        {!isIntroDialogOpen && phase === "preview" && (
          <div className="ow3g-start-btn-wrap">
            <button
              type="button"
              className="ow3g-start-btn"
              onClick={handleStartShuffle}
            >
              <Shuffle style={{ width: "1.1vw", height: "1.1vw" }} />
              <span>Tutup & Acak Gelas</span>
            </button>
          </div>
        )}

        {/* Angka 1, 2, 3 dari /pos1/ di bagian bawah */}
        <div className="ow3g-numbers-bar" aria-label="Pilihan Nomer Gelas 1 2 3">
          {NUMBER_ASSETS.map((item) => (
            <button
              key={item.slot}
              type="button"
              className={`ow3g-number-btn ${
                phase === "guessing" ? "ow3g-number-active" : ""
              }`}
              disabled={phase !== "guessing"}
              onClick={() => handlePickSlot(item.slot)}
              aria-label={`Pilih ${item.alt}`}
              title={phase === "guessing" ? `Pilih ${item.alt}` : item.alt}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="ow3g-number-img"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Dialog Pembuka Mbah Kakek */}
        {isIntroDialogOpen && (
          <DialogPopup
            key="ow3g-kakek-intro"
            isOpen={true}
            dialogs={KAKEK_START_DIALOGS}
            initialDelayMs={0}
            instantText={false}
            focusBackdrop={true}
            lastButtonText="Siap ➔"
            onComplete={() => setIsIntroDialogOpen(false)}
          />
        )}

        {/* Modal Hasil Ronde / Menang / Ulangi Ronde */}
        {phase === "result" && showResultModal && pickedSlot !== null && (
          <div className="ow3g-modal-overlay" role="dialog" aria-modal="true">
            <div className="ow3g-modal-card">
              <h2 className="ow3g-modal-title">
                {isWin
                  ? round === 3
                    ? "MANGAYUBAGYA! KOWE MENANG!"
                    : `RONDE ${round} KASIL!`
                  : `RONDE ${round} DURUNG TEPAT!`}
              </h2>

              {isWin && round === 3 && (
                <img
                  src="/openworld3/keping2.webp"
                  alt="Keping Tugu 2"
                  className="ow3g-modal-keping-img"
                  draggable={false}
                />
              )}

              <p className="ow3g-modal-desc">
                {isWin
                  ? round === 3
                    ? "Kowe kasil ngalahake kabeh 3 ronde tantangan Mbah Kakek! Keping Tugu kapindho wis kasimpen, ayo pasang menyang Tugu Lawu."
                    : `Mantep! Tebakanmu kanggo ${targetMarble.label} bener. Ayo lanjut menyang Ronde ${
                        round + 1
                      }!`
                  : `Posisi ${targetMarble.label} mau ana ing gelas nomer ${
                      marbleSlots[targetMarbleIdx] + 1
                    }. Ayo ulangi Ronde ${round} maneh!`}
              </p>

              {isWin ? (
                round === 3 ? (
                  <button
                    type="button"
                    className="ow3g-modal-btn"
                    onClick={() => router.push("/openworld3")}
                  >
                    <span>Balik menyang Tugu ➔</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ow3g-modal-btn"
                    onClick={() => setupRound((round + 1) as 1 | 2 | 3)}
                  >
                    <span>Lanjut Ronde {round + 1} ➔</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  className="ow3g-modal-btn ow3g-modal-btn-retry"
                  onClick={() => setupRound(round)}
                >
                  <RotateCcw style={{ width: "1.1vw", height: "1.1vw" }} />
                  <span>Ulangi Ronde {round}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
