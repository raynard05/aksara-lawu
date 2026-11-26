"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import FogWind from "../components/FogWind/FogWind";
import FallenLeaves from "../components/fallenleaves/FallenLeaves";
import VirtualJoystick, {
  JoystickMoveEvent,
} from "../components/VirtualJoystick/VirtualJoystick";
import FlyingBirds from "../components/FlyingBirds/FlyingBirds";
import OpenWorld2NPC from "../components/OpenWorld2NPC/OpenWorld2NPC";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import {
  getSavedInventoryItems,
  saveInventoryItems,
} from "../lib/inventoryStorage";
import { Eye, EyeOff, RotateCcw, MessageCircle, Landmark, Ban, DoorOpen } from "lucide-react";
import "./openworld3.css";

// Flag untuk reset sesi otomatis saat refresh halaman (false = not refreshable / semua progres tersimpan permanen)
export const IS_REFRESHABLE_OW3: boolean = true;

// Titik Koordinat Tugu Lawu (Pelataran Tengah) & Range Area Misi
export const OW3_TUGU_POS = {
  x: 56.8,
  y: 57,
  radius: 18,
} as const;

// Titik Koordinat Penjaga Pos (Pak Agus) di dekat Tugu Lawu
export const OW3_PAK_AGUS_POS = {
  x: 41.5,
  y: 57,
  radius: 7.5,
} as const;

// Titik Koordinat Mbah Kakek di area magic (Pendhapa Meja Ungu)
export const OW3_KAKEK_POS = {
  x: 40,
  y: 41.5,
  radius: 7.5,
} as const;

// Titik Koordinat Gerbang Warung Ngaso (/intro_level3)
export const OW3_WARUNG_EXIT_POS = {
  x: 71,
  y: 39,
} as const;

// 5 Titik Lokasi Bintang di Sepanjang Rute Perjalanan Open World 3
export const OW3_STARS_DATA = [
  { id: 1, x: 24, y: 54 },
  { id: 2, x: 40, y: 46 },
  { id: 3, x: 66, y: 37 },
  { id: 4, x: 72, y: 58 },
  { id: 5, x: 52, y: 74 },
];

// 16 Frame Animasi Idle Mbah Kakek (/openworld3/kakek/Pose 01..16.webp)
const KAKEK_IDLE_FRAMES = Array.from({ length: 16 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, "0");
  return `/openworld3/kakek/Pose ${num}.webp`;
});

// 21 Frame WebP Resmi Sprite Karakter Berjalan
const WEBP_WALK_FRAMES = {
  down: [
    "/character/characterwalk1/characterwalk (1).webp",
    "/character/characterwalk1/characterwalk (2).webp",
    "/character/characterwalk1/characterwalk (3).webp",
    "/character/characterwalk1/characterwalk (4).webp",
    "/character/characterwalk1/characterwalk (5).webp",
    "/character/characterwalk1/characterwalk (20).webp",
    "/character/characterwalk1/characterwalk (21).webp",
  ],
  up: [
    "/character/characterwalk1/characterwalk (6).webp",
    "/character/characterwalk1/characterwalk (7).webp",
    "/character/characterwalk1/characterwalk (8).webp",
    "/character/characterwalk1/characterwalk (9).webp",
    "/character/characterwalk1/characterwalk (10).webp",
    "/character/characterwalk1/characterwalk (11).webp",
    "/character/characterwalk1/characterwalk (12).webp",
  ],
  right: [
    "/character/characterwalk1/characterwalk (17).webp",
    "/character/characterwalk1/characterwalk (18).webp",
    "/character/characterwalk1/characterwalk (19).webp",
  ],
  left: [
    "/character/characterwalk1/characterwalk (13).webp",
    "/character/characterwalk1/characterwalk (14).webp",
    "/character/characterwalk1/characterwalk (15).webp",
    "/character/characterwalk1/characterwalk (16).webp",
  ],
};

type Direction = "down" | "up" | "left" | "right";

export interface ObstacleBox {
  id: string;
  name: string;
  x: number; // Persentase X kiri (%)
  y: number; // Persentase Y atas (%)
  w: number; // Lebar (%)
  h: number; // Tinggi (%)
}

// Titik awal pemain: di jalur tanah lapang dekat Gerbang Labirin Pendakian (Kiri Bawah)
const OW3_START_POS = { x: 22, y: 68 };

