"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./intro-level2.css";

// 8 Bagian Dialog Intro Level 2 (Pos 2: Labirin Pendakian)
const INTRO_DIALOGS = [
  {
    id: 1,
    text: "Sugeng rawuh ing Pos 2: Labirin Pendakian!",
  },
  {
    id: 2,
    text: "Apik! Kowe wis kasil ngrampungake tantangan ing Pos 1. Saiki, perjalananmu diterusake kanggo njelajah warisan budaya ing sakiwa-tengene Gunung Lawu.",
  },
  {
    id: 3,
    text: "Ing ngarep, ana labirin sing kudu kok liwati. Sajrone perjalanan, kowe bakal nemokake maneka warna petunjuk babagan warisan budaya lokal.",
  },
  {
    id: 4,
    text: "Wacanen saben petunjuk nganggo Aksara Jawa kanthi tliti, banjur pilih salah siji saka rong jawaban kanggo nemtokake dalan sing bener.",
  },
  {
    id: 5,
    text: "Rampungna tantangan iki kanggo entuk kode rahasia sing bakal mbukak Pos 3.",
  },
  {
    id: 6,
    text: "Kanggo mangsuli kabeh pitakon, pencet tombol kiwa, lurus, utawa tengen ing ngisor iki:",
    showControls: true,
  },
  {
    id: 7,
    text: "Wis siyap nerusake petualangan? Jaga energimu lan goleka dalan sing bener!",
  },
  {
    id: 8,
    text: "Yen wis siap kabeh, pencet tombol ing ngisor iki kanggo miwiti dolanan tantangan!",
    showStartButton: true,
  },
];

// 3 Tombol Arah Navigasi Labirin: Kiwa (Kiri), Lurus (Maju/Lurus), Tengen (Kanan)
const LABIRIN_CONTROLS = [
  {
    id: "kiri",
    src: "/labirin_pendakian/kiri.png",
    alt: "Tombol Kiwa (Kiri)",
    label: "Kiwa",
  },
  {
    id: "lurus",
    src: "/labirin_pendakian/lurus.png",
    alt: "Tombol Lurus",
    label: "Lurus",
  },
  {
    id: "kanan",
    src: "/labirin_pendakian/kanan.png",
    alt: "Tombol Tengen (Kanan)",
    label: "Tengen",
  },
];

