"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import GamePopup, { GamePopupType } from "../components/GamePopup/GamePopup";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import FallenLeaves from "../components/fallenleaves/FallenLeaves";
import FogWind from "../components/FogWind/FogWind";
import {
  ALL_LEVEL2_QUESTIONS,
  Level2QuestionItem,
} from "./level2Questions";
import {
  getSavedInventoryItems,
  saveInventoryItems,
  markLevelCompleted,
  unlockLevel,
} from "../lib/inventoryStorage";
import "./level2-game.css";

// Definisi Tombol Arah Navigasi Labirin
type DirectionType = "kiri" | "lurus" | "kanan";

const DIRECTION_BUTTONS: { id: DirectionType; src: string; alt: string }[] = [
  { id: "kiri", src: "/labirin_pendakian/kiri.png", alt: "Tombol Kiwa (Kiri)" },
  { id: "lurus", src: "/labirin_pendakian/lurus.png", alt: "Tombol Lurus" },
  { id: "kanan", src: "/labirin_pendakian/kanan.png", alt: "Tombol Tengen (Kanan)" },
];

// Jawaban arah yang benar per scene (sesuai spesifikasi)
// scene 1 = kiri, scene 2 = lurus, scene 3 = kanan
const CORRECT_SCENE_DIRECTIONS: Record<number, DirectionType> = {
  1: "kiri",
  2: "lurus",
  3: "kanan",
};

// Jumlah soal yang harus dijawab per scene
const SCENE_QUESTION_REQUIREMENT: Record<number, number> = {
  1: 3,
  2: 3,
  3: 2,
};