// Rintangan Disesuaikan dengan Background /openworld3/openworld3.webp
export const OW3_DEFAULT_OBSTACLES: ObstacleBox[] = [
  // 1. Pepohonan & Bebatuan Hutan Atas Kiri
  {
    id: "alas-ndhuwur-kiri",
    name: "Alas Ndhuwur Kiri",
    x: 0,
    y: 0,
    w: 30,
    h: 36,
  },
  // 2. Pendhapa / Meja Ungu & Kristal (Atas Tengah-Kiri)
  {
    id: "pendhapa-ungu",
    name: "Pendhapa Meja Ungu",
    x: 30,
    y: 0,
    w: 22,
    h: 38,
  },
  // 3. Pepohonan & Bebatuan Hutan Atas Tengah
  {
    id: "alas-ndhuwur-tengah",
    name: "Alas Ndhuwur Tengah",
    x: 52,
    y: 0,
    w: 25,
    h: 34,
  },
  // 4. Bangunan & Teras Warung Ngaso (Kanan Atas)
  {
    id: "warung-ngaso",
    name: "Warung Ngaso",
    x: 55,
    y: 0,
    w: 45,
    h: 38,
  },
  // 5. Wit Rubuh & Semak Kiri Tengah
  {
    id: "wit-rubuh-kiri",
    name: "Wit Rubuh Kiri",
    x: 0,
    y: 36,
    w: 24,
    h: 14,
  },
  // 6. Taman Labirin & Gerbang Labirin Pendakian (Kiri Bawah)
  {
    id: "gerbang-labirin-kiri",
    name: "Gerbang Labirin Pendakian",
    x: 0,
    y: 50,
    w: 16,
    h: 32,
  },
  // 7. Pager Kembang Tengah-Kiri
  {
    id: "pager-tengah-kiri",
    name: "Pager Kembang Kiri",
    x: 28,
    y: 56,
    w: 7,
    h: 22,
  },
  // 8. Pelataran Watu Bunder Tengah (Area Tugu)
  {
    id: "pelataran-watu-tengah",
    name: "Pelataran Watu Tengah",
    x: 46,
    y: 44,
    w: 24,
    h: 25,
  },
  // 9. Alas & Undhak-undhakan Bawah Kiri
  {
    id: "alas-ngisor-kiri",
    name: "Alas Ngisor Kiri",
    x: 0,
    y: 82,
    w: 13,
    h: 18,
  },
  // 10. Pager Kayu & Wit Ngisor Kiri
  {
    id: "pager-ngisor-kiri",
    name: "Pager Ngisor Kiri",
    x: 20,
    y: 70,
    w: 22,
    h: 60,
  },
  // 11. Pager Kayu & Hutan Ngisor Tengah
  {
    id: "pager-ngisor-tengah",
    name: "Pager Ngisor Tengah",
    x: 42,
    y: 78,
    w: 60,
    h: 19,
  },
  // 12. Alas & Pager Sisi Kanan Bawah
  {
    id: "alas-ngisor-kanan",
    name: "Alas Ngisor Kanan",
    x: 80,
    y: 60,
    w: 26,
    h: 40,
  },
  // 13. Tebing Watu & Pager Sisi Kanan (Ngisor Warung Ngaso)
  {
    id: "tebing-kanan",
    name: "Tebing Watu Kanan",
    x: 78,
    y: 38,
    w: 18,
    h: 24,
  },
  {
    id: "tebing-kanan2",
    name: "Tebing Watu Kanan2",
    x: 74,
    y: 0,
    w: 45,
    h: 55,
  },
];

const getSpriteSrc = (dir: Direction, frameIdx: number) => {
  const list = WEBP_WALK_FRAMES[dir] || WEBP_WALK_FRAMES.down;
  if (!list || list.length === 0) return WEBP_WALK_FRAMES.down[0];
  const safeIdx = frameIdx % list.length;
  return list[safeIdx] || list[0];
};

