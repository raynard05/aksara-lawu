"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import FogWind from "../components/FogWind/FogWind";
import FallenLeaves from "../components/fallenleaves/FallenLeaves";
import VirtualJoystick, {
  JoystickMoveEvent,
} from "../components/VirtualJoystick/VirtualJoystick";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import FlyingBirds from "../components/FlyingBirds/FlyingBirds";
import OpenWorld2NPC from "../components/OpenWorld2NPC/OpenWorld2NPC";
import SpotTarget from "../components/SpotTarget/SpotTarget";
import {
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import {
  getSavedInventoryItems,
  saveInventoryItems,
  getUsedItems,
  USED_ITEMS_KEY,
} from "../lib/inventoryStorage";
import "./openworld2.css";

// Flag untuk reset sesi otomatis saat refresh halaman (bisa diubah true / false sesuai kebutuhan testing)
// Ketika false (unrefreshable): Seluruh progress sesi OpenWorld 2 tersimpan secara permanen dan tidak ter-reset saat refresh
export const IS_REFRESHABLE_OW2: boolean = false;

// =============================================================================
// TITIK KOORDINAT PAPAN ARAH 1 & 2 (SUMBER KEBENARAN TUNGGAL / SINGLE SOURCE OF TRUTH)
// Ubah koordinat di sini untuk menggeser posisi visual sekaligus radius interaksi range-nya!
// =============================================================================
export const OW2_SPOTS = {
  spot1: {
    id: 1,
    x: 63, // Persentase X (%) — Sisi tengen (jalur ngisor sangisore gazebo)
    y: 64, // Persentase Y (%)
    radius: 6.5, // Radius jangkauan interaksi (vw/vh)
    label: "Papan Arah 1",
    resultImage: "/openworld2/arah1.webp",
  },
  spot2: {
    id: 2,
    x: 32, // Persentase X (%) — Sisi kiwa (cedhak wit rubuh)
    y: 47, // Persentase Y (%)
    radius: 6.5, // Radius jangkauan interaksi (vw/vh)
    label: "Papan Arah 2",
    resultImage: "/openworld2/arah2.webp",
  },
} as const;

// =============================================================================
// TITIK KOORDINAT KAYU / TIANG TINGGI (RERUNTUHAN WIT RUBUH)
// Ubah koordinat di sini untuk menggeser posisi visual sekaligus radius jupuk-nya!
// =============================================================================
export const OW2_KAYU_POS = {
  x: 23, // Persentase X (%) — Reruntuhan wit rubuh sisih kulon
  y: 50, // Persentase Y (%)
  radius: 5.5, // Radius jangkauan interaksi (vw/vh)
} as const;

// =============================================================================
// TITIK KOORDINAT NPC (PAK AGUS & RINDA)
// Ubah koordinat di sini untuk menggeser posisi visual sekaligus radius cecaturannya!
// =============================================================================
export const OW2_NPC_POS = {
  agus: {
    x: 67, // Persentase X (%) — Penjaga Pos 1 (Kanan Atas)
    y: 46, // Persentase Y (%)
    radius: 6.5, // Radius jangkauan interaksi cecaturan (vw/vh)
  },
  rinda: {
    x: 50, // Persentase X (%) — Pendaki (Cedhak Warung Kopi)
    y: 46, // Persentase Y (%)
    radius: 6.5, // Radius jangkauan interaksi cecaturan (vw/vh)
  },
} as const;

// 5 Titik Lokasi Bintang di Sepanjang Jalur Setapak Open World 2
export const OW2_STARS_DATA = [
  { id: 1, x: 79, y: 36 },
  { id: 2, x: 68, y: 48 },
  { id: 3, x: 44, y: 46 },
  { id: 4, x: 25, y: 52 },
  { id: 5, x: 12, y: 80 }, // Diberi space di atas papan progres agar tidak tertabrak/tertutup
];

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

// Rintangan Disesuaikan dengan Background openworld2/bg.webp
// Sesuai prompt: Opacity ditinggikan agar user dapat mengatur kembali rintangan dengan jelas
export const OW2_DEFAULT_OBSTACLES: ObstacleBox[] = [
  // 1. Pepohonan Hutan Atas Kiri
  {
    id: "wit-ndhuwur-kiri",
    name: "Wit Ndhuwur Kiri",
    x: 0,
    y: 0,
    w: 40,
    h: 40,
  },
  // 2. Pepohonan Hutan Atas Tengah
  {
    id: "wit-ndhuwur-tengah",
    name: "Wit Ndhuwur Tengah",
    x: 40,
    y: 0,
    w: 38,
    h: 40,
  },
  // 3. Pepohonan Hutan Atas Kanan
  {
    id: "wit-ndhuwur-kanan",
    name: "Wit Ndhuwur Kanan",
    x: 50,
    y: -6,
    w: 40,
    h: 35,
  },
  // 4. Bangunan Pos 1 (Kanan Atas)
  {
    id: "pos1-bangunan",
    name: "Bangunan Pos 1",
    x: 88,
    y: 14,
    w: 12,
    h: 16,
  },
  // 5. Pagar Pos 1 (Sisi Kanan, Tangga Bersih Bebas Dilalui)
  {
    id: "pos1-pager-kanan",
    name: "Pager Pos 1 Kanan",
    x: 84,
    y: 36,
    w: 22,
    h: 12,
  },
  {
    id: "pos1-pager-kanan2",
    name: "Pager Pos 2 Kanan",
    x: 70,
    y: 55,
    w: 22,
    h: 12,
  },
  // 6. Gazebo Berlogo Tameng
  {
    id: "gazebo-tameng",
    name: "Gardhu Tameng",
    x: 63,
    y: 28,
    w: 13,
    h: 16,
  },
  // 7. Warung Kopi & Meja Makan
  {
    id: "warung-ngopi",
    name: "Warung Kopi & Meja",
    x: 41,
    y: 25,
    w: 18,
    h: 16,
  },
  // 8. Reruntuhan Pohon Rubuh (Kiri Tengah)
  {
    id: "wit-rubuh-kiri",
    name: "Wit Rubuh Kiri",
    x: 12,
    y: 29,
    w: 15,
    h: 14,
  },

  {
    id: "wit-rubuh-kiri2",
    name: "Wit Rubuh Kiri2",
    x: 7,
    y: 52,
    w: 17,
    h: 13,
  },
  // 9. Gardhu Cilik Tengah
  {
    id: "gardhu-tengah",
    name: "Gardhu Cilik Tengah",
    x: 33,
    y: 52,
    w: 22,
    h: 18,
  },
  // 10. Tembok/Pagar Labirin Sisi Kiri (Ora Bisa Dilewati)
  {
    id: "labirin-pager-kiri",
    name: "Ora Bisa Dilewati",
    x: -5,
    y: 42,
    w: 22,
    h: 32,
  },
  // 11. Hutan & Bebatuan Sisi Bawah Kiri
  {
    id: "alas-ngisor-kiri",
    name: "Watu & Wit Ngisor Kiri",
    x: 0,
    y: 90,
    w: 26,
    h: 12,
  },
  {
    id: "alas-ngisor-kiri2",
    name: "Watu & Wit Ngisor Kiri2",
    x: 0,
    y: 76,
    w: 7,
    h: 12,
  },
  {
    id: "alas-ngisor-kiri3",
    name: "Watu & Wit Ngisor Kiri3",
    x: 20,
    y: 70,
    w: 7,
    h: 20,
  },
  // 12. Hutan & Bebatuan Sisi Bawah Tengah
  {
    id: "alas-ngisor-tengah",
    name: "Watu & Wit Ngisor Tengah",
    x: 26,
    y: 65,
    w: 55,
    h: 44,
  },
  // 13. Hutan Lebat Sisi Bawah Kanan
  {
    id: "alas-ngisor-kanan",
    name: "Alas Kandel Ngisor Kanan",
    x: 80,
    y: 45,
    w: 25,
    h: 70,
  },
];

const getSpriteSrc = (dir: Direction, frameIdx: number) => {
  const list = WEBP_WALK_FRAMES[dir] || WEBP_WALK_FRAMES.down;
  if (!list || list.length === 0) return WEBP_WALK_FRAMES.down[0];
  const safeIdx = frameIdx % list.length;
  return list[safeIdx] || list[0];
};

export default function OpenWorld2Page() {
  const router = useRouter();

  // POIN 1 OPTIMASI_OPENWORLD.txt: Posisi dan animasi dikelola langsung melalui Ref & GPU translate3d (60 FPS tanpa re-render React)
  const characterRef = useRef<HTMLDivElement>(null);
  const spriteImgRef = useRef<HTMLImageElement>(null);

  // Titik awal pemain: di dekat tangga Pos 1 (Kanan Atas)
  const posRef = useRef<{ x: number; y: number }>({ x: 84, y: 36 });
  const directionRef = useRef<Direction>("down");
  const frameIndexRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);

  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1.webp");

  // State tampilan rintangan: Default FALSE agar rintangan transparan (tidak terlihat) saat bermain normal
  const [showObstacles, setShowObstacles] = useState<boolean>(false);

  // Vektor joystick
  const joystickVectorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const walkCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------------------------------------------------
  // QUEST & PROGRES OPEN WORLD 2
  // -------------------------------------------------------------------------
  // 5 Bintang
  const [collectedStarIds, setCollectedStarIds] = useState<number[]>([]);

  // Pak Agus (Penjaga Pos) & Tiang Kayu
  const [isAgusTalked, setIsAgusTalked] = useState<boolean>(false);
  const [hasKayu, setHasKayu] = useState<boolean>(false);

  // Rinda (Pendaki) & Tali
  const [isRindaTalked, setIsRindaTalked] = useState<boolean>(false);
  const [hasTali, setHasTali] = useState<boolean>(false);

  // 2 Spot Target Papan Arah (Arah 1 & Arah 2)
  const [isSpot1Repaired, setIsSpot1Repaired] = useState<boolean>(false);
  const [isSpot2Repaired, setIsSpot2Repaired] = useState<boolean>(false);

  // Dialog System States
  const [activeDialogs, setActiveDialogs] = useState<DialogItem[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentDialogCharacter, setCurrentDialogCharacter] = useState<
    "agus" | "rinda" | "spot_guide" | "gate_locked" | null
  >(null);

  // Curtain Transisi ke /intro_level2
  const [curtainPhase, setCurtainPhase] = useState<"idle" | "closing">("idle");

  // -------------------------------------------------------------------------
  // PROXIMITY REFS & STATES (Hanya update state saat boolean berubah)
  // -------------------------------------------------------------------------
  const [isNearAgus, setIsNearAgus] = useState<boolean>(false);
  const [isNearRinda, setIsNearRinda] = useState<boolean>(false);
  const [isNearTiang, setIsNearTiang] = useState<boolean>(false);
  const [isNearSpot1, setIsNearSpot1] = useState<boolean>(false);
  const [isNearSpot2, setIsNearSpot2] = useState<boolean>(false);
  const [isNearExitGate, setIsNearExitGate] = useState<boolean>(false);

  const nearAgusRef = useRef<boolean>(false);
  const nearRindaRef = useRef<boolean>(false);
  const nearTiangRef = useRef<boolean>(false);
  const nearSpot1Ref = useRef<boolean>(false);
  const nearSpot2Ref = useRef<boolean>(false);
  const nearExitGateRef = useRef<boolean>(false);

  // Hitung Progres
  const totalStarsCount = collectedStarIds.length;
  const totalSpotsRepaired = (isSpot1Repaired ? 1 : 0) + (isSpot2Repaired ? 1 : 0);
  const isMissionComplete = totalStarsCount >= 5 && totalSpotsRepaired >= 2;
  const isMissionCompleteRef = useRef(isMissionComplete);
  useEffect(() => {
    isMissionCompleteRef.current = isMissionComplete;
  }, [isMissionComplete]);
  const progressPercent = Math.round(
    (totalStarsCount / 5) * 50 + (totalSpotsRepaired / 2) * 50
  );

  // Helper fungsi untuk mereset seluruh sesi & progress Open World 2 ke kondisi awal (Tahap Pengujian)
  const handleResetSession = useCallback(() => {
    try {
      sessionStorage.removeItem("aksara_lawu_ow2_stars");
      localStorage.removeItem("aksara_lawu_ow2_stars");

      sessionStorage.removeItem("aksara_lawu_ow2_agus_talked");
      localStorage.removeItem("aksara_lawu_ow2_agus_talked");

      sessionStorage.removeItem("aksara_lawu_ow2_has_kayu");
      localStorage.removeItem("aksara_lawu_ow2_has_kayu");

      sessionStorage.removeItem("aksara_lawu_ow2_rinda_talked");
      localStorage.removeItem("aksara_lawu_ow2_rinda_talked");

      sessionStorage.removeItem("aksara_lawu_ow2_has_tali");
      localStorage.removeItem("aksara_lawu_ow2_has_tali");

      sessionStorage.removeItem("aksara_lawu_ow2_spot1_fixed");
      localStorage.removeItem("aksara_lawu_ow2_spot1_fixed");

      sessionStorage.removeItem("aksara_lawu_ow2_spot2_fixed");
      localStorage.removeItem("aksara_lawu_ow2_spot2_fixed");

      sessionStorage.removeItem("aksara_lawu_crafted_arah1");
      localStorage.removeItem("aksara_lawu_crafted_arah1");

      sessionStorage.removeItem("aksara_lawu_just_crafted");
      localStorage.removeItem("aksara_lawu_just_crafted");

      sessionStorage.removeItem("aksara_lawu_crafting_target_spot");
      localStorage.removeItem("aksara_lawu_crafting_target_spot");

      sessionStorage.removeItem("aksara_lawu_ow2_player_x");
      localStorage.removeItem("aksara_lawu_ow2_player_x");

      sessionStorage.removeItem("aksara_lawu_ow2_player_y");
      localStorage.removeItem("aksara_lawu_ow2_player_y");

      // Bersihkan item uji coba crafting dari inventory
      try {
        const curItems = getSavedInventoryItems();
        const filtered = curItems.filter(
          (id) => !["kayu", "tali", "arah1", "arah2"].includes(id)
        );
        if (filtered.length !== curItems.length) {
          saveInventoryItems(filtered);
        }
      } catch { }

      // Bersihkan used items jika ada
      try {
        const used = getUsedItems();
        const filteredUsed = used.filter(
          (id) => !["kayu", "tali", "arah1", "arah2"].includes(id)
        );
        if (filteredUsed.length !== used.length) {
          const jsonStr = JSON.stringify(filteredUsed);
          sessionStorage.setItem(USED_ITEMS_KEY, jsonStr);
          localStorage.setItem(USED_ITEMS_KEY, jsonStr);
        }
      } catch { }

      // Tutup dialog bila sedang terbuka
      setIsDialogOpen(false);
      setActiveDialogs(null);
      setCurrentDialogCharacter(null);

      // Reset seluruh state reaktif React
      setCollectedStarIds([]);
      setIsAgusTalked(false);
      setHasKayu(false);
      setIsRindaTalked(false);
      setHasTali(false);
      setIsSpot1Repaired(false);
      setIsSpot2Repaired(false);

      // Kembalikan posisi karakter ke titik awal tangga Pos 1
      posRef.current = { x: 84, y: 36 };
      directionRef.current = "down";
      frameIndexRef.current = 0;
      isMovingRef.current = false;
      if (characterRef.current) {
        characterRef.current.style.transform = `translate3d(calc(84vw - 50%), calc(36vh - 100%), 0)`;
      }
      if (spriteImgRef.current) {
        spriteImgRef.current.src = getSpriteSrc("down", 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // -------------------------------------------------------------------------
  // PRELOAD ASSETS & LOAD / RESET STATUS SESI
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Preload sprite karakter jalan
    Object.values(WEBP_WALK_FRAMES).forEach((frames) => {
      frames.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });

    // Preload NPC portraits & assets
    [
      "/openworld2/bg.webp",
      "/openworld2/penjagapos.webp",
      "/openworld2/pendakiprofesional.webp",
      "/openworld2/tiang_tinggi.webp",
      "/openworld2/tali.webp",
      "/openworld2/arah1.webp",
      "/openworld2/arah2.webp",
      "/labirin_pendakian/target.webp",
      "/maps/gembok.webp",
      "/openworld/star.webp",
    ].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Muat avatar terpilih dari storage
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
          // fallback browser lama
          return (window.performance as unknown as { navigation?: { type?: number } })?.navigation?.type === 1;
        } catch {
          return false;
        }
      })();

      // MODE REFRESHABLE:
      // Jika pengguna melakukan refresh halaman browser (F5 / reload) dan flag IS_REFRESHABLE_OW2 aktif,
      // selalu reset seluruh sesi Open World 2 ke awal untuk pengujian ulang
      if (IS_REFRESHABLE_OW2 && isPageReload) {
        handleResetSession();
        return;
      }

      // Cek apakah baru kembali dari halaman crafting melalui navigasi internal router Next.js
      const justCrafted = sessionStorage.getItem("aksara_lawu_just_crafted");
      const isReturningFromCrafting = justCrafted === "true";

      if (isReturningFromCrafting) {
        // Hapus token transisi agar reload selanjutnya tidak dianggap baru kembali dari crafting
        sessionStorage.removeItem("aksara_lawu_just_crafted");
        sessionStorage.removeItem("aksara_lawu_crafted_arah1");
        localStorage.removeItem("aksara_lawu_crafted_arah1");
        const targetSpot = sessionStorage.getItem("aksara_lawu_crafting_target_spot") || "1";
        sessionStorage.removeItem("aksara_lawu_crafting_target_spot");

        // Tancapkan papan arah yang baru dirakit ke titik yang dituju
        if (targetSpot === "2") {
          setIsSpot2Repaired(true);
          sessionStorage.setItem("aksara_lawu_ow2_spot2_fixed", "true");
          localStorage.setItem("aksara_lawu_ow2_spot2_fixed", "true");
        } else {
          setIsSpot1Repaired(true);
          sessionStorage.setItem("aksara_lawu_ow2_spot1_fixed", "true");
          localStorage.setItem("aksara_lawu_ow2_spot1_fixed", "true");
        }

        // Kembalikan posisi karakter ke posisi sebelum crafting jika ada
        const savedPx = sessionStorage.getItem("aksara_lawu_ow2_player_x");
        const savedPy = sessionStorage.getItem("aksara_lawu_ow2_player_y");
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

        // Muat seluruh progres yang tersimpan agar tidak ter-reset saat kembali dari minigame
        const savedStars =
          sessionStorage.getItem("aksara_lawu_ow2_stars") ||
          localStorage.getItem("aksara_lawu_ow2_stars");
        if (savedStars) {
          try {
            const parsed = JSON.parse(savedStars);
            if (Array.isArray(parsed)) setCollectedStarIds(parsed);
          } catch { }
        }

        const savedAgus =
          sessionStorage.getItem("aksara_lawu_ow2_agus_talked") ||
          localStorage.getItem("aksara_lawu_ow2_agus_talked");
        if (savedAgus === "true") setIsAgusTalked(true);

        const savedKayu =
          sessionStorage.getItem("aksara_lawu_ow2_has_kayu") ||
          localStorage.getItem("aksara_lawu_ow2_has_kayu");
        if (savedKayu === "true") setHasKayu(true);

        const savedRinda =
          sessionStorage.getItem("aksara_lawu_ow2_rinda_talked") ||
          localStorage.getItem("aksara_lawu_ow2_rinda_talked");
        if (savedRinda === "true") setIsRindaTalked(true);

        const savedTali =
          sessionStorage.getItem("aksara_lawu_ow2_has_tali") ||
          localStorage.getItem("aksara_lawu_ow2_has_tali");
        if (savedTali === "true") setHasTali(true);

        const savedSpot1 =
          sessionStorage.getItem("aksara_lawu_ow2_spot1_fixed") ||
          localStorage.getItem("aksara_lawu_ow2_spot1_fixed");
        if (savedSpot1 === "true") setIsSpot1Repaired(true);

        const savedSpot2 =
          sessionStorage.getItem("aksara_lawu_ow2_spot2_fixed") ||
          localStorage.getItem("aksara_lawu_ow2_spot2_fixed");
        if (savedSpot2 === "true") setIsSpot2Repaired(true);

        return;
      }

      // MODE REFRESHABLE: Jika true (dan bukan kembali dari crafting), bersihkan seluruh sesi saat refresh halaman
      if (IS_REFRESHABLE_OW2) {
        handleResetSession();
        return;
      }

      // Mode Normal: Muat sesi progres OpenWorld 2 jika IS_REFRESHABLE_OW2 === false
      const savedStars =
        sessionStorage.getItem("aksara_lawu_ow2_stars") ||
        localStorage.getItem("aksara_lawu_ow2_stars");
      if (savedStars) {
        const parsed = JSON.parse(savedStars);
        if (Array.isArray(parsed)) setCollectedStarIds(parsed);
      }

      const savedAgus =
        sessionStorage.getItem("aksara_lawu_ow2_agus_talked") ||
        localStorage.getItem("aksara_lawu_ow2_agus_talked");
      if (savedAgus === "true") setIsAgusTalked(true);

      const savedKayu =
        sessionStorage.getItem("aksara_lawu_ow2_has_kayu") ||
        localStorage.getItem("aksara_lawu_ow2_has_kayu");
      if (savedKayu === "true") setHasKayu(true);

      const savedRinda =
        sessionStorage.getItem("aksara_lawu_ow2_rinda_talked") ||
        localStorage.getItem("aksara_lawu_ow2_rinda_talked");
      if (savedRinda === "true") setIsRindaTalked(true);

      const savedTali =
        sessionStorage.getItem("aksara_lawu_ow2_has_tali") ||
        localStorage.getItem("aksara_lawu_ow2_has_tali");
      if (savedTali === "true") setHasTali(true);

      const savedSpot1 =
        sessionStorage.getItem("aksara_lawu_ow2_spot1_fixed") ||
        localStorage.getItem("aksara_lawu_ow2_spot1_fixed");
      if (savedSpot1 === "true") setIsSpot1Repaired(true);

      const savedSpot2 =
        sessionStorage.getItem("aksara_lawu_ow2_spot2_fixed") ||
        localStorage.getItem("aksara_lawu_ow2_spot2_fixed");
      if (savedSpot2 === "true") setIsSpot2Repaired(true);

      const savedPx =
        sessionStorage.getItem("aksara_lawu_ow2_player_x") ||
        localStorage.getItem("aksara_lawu_ow2_player_x");
      const savedPy =
        sessionStorage.getItem("aksara_lawu_ow2_player_y") ||
        localStorage.getItem("aksara_lawu_ow2_player_y");
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
  }, [handleResetSession]);

  // -------------------------------------------------------------------------
  // COLLISION DETECTION & PHYSICS
  // -------------------------------------------------------------------------
  const checkCollision = useCallback((x: number, y: number): boolean => {
    // Batas Luar Peta
    if (x < 2 || x > 96 || y < 14 || y > 88) return true;

    // Cek Kotak Rintangan (termasuk rintangan pager kiri yang tetap memblokir pergerakan secara UI)
    for (const obs of OW2_DEFAULT_OBSTACLES) {
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
          sessionStorage.setItem("aksara_lawu_ow2_player_x", pxStr);
          localStorage.setItem("aksara_lawu_ow2_player_x", pxStr);
          sessionStorage.setItem("aksara_lawu_ow2_player_y", pyStr);
          localStorage.setItem("aksara_lawu_ow2_player_y", pyStr);
        } catch { }
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

        // POIN 1: Direct GPU Transform di characterRef (No React state re-render)
        if (characterRef.current) {
          characterRef.current.style.transform = `translate3d(calc(${finalX}vw - 50%), calc(${finalY}vh - 100%), 0)`;
        }

        // Cek Pengambilan 5 Bintang Otomatis saat diinjak
        OW2_STARS_DATA.forEach((star) => {
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
                  sessionStorage.setItem("aksara_lawu_ow2_stars", jsonStr);
                  localStorage.setItem("aksara_lawu_ow2_stars", jsonStr);
                } catch { }
                return next;
              });
            }
          }
        });
      }

      // ---------------------------------------------------------------------
      // CEK JARAK INTERAKSI (Hanya trigger setState saat boolean berubah)
      // ---------------------------------------------------------------------
      const curX = posRef.current.x;
      const curY = posRef.current.y;

      // 1. Dekat Pak Agus (Penjaga Pos)
      const dAgus = Math.hypot(curX - OW2_NPC_POS.agus.x, curY - OW2_NPC_POS.agus.y);
      const isNearAgusNow = dAgus < OW2_NPC_POS.agus.radius;
      if (isNearAgusNow !== nearAgusRef.current) {
        nearAgusRef.current = isNearAgusNow;
        setIsNearAgus(isNearAgusNow);
      }

      // 2. Dekat Rinda (Pendaki)
      const dRinda = Math.hypot(curX - OW2_NPC_POS.rinda.x, curY - OW2_NPC_POS.rinda.y);
      const isNearRindaNow = dRinda < OW2_NPC_POS.rinda.radius;
      if (isNearRindaNow !== nearRindaRef.current) {
        nearRindaRef.current = isNearRindaNow;
        setIsNearRinda(isNearRindaNow);
      }

      // 3. Dekat Tiang Kayu (Wit Rubuh)
      if (isAgusTalked && !hasKayu) {
        const dTiang = Math.hypot(curX - OW2_KAYU_POS.x, curY - OW2_KAYU_POS.y);
        const isNearTiangNow = dTiang < OW2_KAYU_POS.radius;
        if (isNearTiangNow !== nearTiangRef.current) {
          nearTiangRef.current = isNearTiangNow;
          setIsNearTiang(isNearTiangNow);
        }
      } else if (nearTiangRef.current) {
        nearTiangRef.current = false;
        setIsNearTiang(false);
      }

      // 4. Dekat Spot Target 1 (Papan Arah 1: Sisi Tengen)
      const dSpot1 = Math.hypot(curX - OW2_SPOTS.spot1.x, curY - OW2_SPOTS.spot1.y);
      const isNearSpot1Now = dSpot1 < OW2_SPOTS.spot1.radius;
      if (isNearSpot1Now !== nearSpot1Ref.current) {
        nearSpot1Ref.current = isNearSpot1Now;
        setIsNearSpot1(isNearSpot1Now);
      }

      // 5. Dekat Spot Target 2 (Papan Arah 2: Sisi Kiwa)
      const dSpot2 = Math.hypot(curX - OW2_SPOTS.spot2.x, curY - OW2_SPOTS.spot2.y);
      const isNearSpot2Now = dSpot2 < OW2_SPOTS.spot2.radius;
      if (isNearSpot2Now !== nearSpot2Ref.current) {
        nearSpot2Ref.current = isNearSpot2Now;
        setIsNearSpot2(isNearSpot2Now);
      }

      // 6. Dekat Gerbang Labirin Pendakian / Titik Emas (x: 17, y: 76)
      const dGate = Math.hypot(curX - 17, curY - 76);
      const isNearGateNow = isMissionCompleteRef.current ? dGate < 8.5 : dGate < 6.5;
      if (isNearGateNow !== nearExitGateRef.current) {
        nearExitGateRef.current = isNearGateNow;
        setIsNearExitGate(isNearGateNow);
      }

      // Jika misi sudah lengkap dan pemain menginjak titik emas (radius <= 3.8%), otomatis trigger masuk labirin
      if (isMissionCompleteRef.current && dGate <= 3.8 && curtainPhase === "idle") {
        handleExitGateAction();
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [checkCollision, collectedStarIds, isDialogOpen, isAgusTalked, hasKayu]);

  // Siklus Frame Animasi Kaki Karakter Berjalan
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

    return () => {
      if (walkCycleTimerRef.current) clearInterval(walkCycleTimerRef.current);
    };
  }, []);

  // Simpan posisi karakter ke session & local storage saat reload atau berpindah halaman
  useEffect(() => {
    const saveCurrentPlayerPos = () => {
      try {
        const pxStr = String(posRef.current.x);
        const pyStr = String(posRef.current.y);
        sessionStorage.setItem("aksara_lawu_ow2_player_x", pxStr);
        localStorage.setItem("aksara_lawu_ow2_player_x", pxStr);
        sessionStorage.setItem("aksara_lawu_ow2_player_y", pyStr);
        localStorage.setItem("aksara_lawu_ow2_player_y", pyStr);
      } catch { }
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
  // HANDLERS INTERAKSI & DIALOG POPUP
  // -------------------------------------------------------------------------

  // 1. Interaksi dengan Pak Agus (Penjaga Pos)
  const handleTalkToAgus = () => {
    setCurrentDialogCharacter("agus");
    setActiveDialogs([
      {
        id: 1,
        speakerName: "Pak Agus (Panjaga Pos)",
        character: "/openworld2/penjagapos.webp",
        characterSide: "left",
        text: "Sugeng rawuh pendaki ing rute Pos 1 tumuju Labirin Pendakian!",
      },
      {
        id: 2,
        speakerName: "Pak Agus (Panjaga Pos)",
        character: "/openworld2/penjagapos.webp",
        characterSide: "left",
        text: "Sayange rute papan pituduh arah menyang Labirin Pendakian rusak amarga kahanan cuaca.",
      },
      {
        id: 3,
        speakerName: "Pak Agus (Panjaga Pos)",
        character: "/openworld2/penjagapos.webp",
        characterSide: "left",
        text: "Apa kowe bisa ngrewangi aku nggawe papan sing anyar banjur dipasang ing sawetara titik?",
      },
      {
        id: 4,
        speakerName: "Pak Agus (Panjaga Pos)",
        character: "/openworld2/penjagapos.webp",
        characterSide: "left",
        text: "Kanggo nggawe papan pituduh arah, mung butuh kayu lan tali.",
      },
      {
        id: 5,
        speakerName: "Pak Agus (Panjaga Pos)",
        character: "/openworld2/penjagapos.webp",
        characterSide: "left",
        text: "Kanggo kayu kowe bisa nemokake ing reruntuhan wit-witan (wit rubuh) ing sisih kulon.",
      },
      {
        id: 6,
        speakerName: "Pak Agus (Panjaga Pos)",
        character: "/openworld2/penjagapos.webp",
        characterSide: "left",
        text: "Dene kanggo tali aku ora duwe, bokmenawa kowe bisa njaluk saka pendaki liyane!",
      },
    ]);
    setIsDialogOpen(true);
  };

  // 2. Interaksi dengan Rinda (Pendaki)
  const handleTalkToRinda = () => {
    setCurrentDialogCharacter("rinda");

    // Sesuai openworld2.txt: Dialog interaktif dengan tombol "Butuh Tali" dan reward tali.webp
    setActiveDialogs([
      {
        id: 1,
        speakerName: "Rinda (Pendaki)",
        character: "/openworld2/pendakiprofesional.webp",
        characterSide: "left",
        text: "Halo, aku Rinda, pendaki saka Magetan.",
      },
      {
        id: 2,
        speakerName: "Rinda (Pendaki)",
        character: "/openworld2/pendakiprofesional.webp",
        characterSide: "left",
        text: "Aku nggawa piranti lan perlengkapan sing jangkep, apa sing kokbutuhake?",
        customAction: {
          buttonText: "Butuh Tali",
        },
      },
      {
        id: 3,
        speakerName: "Rinda (Pendaki)",
        character: "/openworld2/pendakiprofesional.webp",
        characterSide: "left",
        text: "Oh kowe katon mbutuhake tali kanggo nggawe papan pituduh arah ya, aku seneng banget lan nyengkuyung kuwi!",
      },
      {
        id: 4,
        speakerName: "Rinda (Pendaki)",
        character: "/openworld2/pendakiprofesional.webp",
        characterSide: "left",
        text: "Iki taline jupuken wae!",
        rewardItem: {
          image: "/openworld2/tali.webp",
          name: "Tali Tambang",
        },
      },
    ]);
    setIsDialogOpen(true);
  };

  // Selesai Dialog
  const handleDialogComplete = () => {
    setIsDialogOpen(false);

    if (currentDialogCharacter === "agus") {
      setIsAgusTalked(true);
      try {
        sessionStorage.setItem("aksara_lawu_ow2_agus_talked", "true");
        localStorage.setItem("aksara_lawu_ow2_agus_talked", "true");
      } catch { }
    } else if (currentDialogCharacter === "rinda") {
      setIsRindaTalked(true);
      setHasTali(true);
      try {
        sessionStorage.setItem("aksara_lawu_ow2_rinda_talked", "true");
        localStorage.setItem("aksara_lawu_ow2_rinda_talked", "true");
        sessionStorage.setItem("aksara_lawu_ow2_has_tali", "true");
        localStorage.setItem("aksara_lawu_ow2_has_tali", "true");
      } catch { }
    }

    setCurrentDialogCharacter(null);
  };

  // 3. Mengambil Tiang Kayu dari Reruntuhan Wit Rubuh
  const handlePickTiangKayu = () => {
    setHasKayu(true);
    try {
      sessionStorage.setItem("aksara_lawu_ow2_has_kayu", "true");
      localStorage.setItem("aksara_lawu_ow2_has_kayu", "true");
    } catch { }
  };

  // 4. Interaksi dengan Spot Target (Dandani Papan Arah) -> Langsung tuju ke halaman crafting
  const handleSpotTargetAction = (spotId: number) => {
    // Jika bahan belum lengkap
    if (!hasKayu || !hasTali) {
      setCurrentDialogCharacter("spot_guide");
      setActiveDialogs([
        {
          id: 1,
          speakerName: "Panuntun Lawu",
          character: "/character/guider_pose1.png",
          characterSide: "left",
          text: "Bahan durung jangkep! Kowe butuh 1x Kayu (Tiang) lan 1x Tali Tambang kanggo ngrakit papan pituduh arah. Coba temoni Pak Agus lan Rinda dhisik.",
        },
      ]);
      setIsDialogOpen(true);
      return;
    }

    // Bahan sudah lengkap: Langsung meluncur ke halaman crafting (merakit papan arah)
    try {
      const pxStr = String(posRef.current.x);
      const pyStr = String(posRef.current.y);
      sessionStorage.setItem("aksara_lawu_crafting_target_spot", String(spotId));
      localStorage.setItem("aksara_lawu_crafting_target_spot", String(spotId));
      sessionStorage.setItem("aksara_lawu_ow2_player_x", pxStr);
      localStorage.setItem("aksara_lawu_ow2_player_x", pxStr);
      sessionStorage.setItem("aksara_lawu_ow2_player_y", pyStr);
      localStorage.setItem("aksara_lawu_ow2_player_y", pyStr);
      sessionStorage.removeItem("aksara_lawu_just_crafted");
      localStorage.removeItem("aksara_lawu_just_crafted");
    } catch { }
    router.push("/crafting");
  };

  // 5. Interaksi dengan Gerbang Keluar Labirin Pendakian
  const handleExitGateAction = () => {
    if (!isMissionComplete) {
      setCurrentDialogCharacter("gate_locked");
      setActiveDialogs([
        {
          id: 1,
          speakerName: "Panuntun Lawu",
          character: "/character/guider_pose1.png",
          characterSide: "left",
          text: `Gerbang Labirin isih kakunci! Kowe kudu ngumpulake 5/5 Bintang (saiki: ${totalStarsCount}/5) lan masang 2/2 Papan Arah (saiki: ${totalSpotsRepaired}/2) sadurunge nerusake lelampahan.`,
        },
      ]);
      setIsDialogOpen(true);
      return;
    }

    // Masuk ke /intro_level2 dengan animasi curtain
    setCurtainPhase("closing");
    setTimeout(() => {
      router.push("/intro_level2");
    }, 650);
  };

  // Tombol Interaksi di Sisi Kiri Analog (Sama seperti OpenWorld 1)
  const renderInteractionButton = () => {
    // Sembunyikan tombol saat dialog sedang aktif atau sedang dalam jeda delay 1.8 detik
    if (isDialogOpen) return null;

    if (isNearAgus) {
      return (
        <button
          type="button"
          id="btn-ow-interaksi-agus"
          onClick={handleTalkToAgus}
          className="ow-interact-btn"
          aria-label="Cecaturan karo Pak Agus"
          title="Cecaturan karo Pak Agus"
        >
          <span className="ow-interact-icon">💬</span>
          <span className="ow-interact-text">Cecaturan</span>
        </button>
      );
    }

    if (isNearRinda) {
      return (
        <button
          type="button"
          id="btn-ow-interaksi-rinda"
          onClick={handleTalkToRinda}
          className="ow-interact-btn"
          aria-label="Cecaturan karo Rinda"
          title="Cecaturan karo Rinda"
        >
          <span className="ow-interact-icon">💬</span>
          <span className="ow-interact-text">Cecaturan</span>
        </button>
      );
    }

    if (isNearTiang) {
      return (
        <button
          type="button"
          id="btn-ow-interaksi-kayu"
          onClick={handlePickTiangKayu}
          className="ow-interact-btn"
          aria-label="Jupuk Kayu (Tiang)"
          title="Jupuk Kayu (Tiang)"
        >
          <span className="ow-interact-icon">🪵</span>
          <span className="ow-interact-text">Jupuk</span>
        </button>
      );
    }

    if (isNearSpot1 && !isSpot1Repaired) {
      return (
        <button
          type="button"
          id="btn-ow-interaksi-spot1"
          onClick={() => handleSpotTargetAction(1)}
          className="ow-interact-btn"
          aria-label="Dandani Titik Papan Arah 1"
          title="Dandani Titik Papan Arah 1"
        >
          <span className="ow-interact-icon">🔨</span>
          <span className="ow-interact-text">Dandani</span>
        </button>
      );
    }

    if (isNearSpot2 && !isSpot2Repaired) {
      return (
        <button
          type="button"
          id="btn-ow-interaksi-spot2"
          onClick={() => handleSpotTargetAction(2)}
          className="ow-interact-btn"
          aria-label="Dandani Titik Papan Arah 2"
          title="Dandani Titik Papan Arah 2"
        >
          <span className="ow-interact-icon">🔨</span>
          <span className="ow-interact-text">Dandani</span>
        </button>
      );
    }

    if (isNearExitGate) {
      return (
        <button
          type="button"
          id="btn-ow-interaksi-gate"
          onClick={handleExitGateAction}
          className="ow-interact-btn"
          aria-label={isMissionComplete ? "Mlebu menyang Labirin" : "Gerbang isih kakunci"}
          title={isMissionComplete ? "Mlebu menyang Labirin" : "Gerbang isih kakunci"}
        >
          <span className="ow-interact-icon">
            {isMissionComplete ? "🚪" : "🔒"}
          </span>
          <span className="ow-interact-text">
            {isMissionComplete ? "Mlebu" : "Kakunci"}
          </span>
        </button>
      );
    }

    return null;
  };

  return (
    <main className="ow2-root" aria-label="Halaman Open World 2">
      {/* 0. Layer Bayangan Gelap Vignette Ambient pada Background agar Fokus */}
      <div className="ow2-vignette" />

      {/* 1. Efek Cuaca Kabut & Daun Gugur (Memoized) */}
      <FogWind />
      <FallenLeaves />

      {/* 2. Tombol Kontrol Debug / Pengujian (Toggle Rintangan & Reset Sesi) */}
      <div className="ow2-debug-controls">
        <button
          type="button"
          className="ow2-session-reset-btn"
          onClick={handleResetSession}
          title="Reset Sesi Open World 2 (Uji Coba Ulang dari Awal)"
        >
          <RotateCcw style={{ width: "1.1vw", height: "1.1vw" }} />
          <span>Reset Sesi</span>
        </button>

        <button
          type="button"
          className="ow2-obstacle-toggle-btn"
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

      {/* 3. Render Rintangan (Kotak Hitam 'Ora Bisa Dilewati' persis OpenWorld 1 + Debug visualizer jika aktif) */}
      {OW2_DEFAULT_OBSTACLES.map((obs) => {
        const isClosedObstacle = obs.id === "labirin-pager-kiri";

        // Jika bukan rintangan khusus labirin dan debug showObstacles mati, jangan render
        if (!isClosedObstacle && !showObstacles) return null;

        // Status untuk rintangan khusus labirin:
        // Saat misi belum selesai: Gelap dengan badge "Ora Bisa Dilewati" + gembok (persis OpenWorld 1)
        // Saat misi selesai: Terbuka, gembok hilang, cuman rintangan merah opacity rendah tetap ada memblokir jalan fisik (secara UI)
        const showDarkLock = isClosedObstacle && !isMissionComplete;
        const showUnlockedRed = isClosedObstacle && isMissionComplete;

        return (
          <div
            key={obs.id}
            className={`ow2-obstacle-box ${showDarkLock
              ? "ow-collision-closed-dark"
              : showUnlockedRed
                ? "ow2-obstacle-unlocked-red"
                : showObstacles
                  ? "ow2-obstacle-visible"
                  : "ow2-obstacle-hidden"
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
              <div className="ow-closed-badge-container">
                <span className="ow-closed-badge-text">
                  ⛔ {obs.name}
                </span>
                <img
                  src="/maps/gembok.webp"
                  alt="Gembok Rintangan Tertutup"
                  className="ow-closed-gembok-img"
                  draggable={false}
                />
              </div>
            ) : showObstacles ? (
              <>
                <span className="ow2-obstacle-id">{obs.id}</span>
                <span className="ow2-obstacle-coords">
                  x:{obs.x} y:{obs.y} w:{obs.w} h:{obs.h}
                </span>
              </>
            ) : null}
          </div>
        );
      })}

      {/* Titik / Zona Lingkaran Emas Transisi Gerbang Labirin saat Misi Selesai (Persis OpenWorld 1) */}
      {isMissionComplete && (
        <div
          className="ow2-gold-zone"
          style={{ left: "17%", top: "76%" }}
          aria-label="Titik Emas Gerbang Labirin"
          onClick={handleExitGateAction}
        >
          <div className="ow2-gold-inner-circle" />
        </div>
      )}

      {/* 4. Render 5 Bintang yang Belum Terkumpul (Persis OpenWorld 1) */}
      {OW2_STARS_DATA.filter((star) => !collectedStarIds.includes(star.id)).map(
        (star) => (
          <div
            key={`star-${star.id}`}
            className="ow2-star-item"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            <div className="ow2-star-trigger-zone" />
            <img
              src="/openworld/star.webp"
              alt={`Bintang ${star.id}`}
              className="ow2-star-img"
              draggable={false}
            />
          </div>
        )
      )}

      {/* 5. Render Tiang Kayu di Reruntuhan Pohon (Muncul setelah bicara dengan Pak Agus) */}
      {isAgusTalked && !hasKayu && (
        <div
          className="ow2-tiang-item"
          style={{ left: `${OW2_KAYU_POS.x}%`, top: `${OW2_KAYU_POS.y}%` }}
          aria-label="Kayu (Tiang)"
        >
          <div className="ow2-tiang-pulse-zone" />
          <div className="ow2-tiang-label">Kayu (Tiang)</div>
          <img
            src="/openworld2/tiang_tinggi.webp"
            alt="Kayu"
            className="ow2-tiang-img"
            draggable={false}
          />
        </div>
      )}

      {/* 6. Render NPC Pak Agus (Penjaga Pos di Kanan Atas: Patroli ke Kanan) */}
      <OpenWorld2NPC
        x={OW2_NPC_POS.agus.x}
        y={OW2_NPC_POS.agus.y}
        name="Pak Agus (Panjaga Pos)"
        type="penjaga"
        patrolDirection="kanan"
        avatarImg="/openworld2/penjagapos.webp"
        isInteracting={isDialogOpen && currentDialogCharacter === "agus"}
        showTriggerZone={!isAgusTalked}
        onClick={handleTalkToAgus}
      />

      {/* 7. Render NPC Rinda (Pendaki di Dekat Warung: Patroli ke Kiri) */}
      <OpenWorld2NPC
        x={OW2_NPC_POS.rinda.x}
        y={OW2_NPC_POS.rinda.y}
        name="Rinda (Pendaki)"
        type="pendaki"
        patrolDirection="kiri"
        avatarImg="/openworld2/pendakiprofesional.webp"
        isInteracting={isDialogOpen && currentDialogCharacter === "rinda"}
        showTriggerZone={!isRindaTalked}
        onClick={handleTalkToRinda}
      />

      {/* 8. Komponen Spot Target 1 (Papan Arah 1: Sisi Tengen) */}
      <SpotTarget
        id={OW2_SPOTS.spot1.id}
        x={OW2_SPOTS.spot1.x}
        y={OW2_SPOTS.spot1.y}
        isRepaired={isSpot1Repaired}
        resultImage={OW2_SPOTS.spot1.resultImage}
        label={OW2_SPOTS.spot1.label}
        isPlayerNear={isNearSpot1}
        onClick={() => handleSpotTargetAction(1)}
      />

      {/* 9. Komponen Spot Target 2 (Papan Arah 2: Sisi Kiwa) */}
      <SpotTarget
        id={OW2_SPOTS.spot2.id}
        x={OW2_SPOTS.spot2.x}
        y={OW2_SPOTS.spot2.y}
        isRepaired={isSpot2Repaired}
        resultImage={OW2_SPOTS.spot2.resultImage}
        label={OW2_SPOTS.spot2.label}
        isPlayerNear={isNearSpot2}
        onClick={() => handleSpotTargetAction(2)}
      />

      {/* 10. Karakter Pemain Utama (POIN 1: Direct GPU Transform translate3d) */}
      <div className="ow2-character-stage" aria-hidden="true">
        <div
          ref={characterRef}
          className="ow2-character-entity"
          style={{
            transform: `translate3d(calc(${posRef.current.x}vw - 50%), calc(${posRef.current.y}vh - 100%), 0)`,
          }}
        >
          {/* Nametag Pemain */}
          <div className="ow2-character-nametag">
            <img
              src={`/avatar/${selectedAvatar}`}
              alt="Avatar"
              className="ow2-nametag-icon"
              draggable={false}
            />
            <span className="ow2-nametag-text">Pendaki Lawu</span>
          </div>

          {/* Sprite Berjalan Karakter */}
          <div className="ow2-character-sprite-wrap">
            <img
              ref={spriteImgRef}
              src={getSpriteSrc("down", 0)}
              alt="Pendaki Lawu"
              className="ow2-character-sprite"
              draggable={false}
            />
            <div className="ow2-character-shadow" />
          </div>
        </div>
      </div>

      {/* 11. Burung Terbang (Layer Paling Atas di Atas Seluruh Elemen World & Karakter) */}
      <FlyingBirds />

      {/* 12. Papan Progres Petualangan (Pojok Bawah Kiri) */}
      <aside className="ow2-progress-board" aria-label="Progres Petualangan">
        <div className="ow2-progress-header">
          <span className="ow2-progress-title">PROGRES JELAJAH</span>
          <span className="ow2-progress-percent">{progressPercent}%</span>
        </div>

        <div className="ow2-progress-bar-bg">
          <div
            className="ow2-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="ow2-progress-rows">
          <div
            className={`ow2-progress-row ${totalStarsCount >= 5 ? "ow2-progress-row-complete" : ""
              }`}
          >
            <span>Bintang</span>
            <span>{totalStarsCount} / 5</span>
          </div>

          <div
            className={`ow2-progress-row ${totalSpotsRepaired >= 2 ? "ow2-progress-row-complete" : ""
              }`}
          >
            <span>Papan Arah</span>
            <span>{totalSpotsRepaired} / 2</span>
          </div>
        </div>
      </aside>

      {/* 13. Tombol Interaksi di Sisi Kiri Analog (Sama seperti OpenWorld 1) */}
      {renderInteractionButton()}

      {/* 14. Virtual Joystick (POIN 3: Memoized & Zero-Latency) */}
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

      {/* 15. Dialog Pop Up Berkarakter */}
      {isDialogOpen && activeDialogs && (
        <DialogPopup
          key={`dialog-${currentDialogCharacter}`}
          isOpen={true}
          dialogs={activeDialogs}
          initialDelayMs={
            currentDialogCharacter === "agus" || currentDialogCharacter === "rinda"
              ? 1800
              : 0
          }
          instantText={false}
          focusBackdrop={true}
          onComplete={handleDialogComplete}
        />
      )}

      {/* 16. Curtain Transisi ke /intro_level2 */}
      <div
        className={`ow2-curtain-overlay ${curtainPhase === "closing" ? "ow2-curtain-closing" : ""
          }`}
      >
        <div className="ow2-curtain-top" />
        <div className="ow2-curtain-bottom" />
      </div>
    </main>
  );
}

