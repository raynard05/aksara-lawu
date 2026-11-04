"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import FogWind from "../components/FogWind/FogWind";
import FallenLeaves from "../components/fallenleaves/FallenLeaves";
import VirtualJoystick, {
  JoystickMoveEvent,
} from "../components/VirtualJoystick/VirtualJoystick";
import ConfuseCharacter from "../components/ConfuseCharacter/ConfuseCharacter";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import FlyingBirds from "../components/FlyingBirds/FlyingBirds";
import {
  getSavedInventoryItems,
  saveInventoryItems,
} from "../lib/inventoryStorage";
import "./openworld.css";

// 5 Lokasi Bintang Tersebar di Jalur Setapak
export const STARS_DATA = [
  { id: 1, x: 20, y: 72 },
  { id: 2, x: 42, y: 44 },
  { id: 3, x: 58, y: 55 },
  { id: 4, x: 74, y: 64 },
  { id: 5, x: 73, y: 48 },
];

// Lokasi Kacamata Bayu yang Hilang (di sekitar toko perlengkapan / warung sisi kiri bawah: x: 19, y: 65)
export const KACAMATA_DATA = {
  id: "kacamata-bayu",
  x: 25,
  y: 85,
};

// 21 Frame WebP Resmi dari assets/character/characterwalk1:
// characterwalk (1).webp sampai (7).webp: Depan (Maju ke bawah / hadap kamera)
// characterwalk (8).webp sampai (14).webp: Belakang (Maju ke atas / membelakangi kamera)
// characterwalk (15).webp sampai (21).webp: Samping (Karakter hadap kanan secara default)
// Untuk hadap Kanan: scaleX(1)
// Untuk hadap Kiri: scaleX(-1) (flip horizontal)
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

// Definisi Frame Rintangan Berwarna (Collision Obstacles):
// Pepohonan, semak-semak tebal, batu gunung, dan batas tebing di peta
export interface ObstacleBox {
  id: string;
  name: string;
  x: number; // Persentase X kiri (%)
  y: number; // Persentase Y atas (%)
  w: number; // Lebar (%)
  h: number; // Tinggi (%)
}

const DEFAULT_OBSTACLES: ObstacleBox[] = [
  // 1. Rombongan Pohon Rimbun Sisi Kiri Atas
  {
    id: "pohon-kiri-atas",
    name: "Wit Rimbun Kiri",
    x: 0,
    y: 0,
    w: 24,
    h: 42,
  },
  // 2. Barisan Pepohonan & Tebing Tengah Atas
  {
    id: "pohon-tengah-atas",
    name: "Jurang & Wit Ndhuwur",
    x: 24,
    y: 0,
    w: 49,
    h: 42,
  },
  // 3. Pepohonan Hutan Lebat Sisi Kanan Atas (Arah Pos 1 Tertutup)
  {
    id: "pohon-kanan-atas",
    name: "Ora Bisa Dilewati (Tertutup)",
    x: 70,
    y: 0,
    w: 35,
    h: 43.5,
  },

  {
    id: "pohon-kanan-atas2",
    name: "Wit Kandel Kanan2",
    x: 85,
    y: 0,
    w: 15,
    h: 31,
  },

  {
    id: "pohon-kanan-atas3",
    name: "Wit Kandel Kanan3",
    x: 95,
    y: 30,
    w: 5,
    h: 18,
  },

  {
    id: "pohon-kanan-atas4",
    name: "Wit Kandel Kanan4",
    x: 78,
    y: 33,
    w: 5,
    h: 25,
  },



  // 4. Bebatuan & Semak Kiri Bawah (Pojok Kiri)
  {
    id: "batu-kiri-ngisor",
    name: "Watu Gede Kiri",
    x: 30,
    y: 75,
    w: 100,
    h: 40,
  },

  {
    id: "batu-kiri-ngisor2",
    name: "Watu Gede Kiri2",
    x: 0,
    y: 79,
    w: 22,
    h: 22,
  },

  {
    id: "batu-kiri-ngisor3",
    name: "Watu Gede Kiri3",
    x: 12,
    y: 88,
    w: 22,
    h: 14,
  },

  {
    id: "batu-kiri-2",
    name: "Watu Gede 2",
    x: 0,
    y: 35
    ,
    w: 7,
    h: 50,
  },


  {
    id: "batu-kiri-3",
    name: "Watu Gede 3",
    x: 4,
    y: 50
    ,
    w: 20,
    h: 17,
  },
  // 5. Bebatuan & Tebing Sisi Kanan Tengah
  {
    id: "batu-kanan-tengah",
    name: "Gundukan Watu Kanan",
    x: 80,
    y: 44,
    w: 22,
    h: 33,
  },
  {
    id: "batu-tengah",
    name: "Gundukan Watu tengah",
    x: 30,
    y: 60,
    w: 30,
    h: 20,
  },
  {
    id: "batu-tengah2",
    name: "Gundukan Watu tengah 2",
    x: 31,
    y: 51,
    w: 20,
    h: 9,
  },

  {
    id: "batu-tengah3",
    name: "Gundukan Watu tengah 3",
    x: 65,
    y: 57,
    w: 9,
    h: 5,
  },


  {
    id: "batu-tengah4",
    name: "Gundukan Watu tengah 4",
    x: 35,
    y: 47,
    w: 9,
    h: 5,
  },

  {
    id: "batu-tengah5",
    name: "Gundukan Watu tengah 5",
    x: 55,
    y: 42,
    w: 12,
    h: 7,
  },

  {
    id: "batu-tengah6",
    name: "Gundukan Watu tengah 6",
    x: 7,
    y: 66,
    w: 7,
    h: 7,
  },

  {
    id: "batu-tengah7",
    name: "Gundukan Watu tengah 7",
    x: 60,
    y: 68,
    w: 9,
    h: 8,
  },

];