export default function Level2GamePage() {
  const router = useRouter();

  // 1. STATE SCENE & MODE:
  // scene: 1 (scene1), 2 (scene2), 3 (scene3), 4 (ending_rev)
  const [currentScene, setCurrentScene] = useState<number>(1);
  // viewMode: "scene" (halaman labirin) | "question" (halaman soal)
  const [viewMode, setViewMode] = useState<"scene" | "question">("scene");

  // 2. STATE DATA PEMAIN:
  const [userName, setUserName] = useState<string>("Pendaki");

  // Status penyelesaian soal per scene (scene 1, 2, 3)
  // Sebelum menjawab semua soal di scene tersebut, tombol arah navigasi TIDAK boleh di-enable dan TIDAK boleh dianimasi
  const [hasCompletedQuestionsForScene, setHasCompletedQuestionsForScene] = useState<
    Record<number, boolean>
  >({
    1: false,
    2: false,
    3: false,
  });

  // 3. STATE POPUP PEMANDU:
  const [showScene1WelcomeGuide, setShowScene1WelcomeGuide] = useState<boolean>(true);
  const [showPemanduScene1, setShowPemanduScene1] = useState<boolean>(false);
  const [showQuestionScene1Intro, setShowQuestionScene1Intro] = useState<boolean>(false);
  const [showSuccessDirectionDialog, setShowSuccessDirectionDialog] = useState<boolean>(false);
  const [showPemanduEnding, setShowPemanduEnding] = useState<boolean>(false);

  // 4. STATE TRANSISI COVER HITAM:
  // curtainState: "hidden" | "closing" (nutup) | "waiting" (tahan 1.5s) | "opening" (buka ke atas)
  const [curtainState, setCurtainState] = useState<
    "hidden" | "closing" | "waiting" | "opening"
  >("hidden");

  // 5. STATE PERTANYAAN LEVEL 2:
  const [availableQuestions, setAvailableQuestions] = useState<Level2QuestionItem[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Level2QuestionItem | null>(null);
  const [solvedQuestionsInScene, setSolvedQuestionsInScene] = useState<number>(0);
  const [totalMistakes, setTotalMistakes] = useState<number>(0); // Total salah maksimal 2x

  // Pemetaan acak 2 opsi jawaban ('a' & 'b') ke 2 tombol dari 3 arah (misal kiri & lurus, atau lurus & kanan, dll)
  const [assignedButtons, setAssignedButtons] = useState<{
    keyA: DirectionType;
    keyB: DirectionType;
  }>({ keyA: "kiri", keyB: "kanan" });

  // 6. STATE FEEDBACK JAWABAN BENAR:
  const [isAnswerSuccess, setIsAnswerSuccess] = useState<boolean>(false);
  const [successDirection, setSuccessDirection] = useState<DirectionType>("kiri");

  // 7. STATE POPUP POPUP (Benar, Salah, Game Over):
  const [popupType, setPopupType] = useState<GamePopupType>(null);

  // 8. STATE KEMENANGAN (VICTORY FLOW PADA SCENE 3 ARAH BENAR):
  const [showStarCelebration, setShowStarCelebration] = useState<boolean>(false);
  const [starFlying, setStarFlying] = useState<boolean>(false);
  const [showVictoryCardPopup, setShowVictoryCardPopup] = useState<boolean>(false);

  // Refs untuk interval timer
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSeenQuestionIntroRef = useRef<boolean>(false);

  // Inisialisasi Nama User dari Session Storage & Reset Sesi Level 2
  useEffect(() => {
    resetLevel2Session();
    try {
      const rawSession =
        sessionStorage.getItem("aksara_lawu_current_session") ||
        localStorage.getItem("aksara_lawu_current_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        const name = parsed.nama || parsed.name || parsed.username || "Pendaki";
        setUserName(String(name).slice(0, 12));
      }
    } catch {
      setUserName("Pendaki");
    }
  }, []);

  // Fungsi untuk membersihkan dan mereset ulang seluruh sesi permainan Level 2
  const resetLevel2Session = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    setCurrentScene(1);
    setViewMode("scene");
    setHasCompletedQuestionsForScene({
      1: false,
      2: false,
      3: false,
    });
    setShowScene1WelcomeGuide(true);
    setShowPemanduScene1(false);
    setShowQuestionScene1Intro(false);
    hasSeenQuestionIntroRef.current = false;
    setShowSuccessDirectionDialog(false);
    setShowPemanduEnding(false);
    setCurtainState("hidden");
    const freshShuffled = [...ALL_LEVEL2_QUESTIONS].sort(() => 0.5 - Math.random());
    setAvailableQuestions(freshShuffled);
    setActiveQuestion(null);
    setSolvedQuestionsInScene(0);
    setTotalMistakes(0);
    setIsAnswerSuccess(false);
    setPopupType(null);
    setShowStarCelebration(false);
    setStarFlying(false);
    setShowVictoryCardPopup(false);

    try {
      sessionStorage.removeItem("aksara_lawu_level2_session");
      localStorage.removeItem("aksara_lawu_level2_session");
    } catch {
      // ignore
    }
  };

  // Dialog pemandu saat pertama kali mengunjungi Scene 1
  const scene1WelcomeDialogs = useMemo<DialogItem[]>(() => {
    return [
      {
        id: 1,
        speakerName: "Panuntun Lawu",
        character: "/character/guider_pose1.png",
        characterSide: "left",
        text: "Ayo pencet papan kanggo golek informasi luwih jangkep!",
      },
    ];
  }, []);

  // Data dialog pemandu untuk Scene 1 saat klik papan (menggunakan DialogPopup berkarakter ala Cemoro Sewu)
  const scene1PemanduDialogs = useMemo<DialogItem[]>(() => {
    return [
      {
        id: 1,
        speakerName: "Panuntun Lawu",
        character: "/character/guider_pose1.png",
        characterSide: "left",
        text: `Halo ${userName}, kowe wis tekan ing pertigaan! Wangsulana sawetara pitakon iki kanggo entuk informasi supaya ora kesasar.`,
      },
    ];
  }, [userName]);

  // Data dialog pemandu saat awal mula masuk halaman question dari Scene 1
  const questionScene1IntroDialogs = useMemo<DialogItem[]>(() => {
    return [
      {
        id: 1,
        speakerName: "Panuntun Lawu",
        character: "/character/guider_pose1.png",
        characterSide: "left",
        text: "Wangsulana pitakon iki kanggo entuk pituduh dalan sing bener, muga-muga kowe beja!",
      },
    ];
  }, []);

  // Data dialog pemandu setelah berhasil menjawab soal: arah yang benar
  const successDirectionDialogs = useMemo<DialogItem[]>(() => {
    const directionNameJawa =
      successDirection === "kiri"
        ? "KIWA (Kiri)"
        : successDirection === "lurus"
        ? "LURUS"
        : "TENGEN (Kanan)";
    return [
      {
        id: 1,
        speakerName: "Panuntun Lawu",
        character: "/character/guider_pose1.png",
        characterSide: "left",
        text: `Sugeng kowe kasil mangsuli kabeh pitakon! Dalan sing bener yaiku ${directionNameJawa}. Pencet tombol ${directionNameJawa} kanggo entuk dalan sing bener!`,
        rewardItem: {
          image: `/labirin_pendakian/${successDirection}.png`,
          name: directionNameJawa,
        },
      },
    ];
  }, [successDirection]);

  // Data dialog pemandu untuk Scene Ending (menggunakan DialogPopup berkarakter ala Cemoro Sewu)
  const endingPemanduDialogs = useMemo<DialogItem[]>(() => {
    return [
      {
        id: 1,
        speakerName: "Panuntun Lawu",
        character: "/character/guider_pose1.png",
        characterSide: "left",
        text: `Sugeng ${userName}, kowe wis ana ing dalan metu Labirin Pendakian! Siapna tenagamu kanggo tumuju menyang Warung Ngaso.`,
      },
    ];
  }, [userName]);

  // Bersihkan semua timer saat unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Sembunyikan TopBar jika sedang berada di halaman soal (question), dan tampilkan kembali di scene labirin
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("aksara-lawu-topbar-toggle", {
          detail: { hidden: viewMode === "question" },
        })
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("aksara-lawu-topbar-toggle", {
            detail: { hidden: false },
          })
        );
      }
    };
  }, [viewMode]);

  // Handler saat pemain menekan Target Papan di Scene 1, 2, atau 3
  const handleBoardClick = () => {
    // Jika soal di ronde/scene ini sudah selesai dijawab, abaikan klik
    if (hasCompletedQuestionsForScene[currentScene]) return;

    if (currentScene === 1) {
      // Scene 1: Munculkan popup pemandu terlebih dahulu
      setShowPemanduScene1(true);
    } else {
      // Scene 2 & Scene 3: Langsung transisi ke halaman question
      triggerTransitionToQuestion();
    }
  };

  // Tutup popup pemandu scene 1 dan langsung arahkan ke question dengan animasi cover
  const handleStartQuestionsScene1 = () => {
    setShowPemanduScene1(false);
    triggerTransitionToQuestion();
  };

  // Fungsi helper untuk memulai transisi cover hitam (delay 1.5s -> buka ke atas)
  const triggerTransitionToQuestion = () => {
    setSolvedQuestionsInScene(0); // Hitung baru soal benar untuk ronde ini
    setTotalMistakes(0); // Hitung baru kesalahan untuk ronde ini
    prepareNextQuestion();
    setCurtainState("closing");

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    transitionTimerRef.current = setTimeout(() => {
      // Switch view mode saat cover menutup penuh
      setViewMode("question");
      setCurtainState("waiting");

      // Tahan 1.5 detik sesuai instruksi spesifikasi
      setTimeout(() => {
        setCurtainState("opening");
        setTimeout(() => {
          setCurtainState("hidden");
          // Munculkan dialog pengantar saat pertama kali mengunjungi question dari scene 1
          if (currentScene === 1 && !hasSeenQuestionIntroRef.current) {
            hasSeenQuestionIntroRef.current = true;
            setShowQuestionScene1Intro(true);
          }
        }, 1200);
      }, 1500);
    }, 500);
  };

  // Memilih soal baru yang belum terjawab & mengacak mapping tombolnya
  const prepareNextQuestion = (explicitPool?: Level2QuestionItem[]) => {
    setIsAnswerSuccess(false);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // Ambil soal pertama dari sisa yang tersedia
    let pool = explicitPool || availableQuestions;
    if (!pool || pool.length === 0) {
      pool = [...ALL_LEVEL2_QUESTIONS].sort(() => 0.5 - Math.random());
    }

    const nextQ = pool[0];
    setActiveQuestion(nextQ);

    // Acak kombinasi 2 dari 3 tombol untuk opsi A & B
    const dirs: DirectionType[] = ["kiri", "lurus", "kanan"];
    const shuffledDirs = [...dirs].sort(() => 0.5 - Math.random());
    setAssignedButtons({
      keyA: shuffledDirs[0],
      keyB: shuffledDirs[1],
    });
  };

  // Handler saat pemain memilih salah satu tombol arah di halaman Question
  const handleQuestionOptionClick = (clickedDir: DirectionType) => {
    if (!activeQuestion || popupType !== null || showQuestionScene1Intro) return;

    // Jika sedang dalam state sukses menjawab, klik tombol yang menyala akan mempercepat navigasi
    if (isAnswerSuccess) {
      if (clickedDir === successDirection) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setShowSuccessDirectionDialog(false);
        finishQuestionRoundAndReturn();
      }
      return;
    }

    // Tentukan apakah tombol yang ditekan sesuai dengan jawaban benar soal
    const correctDir =
      activeQuestion.correctKey === "a"
        ? assignedButtons.keyA
        : assignedButtons.keyB;

    if (clickedDir === correctDir) {
      // JAWABAN BENAR!
      setPopupType("correct");

      const newSolved = solvedQuestionsInScene + 1;
      setSolvedQuestionsInScene(newSolved);

      // Hapus soal yang berhasil dijawab dari pool agar tidak muncul lagi
      const remainingPool = availableQuestions.filter((q) => q.id !== activeQuestion.id);
      setAvailableQuestions(remainingPool);

      // Cek apakah target jumlah soal di ronde/scene ini sudah terpenuhi (Round 1: 3, Round 2: 3, Round 3: 2)
      const req = SCENE_QUESTION_REQUIREMENT[currentScene] || 3;

      if (newSolved >= req) {
        // Sudah menyelesaikan seluruh soal untuk ronde/scene ini!
        // Tandai scene ini telah berhasil dijawab agar tombol arahnya aktif di scene labirin
        setHasCompletedQuestionsForScene((prev) => ({
          ...prev,
          [currentScene]: true,
        }));

        const targetDirection = CORRECT_SCENE_DIRECTIONS[currentScene] || "kiri";
        setSuccessDirection(targetDirection);
        setIsAnswerSuccess(true);

        // Pop up benar muncul selama 1.5 detik, lalu tutup dan munculkan DialogPopup Pemandu
        setTimeout(() => {
          setPopupType(null);
          setShowSuccessDirectionDialog(true);
        }, 1500);
      } else {
        // Pop up benar muncul selama 1.5 detik, lalu tutup dan lanjut ke soal berikutnya
        setTimeout(() => {
          setPopupType(null);
          prepareNextQuestion(remainingPool);
        }, 1500);
      }
    } else {
      // JAWABAN SALAH!
      const newWrong = totalMistakes + 1;
      setTotalMistakes(newWrong);

      if (newWrong > 2) {
        // Kesempatan ganti soal hingga 2x habis & masih salah -> Game Over kembali ke intro_level2
        setPopupType("gameover");
      } else {
        // Kesalahan ke-1 atau ke-2: munculkan popup salah 1.5s dan ganti soal dengan soal lain yang belum terjawab
        setPopupType("salah");
        setTimeout(() => {
          setPopupType(null);
          // Pindahkan soal yang salah ke bagian paling belakang pool
          let updatedPool = [...availableQuestions];
          if (updatedPool.length > 1) {
            const currentItem = updatedPool[0];
            const others = updatedPool.slice(1);
            updatedPool = [...others, currentItem];
          }
          setAvailableQuestions(updatedPool);
          // Segera siapkan soal berbeda dari updatedPool
          prepareNextQuestion(updatedPool);
        }, 1500);
      }
    }
  };

  // Fungsi transisi balik dari Question ke Scene Labirin setelah sukses menjawab
  const finishQuestionRoundAndReturn = () => {
    setShowSuccessDirectionDialog(false);
    setIsAnswerSuccess(false);
    setCurtainState("closing");

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

    transitionTimerRef.current = setTimeout(() => {
      setViewMode("scene");
      setSolvedQuestionsInScene(0); // Reset hitungan soal untuk ronde berikutnya
      setTotalMistakes(0); // Reset hitungan kesalahan untuk ronde berikutnya
      setCurtainState("waiting");

      setTimeout(() => {
        setCurtainState("opening");
        setTimeout(() => {
          setCurtainState("hidden");
        }, 1000);
      }, 1500);
    }, 450);
  };

  // Handler saat pemain menekan tombol arah di Scene Labirin
  const handleSceneNavClick = (dir: DirectionType) => {
    // Jangan izinkan navigasi jika soal pada scene ini belum tuntas dijawab
    if (!hasCompletedQuestionsForScene[currentScene]) return;

    const requiredDir = CORRECT_SCENE_DIRECTIONS[currentScene];

    // Hanya tombol arah yang benar yang merespons
    if (dir !== requiredDir) return;

    if (currentScene === 1) {
      // Pindah ke Scene 2 (Ronde 2 dimulai fresh)
      setCurrentScene(2);
      setSolvedQuestionsInScene(0);
      setTotalMistakes(0);
    } else if (currentScene === 2) {
      // Pindah ke Scene 3 (Ronde 3 dimulai fresh)
      setCurrentScene(3);
      setSolvedQuestionsInScene(0);
      setTotalMistakes(0);
    } else if (currentScene === 3) {
      // Selesai Scene 3 -> Animasi Bintang Terbang ke Bag + Kartu Level 3 + Confetti
      triggerVictoryScene3();
    }
  };

  // Efek kemenangan setelah memencet arah yang benar di Scene 3
  const triggerVictoryScene3 = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        zIndex: 999,
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.15, y: 0.7 },
        zIndex: 999,
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.85, y: 0.7 },
        zIndex: 999,
      });
    } catch {
      // Abaikan jika confetti error
    }

    setShowStarCelebration(true);

    // Bintang berputar di tengah layar lalu terbang ke bag di TopBar
    setTimeout(() => {
      setStarFlying(true);
      setTimeout(() => {
        setShowStarCelebration(false);
        setStarFlying(false);

        // Simpan Kartu Level 3 ke Inventory & Buka Gembok Level 3
        const currentItems = getSavedInventoryItems();
        if (!currentItems.includes("cardlevel3")) {
          saveInventoryItems([...currentItems, "cardlevel3"]);
        }
        unlockLevel(3);
        markLevelCompleted(2);

        // Munculkan popup kartu Level 3
        setShowVictoryCardPopup(true);
      }, 1300);
    }, 1800);
  };

  // Tombol "Lanjut menyang Gerbang Metu" pada popup kartu level 3
  const handleProceedToEnding = () => {
    setShowVictoryCardPopup(false);
    setCurrentScene(4); // Masuk ke ending_rev
  };

  // Handler saat pesan.webp di scene ending dipencet
  const handleEndingMessageClick = () => {
    setShowPemanduEnding(true);
  };

  // Kembali ke halaman peta dari ending
  const handleReturnToMaps = () => {
    router.push("/maps");
  };

  // Restart kembali ke intro_level2 saat Game Over (bersihkan seluruh state sesi Level 2)
  const handleGameOverRestart = () => {
    resetLevel2Session();
    router.push("/intro_level2");
  };

  // Gambar latar belakang dinamis berdasarkan viewMode dan currentScene
  const currentBackgroundSrc = useMemo(() => {
    if (viewMode === "question") {
      return "/labirin_pendakian/question_bg.webp";
    }
    if (currentScene === 1) return "/labirin_pendakian/scene1.webp";
    if (currentScene === 2) return "/labirin_pendakian/scene2.webp";
    if (currentScene === 3) return "/labirin_pendakian/scene3.webp";
    return "/labirin_pendakian/ending_rev.webp";
  }, [viewMode, currentScene]);

  // Arah yang harus dipilih untuk scene saat ini
  const requiredDirectionForScene = CORRECT_SCENE_DIRECTIONS[currentScene];

  return (
    <main className="l2g-root" aria-label="Game Level 2 - Labirin Pendakian">
      <div className="l2g-viewport">
        {/* =========================================================
            1. BACKGROUND LAYER
            ========================================================= */}
        <div
          className="l2g-bg-layer"
          style={{ backgroundImage: `url(${currentBackgroundSrc})` }}
        />

        {/* =========================================================
            2. EFEK DAUN GUGUR & FOG WIND
               - Daun jatuh untuk scene 1 s/d ending
               - Fog dan daun khusus untuk question
            ========================================================= */}
        <FallenLeaves />
        {viewMode === "question" && <FogWind opacity={0.55} />}

        {/* =========================================================
            3. KONTEN MODE SCENE LABIRIN (SCENE 1, 2, 3, & ENDING)
            ========================================================= */}
        {viewMode === "scene" && (
          <>
            {/* TARGET PAPAN INTERAKTIF (Hanya di Scene 1, 2, dan 3 jika ronde belum tuntas)
                Setelah ronde berhasil dijawab, garis putus-putus dan target dihilangkan agar pemain fokus menekan arah yang benar */}
            {currentScene <= 3 && !hasCompletedQuestionsForScene[currentScene] && (
              <button
                type="button"
                id="btn-target-papan"
                className={`l2g-target-board-area l2g-target-scene-${currentScene}`}
                onClick={handleBoardClick}
                aria-label="Papan Petunjuk Labirin"
                title="Pencet Papan Petunjuk"
              >
                {/* Kotak garis putus-putus kuning glow */}
                <div className="l2g-target-dashed-box" />
                {/* Icon target lompat kecil di atas papan */}
                <img
                  src="/labirin_pendakian/target.png"
                  alt="Target"
                  className="l2g-target-icon"
                  draggable={false}
                />
              </button>
            )}

            {/* NAVIGASI TOMBOL KIRI, KANAN, LURUS / PESAN
                Diletakkan di slot perkamen Kiri, Kanan, dan Bawah sesuai Desain Figma (Gambar 4).
                Sebelum menjawab semua soal, tombol TIDAK di-enable dan TIDAK dianimasi. */}
            {currentScene <= 3 ? (
              <>
                {/* Tombol KIRI di Slot Perkamen Kiri */}
                <div className="l2g-nav-slot-kiri">
                  <button
                    type="button"
                    id="btn-scene-nav-kiri"
                    className={`l2g-nav-button-card ${
                      hasCompletedQuestionsForScene[currentScene] &&
                      requiredDirectionForScene === "kiri"
                        ? "l2g-btn-shake"
                        : ""
                    }`}
                    onClick={() => handleSceneNavClick("kiri")}
                    disabled={
                      !hasCompletedQuestionsForScene[currentScene] ||
                      requiredDirectionForScene !== "kiri"
                    }
                    aria-label="Tombol Kiwa (Kiri)"
                    title="Tombol Kiwa (Kiri)"
                  >
                    <img
                      src="/labirin_pendakian/kiri.png"
                      alt="Tombol Kiwa"
                      className="l2g-nav-btn-img"
                      draggable={false}
                    />
                  </button>
                </div>

                {/* Tombol KANAN di Slot Perkamen Kanan */}
                <div className="l2g-nav-slot-kanan">
                  <button
                    type="button"
                    id="btn-scene-nav-kanan"
                    className={`l2g-nav-button-card ${
                      hasCompletedQuestionsForScene[currentScene] &&
                      requiredDirectionForScene === "kanan"
                        ? "l2g-btn-shake"
                        : ""
                    }`}
                    onClick={() => handleSceneNavClick("kanan")}
                    disabled={
                      !hasCompletedQuestionsForScene[currentScene] ||
                      requiredDirectionForScene !== "kanan"
                    }
                    aria-label="Tombol Tengen (Kanan)"
                    title="Tombol Tengen (Kanan)"
                  >
                    <img
                      src="/labirin_pendakian/kanan.png"
                      alt="Tombol Tengen"
                      className="l2g-nav-btn-img"
                      draggable={false}
                    />
                  </button>
                </div>

                {/* Tombol LURUS di Slot Perkamen Bawah */}
                <div className="l2g-nav-slot-lurus">
                  <button
                    type="button"
                    id="btn-scene-nav-lurus"
                    className={`l2g-nav-button-card ${
                      hasCompletedQuestionsForScene[currentScene] &&
                      requiredDirectionForScene === "lurus"
                        ? "l2g-btn-shake"
                        : ""
                    }`}
                    onClick={() => handleSceneNavClick("lurus")}
                    disabled={
                      !hasCompletedQuestionsForScene[currentScene] ||
                      requiredDirectionForScene !== "lurus"
                    }
                    aria-label="Tombol Lurus"
                    title="Tombol Lurus"
                  >
                    <img
                      src="/labirin_pendakian/lurus.png"
                      alt="Tombol Lurus"
                      className="l2g-nav-btn-img"
                      draggable={false}
                    />
                  </button>
                </div>
              </>
            ) : (
              // Ending Rev: Hanya tombol pesan.png di slot perkamen bawah beranimasi shake
              <div className="l2g-nav-slot-pesan">
                <button
                  type="button"
                  id="btn-ending-pesan"
                  className="l2g-nav-button-card l2g-btn-shake"
                  onClick={handleEndingMessageClick}
                  aria-label="Pesen Pemandu"
                  title="Pencet Pesen"
                >
                  <img
                    src="/labirin_pendakian/pesan.png"
                    alt="Pesan Pemandu"
                    className="l2g-nav-btn-img"
                    draggable={false}
                  />
                </button>
              </div>
            )}
          </>
        )}

        {/* =========================================================
            4. KONTEN MODE QUESTION (HALAMAN SOAL)
            ========================================================= */}
        {viewMode === "question" && activeQuestion && (
          <section className="l2g-question-stage" aria-label="Tantangan Soal Labirin">
            {/* AREA SOAL DI ATAS PAPAN question_bg */}
            <div className="l2g-question-board-content">
              {activeQuestion.image ? (
                // Layout Soal Gambar + Teks
                <div className="l2g-q-layout-with-image">
                  <div className="l2g-q-text-column">
                    <h2 className="l2g-q-prompt-text">{activeQuestion.questionText}</h2>
                    <div className="l2g-q-options-container">
                      <div className="l2g-q-option-pill">
                        <img
                          src={`/labirin_pendakian/${assignedButtons.keyA}.png`}
                          alt=""
                          className="l2g-q-option-btn-icon"
                        />
                        <span className="l2g-q-option-text">
                          {activeQuestion.options[0].text}
                        </span>
                      </div>
                      <div className="l2g-q-option-pill">
                        <img
                          src={`/labirin_pendakian/${assignedButtons.keyB}.png`}
                          alt=""
                          className="l2g-q-option-btn-icon"
                        />
                        <span className="l2g-q-option-text">
                          {activeQuestion.options[1].text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="l2g-q-image-column">
                    <div className="l2g-q-image-frame">
                      <img
                        src={activeQuestion.image}
                        alt="Candi Lawu"
                        className="l2g-q-candi-img"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Layout Soal Teks Saja
                <div className="l2g-q-layout-text-only">
                  <h2 className="l2g-q-prompt-text">{activeQuestion.questionText}</h2>
                  <div className="l2g-q-options-container">
                    <div className="l2g-q-option-pill">
                      <img
                        src={`/labirin_pendakian/${assignedButtons.keyA}.png`}
                        alt=""
                        className="l2g-q-option-btn-icon"
                      />
                      <span className="l2g-q-option-text">
                        {activeQuestion.options[0].text}
                      </span>
                    </div>
                    <div className="l2g-q-option-pill">
                      <img
                        src={`/labirin_pendakian/${assignedButtons.keyB}.png`}
                        alt=""
                        className="l2g-q-option-btn-icon"
                      />
                      <span className="l2g-q-option-text">
                        {activeQuestion.options[1].text}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TOMBOL PILIHAN JAWABAN QUESTION DI SLOT PERKAMEN KIRI, KANAN, BAWAH
                Sesuai Desain Figma (Gambar 4) */}
            {/* Tombol KIRI di Slot Perkamen Kiri */}
            <div className="l2g-nav-slot-kiri">
              <button
                type="button"
                id="btn-question-opt-kiri"
                className={`l2g-nav-button-card ${
                  isAnswerSuccess && successDirection === "kiri"
                    ? "l2g-btn-shake"
                    : ""
                }`}
                onClick={() => handleQuestionOptionClick("kiri")}
                disabled={
                  isAnswerSuccess
                    ? successDirection !== "kiri"
                    : assignedButtons.keyA !== "kiri" &&
                      assignedButtons.keyB !== "kiri"
                }
                aria-label="Pilihan Kiwa"
                title="Pilihan Kiwa"
              >
                <img
                  src="/labirin_pendakian/kiri.png"
                  alt="Kiwa"
                  className="l2g-nav-btn-img"
                  draggable={false}
                />
              </button>
            </div>

            {/* Tombol KANAN di Slot Perkamen Kanan */}
            <div className="l2g-nav-slot-kanan">
              <button
                type="button"
                id="btn-question-opt-kanan"
                className={`l2g-nav-button-card ${
                  isAnswerSuccess && successDirection === "kanan"
                    ? "l2g-btn-shake"
                    : ""
                }`}
                onClick={() => handleQuestionOptionClick("kanan")}
                disabled={
                  isAnswerSuccess
                    ? successDirection !== "kanan"
                    : assignedButtons.keyA !== "kanan" &&
                      assignedButtons.keyB !== "kanan"
                }
                aria-label="Pilihan Tengen"
                title="Pilihan Tengen"
              >
                <img
                  src="/labirin_pendakian/kanan.png"
                  alt="Tengen"
                  className="l2g-nav-btn-img"
                  draggable={false}
                />
              </button>
            </div>

            {/* Tombol LURUS di Slot Perkamen Bawah */}
            <div className="l2g-nav-slot-lurus">
              <button
                type="button"
                id="btn-question-opt-lurus"
                className={`l2g-nav-button-card ${
                  isAnswerSuccess && successDirection === "lurus"
                    ? "l2g-btn-shake"
                    : ""
                }`}
                onClick={() => handleQuestionOptionClick("lurus")}
                disabled={
                  isAnswerSuccess
                    ? successDirection !== "lurus"
                    : assignedButtons.keyA !== "lurus" &&
                      assignedButtons.keyB !== "lurus"
                }
                aria-label="Pilihan Lurus"
                title="Pilihan Lurus"
              >
                <img
                  src="/labirin_pendakian/lurus.png"
                  alt="Lurus"
                  className="l2g-nav-btn-img"
                  draggable={false}
                />
              </button>
            </div>
          </section>
        )}

        {/* =========================================================
            5. POPUP PEMANDU AWAL SCENE 1
            "Ayo pencet papan kanggo golek informasi luwih jangkep!"
            (Hanya saat pertama kali mengunjungi Scene 1)
            ========================================================= */}
        {showScene1WelcomeGuide && currentScene === 1 && viewMode === "scene" && (
          <DialogPopup
            key="scene1-welcome-guide"
            dialogs={scene1WelcomeDialogs}
            isOpen={showScene1WelcomeGuide}
            initialDelayMs={0}
            focusBackdrop={true}
            lastButtonText="Iya, Mangerteni ➔"
            onComplete={() => setShowScene1WelcomeGuide(false)}
          />
        )}

        {/* =========================================================
            6. POPUP PEMANDU SCENE 1 SAAT KLIK PAPAN
            ========================================================= */}
        {showPemanduScene1 && (
          <DialogPopup
            key="pemandu-scene1"
            dialogs={scene1PemanduDialogs}
            isOpen={showPemanduScene1}
            initialDelayMs={0}
            focusBackdrop={true}
            lastButtonText="Miwiti Wangsulan ➔"
            onComplete={handleStartQuestionsScene1}
          />
        )}

        {/* =========================================================
            6b. POPUP PEMANDU AWAL MASUK QUESTION DARI SCENE 1
            "Wangsulana pitakon iki kanggo entuk pituduh dalan sing bener, muga-muga kowe beja!"
            ========================================================= */}
        {showQuestionScene1Intro && viewMode === "question" && currentScene === 1 && (
          <DialogPopup
            key="question-scene1-intro"
            dialogs={questionScene1IntroDialogs}
            isOpen={showQuestionScene1Intro}
            initialDelayMs={0}
            focusBackdrop={true}
            lastButtonText="Miwiti Wangsulan ➔"
            onComplete={() => {
              setShowQuestionScene1Intro(false);
            }}
          />
        )}

        {/* =========================================================
            7. POPUP PEMANDU ARAH BENAR SETELAH SELESAI MENJAWAB SOAL
            (Menampilkan arah yang benar dan aset arah, aksi lewat tombol)
            ========================================================= */}
        {showSuccessDirectionDialog && (
          <DialogPopup
            key={`success-pemandu-${currentScene}`}
            dialogs={successDirectionDialogs}
            isOpen={showSuccessDirectionDialog}
            initialDelayMs={0}
            instantText={true}
            focusBackdrop={true}
            lastButtonText="Nerusake menyang Labirin ➔"
            onComplete={() => {
              setShowSuccessDirectionDialog(false);
              finishQuestionRoundAndReturn();
            }}
          />
        )}

        {/* =========================================================
            8. POPUP PEMANDU ENDING (Dialog Berkarakter Panuntun Cemoro Sewu)
            ========================================================= */}
        {showPemanduEnding && (
          <DialogPopup
            key="pemandu-ending"
            dialogs={endingPemanduDialogs}
            isOpen={showPemanduEnding}
            initialDelayMs={0}
            focusBackdrop={true}
            lastButtonText="Bali menyang Peta ➔"
            onComplete={handleReturnToMaps}
          />
        )}

        {/* =========================================================
            9. FEEDBACK POPUP GAMEPLAY (BENAR, SALAH, GAME OVER)
            - Muncul selama 1.5 detik (autoCloseDelay={1500})
            - Game Over dapat dipencet untuk restart ke /intro_level2
            ========================================================= */}
        <GamePopup
          type={popupType}
          autoCloseDelay={1500}
          onClose={() => setPopupType(null)}
          onGameOverClick={handleGameOverRestart}
        />

        {/* =========================================================
            10. ANIMASI STAR MENGKILAU + TERBANG KE BAG
            ========================================================= */}
        {showStarCelebration && (
          <div className="l2g-star-celebration-overlay">
            <img
              src="/pos1/star.webp"
              alt="Bintang Prestasi"
              className={`l2g-star-element ${starFlying ? "l2g-star-fly" : ""}`}
              draggable={false}
            />
          </div>
        )}

        {/* =========================================================
            11. POPUP KEMENANGAN KARTU LEVEL 3 (Styling Serupa Game Level 1)
            ========================================================= */}
        {showVictoryCardPopup && (
          <div className="l2g-focus-overlay" role="dialog" aria-modal="true">
            <div className="l2g-victory-box">
              <h2 className="l2g-victory-title">Mangayubagya, Kowe Kasil!</h2>
              <div className="l2g-card-wrapper">
                <img
                  src="/assets/inventory/cardlevel3.png"
                  alt="Kartu Akses Level 3"
                  className="l2g-card-img"
                  draggable={false}
                />
              </div>
              <p className="l2g-victory-desc">
                Cek panyimpenan kanggo entuk informasi luwih jangkep babagan Pos 3!
              </p>
              <button
                type="button"
                id="btn-victory-proceed-ending"
                onClick={handleProceedToEnding}
                className="l2g-btn-next-scene"
                aria-label="Nerusake menyang Gerbang Metu"
                title="Nerusake menyang Gerbang Metu"
              >
                Nerusake menyang Gerbang Metu
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            12. COVER TRANSISI DENGAN ASSET /cover/gamecover.webp
            Tahan 1.5 detik lalu mengangkat ke atas
            ========================================================= */}
        {curtainState !== "hidden" && (
          <div
            className={`l2g-curtain-cover ${
              curtainState === "closing"
                ? "l2g-curtain-closing"
                : curtainState === "opening"
                ? "l2g-curtain-opening"
                : ""
            }`}
          />
        )}
      </div>
    </main>
  );
}

