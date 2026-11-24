"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./intro-level3.css";

// 6 Bagian Dialog Intro Level 3 (Pos 3: Warung Ngaso)
const INTRO_DIALOGS = [
  {
    id: 1,
    text: "Sugeng rawuh ing Pos 3: Warung Ngaso!",
  },
  {
    id: 2,
    text: "Sawise ngliwati lelampahan sadurunge, saiki wayahe ngaso sedhela ing warung kuliner khas Magetan. Ing warung iki, ana maneka warna panganan khas sing bisa ditemokake.",
  },
  {
    id: 3,
    text: "Nanging, sadurunge bisa ngaso lan nikmati panganan, ana pesenan sing kudu dirampungake. Wacanen kertu pesenan sing ditulis nganggo Aksara Jawa kanthi tliti, banjur jupuken rong panganan sing cocog lan pindhahna menyang nampan.",
  },
  {
    id: 4,
    text: "Kanggo ndeleng rincian saben pesenan, kowe cukup ngeklik tombol pesenan ing ngisor iki:",
    showPesananBtn: true,
  },
  {
    id: 5,
    text: "Rampungna pesenan kanthi bener kanggo entuk Kode Warung Ngaso. Gunakna kode kasebut kanggo mbukak dalan menyang Pos 4!",
  },
  {
    id: 6,
    text: "Ayo, wacanen pesenane lan jupuken panganan sing trep!",
    showStartButton: true,
  },
];

export default function IntroLevel3Page() {
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

  // Aksi tombol "Miwiti Level 3" -> navigasi ke halaman game level 3
  const handleStartGame = () => {
    router.push("/level3_game");
  };

  const currentDialog = activeDialogs[currentStep];
  const allWords = currentDialog?.text ? currentDialog.text.split(" ") : [];
  const displayedWords = allWords.slice(0, visibleWordsCount);

  return (
    <main
      className="il3-root"
      aria-label="Halaman Intro Level 3 - Pos 3: Warung Ngaso"
    >
      <div className="il3-viewport">
        {/* =============================================
            1. AVATAR PEMAIN (SESI AKTIF)
            Diletakkan di lingkaran avatar pada posisi bawah-kiri
            ============================================= */}
        <div
          className="il3-avatar-container"
          aria-label={`Avatar Pemain Sesi: ${selectedAvatar}`}
        >
          <img
            src={`/avatar/${selectedAvatar}`}
            alt="Avatar Pemain"
            className="il3-avatar-img"
            draggable={false}
          />
        </div>

        {/* =============================================
            2. BANNER LEVEL POS 3 (BAGIAN BAWAH TENGAH)
            Merender /maps/level3.webp di tengah bawah papan
            ============================================= */}
        <div
          className="il3-level-banner-container"
          aria-label="Level 3 - Pos 3: Warung Ngaso"
        >
          <img
            src="/maps/level3.webp"
            alt="Level 3 - Pos 3: Warung Ngaso"
            className="il3-level-banner-img"
            draggable={false}
          />
        </div>

        {/* =============================================
            3. AREA DIALOG KERTAS PERGAMEN (SISI KANAN)
            Teks font Jakarta Sans, animasi kata per kata (0.2s)
            ============================================= */}
        <section
          className="il3-dialog-section"
          aria-label="Dialog Pengantar Pos 3: Warung Ngaso"
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
          {/* Header Navigasi Dialog: Badge Nomor, Pos Tag & Tombol Prev / Next */}
          <div className="il3-dialog-nav-bar">
            <div className="il3-dialog-badge-group">
              <span className="il3-dialog-step-badge">
                {currentStep + 1} / {activeDialogs.length}
              </span>

            </div>

            <div className="il3-dialog-nav-buttons">
              <button
                type="button"
                id="btn-dialog-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={currentStep === 0}
                className="il3-dialog-nav-btn"
                aria-label="Dialog Sadurunge (Previous)"
                title="Sadurunge"
              >
                <img
                  src="/main_assets/previous.png"
                  alt="Previous"
                  className="il3-dialog-nav-icon"
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
                className="il3-dialog-nav-btn"
                aria-label="Dialog Sabanjure (Next)"
                title="Sabanjure"
              >
                <img
                  src="/main_assets/next.png"
                  alt="Next"
                  className="il3-dialog-nav-icon"
                  draggable={false}
                />
              </button>
            </div>
          </div>

          {/* Isi Teks Dialog Beranimasi Kata per Kata */}
          <div className="il3-dialog-body">
            <p className="il3-dialog-text">
              {displayedWords.map((word, idx) => (
                <span
                  key={`word-${currentStep}-${idx}`}
                  className="il3-word"
                  style={{ animationDelay: `${idx * 0.02}s` }}
                >
                  {word}{" "}
                </span>
              ))}
            </p>

            {/* Render Tombol Pesanan (Pratinjau Pesanan) pada Slide 4 */}
            {currentDialog?.showPesananBtn && !isTyping && (
              <div
                className="il3-pesanan-btn-wrapper"
                aria-label="Pratinjau Tombol Pesanan"
              >
                <div
                  className="il3-pesanan-card"
                  title="Tombol Pesanan"
                  aria-label="Tombol Pesanan"
                >
                  <img
                    src="/warungngaso/pesanan.webp"
                    alt="Tombol Pesanan"
                    className="il3-pesanan-img"
                    draggable={false}
                  />
                </div>
              </div>
            )}

            {/* Render Tombol 'Miwiti Level 3' pada Slide Terakhir */}
            {currentDialog?.showStartButton && !isTyping && (
              <div className="il3-start-button-wrapper">
                <button
                  type="button"
                  id="btn-wiwit-level3"
                  onClick={handleStartGame}
                  className="il3-btn-start"
                  aria-label="Miwiti Level 3"
                  title="Miwiti Level 3"
                >
                  Miwiti Level 3
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

