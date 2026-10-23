"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./intro-level1.css";

// 9 Bagian Dialog Intro Level 1 (Teks dan Video dipisah menjadi slide mandiri untuk SEMUA RESPONSIVE)
const INTRO_DIALOGS = [
  {
    id: 1,
    type: "text" as const,
    text: "Sugeng rawuh ing Pos 1: Jejak Lawu!",
  },
  {
    id: 2,
    type: "text" as const,
    text: "Ing pos iki, para pendaki bakal nyusuri sejarah Gunung Lawu liwat video cekak. Gatekna video kanthi tliti, amarga informasi ing sajrone video dadi bekal kanggo ngrampungake tantangan.",
  },
  {
    id: 3,
    type: "text" as const,
    text: "Sawise nonton video, wangsulana pitakon kanthi milih salah siji saka patang pilihan jawaban sing ditulis nganggo Aksara Jawa.",
  },
  {
    id: 4,
    type: "text" as const,
    text: "Ayo disemak videone dhisik kanthi tliti sadurunge mangsuli!",
  },
  {
    id: 5,
    type: "video_only" as const,
    text: "Video Sejarah Gunung Lawu",
    showVideo: true,
  },
  {
    id: 6,
    type: "text" as const,
    text: "Rampungna kabeh tantangan kanthi bener kanggo entuk Kode Jejak Lawu. Gunakna kode kasebut kanggo mbukak dalan menyang Pos 2 lan nerusake petualangan!",
  },
  {
    id: 7,
    type: "text" as const,
    text: "Ayo, temokake jejak sejarah Gunung Lawu lan rampungna tantangane!",
  },
  {
    id: 8,
    type: "text" as const,
    text: "Mengko kowé bisa ngeklik tombol-tombol iki trep karo wangsulan sing bener:",
    showSymbols: true,
  },
  {
    id: 9,
    type: "text" as const,
    text: "Yen wis siap kabeh, pencet tombol ing ngisor iki kanggo miwiti dolanan tantangan!",
    showStartButton: true,
  },
];

// Tombol simbol sistem untuk langkah simbol (o, +, x, Y)
const SYSTEM_SYMBOLS = [
  { id: "o", src: "/pos1/o.webp", alt: "Tombol O" },
  { id: "plus", src: "/pos1/+.webp", alt: "Tombol Tambah" },
  { id: "x", src: "/pos1/x.webp", alt: "Tombol Silang" },
  { id: "y", src: "/pos1/Y.webp", alt: "Tombol Y" },
];