export default function IntroLevel2Page() {
  const router = useRouter();

  const activeDialogs = INTRO_DIALOGS;

  // State dialog saat ini (0 sampai activeDialogs.length - 1)
  const [currentStep, setCurrentStep] = useState<number>(0);
  // State avatar pemain dari sesi aktif
  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1.webp");
  // State jumlah kata yang sedang tampil untuk animasi kata per kata (0.2s per kata)
  const [visibleWordsCount, setVisibleWordsCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

  // Timer ref untuk membersihkan interval kata
  const wordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ambil avatar dari sesi yang sedang aktif
  useEffect(() => {
    try {
      const storedAvatar =
        sessionStorage.getItem("aksara_lawu_selected_avatar") ||
        localStorage.getItem("aksara_lawu_selected_avatar");
      if (storedAvatar) {
        setSelectedAvatar(storedAvatar);
      }
    } catch {
      // Fallback tetap ke default
    }
  }, []);

  // Animasi kata per kata: jeda 0.2s (200ms) per kata
  useEffect(() => {
    const dialogItem = activeDialogs[currentStep];
    const words = dialogItem ? dialogItem.text.split(" ") : [];

    // Reset hitungan kata & set status mengetik
    setVisibleWordsCount(0);
    setIsTyping(true);

    if (wordTimerRef.current) {
      clearInterval(wordTimerRef.current);
    }

    if (words.length === 0) {
      setIsTyping(false);
      return;
    }

    let currentCount = 0;
    wordTimerRef.current = setInterval(() => {
      currentCount += 1;
      setVisibleWordsCount(currentCount);

      if (currentCount >= words.length) {
        if (wordTimerRef.current) {
          clearInterval(wordTimerRef.current);
        }
        setIsTyping(false);
      }
    }, 200); // 0.2 detik per kata

    return () => {
      if (wordTimerRef.current) {
        clearInterval(wordTimerRef.current);
      }
    };
  }, [currentStep, activeDialogs]);

  // Aksi tombol Previous pada dialog
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Aksi tombol Next pada dialog
  const handleNext = () => {
    const currentItem = activeDialogs[currentStep];
    const words = currentItem.text.split(" ");
    if (isTyping && visibleWordsCount < words.length) {
      if (wordTimerRef.current) {
        clearInterval(wordTimerRef.current);
      }
      setVisibleWordsCount(words.length);
      setIsTyping(false);
      return;
    }

    if (currentStep < activeDialogs.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Aksi tombol "Miwiti Level 2" -> navigasi ke halaman game level 2
  const handleStartGame = () => {
    router.push("/level2_game");
  };

  const currentDialog = activeDialogs[currentStep];
  const allWords = currentDialog?.text ? currentDialog.text.split(" ") : [];
  const displayedWords = allWords.slice(0, visibleWordsCount);

  return (
    <main
      className="il2-root"
      aria-label="Halaman Intro Level 2 - Pos 2: Labirin Pendakian"
    >
      <div className="il2-viewport">
        {/* =============================================
            1. AVATAR PEMAIN (SESI AKTIF)
            Diletakkan di lingkaran avatar pada posisi bawah-kiri
            ============================================= */}
        <div
          className="il2-avatar-container"
          aria-label={`Avatar Pemain Sesi: ${selectedAvatar}`}
        >
          <img
            src={`/avatar/${selectedAvatar}`}
            alt="Avatar Pemain"
            className="il2-avatar-img"
            draggable={false}
          />
        </div>

        {/* =============================================
            2. BANNER LEVEL POS 2 (BAGIAN BAWAH TENGAH)
            Merender assets/maps/level2.webp di tengah bawah papan
            ============================================= */}
        <div
          className="il2-level-banner-container"
          aria-label="Level 2 - Pos 2: Labirin Pendakian"
        >
          <img
            src="/maps/level2.webp"
            alt="Level 2 - Pos 2: Labirin Pendakian"
            className="il2-level-banner-img"
            draggable={false}
          />
        </div>

        {/* =============================================
            3. AREA DIALOG KERTAS PERGAMEN (SISI KANAN)
            Teks font Jakarta Sans, animasi kata per kata (0.2s)
            ============================================= */}
        <section
          className="il2-dialog-section"
          aria-label="Dialog Pengantar Pos 2"
          onClick={() => {
            // Klik area kertas mempercepat teks jika sedang mengetik
            if (isTyping) {
              if (wordTimerRef.current) {
                clearInterval(wordTimerRef.current);
              }
              setVisibleWordsCount(allWords.length);
              setIsTyping(false);
            }
          }}
        >
          {/* Header Navigasi Dialog: Badge Nomor & Tombol Prev / Next */}
          <div className="il2-dialog-nav-bar">
            <span className="il2-dialog-step-badge">
              {currentStep + 1} / {activeDialogs.length}
            </span>

            <div className="il2-dialog-nav-buttons">
              <button
                type="button"
                id="btn-dialog-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={currentStep === 0}
                className="il2-dialog-nav-btn"
                aria-label="Dialog Sadurunge (Previous)"
                title="Sadurunge"
              >
                <img
                  src="/main_assets/previous.png"
                  alt="Previous"
                  className="il2-dialog-nav-icon"
                  draggable={false}
                />
              </button>

              <button
                type="button"
                id="btn-dialog-next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={currentStep === activeDialogs.length - 1 && !isTyping}
                className="il2-dialog-nav-btn"
                aria-label="Dialog Sabanjure (Next)"
                title="Sabanjure"
              >
                <img
                  src="/main_assets/next.png"
                  alt="Next"
                  className="il2-dialog-nav-icon"
                  draggable={false}
                />
              </button>
            </div>
          </div>

          {/* Isi Teks Dialog Beranimasi Kata per Kata */}
          <div className="il2-dialog-body">
            <p className="il2-dialog-text">
              {displayedWords.map((word, idx) => (
                <span
                  key={`word-${currentStep}-${idx}`}
                  className="il2-word"
                  style={{ animationDelay: `${idx * 0.02}s` }}
                >
                  {word}{" "}
                </span>
              ))}
            </p>

            {/* Render 3 Tombol Arah (Kiwa, Lurus, Tengen) */}
            {currentDialog?.showControls && !isTyping && (
              <div
                className="il2-controls-wrapper"
                aria-label="Pilihan Tombol Arah Jawaban"
              >
                {LABIRIN_CONTROLS.map((ctrl) => (
                  <button
                    key={ctrl.id}
                    type="button"
                    id={`btn-control-${ctrl.id}`}
                    className="il2-control-card"
                    aria-label={ctrl.alt}
                    title={ctrl.alt}
                  >
                    <div className="il2-control-img-wrap">
                      <img
                        src={ctrl.src}
                        alt={ctrl.alt}
                        className="il2-control-img"
                        draggable={false}
                      />
                    </div>
                    <span className="il2-control-label">{ctrl.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Render Tombol 'Miwiti Level 2' */}
            {currentDialog?.showStartButton && !isTyping && (
              <div className="il2-start-button-wrapper">
                <button
                  type="button"
                  id="btn-wiwit-level2"
                  onClick={handleStartGame}
                  className="il2-btn-start"
                  aria-label="Miwiti Level 2"
                  title="Miwiti Level 2"
                >
                  Miwiti Level 2
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