// Flag untuk reset sesi otomatis saat refresh halaman (bisa diubah true / false sesuai kebutuhan testing)
const IS_REFRESHABLE: boolean = true;

// Pilih sprite webp yang sesuai dengan arah dan frame
const getSpriteSrc = (dir: Direction, frameIdx: number) => {
  const list = WEBP_WALK_FRAMES[dir] || WEBP_WALK_FRAMES.down;
  if (!list || list.length === 0) return WEBP_WALK_FRAMES.down[0];
  const safeIdx = frameIdx % list.length;
  return list[safeIdx] || list[0];
};

export default function OpenWorldPage() {
  const router = useRouter();

  // Posisi dan animasi karakter dikelola langsung melalui Ref & GPU translate3d (Zero React State Thrashing di 60 FPS)
  const characterRef = useRef<HTMLDivElement>(null);
  const spriteImgRef = useRef<HTMLImageElement>(null);
  const posRef = useRef<{ x: number; y: number }>({ x: 18, y: 46 });
  const directionRef = useRef<Direction>("down");
  const frameIndexRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);

  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1.webp");

  // State untuk melihat frame berwarna daerah rintangan (Default FALSE agar super ringan di HP mobile)
  const [showObstacles, setShowObstacles] = useState<boolean>(false);

  // Vektor joystick analog (x: -1 s/d 1, y: -1 s/d 1)
  const joystickVectorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const walkCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Status Proksimitas Interaksi (Hanya re-render saat masuk/keluar zona pemicu)
  const [isNearBayu, setIsNearBayu] = useState<boolean>(false);
  const [isNearKacamata, setIsNearKacamata] = useState<boolean>(false);
  const [isNearPos1Transition, setIsNearPos1Transition] = useState<boolean>(false);

  const nearBayuRef = useRef<boolean>(false);
  const nearKacamataRef = useRef<boolean>(false);
  const nearPos1Ref = useRef<boolean>(false);

  // Progress & Quest States (Pendaki Bingung & Bintang)
  const [collectedStarIds, setCollectedStarIds] = useState<number[]>([]);
  const [questStep, setQuestStep] = useState<
    "not_started" | "searching" | "found" | "completed"
  >("not_started");
  // "not_started": belum bicara
  // "searching": Bayu minta tolong cari kacamata -> kacamata muncul di world
  // "found": kacamata sudah diambil user -> siap dikembalikan ke Bayu
  // "completed": kacamata dikembalikan, dapat badge pos 1, rute Pos 1 terbuka

  // Dialog System States
  const [activeDialogs, setActiveDialogs] = useState<DialogItem[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentDialogType, setCurrentDialogType] = useState<
    "bayu_intro" | "kacamata_found" | "bayu_reward" | null
  >(null);

  // Transition Curtain ke Halaman Maps (Turun dari atas -> Diam sejenak -> Turun ke bawah menghilang -> Terbuka halaman Maps)
  const [curtainPhase, setCurtainPhase] = useState<
    "idle" | "closing" | "opening"
  >("idle");

  // Load atau Reset status sesi saat refresh halaman
  useEffect(() => {
    try {
      if (IS_REFRESHABLE) {
        // Mode Refreshable AKTIF: bersihkan semua progress sesi openworld & badge1 agar kembali ke awal
        sessionStorage.removeItem("aksara_lawu_ow_stars");
        localStorage.removeItem("aksara_lawu_ow_stars");
        sessionStorage.removeItem("aksara_lawu_ow_quest");
        localStorage.removeItem("aksara_lawu_ow_quest");

        // Hapus badge1 dari inventory untuk pengujian ulang
        const currentItems = getSavedInventoryItems();
        if (currentItems.includes("badge1")) {
          saveInventoryItems(currentItems.filter((id) => id !== "badge1"));
        }

        setCollectedStarIds([]);
        setQuestStep("not_started");
        return;
      }

      // Mode Normal: Muat data dari penyimpanan sesi jika IS_REFRESHABLE === false
      const savedStars =
        sessionStorage.getItem("aksara_lawu_ow_stars") ||
        localStorage.getItem("aksara_lawu_ow_stars");
      if (savedStars) {
        setCollectedStarIds(JSON.parse(savedStars));
      }

      const savedQuest =
        sessionStorage.getItem("aksara_lawu_ow_quest") ||
        localStorage.getItem("aksara_lawu_ow_quest");
      if (
        savedQuest === "not_started" ||
        savedQuest === "searching" ||
        savedQuest === "found" ||
        savedQuest === "completed"
      ) {
        setQuestStep(savedQuest);
      }
    } catch {
      // ignore
    }
  }, []);

  const questStepRef = useRef<"not_started" | "searching" | "found" | "completed">("not_started");
  const collectedStarIdsRef = useRef<number[]>([]);

  useEffect(() => {
    questStepRef.current = questStep;
  }, [questStep]);

  useEffect(() => {
    collectedStarIdsRef.current = collectedStarIds;
  }, [collectedStarIds]);

  // Simpan progress bintang
  const collectStar = (id: number) => {
    if (collectedStarIdsRef.current.includes(id)) return;
    const next = [...collectedStarIdsRef.current, id];
    collectedStarIdsRef.current = next;
    setCollectedStarIds((prev) => {
      if (prev.includes(id)) return prev;
      try {
        sessionStorage.setItem("aksara_lawu_ow_stars", JSON.stringify(next));
        localStorage.setItem("aksara_lawu_ow_stars", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Update dan simpan quest step
  const updateQuestStep = (
    step: "not_started" | "searching" | "found" | "completed"
  ) => {
    questStepRef.current = step;
    setQuestStep(step);
    try {
      sessionStorage.setItem("aksara_lawu_ow_quest", step);
      localStorage.setItem("aksara_lawu_ow_quest", step);
    } catch {
      // ignore
    }
  };

  // Preload 21 WebP frame animasi jalan & inisialisasi proksimitas awal
  useEffect(() => {
    // 1. Preload 21 WebP frames agar tidak ada jank decode saat mulai jalan di HP
    const allFrames = [
      ...WEBP_WALK_FRAMES.down,
      ...WEBP_WALK_FRAMES.up,
      ...WEBP_WALK_FRAMES.right,
      ...WEBP_WALK_FRAMES.left,
    ];
    allFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // 2. Inisialisasi status proksimitas awal
    const initX = posRef.current.x;
    const initY = posRef.current.y;
    const nearB = Math.hypot(initX - 64, initY - 75) <= 13.5;
    nearBayuRef.current = nearB;
    setIsNearBayu(nearB);

    // 3. Pastikan tombol Maps dan Bag di TopBar dinonaktifkan saat di Open World
    window.dispatchEvent(
      new CustomEvent("aksara-lawu-topbar-toggle", {
        detail: { disableInGame: true },
      })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("aksara-lawu-topbar-toggle", {
          detail: { disableInGame: false },
        })
      );
    };
  }, []);

  // Cek apakah posisi koordinat (targetX, targetY) bertabrakan dengan salah satu rintangan
  const checkCollision = useCallback((targetX: number, targetY: number) => {
    const charRadiusX = 1.1;
    const charRadiusY = 0.9;

    for (let i = 0; i < DEFAULT_OBSTACLES.length; i++) {
      const obs = DEFAULT_OBSTACLES[i];
      if (obs.id === "pohon-kanan-atas" && questStepRef.current === "completed") {
        continue;
      }

      const obsLeft = obs.x;
      const obsRight = obs.x + obs.w;
      const obsTop = obs.y;
      const obsBottom = obs.y + obs.h;

      const overlapX =
        targetX + charRadiusX >= obsLeft && targetX - charRadiusX <= obsRight;
      const overlapY =
        targetY + charRadiusY >= obsTop && targetY - charRadiusY <= obsBottom;

      if (overlapX && overlapY) {
        return true;
      }
    }
    return false;
  }, []);

  // Ambil avatar tersimpan dari sesi Cemoro Sewu
  useEffect(() => {
    try {
      const storedAvatar =
        sessionStorage.getItem("aksara_lawu_selected_avatar") ||
        localStorage.getItem("aksara_lawu_selected_avatar");
      if (storedAvatar) {
        setSelectedAvatar(storedAvatar);
      }
    } catch {
      // ignore
    }
  }, []);

  // Kontrol siklus pergantian frame kaki karakter secara direct DOM (Zero React Re-render)
  const startWalkCycle = useCallback(() => {
    if (!walkCycleTimerRef.current) {
      walkCycleTimerRef.current = setInterval(() => {
        frameIndexRef.current += 1;
        if (spriteImgRef.current) {
          spriteImgRef.current.src = getSpriteSrc(
            directionRef.current,
            frameIndexRef.current
          );
        }
      }, 105);
    }
  }, []);

  const stopWalkCycle = useCallback(() => {
    if (walkCycleTimerRef.current) {
      clearInterval(walkCycleTimerRef.current);
      walkCycleTimerRef.current = null;
    }
    frameIndexRef.current = 0;
    if (spriteImgRef.current) {
      spriteImgRef.current.src = getSpriteSrc(directionRef.current, 0);
    }
  }, []);

  // Game Loop Pergerakan Karakter — 60 FPS Direct GPU Translate3d (Zero State Thrashing)
  useEffect(() => {
    const loop = () => {
      const keys = keysPressedRef.current;
      const joy = joystickVectorRef.current;

      let dx = 0;
      let dy = 0;

      // 1. Input Analog Mobile Legends (Kecepatan dipercepat agar responsif & lincah)
      if (joy.active) {
        const speed = 0.24;
        dx = joy.x * speed;
        dy = joy.y * speed;
      } else {
        // 2. Input Keyboard WASD & Panah
        const keySpeed = 0.24;
        if (keys["ArrowUp"] || keys["KeyW"]) dy -= keySpeed;
        if (keys["ArrowDown"] || keys["KeyS"]) dy += keySpeed;
        if (keys["ArrowLeft"] || keys["KeyA"]) dx -= keySpeed;
        if (keys["ArrowRight"] || keys["KeyD"]) dx += keySpeed;
      }

      const currentlyMoving = Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01;

      if (currentlyMoving !== isMovingRef.current) {
        isMovingRef.current = currentlyMoving;
        if (currentlyMoving) {
          startWalkCycle();
        } else {
          stopWalkCycle();
        }
      }

      if (currentlyMoving) {
        let newDir: Direction = directionRef.current;
        if (Math.abs(dx) >= Math.abs(dy)) {
          newDir = dx > 0 ? "right" : "left";
        } else {
          newDir = dy > 0 ? "down" : "up";
        }

        if (newDir !== directionRef.current) {
          directionRef.current = newDir;
          if (spriteImgRef.current) {
            spriteImgRef.current.src = getSpriteSrc(
              newDir,
              frameIndexRef.current
            );
          }
        }

        const currentPos = posRef.current;
        let nextX = currentPos.x;
        let nextY = currentPos.y;

        const candidateX = Math.max(5, Math.min(95, currentPos.x + dx));
        if (!checkCollision(candidateX, currentPos.y)) {
          nextX = candidateX;
        }

        const minY = questStepRef.current === "completed" && nextX >= 65 ? 16 : 40;
        const candidateY = Math.max(minY, Math.min(94, currentPos.y + dy));
        if (!checkCollision(nextX, candidateY)) {
          nextY = candidateY;
        }

        if (nextX !== currentPos.x || nextY !== currentPos.y) {
          posRef.current = { x: nextX, y: nextY };

          // Update posisi visual karakter langsung ke GPU tanpa memicu re-render React
          if (characterRef.current) {
            characterRef.current.style.transform = `translate3d(calc(${nextX}vw - 50%), calc(${nextY}vh - 100%), 0)`;
          }

          // Cek kedekatan dengan Bayu (Hanya set state jika status berubah)
          const nearB = Math.hypot(nextX - 64, nextY - 75) <= 13.5;
          if (nearB !== nearBayuRef.current) {
            nearBayuRef.current = nearB;
            setIsNearBayu(nearB);
          }

          // Cek kedekatan dengan Kacamata Bayu
          const nearK =
            questStepRef.current === "searching" &&
            Math.hypot(nextX - KACAMATA_DATA.x, nextY - KACAMATA_DATA.y) <= 9.0;
          if (nearK !== nearKacamataRef.current) {
            nearKacamataRef.current = nearK;
            setIsNearKacamata(nearK);
          }

          // Cek kedekatan dengan Titik Kuning Pos 1
          const nearP1 =
            questStepRef.current === "completed" &&
            Math.hypot(nextX - 92, nextY - 34) <= 12.0;
          if (nearP1 !== nearPos1Ref.current) {
            nearPos1Ref.current = nearP1;
            setIsNearPos1Transition(nearP1);
          }

          // Otomatis kumpulkan bintang jika pemain menginjak trigger zone bintang (radius 3.8%)
          for (let s = 0; s < STARS_DATA.length; s++) {
            const star = STARS_DATA[s];
            if (!collectedStarIdsRef.current.includes(star.id)) {
              const dist = Math.hypot(nextX - star.x, nextY - star.y);
              if (dist <= 3.8) {
                collectStar(star.id);
              }
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (walkCycleTimerRef.current) {
        clearInterval(walkCycleTimerRef.current);
        walkCycleTimerRef.current = null;
      }
    };
  }, [checkCollision, startWalkCycle, stopWalkCycle]);

  // Listener keyboard W A S D & Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
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

  // Event Callback Joystick Analog Mobile Legends
  const handleJoystickMove = useCallback((event: JoystickMoveEvent) => {
    joystickVectorRef.current = {
      x: event.x,
      y: event.y,
      active: event.isMoving,
    };
  }, []);

  const handleJoystickEnd = useCallback(() => {
    joystickVectorRef.current = {
      x: 0,
      y: 0,
      active: false,
    };
  }, []);

  // Handler Interaksi saat tombol 'Interaksi' (Gawe Hubungan / Cecaturan) ditekan
  const handleTriggerInteraction = () => {
    // 1. Interaksi dengan Kacamata yang Hilang
    if (isNearKacamata) {
      updateQuestStep("found");
      const dialogFound: DialogItem[] = [
        {
          id: 1,
          speakerName: "Panuntun",
          text: "Wah, kacamatane Bayu wis ketemu! Saiki ayo dibalekake marang Bayu sing ana ing ngisor.",
          character: "guider_pose1",
          characterSide: "left",
        },
      ];
      setActiveDialogs(dialogFound);
      setCurrentDialogType("kacamata_found");
      setIsDialogOpen(true);
      return;
    }

    // 2. Interaksi dengan Bayu
    if (isNearBayu) {
      if (questStep === "not_started") {
        // Dialog Pertama: Bayu minta bantuan cari kacamata
        const dialogIntro: DialogItem[] = [
          {
            id: 1,
            speakerName: "Bayu",
            text: "Halo bro! Jenengku Bayu. Suwun banget kowe wis gelem nyedhak mrene.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
          {
            id: 2,
            speakerName: "Bayu",
            text: "Aku lagi bingung banget iki... Kacamataku ilang, dadi pandelenganku kabur lan ora bisa ndelok dalan kanthi cetha.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
          {
            id: 3,
            speakerName: "Bayu",
            text: "Kowe apa bisa ngrewangi aku nggoleki kacamataku? Kayane keri ing cedhak warung perlengkapan sisih kiwa ngisor pas aku blanja mau.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
        ];
        setActiveDialogs(dialogIntro);
        setCurrentDialogType("bayu_intro");
        setIsDialogOpen(true);
      } else if (questStep === "searching") {
        // Sedang mencari kacamata
        const dialogSearching: DialogItem[] = [
          {
            id: 1,
            speakerName: "Bayu",
            text: "Tulung deloken ing cedhak warung perlengkapan sisih kiwa ngisor ya, muga-muga kacamataku ndang ketemu...",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
        ];
        setActiveDialogs(dialogSearching);
        setCurrentDialogType("bayu_intro");
        setIsDialogOpen(true);
      } else if (questStep === "found") {
        // User membawa kacamata -> Bayu berterima kasih & beri badge 1 + buka pos 1
        const dialogReward: DialogItem[] = [
          {
            id: 1,
            speakerName: "Bayu",
            text: "Wah, suwun banget kowe wis nemokake kacamataku! Saiki mripatku wis padhang lan cetha maneh.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
          {
            id: 2,
            speakerName: "Bayu",
            text: "Kanggo tanda matur suwun, kowe saiki oleh munggah menyang Pos 1. Nampanana Lencana Pos 1 iki ya!",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
            rewardItem: {
              image: "/badge/badge1.webp",
              name: "Lencana Pos 1 (Badge 1)",
            },
          },
          {
            id: 3,
            speakerName: "Bayu",
            text: "Kanggo nerusake lakumu, mlakua nuju titik kuning ing gapura Pos 1 sisih ndhuwur kae.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
        ];
        setActiveDialogs(dialogReward);
        setCurrentDialogType("bayu_reward");
        setIsDialogOpen(true);
      } else if (questStep === "completed") {
        // Sudah selesai
        const dialogDone: DialogItem[] = [
          {
            id: 1,
            speakerName: "Bayu",
            text: "Matur suwun banget kancaku! Dalan menyang Pos 1 wis mbukak, sugeng nerusake petualanganmu ing Gunung Lawu!",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
        ];
        setActiveDialogs(dialogDone);
        setCurrentDialogType(null);
        setIsDialogOpen(true);
      }
    }
  };

  // Callback saat Dialog selesai
  const handleDialogComplete = () => {
    setIsDialogOpen(false);
    if (currentDialogType === "bayu_intro") {
      if (questStep === "not_started") {
        updateQuestStep("searching");
      }
    } else if (currentDialogType === "kacamata_found") {
      // tetap "found", siap bicara ke Bayu
    } else if (currentDialogType === "bayu_reward") {
      // 1. Simpan badge1 ke dalam inventory
      try {
        const currentItems = getSavedInventoryItems();
        if (!currentItems.includes("badge1")) {
          saveInventoryItems([...currentItems, "badge1"]);
        }
      } catch (err) {
        console.error("Gagal nyimpen badge1:", err);
      }

      // 2. Tandai quest selesai
      updateQuestStep("completed");
    }
    setActiveDialogs(null);
    setCurrentDialogType(null);
  };

  // Trigger Closing Transition Scene:
  // 1. Cover turun dari atas menutup layar (0.8s)
  // 2. Langsung pindah ke /maps?from=openworld dengan cover masih tertutup penuh
  // 3. Di halaman /maps, cover diam 1.5 detik (delay) lalu meluncur ke bawah membuka peta maps secara langsung
  const handleEnterPos1Transition = () => {
    if (curtainPhase !== "idle") return;
    setCurtainPhase("closing");

    // Tunggu cover turun menutup penuh layar (850ms), lalu pindah ke halaman maps
    setTimeout(() => {
      router.push("/maps?from=openworld");
    }, 850);
  };

  // Jika aset gambar kiri sudah menghadap ke kiri secara tersendiri, gunakan scaleX(1)
  // Tidak perlu lagi di-flip secara CSS
  const spriteTransform = "scaleX(1)";

  // Hitung total progress
  const totalStars = 5;
  const collectedStarsCount = collectedStarIds.length;
  const challengeDone = questStep === "completed" ? 1 : 0;
  // Bobot: 5 bintang (10% each = 50%), tantangan bayu (50%) -> Total 100%
  const progressPercent = Math.min(
    100,
    Math.round((collectedStarsCount / totalStars) * 50 + challengeDone * 50)
  );

  return (
    <main
      className={`ow-root ${showObstacles ? "ow-show-hitboxes" : ""}`}
      aria-label="Halaman Open World - Lembah Cemoro Lawu"
    >
      {/* 1. Efek Vignette Ambient */}
      <div className="ow-vignette" />

      {/* 2. Komponen FogWind (efek kabut angin perlahan di atas background) */}
      <FogWind />

      {/* 3. Efek Guguran Daun Ringan Dioptimasi (Hanya 5 daun lembut agar GPU mobile super ringan) */}
      <FallenLeaves variant="all" countLimit={5} />

      {/* 4. Burung Terbang Sudut Pandang Datar (Side View POV) Transparan */}
      <FlyingBirds />

      {/* 4. Frame Berwarna Rintangan (Collision Zones: Pohon, Batu, Jurang) */}
      {DEFAULT_OBSTACLES.map((obs) => {
        // Hilangkan rintangan pohon-kanan-atas sepenuhnya setelah tantangan selesai
        if (obs.id === "pohon-kanan-atas" && questStep === "completed") {
          return null;
        }

        const isPos1Closed = obs.id === "pohon-kanan-atas";
        const showClosedDark = isPos1Closed && questStep !== "completed";

        return (
          <div
            key={obs.id}
            className={`ow-collision-zone ${showClosedDark
              ? "ow-collision-closed-dark"
              : showObstacles
                ? "ow-collision-visible"
                : "ow-collision-hidden"
              }`}
            data-label={obs.name}
            style={{
              left: `${obs.x}%`,
              top: `${obs.y}%`,
              width: `${obs.w}%`,
              height: `${obs.h}%`,
              opacity: showClosedDark ? undefined : 0,
            }}
            aria-hidden={!showObstacles && !showClosedDark}
          >
            {showClosedDark && (
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
            )}
          </div>
        );
      })}

      {/* 5. Tombol Toggle Inspeksi Frame Rintangan Berwarna di Pojok Kanan Atas */}
      <button
        type="button"
        id="btn-toggle-obstacles"
        onClick={() => setShowObstacles((prev) => !prev)}
        className="ow-collision-toggle-btn"
        aria-label="Tampilake / Ndhelikake Frame Rintangan"
        title="Klik kanggo nampilake/ndhelikake frame wates wit & watu"
      >
        <span
          className={`ow-toggle-indicator ${showObstacles
            ? "ow-toggle-indicator-on"
            : "ow-toggle-indicator-off"
            }`}
        />
        {showObstacles ? "Frame Rintangan: On" : "Frame Rintangan: Off"}
      </button>

      {/* 6. Render 5 Bintang di Sepanjang Jalan Setapak */}
      {STARS_DATA.map((star) => {
        if (collectedStarIds.includes(star.id)) return null;
        return (
          <div
            key={star.id}
            className="ow-star-entity"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            aria-label={`Bintang ${star.id}`}
          >
            <div className="ow-star-trigger-zone" />
            <img
              src="/openworld/star.webp"
              alt="Bintang Petualangan"
              className="ow-star-img"
              draggable={false}
            />
          </div>
        );
      })}

      {/* 7. Render Kacamata Bayu yang Hilang (Muncul setelah bicara dengan Bayu) */}
      {questStep === "searching" && (
        <div
          className="ow-kacamata-entity"
          style={{ left: `${KACAMATA_DATA.x}%`, top: `${KACAMATA_DATA.y}%` }}
          aria-label="Kacamata Bayu sing Ilang"
        >
          <div className="ow-kacamata-trigger-zone" />
          <img
            src="/openworld/kacamata.webp"
            alt="Kacamata Bayu sing Ilang"
            className="ow-kacamata-img"
            draggable={false}
          />
        </div>
      )}

      {/* 8. Titik / Zona Lingkaran Kuning Kontras di Pos 1 setelah Tantangan Selesai (Tanpa Teks) */}
      {questStep === "completed" && (
        <div
          className="ow-pos1-yellow-zone"
          aria-label="Titik Kuning Gapura Pos 1"
          onClick={handleEnterPos1Transition}
        >
          <div className="ow-pos1-yellow-inner-circle" />
        </div>
      )}

      {/* 9. Area Stage Karakter & NPC */}
      <div className="ow-character-stage" aria-hidden="true">
        {/* NPC Karakter Bingung (ConfuseCharacter) dengan Lingkaran Merah Trigger */}
        <ConfuseCharacter
          x={64}
          y={75}
          name="Pendaki Bingung"
          showTriggerZone={questStep !== "completed"}
        />

        <div
          ref={characterRef}
          className="ow-character-entity"
          style={{
            transform: `translate3d(calc(${posRef.current.x}vw - 50%), calc(${posRef.current.y}vh - 100%), 0)`,
          }}
        >
          {/* Label Nama Pemain & Ikon Avatar */}
          <div className="ow-character-nametag">
            <img
              src={`/avatar/${selectedAvatar}`}
              alt="Avatar"
              className="ow-nametag-icon"
              draggable={false}
            />
            <span className="ow-nametag-text">Pendaki Lawu</span>
          </div>

          {/* Sprite Karakter Bergerak dengan 21 File WebP Lengkap (Direct GPU DOM) */}
          <div className="ow-character-sprite-wrap">
            <img
              ref={spriteImgRef}
              src={getSpriteSrc("down", 0)}
              alt="Karakter Pendaki Lawu"
              className="ow-character-sprite"
              style={{ transform: spriteTransform }}
              draggable={false}
            />
            <div className="ow-character-shadow" />
            {/* Visual Bounding Box Kaki Karakter */}
            <div className="ow-character-hitbox" />
          </div>
        </div>
      </div>

      {/* 10. Frame Progress Petualangan di Pojok Bawah Kiri */}
      <aside className="ow-progress-board" aria-label="Progress Petualangan">
        <div className="ow-progress-header">
          <span className="ow-progress-title">PROGRES JELAJAH</span>
          <span className="ow-progress-percent">{progressPercent}%</span>
        </div>
        <div className="ow-progress-bar-bg">
          <div
            className="ow-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="ow-progress-items">
          <div className="ow-progress-row">
            <div className="ow-progress-row-left">
              <img
                src="/openworld/star.webp"
                alt="Bintang"
                className="ow-progress-star-icon"
                draggable={false}
              />
              <span>Bintang Ditumpuk</span>
            </div>
            <span
              className={`ow-progress-val ${collectedStarsCount === totalStars ? "completed" : ""
                }`}
            >
              {collectedStarsCount} / {totalStars}
            </span>
          </div>
          <div className="ow-progress-row">
            <div className="ow-progress-row-left">
              <span>🧭 Tantangan Bayu</span>
            </div>
            <span
              className={`ow-progress-val ${challengeDone === 1 ? "completed" : ""
                }`}
            >
              {challengeDone} / 1
            </span>
          </div>
        </div>
      </aside>

      {/* 11. Tombol Interaksi (Bahasa Jawa: "Cecaturan" / "Interaksi") di Sisi Kiri Analog */}
      {(isNearBayu || isNearKacamata) && (
        <button
          type="button"
          id="btn-ow-interaksi"
          onClick={handleTriggerInteraction}
          className="ow-interact-btn"
          aria-label={isNearKacamata ? "Jupuk Kacamata" : "Cecaturan karo Bayu"}
          title={isNearKacamata ? "Jupuk Kacamata" : "Cecaturan karo Bayu"}
        >
          <span className="ow-interact-icon">
            {isNearKacamata ? "👓" : "💬"}
          </span>
          <span className="ow-interact-text">
            {isNearKacamata ? "Jupuk" : "Cecaturan"}
          </span>
        </button>
      )}

      {/* Tombol Interaksi Titik Kuning Pos 1 */}
      {isNearPos1Transition && (
        <button
          type="button"
          id="btn-ow-interaksi-pos1"
          onClick={handleEnterPos1Transition}
          className="ow-interact-btn"
          aria-label="Mlebu Pos 1"
          title="Mlebu Pos 1"
        >
          <span className="ow-interact-icon">🚪</span>
          <span className="ow-interact-text">Mlebu Pos 1</span>
        </button>
      )}

      {/* 12. Analog Lingkaran Gaya Mobile Legends di Pojok Kanan Bawah */}
      <VirtualJoystick
        onMove={handleJoystickMove}
        onEnd={handleJoystickEnd}
      />

      {/* 13. Pop Up Dialog Interaktif */}
      {isDialogOpen && activeDialogs && (
        <DialogPopup
          dialogs={activeDialogs}
          isOpen={isDialogOpen}
          onComplete={handleDialogComplete}
        />
      )}

      {/* 14. Closing Scene: Cover Turun dari Atas ke Bawah Menutup Layar, jeda sejenak, lalu Turun ke Bawah Menghilang */}
      {curtainPhase !== "idle" && (
        <div className={`ow-curtain-overlay ow-curtain-${curtainPhase}`} />
      )}
    </main>
  );
}
