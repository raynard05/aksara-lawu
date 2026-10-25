"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import GamePopup, { GamePopupType } from "../components/GamePopup/GamePopup";
import {
  getRandomLevel1Questions,
  QuestionItem,
  QuestionOption,
} from "./level1Questions";
import {
  getSavedInventoryItems,
  saveInventoryItems,
  markLevelCompleted,
  getCompletedLevels,
} from "../lib/inventoryStorage";
import "./level1-game.css";

// Definisi 4 Ikon Simbol Pilihan Jawaban
const SYMBOL_CONTROLS = [
  { id: "o" as const, src: "/pos1/o.webp", alt: "Tombol O" },
  { id: "plus" as const, src: "/pos1/+.webp", alt: "Tombol Tambah (+)" },
  { id: "x" as const, src: "/pos1/x.webp", alt: "Tombol Silang (X)" },
  { id: "y" as const, src: "/pos1/Y.webp", alt: "Tombol Y" },
];

export default function Level1GamePage() {
  const router = useRouter();

  // 1. STATE INTRO FLOW:
  // "delay 2 detik untuk memunculkan pop up buatkan pop up coklat yg match tanpa shadow...
  // dan beri loading dulu 2,5s lalu beri countdown icon 3,2,1 png. setelah count down selesai, render icon ready.png"
  const [introStep, setIntroStep] = useState<
    "initial_wait" | "loading" | "countdown_3" | "countdown_2" | "countdown_1" | "ready" | "in_game"
  >("initial_wait");

  // 2. STATE GAMEPLAY PERTANYAAN:
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0); // Maks 2 kali kesempatan per soal
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  // 3. STATE POPUP FEEDBACK (popup.txt):
  const [popupType, setPopupType] = useState<GamePopupType>(null);

  // 4. STATE KEMENANGAN (VICTORY FLOW):
  // Star mengkilau + confetti di setiap sudut -> delay 2.2s -> star terbang ke bag di topbar -> tampilkan popup kemenangan kartu level 2
  const [showStarCelebration, setShowStarCelebration] = useState<boolean>(false);
  const [starFlying, setStarFlying] = useState<boolean>(false);
  const [showVictoryPopup, setShowVictoryPopup] = useState<boolean>(false);

  // Refs untuk menampung timer intro agar bisa dibersihkan kapan pun
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearIntroTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  // Menjalankan sekuens intro: jeda 2s -> loading 2.5s -> 3 (1s) -> 2 (1s) -> 1 (1s) -> ready (0.9s) -> in_game
  const startIntroSequence = () => {
    clearIntroTimers();
    setIntroStep("initial_wait");

    const t1 = setTimeout(() => {
      setIntroStep("loading");
      const t2 = setTimeout(() => {
        setIntroStep("countdown_3");
        const t3 = setTimeout(() => {
          setIntroStep("countdown_2");
          const t4 = setTimeout(() => {
            setIntroStep("countdown_1");
            const t5 = setTimeout(() => {
              setIntroStep("ready");
              const t6 = setTimeout(() => {
                setIntroStep("in_game");
              }, 900);
              timerRefs.current.push(t6);
            }, 1000);
            timerRefs.current.push(t5);
          }, 1000);
          timerRefs.current.push(t4);
        }, 1000);
        timerRefs.current.push(t3);
      }, 2500);
      timerRefs.current.push(t2);
    }, 2000);
    timerRefs.current.push(t1);
  };

  // Fungsi untuk membersihkan dan mengocok ulang seluruh sesi permainan Level 1
  const resetLevel1Session = () => {
    clearIntroTimers();
    const freshQuestions = getRandomLevel1Questions();
    setQuestions(freshQuestions);
    setCurrentQIndex(0);
    setAttemptsUsed(0);
    setCorrectAnswersCount(0);
    setPopupType(null);
    setShowStarCelebration(false);
    setStarFlying(false);
    setShowVictoryPopup(false);
    setIntroStep("initial_wait");
  };

  // Inisialisasi pertanyaan acak & jalankan sekuens intro dari awal setiap kali halaman dibuka
  // Route guard: Jika Level 1 sudah selesai dituntaskan, alihkan kembali ke /maps
  useEffect(() => {
    try {
      const completed = getCompletedLevels();
      if (completed.includes(1)) {
        router.replace("/maps");
        return;
      }
    } catch {
      // ignore
    }

    resetLevel1Session();
    startIntroSequence();

    return () => {
      clearIntroTimers();
    };
  }, [router]);

  // Helper untuk memicu confetti di setiap sudut
  const triggerCornerConfetti = () => {
    try {
      // Sudut Kiri Bawah
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.9 },
        zIndex: 999,
      });
      // Sudut Kanan Bawah
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.9 },
        zIndex: 999,
      });
      // Sudut Kiri Atas
      confetti({
        particleCount: 40,
        angle: 310,
        spread: 45,
        origin: { x: 0.05, y: 0.1 },
        zIndex: 999,
      });
      // Sudut Kanan Atas
      confetti({
        particleCount: 40,
        angle: 230,
        spread: 45,
        origin: { x: 0.95, y: 0.1 },
        zIndex: 999,
      });
    } catch {
      // Abaikan jika confetti gagal
    }
  };

  // Menangani alur kemenangan (2 soal benar)
  const handleWinFlow = () => {
    // 1. Simpan item kartu level 2 ke inventaris pemain & tandai Pos 1 telah tuntas
    markLevelCompleted(1);
    const currentItems = getSavedInventoryItems();
    if (!currentItems.includes("cardlevel2")) {
      saveInventoryItems([...currentItems, "cardlevel2"]);
    }

    // 2. Tampilkan star.webp mengkilau di tengah layar & confetti di setiap sudut
    setShowStarCelebration(true);
    triggerCornerConfetti();

    // 3. Beri delay 2.2 detik lalu terbangkan star ke topbar component bagian bag
    setTimeout(() => {
      setStarFlying(true);

      // Setelah animasi terbang selesai (1.1s), auto enable bag dan maps di topbar
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("aksara-lawu-topbar-toggle", {
            detail: { disableInGame: false },
          })
        );
        setShowStarCelebration(false);
        // Tampilkan pop up coklat kemenangan berisi kartu level 2
        setShowVictoryPopup(true);
      }, 1100);
    }, 2200);
  };

  // Logika Menjawab Soal:
  // - Setiap soal jatah menjawab 2 kali
  // - Total soal yang diuji = 3
  // - Butuh 2 soal benar untuk menang
  // - Jika salah pada kesempatan 1 -> popup salah (2.3s) -> coba lagi di soal yang sama (kesempatan ke-2)
  // - Jika salah pada kesempatan 2 -> kesempatan habis:
  //   - Cek apakah masih bisa menang (misal baru soal 1 atau soal 2):
  //     - Jika masih ada soal ke-3 dan belum game over permanen -> lanjut ke soal berikutnya
  //     - Jika sudah tidak mungkin mencapai 2 benar (misal sudah 2 soal gagal) -> popup gameover
  const handleSelectAnswer = (selectedSymbol: "o" | "plus" | "x" | "y") => {
    if (popupType !== null || introStep !== "in_game" || questions.length === 0) {
      return;
    }

    const currentQ = questions[currentQIndex];
    if (!currentQ) return;

    const isCorrect = selectedSymbol === currentQ.correctSymbolId;

    if (isCorrect) {
      // JAWABAN BENAR
      const newCorrectCount = correctAnswersCount + 1;
      setCorrectAnswersCount(newCorrectCount);
      setPopupType("correct");

      // Cek apakah sudah memenuhi target 2 soal benar
      if (newCorrectCount >= 2) {
        // Pemain menang! Setelah popup correct selesai, jalankan win flow
        setTimeout(() => {
          setPopupType(null);
          handleWinFlow();
        }, 2300);
      } else {
        // Belum 2 benar, lanjut ke soal berikutnya
        setTimeout(() => {
          setPopupType(null);
          if (currentQIndex < 2) {
            setCurrentQIndex((prev) => prev + 1);
            setAttemptsUsed(0);
          } else {
            // Sudah sampai soal ke-3 tapi belum dapat 2 benar -> game over
            setPopupType("gameover");
          }
        }, 2300);
      }
    } else {
      // JAWABAN SALAH
      const newAttempts = attemptsUsed + 1;
      setAttemptsUsed(newAttempts);

      if (newAttempts < 2) {
        // Masih ada 1 kesempatan tersisa untuk soal ini
        setPopupType("salah");
        setTimeout(() => {
          setPopupType(null);
        }, 2300);
      } else {
        // Kesempatan 2 kali habis untuk soal ini!
        const remainingQuestions = 3 - (currentQIndex + 1);
        const maxPossibleWins = correctAnswersCount + remainingQuestions;

        if (maxPossibleWins >= 2 && currentQIndex < 2) {
          // Masih bisa menang di soal berikutnya -> tampilkan popup salah sebentar lalu ganti soal
          setPopupType("salah");
          setTimeout(() => {
            setPopupType(null);
            setCurrentQIndex((prev) => prev + 1);
            setAttemptsUsed(0);
          }, 2300);
        } else {
          // Sudah tidak mungkin mencapai 2 benar -> LANGSUNG TAMPILKAN GAME OVER sampai user klik gambar
          setPopupType("gameover");
        }
      }
    }
  };

  // Game over -> bersihkan seluruh state sesi permainan lalu kembali ke halaman introlevel1
  const handleGameOverRestart = () => {
    resetLevel1Session();
    try {
      sessionStorage.removeItem("aksara_lawu_level1_session");
    } catch {
      // Abaikan jika tidak tersedia
    }
    router.push("/intro_level1");
  };

  // Tombol kembali pada popup kemenangan -> kembali ke peta
  const handleVictoryBack = () => {
    router.push("/maps");
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <main className="l1g-root" aria-label="Game Level 1: Pos 1 Jejak Lawu">
      <div className="l1g-viewport">
        {/* =============================================
            1. AREA PAPAN SOAL DAN JAWABAN (ATAS)
            Dirender di dalam papan kayu bg_rev.webp
            ============================================= */}
        {introStep === "in_game" && currentQuestion && (
          <>
            {/* Indikator kesempatan menjawab (2 jatah dot per soal) di atas atap papan */}
            <div className="l1g-attempts-indicator" aria-label="Indikator Kesempatan">
              <span>KESEMPATAN MANGSULI :</span>
              <div
                className={`l1g-attempt-dot ${attemptsUsed >= 1 ? "l1g-dot-used" : ""}`}
                title="Kesempatan 1"
              />
              <div
                className={`l1g-attempt-dot ${attemptsUsed >= 2 ? "l1g-dot-used" : ""}`}
                title="Kesempatan 2"
              />
            </div>

            <section className="l1g-board-content" aria-label="Papan Soal Aksara Jawa">
              {/* Soal Aksara Jawa */}
              <div className="l1g-question-box">
                <h2 className="l1g-question-text">{currentQuestion.question}</h2>
              </div>

            {/* Opsi Jawaban Aksara Jawa berpasangan dengan Ikon */}
            <div className="l1g-options-grid">
              {currentQuestion.options.map((option: QuestionOption) => {
                const sym = SYMBOL_CONTROLS.find((s) => s.id === option.symbolId);
                return (
                  <div key={option.symbolId} className="l1g-option-card">
                    <div className="l1g-option-badge">
                      {sym && (
                        <img
                          src={sym.src}
                          alt={sym.alt}
                          className="l1g-badge-icon"
                          draggable={false}
                        />
                      )}
                    </div>
                    <span className="l1g-option-text">{option.text}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

        {/* =============================================
            2. BAGIAN BAWAH: 4 TOMBOL ICON (O, +, X, Y)
            Tepat di atas papan bawah coklat bg_rev.webp
            ============================================= */}
        <section
          className="l1g-bottom-controls-bar"
          aria-label="Panel Tombol Simbol Jawaban"
        >
          {SYMBOL_CONTROLS.map((ctrl) => (
            <button
              key={ctrl.id}
              type="button"
              id={`btn-game-symbol-${ctrl.id}`}
              onClick={() => handleSelectAnswer(ctrl.id)}
              disabled={introStep !== "in_game" || popupType !== null}
              className="l1g-symbol-button"
              aria-label={ctrl.alt}
              title={ctrl.alt}
            >
              <img
                src={ctrl.src}
                alt={ctrl.alt}
                className="l1g-symbol-btn-img"
                draggable={false}
              />
            </button>
          ))}
        </section>

        {/* =============================================
            3. INTRO FLOW: LOADING, COUNTDOWN (3, 2, 1), & READY
               Langsung tampil di tengah layar tanpa kotak background cokelat
            ============================================= */}
        {introStep !== "initial_wait" && introStep !== "in_game" && (
          <div className="l1g-intro-stage" role="status" aria-live="polite">
            {introStep === "loading" && (
              <div className="l1g-intro-loading-wrap">
                <div className="l1g-loading-spinner" />
                <p className="l1g-loading-text">Nyiapake Tantangan Pos 1...</p>
              </div>
            )}

            {introStep === "countdown_3" && (
              <img
                src="/pos1/3.png"
                alt="3"
                className="l1g-countdown-img"
                draggable={false}
              />
            )}

            {introStep === "countdown_2" && (
              <img
                src="/pos1/2.png"
                alt="2"
                className="l1g-countdown-img"
                draggable={false}
              />
            )}

            {introStep === "countdown_1" && (
              <img
                src="/pos1/1.png"
                alt="1"
                className="l1g-countdown-img"
                draggable={false}
              />
            )}

            {introStep === "ready" && (
              <div className="l1g-ready-banner-wrapper" aria-label="Siap Mulai">
                <img
                  src="/pos1/ready.png"
                  alt="Siap, Mulai"
                  className="l1g-ready-img"
                  draggable={false}
                />
              </div>
            )}
          </div>
        )}

        {/* =============================================
            4. FEEDBACK POPUP GAMEPLAY (popup.txt):
               - Benar (correct.webp)
               - Salah (salah.webp + red border + shake)
               - Game Over (gameover.webp + klik balik ke introlevel1)
            ============================================= */}
        <GamePopup
          type={popupType}
          onGameOverClick={handleGameOverRestart}
        />

        {/* =============================================
            5. ANIMASI STAR MENGKILAU + TERBANG KE BAG
            ============================================= */}
        {showStarCelebration && (
          <div className="l1g-star-celebration-overlay">
            <img
              src="/pos1/star.webp"
              alt="Bintang Prestasi"
              className={`l1g-star-element ${starFlying ? "l1g-star-fly" : ""}`}
              draggable={false}
            />
          </div>
        )}

        {/* =============================================
            6. POPUP COKLAT KEMENANGAN (KARTU AKSES LEVEL 2)
            - tanpa shadow fokus
            - kartu /assets/inventory/cardlevel2.png di tengah
            - teks "cek penyimpenan untuk mendapatkan informasi lebih lanjut"
            - tombol "Bali" dalam bahasa Jawa
            ============================================= */}
        {showVictoryPopup && (
          <div className="l1g-focus-overlay" role="dialog" aria-modal="true">
            <div className="l1g-victory-box">
              <h2 className="l1g-victory-title">Sugeng, Kowé Kasil!</h2>
              <div className="l1g-card-wrapper">
                <img
                  src="/assets/inventory/cardlevel2.png"
                  alt="Kartu Akses Level 2"
                  className="l1g-card-img"
                  draggable={false}
                />
              </div>
              <p className="l1g-victory-desc">
                Cek panyimpenan kanggo éntuk informasi luwih jangkep babagan Pos 2!
              </p>
              <button
                type="button"
                id="btn-victory-back"
                onClick={handleVictoryBack}
                className="l1g-btn-back"
                aria-label="Bali menyang Peta"
                title="Bali menyang Peta"
              >
                Bali menyang Peta
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