export default function IntroLevel1Page() {
  const router = useRouter();

  const activeDialogs = INTRO_DIALOGS;

  // State dialog saat ini (0 sampai activeDialogs.length - 1)
  const [currentStep, setCurrentStep] = useState<number>(0);
  // State avatar pemain dari sesi aktif
  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar3.webp");
  // State jumlah kata yang sedang tampil untuk animasi kata per kata (0.2s per kata)
  const [visibleWordsCount, setVisibleWordsCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

  // Timer ref untuk membersihkan interval kata
  const wordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ambil avatar pemain yang dipilih saat di Cemoro Sewu dari sessionStorage / localStorage
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

  // Animasi kata per kata: jeda 0.2s (200ms) per kata sesuai prompt level.txt
  useEffect(() => {
    const dialogItem = activeDialogs[currentStep];
    const isVideoOnly = dialogItem?.type === "video_only";

    if (isVideoOnly) {
      setVisibleWordsCount(0);
      setIsTyping(false);
      return;
    }

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
    if (currentItem?.type !== "video_only") {
      const words = currentItem.text.split(" ");
      if (isTyping && visibleWordsCount < words.length) {
        if (wordTimerRef.current) {
          clearInterval(wordTimerRef.current);
        }
        setVisibleWordsCount(words.length);
        setIsTyping(false);
        return;
      }
    }

    if (currentStep < activeDialogs.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Aksi tombol "Wiwit Level 1" -> navigasi ke halaman game level1_game
  const handleStartGame = () => {
    router.push("/level1_game");
  };

  const currentDialog = activeDialogs[currentStep];
  const isVideoOnly = currentDialog?.type === "video_only";
  const allWords = currentDialog?.text ? currentDialog.text.split(" ") : [];
  const displayedWords = allWords.slice(0, visibleWordsCount);

  return (
    <main className="il1-root" aria-label="Halaman Intro Level 1 - Pos 1: Jejak Lawu">
      <div className="il1-viewport">
        {/* =============================================
            1. AVATAR PEMAIN (SESI AKTIF)
            Dirender di dalam lingkaran avatar pada posisi bawah-kiri
            ============================================= */}
        <div
          className="il1-avatar-container"
          aria-label={`Avatar Pemain Sesi: ${selectedAvatar}`}
        >
          <img
            src={`/avatar/${selectedAvatar}`}
            alt="Avatar Pemain"
            className="il1-avatar-img"
            draggable={false}
          />
        </div>

        {/* =============================================
            2. BANNER LEVEL POS 1 (BAGIAN BAWAH TENGAH)
            Merender assets/maps/level1_rev.webp di tengah bawah papan
            ============================================= */}
        <div
          className="il1-level-banner-container"
          aria-label="Level 1 - Pos 1: Jejak Lawu"
        >
          <img
            src="/maps/level1_rev.webp"
            alt="Level 1 - Pos 1: Jejak Lawu"
            className="il1-level-banner-img"
            draggable={false}
          />
        </div>

        {/* =============================================
            3. AREA DIALOG KERTAS PERGAMEN (SISI KANAN)
            Teks font Jakarta Sans, animasi kata per kata (0.2s)
            ============================================= */}
        <section
          className="il1-dialog-section"
          aria-label="Dialog Pengantar Pos 1"
          onClick={() => {
            // Klik area kertas mempercepat teks jika sedang mengetik
            if (isTyping && !isVideoOnly) {
              if (wordTimerRef.current) {
                clearInterval(wordTimerRef.current);
              }
              setVisibleWordsCount(allWords.length);
              setIsTyping(false);
            }
          }}
        >
          {/* Header Navigasi Dialog: Badge Nomor & Tombol Prev / Next */}
          <div className="il1-dialog-nav-bar">
            <span className="il1-dialog-step-badge">
              {currentStep + 1} / {activeDialogs.length}
            </span>

            <div className="il1-dialog-nav-buttons">
              <button
                type="button"
                id="btn-dialog-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={currentStep === 0}
                className="il1-dialog-nav-btn"
                aria-label="Dialog Sadurunge (Previous)"
                title="Sadurunge"
              >
                <img
                  src="/main_assets/previous.png"
                  alt="Previous"
                  className="il1-dialog-nav-icon"
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
                className="il1-dialog-nav-btn"
                aria-label="Dialog Sabanjure (Next)"
                title="Sabanjure"
              >
                <img
                  src="/main_assets/next.png"
                  alt="Next"
                  className="il1-dialog-nav-icon"
                  draggable={false}
                />
              </button>
            </div>
          </div>

          {/* Isi Teks Dialog Beranimasi Kata per Kata */}
          <div className={`il1-dialog-body ${isVideoOnly ? "il1-dialog-body-video-only" : ""}`}>
            {!isVideoOnly && (
              <p className="il1-dialog-text">
                {displayedWords.map((word, idx) => (
                  <span
                    key={`word-${currentStep}-${idx}`}
                    className="il1-word"
                    style={{ animationDelay: `${idx * 0.02}s` }}
                  >
                    {word}{" "}
                  </span>
                ))}
              </p>
            )}

            {/* Render Embed Video YouTube (Jika showVideo aktif pada slide ini) */}
            {currentDialog?.showVideo && (
              <div
                className={`il1-video-frame-wrapper ${isVideoOnly ? "il1-video-frame-wrapper-solo" : ""}`}
                aria-label="Video Sejarah Gunung Lawu"
              >
                <div className={`il1-video-frame ${isVideoOnly ? "il1-video-frame-solo" : ""}`}>
                  <iframe
                    className="il1-video-iframe"
                    src="https://www.youtube.com/embed/INUeKTTdV-U?si=tVMbz6OIVBQ9JuBi"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Render 4 Tombol Pilihan O, +, X, Y */}
            {currentDialog?.showSymbols && !isTyping && (
              <div
                className="il1-system-symbols-wrapper"
                aria-label="Pilihan Simbol Jawaban"
              >
                {SYSTEM_SYMBOLS.map((symbol) => (
                  <button
                    key={symbol.id}
                    type="button"
                    id={`btn-symbol-${symbol.id}`}
                    className="il1-symbol-card"
                    aria-label={symbol.alt}
                    title={symbol.alt}
                  >
                    <img
                      src={symbol.src}
                      alt={symbol.alt}
                      className="il1-symbol-img"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Render Tombol 'Wiwit Level 1' */}
            {currentDialog?.showStartButton && !isTyping && (
              <div className="il1-start-button-wrapper">
                <button
                  type="button"
                  id="btn-wiwit-level1"
                  onClick={handleStartGame}
                  className="il1-btn-start"
                  aria-label="Miwiti Level 1"
                  title="Wiwit Level 1"
                >
                  Wiwit Level 1
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