export default function OpenWorld3Page() {
  const router = useRouter();

  // Posisi dan animasi dikelola langsung melalui Ref & GPU translate3d (60 FPS tanpa re-render React)
  const characterRef = useRef<HTMLDivElement>(null);
  const spriteImgRef = useRef<HTMLImageElement>(null);

  const posRef = useRef<{ x: number; y: number }>({ ...OW3_START_POS });
  const directionRef = useRef<Direction>("down");
  const frameIndexRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);

  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1.webp");
  // Default FALSE agar rintangan transparan sepenuhnya saat bermain normal
  const [showObstacles, setShowObstacles] = useState<boolean>(false);

  // State Misi Keping Tugu 1 & 2, 5 Bintang, Tugu Done, Mbah Kakek & Dialog
  const [collectedStarIds, setCollectedStarIds] = useState<number[]>([]);
  const [hasKeping1, setHasKeping1] = useState<boolean>(false);
  const [hasKeping2, setHasKeping2] = useState<boolean>(false);
  const [isTuguDone, setIsTuguDone] = useState<boolean>(false);
  const [curtainPhase, setCurtainPhase] = useState<"idle" | "closing">("idle");
  const [isNearAgus, setIsNearAgus] = useState<boolean>(false);
  const [isNearKakek, setIsNearKakek] = useState<boolean>(false);
  const [isNearTugu, setIsNearTugu] = useState<boolean>(false);
  const [isNearWarungExit, setIsNearWarungExit] = useState<boolean>(false);
  const [kakekFrameIdx, setKakekFrameIdx] = useState<number>(0);
  const [activeDialogs, setActiveDialogs] = useState<DialogItem[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentDialogTarget, setCurrentDialogTarget] = useState<
    "agus" | "agus_congrats" | "kakek" | "tugu" | null
  >(null);

  const nearAgusRef = useRef<boolean>(false);
  const nearKakekRef = useRef<boolean>(false);
  const nearTuguRef = useRef<boolean>(false);
  const nearWarungExitRef = useRef<boolean>(false);
  const isMissionCompleteRef = useRef<boolean>(false);

  const totalStarsCount = collectedStarIds.length;
  const totalKepingCount = (hasKeping1 ? 1 : 0) + (hasKeping2 ? 1 : 0);
  const isMissionComplete =
    totalStarsCount >= 5 && totalKepingCount >= 2 && isTuguDone;
  const progressPercent = Math.round(
    ((totalStarsCount + totalKepingCount + (isTuguDone ? 1 : 0)) / 8) * 100
  );

  useEffect(() => {
    isMissionCompleteRef.current = isMissionComplete;
  }, [isMissionComplete]);

  const joystickVectorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const walkCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset posisi pemain & progres sesi ke titik awal
  const handleResetPosition = useCallback(() => {
    posRef.current = { ...OW3_START_POS };
    directionRef.current = "down";
    frameIndexRef.current = 0;
    setCollectedStarIds([]);
    setHasKeping1(false);
    setHasKeping2(false);
    setIsTuguDone(false);
    setCurtainPhase("idle");
    setIsDialogOpen(false);
    setActiveDialogs(null);
    setCurrentDialogTarget(null);

    if (characterRef.current) {
      characterRef.current.style.transform = `translate3d(calc(${OW3_START_POS.x}vw - 50%), calc(${OW3_START_POS.y}vh - 100%), 0)`;
    }
    if (spriteImgRef.current) {
      spriteImgRef.current.src = getSpriteSrc("down", 0);
    }

    try {
      sessionStorage.removeItem("aksara_lawu_ow3_player_x");
      sessionStorage.removeItem("aksara_lawu_ow3_player_y");
      sessionStorage.removeItem("aksara_lawu_ow3_stars");
      sessionStorage.removeItem("aksara_lawu_ow3_has_keping1");
      sessionStorage.removeItem("aksara_lawu_ow3_has_keping2");
      sessionStorage.removeItem("aksara_lawu_ow3_tugu_done");
      sessionStorage.removeItem("aksara_lawu_ow3_agus_congrats_shown");
      localStorage.removeItem("aksara_lawu_ow3_player_x");
      localStorage.removeItem("aksara_lawu_ow3_player_y");
      localStorage.removeItem("aksara_lawu_ow3_stars");
      localStorage.removeItem("aksara_lawu_ow3_has_keping1");
      localStorage.removeItem("aksara_lawu_ow3_has_keping2");
      localStorage.removeItem("aksara_lawu_ow3_tugu_done");
      localStorage.removeItem("aksara_lawu_ow3_agus_congrats_shown");
      const currentItems = getSavedInventoryItems();
      if (currentItems.includes("keping1") || currentItems.includes("keping2")) {
        saveInventoryItems(
          currentItems.filter((id) => id !== "keping1" && id !== "keping2")
        );
      }
    } catch {
      // ignore
    }
  }, []);

  // Preload sprite frames & background, serta muat avatar & posisi tersimpan
  useEffect(() => {
    Object.values(WEBP_WALK_FRAMES).forEach((frames) => {
      frames.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });

    [
      "/openworld3/openworld3.webp",
      "/openworld3/tuguasset.webp",
      "/openworld3/tuguasset2.webp",
      "/openworld3/keping1.webp",
      "/openworld3/si_embah.webp",
      "/openworld3/meja.webp",
      "/openworld2/penjagapos.webp",
      "/openworld/star.webp",
      "/maps/gembok.webp",
      ...KAKEK_IDLE_FRAMES,
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    try {
      const storedAvatar =
        sessionStorage.getItem("aksara_lawu_selected_avatar") ||
        localStorage.getItem("aksara_lawu_selected_avatar");
      if (storedAvatar) {
        setSelectedAvatar(storedAvatar);
      }

      // Deteksi apakah saat ini halaman dimuat via browser reload / refresh (F5 / tombol reload browser)
      const isPageReload = (() => {
        try {
          const navEntries = performance.getEntriesByType("navigation");
          if (navEntries.length > 0) {
            return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
          }
          return (
            (window.performance as unknown as { navigation?: { type?: number } })
              ?.navigation?.type === 1
          );
        } catch {
          return false;
        }
      })();

      if (IS_REFRESHABLE_OW3 && isPageReload) {
        handleResetPosition();
        return;
      }

      if (IS_REFRESHABLE_OW3) {
        handleResetPosition();
        return;
      }

      const savedPx =
        sessionStorage.getItem("aksara_lawu_ow3_player_x") ||
        localStorage.getItem("aksara_lawu_ow3_player_x");
      const savedPy =
        sessionStorage.getItem("aksara_lawu_ow3_player_y") ||
        localStorage.getItem("aksara_lawu_ow3_player_y");
      const savedStars =
        sessionStorage.getItem("aksara_lawu_ow3_stars") ||
        localStorage.getItem("aksara_lawu_ow3_stars");
      if (savedStars) {
        try {
          const parsed = JSON.parse(savedStars);
          if (Array.isArray(parsed)) setCollectedStarIds(parsed);
        } catch {
          // ignore
        }
      }
      const savedKeping1 =
        sessionStorage.getItem("aksara_lawu_ow3_has_keping1") ||
        localStorage.getItem("aksara_lawu_ow3_has_keping1");
      if (savedKeping1 === "true") {
        setHasKeping1(true);
      }
      const savedKeping2 =
        sessionStorage.getItem("aksara_lawu_ow3_has_keping2") ||
        localStorage.getItem("aksara_lawu_ow3_has_keping2");
      if (savedKeping2 === "true") {
        setHasKeping2(true);
      }
      const savedTuguDone =
        sessionStorage.getItem("aksara_lawu_ow3_tugu_done") ||
        localStorage.getItem("aksara_lawu_ow3_tugu_done");
      if (savedTuguDone === "true") {
        setIsTuguDone(true);
      }

      const congratsShown =
        sessionStorage.getItem("aksara_lawu_ow3_agus_congrats_shown") ||
        localStorage.getItem("aksara_lawu_ow3_agus_congrats_shown");

      // Ketika user kembali ke openworld3 setelah mendapatkan keping kedua, tampilkan dialog Pak Agus
      if (
        savedKeping2 === "true" &&
        savedTuguDone !== "true" &&
        congratsShown !== "true"
      ) {
        sessionStorage.setItem("aksara_lawu_ow3_agus_congrats_shown", "true");
        localStorage.setItem("aksara_lawu_ow3_agus_congrats_shown", "true");
        setCurrentDialogTarget("agus_congrats");
        setActiveDialogs([
          {
            id: 1,
            speakerName: "Pak Agus (Penjaga Pos)",
            character: "/openworld2/penjagapos.webp",
            text: "Slamet! Kowe kasil menangake tantangane!",
          },
          {
            id: 2,
            speakerName: "Pak Agus (Penjaga Pos)",
            character: "/openworld2/penjagapos.webp",
            text: "Ndang menyanga tugu kanggo njangkepi puzzle!",
          },
        ]);
        setIsDialogOpen(true);
      }

      if (savedPx && savedPy) {
        const px = parseFloat(savedPx);
        const py = parseFloat(savedPy);
        if (!isNaN(px) && !isNaN(py)) {
          posRef.current = { x: px, y: py };
          if (characterRef.current) {
            characterRef.current.style.transform = `translate3d(calc(${px}vw - 50%), calc(${py}vh - 100%), 0)`;
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // -------------------------------------------------------------------------
  // COLLISION DETECTION & PHYSICS
  // -------------------------------------------------------------------------
  const checkCollision = useCallback((x: number, y: number): boolean => {
    // Batas Luar Peta
    if (x < 2 || x > 96 || y < 14 || y > 88) return true;

    for (const obs of OW3_DEFAULT_OBSTACLES) {
      if (
        x >= obs.x &&
        x <= obs.x + obs.w &&
        y >= obs.y &&
        y <= obs.y + obs.h
      ) {
        return true;
      }
    }
    return false;
  }, []);

  // -------------------------------------------------------------------------
  // GAME LOOP (REQUEST ANIMATION FRAME — 60 FPS MULUS)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const SPEED = 0.42; // Kecepatan gerak karakter (% per frame)

    const tick = () => {
      let vx = 0;
      let vy = 0;

      // Input Keyboard WASD & Arrow
      if (keysPressedRef.current["KeyW"] || keysPressedRef.current["ArrowUp"]) vy -= 1;
      if (keysPressedRef.current["KeyS"] || keysPressedRef.current["ArrowDown"]) vy += 1;
      if (keysPressedRef.current["KeyA"] || keysPressedRef.current["ArrowLeft"]) vx -= 1;
      if (keysPressedRef.current["KeyD"] || keysPressedRef.current["ArrowRight"]) vx += 1;

      // Input Joystick Analog
      if (joystickVectorRef.current.active) {
        vx = joystickVectorRef.current.x;
        vy = joystickVectorRef.current.y;
      }

      const length = Math.sqrt(vx * vx + vy * vy);
      const isMoving = length > 0.08 && !isDialogOpen;
      const wasMoving = isMovingRef.current;
      isMovingRef.current = isMoving;

      if (wasMoving && !isMoving) {
        try {
          const pxStr = String(posRef.current.x);
          const pyStr = String(posRef.current.y);
          sessionStorage.setItem("aksara_lawu_ow3_player_x", pxStr);
          localStorage.setItem("aksara_lawu_ow3_player_x", pxStr);
          sessionStorage.setItem("aksara_lawu_ow3_player_y", pyStr);
          localStorage.setItem("aksara_lawu_ow3_player_y", pyStr);
        } catch {
          // ignore
        }
      }

      if (isMoving) {
        const normX = vx / length;
        const normY = vy / length;

        // Tentukan Arah Hadap
        let nextDir: Direction = directionRef.current;
        if (Math.abs(normX) > Math.abs(normY)) {
          nextDir = normX > 0 ? "right" : "left";
        } else {
          nextDir = normY > 0 ? "down" : "up";
        }
        directionRef.current = nextDir;

        // Hitung Posisi Baru dengan Collision Sliding
        const targetX = posRef.current.x + normX * SPEED;
        const targetY = posRef.current.y + normY * SPEED;

        let finalX = posRef.current.x;
        let finalY = posRef.current.y;

        if (!checkCollision(targetX, posRef.current.y)) {
          finalX = targetX;
        }
        if (!checkCollision(posRef.current.x, targetY)) {
          finalY = targetY;
        }

        posRef.current = { x: finalX, y: finalY };

        // Direct GPU Transform di characterRef (No React state re-render)
        if (characterRef.current) {
          characterRef.current.style.transform = `translate3d(calc(${finalX}vw - 50%), calc(${finalY}vh - 100%), 0)`;
        }

        // Cek Pengambilan 5 Bintang Otomatis saat diinjak
        OW3_STARS_DATA.forEach((star) => {
          if (!collectedStarIds.includes(star.id)) {
            const dx = star.x - finalX;
            const dy = star.y - finalY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 3.8) {
              setCollectedStarIds((prev) => {
                if (prev.includes(star.id)) return prev;
                const next = [...prev, star.id];
                try {
                  const jsonStr = JSON.stringify(next);
                  sessionStorage.setItem("aksara_lawu_ow3_stars", jsonStr);
                  localStorage.setItem("aksara_lawu_ow3_stars", jsonStr);
                } catch {
                  // ignore
                }
                return next;
              });
            }
          }
        });
      }

      // ---------------------------------------------------------------------
      // CEK JARAK INTERAKSI (Pak Agus, Mbah Kakek, Tugu Lawu & Gerbang Warung)
      // ---------------------------------------------------------------------
      const curX = posRef.current.x;
      const curY = posRef.current.y;

      const dAgus = Math.hypot(curX - OW3_PAK_AGUS_POS.x, curY - OW3_PAK_AGUS_POS.y);
      const isNearAgusNow = dAgus < OW3_PAK_AGUS_POS.radius;
      if (isNearAgusNow !== nearAgusRef.current) {
        nearAgusRef.current = isNearAgusNow;
        setIsNearAgus(isNearAgusNow);
      }

      const dKakek = Math.hypot(curX - OW3_KAKEK_POS.x, curY - OW3_KAKEK_POS.y);
      const isNearKakekNow = dKakek < OW3_KAKEK_POS.radius;
      if (isNearKakekNow !== nearKakekRef.current) {
        nearKakekRef.current = isNearKakekNow;
        setIsNearKakek(isNearKakekNow);
      }

      const dTugu = Math.hypot(curX - OW3_TUGU_POS.x, curY - OW3_TUGU_POS.y);
      const isNearTuguNow = dTugu < OW3_TUGU_POS.radius;
      if (isNearTuguNow !== nearTuguRef.current) {
        nearTuguRef.current = isNearTuguNow;
        setIsNearTugu(isNearTuguNow);
      }

      const dWarungExit = Math.hypot(
        curX - OW3_WARUNG_EXIT_POS.x,
        curY - OW3_WARUNG_EXIT_POS.y
      );
      const isNearWarungExitNow =
        isMissionCompleteRef.current && dWarungExit < 8.5;
      if (isNearWarungExitNow !== nearWarungExitRef.current) {
        nearWarungExitRef.current = isNearWarungExitNow;
        setIsNearWarungExit(isNearWarungExitNow);
      }

      if (
        isMissionCompleteRef.current &&
        dWarungExit <= 3.8 &&
        curtainPhase === "idle"
      ) {
        setCurtainPhase("closing");
        setTimeout(() => {
          router.push("/intro_level3");
        }, 650);
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [checkCollision, collectedStarIds, curtainPhase, isDialogOpen, router]);

  // Siklus Frame Animasi Kaki Karakter Berjalan & Idle Mbah Kakek
  useEffect(() => {
    walkCycleTimerRef.current = setInterval(() => {
      if (isMovingRef.current && spriteImgRef.current) {
        frameIndexRef.current = (frameIndexRef.current + 1) % 7;
        const newSrc = getSpriteSrc(directionRef.current, frameIndexRef.current);
        if (spriteImgRef.current.src !== newSrc) {
          spriteImgRef.current.src = newSrc;
        }
      }
    }, 110);

    const kakekIdleTimer = setInterval(() => {
      setKakekFrameIdx((prev) => (prev + 1) % KAKEK_IDLE_FRAMES.length);
    }, 150);

    return () => {
      if (walkCycleTimerRef.current) clearInterval(walkCycleTimerRef.current);
      clearInterval(kakekIdleTimer);
    };
  }, []);

  // Simpan posisi karakter saat unload
  useEffect(() => {
    const saveCurrentPlayerPos = () => {
      try {
        const pxStr = String(posRef.current.x);
        const pyStr = String(posRef.current.y);
        sessionStorage.setItem("aksara_lawu_ow3_player_x", pxStr);
        localStorage.setItem("aksara_lawu_ow3_player_x", pxStr);
        sessionStorage.setItem("aksara_lawu_ow3_player_y", pyStr);
        localStorage.setItem("aksara_lawu_ow3_player_y", pyStr);
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeunload", saveCurrentPlayerPos);
    return () => {
      window.removeEventListener("beforeunload", saveCurrentPlayerPos);
      saveCurrentPlayerPos();
    };
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // -------------------------------------------------------------------------
  // HANDLER INTERAKSI PAK AGUS (PENJAGA POS) & TUGU LAWU
  // -------------------------------------------------------------------------
  const handleTakeKeping1 = useCallback(() => {
    setHasKeping1(true);
    try {
      sessionStorage.setItem("aksara_lawu_ow3_has_keping1", "true");
      localStorage.setItem("aksara_lawu_ow3_has_keping1", "true");

      const currentItems = getSavedInventoryItems();
      if (!currentItems.includes("keping1")) {
        saveInventoryItems([...currentItems, "keping1"]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleTalkToAgus = useCallback(() => {
    if (isDialogOpen) return;
    setCurrentDialogTarget("agus");

    if (!hasKeping1) {
      setActiveDialogs([
        {
          id: 1,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Halo pendaki, ketemu maneh awake dhewe!",
        },
        {
          id: 2,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Kowe saiki ana ing Tugu Lawu, aku ngerti kowe kepengin nerusake laku menyang Warung Ngaso.",
        },
        {
          id: 3,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Nanging kowe kudu njangkepi bagean saka tugu iki.",
        },
        {
          id: 4,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Aku mung nduweni 1 keping kanggo njangkepi.",
        },
        {
          id: 5,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Lan aku bakal menehi kowe kanthi cuma-cuma, iki jupuken!",
          rewardItem: {
            image: "/openworld3/keping1.webp",
            name: "Keping Tugu 1",
            position: "top",
          },
          customAction: {
            buttonText: "Ambil",
            onAction: handleTakeKeping1,
          },
        },
        {
          id: 6,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Mung keping kapindhone disimpen dening kakek sing ana ing ndhuwur.",
        },
        {
          id: 7,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Dheweke nduweni tantangan kanggo saben pendaki.",
        },
        {
          id: 8,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Budhala mrana, lan kalahna dheweke kanggo entuk keping kapindho!",
        },
      ]);
    } else {
      setActiveDialogs([
        {
          id: 1,
          speakerName: "Pak Agus (Penjaga Pos)",
          character: "/openworld2/penjagapos.webp",
          text: "Keping kapisan wis koksimpen kanthi apik! Saiki budhala menyang ndhuwur, kalahna tantangan saka kakek kanggo entuk keping kapindho!",
        },
      ]);
    }
    setIsDialogOpen(true);
  }, [hasKeping1, handleTakeKeping1, isDialogOpen]);

  const handleTalkToKakek = useCallback(() => {
    if (isDialogOpen) return;
    setCurrentDialogTarget("kakek");
    setActiveDialogs([
      {
        id: 1,
        speakerName: "Mbah Kakek",
        character: "/openworld3/si_embah.webp",
        characterHalfBody: true,
        text: "Uhuk, uhuk, uhuk...",
      },
      {
        id: 2,
        speakerName: "Mbah Kakek",
        character: "/openworld3/si_embah.webp",
        characterHalfBody: true,
        text: "Sapa kuwi? Oh, pendaki liya...",
      },
      {
        id: 3,
        speakerName: "Mbah Kakek",
        character: "/openworld3/si_embah.webp",
        characterHalfBody: true,
        text: "Kowe mesthi mrene kanggo njupuk keping kapindho.",
      },
      {
        id: 4,
        speakerName: "Mbah Kakek",
        character: "/openworld3/si_embah.webp",
        characterHalfBody: true,
        text: "Hmmmm, ayo dolanan gelas kelereng karo aku.",
      },
      {
        id: 5,
        speakerName: "Mbah Kakek",
        character: "/openworld3/si_embah.webp",
        characterHalfBody: true,
        text: "Yen kowe menang, aku bakal menehake keping kuwi kanggo kowe.",
      },
      {
        id: 6,
        speakerName: "Mbah Kakek",
        character: "/openworld3/si_embah.webp",
        characterHalfBody: true,
        text: "Ayoo, kalahna aku!",
      },
    ]);
    setIsDialogOpen(true);
  }, [isDialogOpen]);

  const handleInspectTugu = useCallback(() => {
    if (isDialogOpen) return;

    // Jika sudah memiliki Keping 1 & Keping 2 dan tugu belum selesai, langsung buka halaman tugu
    if (hasKeping1 && hasKeping2 && !isTuguDone) {
      router.push("/openworld3_tugu");
      return;
    }

    setCurrentDialogTarget("tugu");
    let tuguText =
      "Tugu Lawu iki isih kosong lan mbutuhake rong kepingan kanggo njangkepi. Coba cecaturan karo Pak Agus ing cedhak tugu!";
    if (isTuguDone) {
      tuguText =
        "Tugu Lawu wis jangkep! Akses menyang Warung Ngaso saiki wis kebukak.";
    } else if (hasKeping1) {
      tuguText =
        "Tugu Lawu isih mbutuhake Keping 2 supaya bisa jangkep. Keping 1 wis ana ing tanganmu, saiki golekana Keping 2 menyang ndhuwur!";
    } else if (hasKeping2) {
      tuguText =
        "Keping 2 wis ana ing tanganmu! Saiki cecaturan karo Pak Agus ing cedhak tugu kanggo njupuk Keping 1.";
    }
    setActiveDialogs([
      {
        id: 1,
        speakerName: "Tugu Lawu",
        character: "/openworld2/penjagapos.webp",
        text: tuguText,
      },
    ]);
    setIsDialogOpen(true);
  }, [hasKeping1, hasKeping2, isTuguDone, isDialogOpen, router]);

  const handleDialogComplete = useCallback(() => {
    const target = currentDialogTarget;
    setIsDialogOpen(false);
    setActiveDialogs(null);
    setCurrentDialogTarget(null);

    if (target === "kakek") {
      router.push("/openworld3_game");
    }
  }, [currentDialogTarget, router]);

  const handleEnterWarungNgaso = useCallback(() => {
    if (!isMissionComplete || curtainPhase === "closing") return;
    setCurtainPhase("closing");
    setTimeout(() => {
      router.push("/intro_level3");
    }, 650);
  }, [curtainPhase, isMissionComplete, router]);

  const renderInteractionButton = () => {
    if (isDialogOpen) return null;

    if (isNearWarungExit && isMissionComplete) {
      return (
        <button
          type="button"
          id="btn-ow3-interaksi-warung"
          onClick={handleEnterWarungNgaso}
          className="ow3-interact-btn"
          aria-label="Mlebu menyang Warung Ngaso"
          title="Mlebu menyang Warung Ngaso"
        >
          <DoorOpen className="ow3-interact-icon" />
          <span className="ow3-interact-text">Mlebu</span>
        </button>
      );
    }

    if (isNearKakek) {
      return (
        <button
          type="button"
          id="btn-ow3-interaksi-kakek"
          onClick={handleTalkToKakek}
          className="ow3-interact-btn"
          aria-label="Cecaturan karo Mbah Kakek"
          title="Cecaturan karo Mbah Kakek"
        >
          <MessageCircle className="ow3-interact-icon" />
          <span className="ow3-interact-text">Cecaturan</span>
        </button>
      );
    }

    if (isNearAgus) {
      return (
        <button
          type="button"
          id="btn-ow3-interaksi-agus"
          onClick={handleTalkToAgus}
          className="ow3-interact-btn"
          aria-label="Cecaturan karo Pak Agus"
          title="Cecaturan karo Pak Agus"
        >
          <MessageCircle className="ow3-interact-icon" />
          <span className="ow3-interact-text">Cecaturan</span>
        </button>
      );
    }

    if (isNearTugu) {
      return (
        <button
          type="button"
          id="btn-ow3-interaksi-tugu"
          onClick={handleInspectTugu}
          className="ow3-interact-btn"
          aria-label="Deleng Misi Tugu Lawu"
          title="Deleng Misi Tugu Lawu"
        >
          <Landmark className="ow3-interact-icon" />
          <span className="ow3-interact-text">Tugu Lawu</span>
        </button>
      );
    }

    return null;
  };

  return (
    <main className="ow3-root" aria-label="Halaman Open World 3">
      {/* 0. Layer Bayangan Gelap Vignette Ambient pada Background */}
      <div className="ow3-vignette" />

      {/* 1. Efek Cuaca Kabut & Daun Gugur */}
      <FogWind />
      <FallenLeaves />

      {/* 2. Tombol Kontrol Debug (Toggle Rintangan & Reset Posisi) */}
      <div className="ow3-debug-controls">
        <button
          type="button"
          className="ow3-session-reset-btn"
          onClick={handleResetPosition}
          title="Reset Posisi Karakter menyang Titik Awal"
        >
          <RotateCcw style={{ width: "1.1vw", height: "1.1vw" }} />
          <span>Reset Posisi</span>
        </button>

        <button
          type="button"
          className="ow3-obstacle-toggle-btn"
          onClick={() => setShowObstacles((prev) => !prev)}
          title="Tampilake / Delikake Kotak Rintangan Debug"
        >
          {showObstacles ? (
            <>
              <EyeOff style={{ width: "1.1vw", height: "1.1vw" }} />
              <span>Delikake Rintangan</span>
            </>
          ) : (
            <>
              <Eye style={{ width: "1.1vw", height: "1.1vw" }} />
              <span>Tampilake Rintangan</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Render Rintangan (Warung Ngaso Terkunci + Debug visualizer jika aktif) */}
      {OW3_DEFAULT_OBSTACLES.map((obs) => {
        const isWarungLocked = obs.id === "warung-ngaso";

        if (!isWarungLocked && !showObstacles) return null;

        const showDarkLock = isWarungLocked && !isMissionComplete;
        const showUnlockedRed = isWarungLocked && isMissionComplete;

        return (
          <div
            key={obs.id}
            className={`ow3-obstacle-box ${showDarkLock
              ? "ow3-closed-dark"
              : showUnlockedRed
                ? "ow3-obstacle-unlocked-red"
                : showObstacles
                  ? "ow3-obstacle-visible"
                  : ""
              }`}
            data-label={obs.name}
            style={{
              left: `${obs.x}%`,
              top: `${obs.y}%`,
              width: `${obs.w}%`,
              height: `${obs.h}%`,
            }}
            aria-hidden={!showObstacles && !showDarkLock && !showUnlockedRed}
          >
            {showDarkLock ? (
              <div className="ow3-closed-badge-container">
                <span className="ow3-closed-badge-text">
                  <Ban style={{ width: "1.4vh", height: "1.4vh", color: "#ef4444" }} />
                  <span>{obs.name}</span>
                </span>
                <img
                  src="/maps/gembok.webp"
                  alt="Gembok Rintangan Tertutup"
                  className="ow3-closed-gembok-img"
                  draggable={false}
                />
              </div>
            ) : showObstacles ? (
              <>
                <span className="ow3-obstacle-id">{obs.id}</span>
                <span className="ow3-obstacle-coords">
                  x:{obs.x} y:{obs.y} w:{obs.w} h:{obs.h}
                </span>
              </>
            ) : null}
          </div>
        );
      })}

      {/* 3.2. Titik Lingkaran Emas Transisi ke /intro_level3 saat seluruh syarat misi terpenuhi */}
      {isMissionComplete && (
        <div
          className="ow3-gold-zone"
          style={{
            left: `${OW3_WARUNG_EXIT_POS.x}%`,
            top: `${OW3_WARUNG_EXIT_POS.y}%`,
          }}
          aria-label="Titik Emas Menyang Warung Ngaso"
          onClick={handleEnterWarungNgaso}
        >
          <div className="ow3-gold-inner-circle" />
        </div>
      )}

      {/* 3.3. Render 5 Bintang di Sepanjang Rute Perjalanan */}
      {OW3_STARS_DATA.filter((star) => !collectedStarIds.includes(star.id)).map(
        (star) => (
          <div
            key={`star-${star.id}`}
            className="ow3-star-item"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            <div className="ow3-star-trigger-zone" />
            <img
              src="/openworld/star.webp"
              alt={`Bintang ${star.id}`}
              className="ow3-star-img"
              draggable={false}
            />
          </div>
        )
      )}

      {/* 3.5. Tugu Lawu di Pelataran Tengah beserta Range Area Misi */}
      <div
        className="ow3-tugu-wrapper"
        style={{ left: `${OW3_TUGU_POS.x}%`, top: `${OW3_TUGU_POS.y}%` }}
        onClick={handleInspectTugu}
        role="button"
        tabIndex={0}
        aria-label="Tugu Lawu"
        title="Tugu Lawu — Titik Misi"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleInspectTugu();
          }
        }}
      >
        <div
          className={`ow3-tugu-range-zone ${isNearTugu ? "ow3-tugu-range-active" : ""
            }`}
        />
        <img
          src={
            isTuguDone
              ? "/openworld3/tuguasset2.webp"
              : "/openworld3/tuguasset.webp"
          }
          alt="Tugu Lawu"
          className="ow3-tugu-img"
          draggable={false}
        />
      </div>

      {/* 3.6. Penjaga Pos (Pak Agus) di dekat Tugu Lawu */}
      <OpenWorld2NPC
        x={OW3_PAK_AGUS_POS.x}
        y={OW3_PAK_AGUS_POS.y}
        name="Pak Agus"
        type="penjaga"
        avatarImg="/openworld2/penjagapos.webp"
        isInteracting={isNearAgus || (isDialogOpen && currentDialogTarget === "agus")}
        showTriggerZone={true}
        onClick={handleTalkToAgus}
      />

      {/* 3.7. Mbah Kakek di area magic (Pendhapa Meja Ungu, diam di tempat dengan 16 pose idle) */}
      <div
        className="ow2-npc-entity"
        style={{
          left: `${OW3_KAKEK_POS.x}%`,
          top: `${OW3_KAKEK_POS.y}%`,
          transform: "translate(-50%, -100%)",
        }}
        onClick={handleTalkToKakek}
        role="button"
        tabIndex={0}
        aria-label="Mbah Kakek"
        title="Mbah Kakek — Tantangan Gelas Kelereng"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTalkToKakek();
          }
        }}
      >
        <div
          className={`ow2-npc-trigger-zone ${isNearKakek || (isDialogOpen && currentDialogTarget === "kakek")
            ? "ow2-npc-zone-active"
            : ""
            }`}
        />
        <div className="ow2-npc-nametag">
          <img
            src="/openworld3/si_embah.webp"
            alt="Avatar Mbah Kakek"
            className="ow2-npc-nametag-icon"
            draggable={false}
          />
          <span className="ow2-npc-nametag-text">Mbah Kakek</span>
        </div>
        <div className="ow2-npc-sprite-wrap">
          <img
            src={KAKEK_IDLE_FRAMES[kakekFrameIdx]}
            alt="Mbah Kakek"
            className="ow2-npc-sprite-img"
            draggable={false}
          />
          <div className="ow2-npc-shadow" />
        </div>
      </div>

      {/* 4. Karakter Pemain Utama (Direct GPU Transform translate3d) */}
      <div className="ow3-character-stage" aria-hidden="true">
        <div
          ref={characterRef}
          className="ow3-character-entity"
          style={{
            transform: `translate3d(calc(${posRef.current.x}vw - 50%), calc(${posRef.current.y}vh - 100%), 0)`,
          }}
        >
          {/* Nametag Pemain */}
          <div className="ow3-character-nametag">
            <img
              src={`/avatar/${selectedAvatar}`}
              alt="Avatar"
              className="ow3-nametag-icon"
              draggable={false}
            />
            <span className="ow3-nametag-text">Pendaki Lawu</span>
          </div>

          {/* Sprite Berjalan Karakter */}
          <div className="ow3-character-sprite-wrap">
            <img
              ref={spriteImgRef}
              src={getSpriteSrc("down", 0)}
              alt="Pendaki Lawu"
              className="ow3-character-sprite"
              draggable={false}
            />
            <div className="ow3-character-shadow" />
          </div>
        </div>
      </div>

      {/* 5. Burung Terbang */}
      <FlyingBirds />

      {/* 5.5. Papan Progres Petualangan (Pojok Bawah Kiri) */}
      <aside className="ow3-progress-board" aria-label="Progres Petualangan">
        <div className="ow3-progress-header">
          <span className="ow3-progress-title">PROGRES JELAJAH</span>
          <span className="ow3-progress-percent">{progressPercent}%</span>
        </div>

        <div className="ow3-progress-bar-bg">
          <div
            className="ow3-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="ow3-progress-rows">
          <div
            className={`ow3-progress-row ${totalStarsCount >= 5 ? "ow3-progress-row-complete" : ""
              }`}
          >
            <span>Bintang</span>
            <span>{totalStarsCount} / 5</span>
          </div>

          <div
            className={`ow3-progress-row ${totalKepingCount >= 2 ? "ow3-progress-row-complete" : ""
              }`}
          >
            <span>Keping Tugu</span>
            <span>{totalKepingCount} / 2</span>
          </div>

          <div
            className={`ow3-progress-row ${isTuguDone ? "ow3-progress-row-complete" : ""
              }`}
          >
            <span>Tugu Lawu</span>
            <span>{isTuguDone ? 1 : 0} / 1</span>
          </div>
        </div>
      </aside>

      {/* 6. Tombol Interaksi (Cecaturan / Tugu Lawu / Mlebu) */}
      {renderInteractionButton()}

      {/* 7. Virtual Joystick */}
      <VirtualJoystick
        onMove={(evt: JoystickMoveEvent) => {
          joystickVectorRef.current = {
            x: evt.x,
            y: evt.y,
            active: evt.isMoving,
          };
        }}
        onEnd={() => {
          joystickVectorRef.current = { x: 0, y: 0, active: false };
        }}
      />

      {/* 8. Dialog Pop Up Karakter Penjaga Pos & Tugu */}
      {isDialogOpen && activeDialogs && (
        <DialogPopup
          key={`ow3-dialog-${currentDialogTarget}`}
          isOpen={true}
          dialogs={activeDialogs}
          initialDelayMs={0}
          instantText={false}
          focusBackdrop={true}
          lastButtonText={
            currentDialogTarget === "kakek" ? "Ayo Dolanan ➔" : "Tutup ➔"
          }
          onComplete={handleDialogComplete}
        />
      )}

      {/* 9. Curtain Transisi ke /intro_level3 */}
      <div
        className={`ow3-curtain-overlay ${curtainPhase === "closing" ? "ow3-curtain-closing" : ""
          }`}
      >
        <div className="ow3-curtain-top" />
        <div className="ow3-curtain-bottom" />
      </div>
    </main>
  );
}

