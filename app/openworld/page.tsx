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

export default function OpenWorldPage() {
  const router = useRouter();

  // Posisi karakter dalam persentase (%) layar (Spawn di jalan setapak depan gapura gerbang)
  const [posX, setPosX] = useState<number>(18);
  const [posY, setPosY] = useState<number>(46);
  const [direction, setDirection] = useState<Direction>("down");
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1.webp");

  // State untuk melihat frame berwarna daerah rintangan (Toggle Mode Debug/Atur UI)
  const [showObstacles, setShowObstacles] = useState<boolean>(true);

  // Gunakan ref untuk state dinamis agar game loop requestAnimationFrame selalu presisi tanpa closure delay
  const posRef = useRef<{ x: number; y: number }>({ x: 18, y: 46 });
  const directionRef = useRef<Direction>("down");

  // Vektor joystick analog (x: -1 s/d 1, y: -1 s/d 1)
  const joystickVectorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const walkCycleTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Simpan progress bintang
  const collectStar = (id: number) => {
    setCollectedStarIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
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
    setQuestStep(step);
    try {
      sessionStorage.setItem("aksara_lawu_ow_quest", step);
      localStorage.setItem("aksara_lawu_ow_quest", step);
    } catch {
      // ignore
    }
  };

  // Hitung kedekatan karakter dengan NPC Bayu (x: 64, y: 75)
  // Sesuai lingkaran merah trigger visual (18vw x 18vh), berikan range deteksi yang luas (radius ~12-14%)
  const isNearBayu = Math.hypot(posX - 64, posY - 75) <= 13.5;

  // Hitung kedekatan dengan Kacamata Bayu (jika questStep === "searching")
  const isNearKacamata =
    questStep === "searching" &&
    Math.hypot(posX - KACAMATA_DATA.x, posY - KACAMATA_DATA.y) <= 9.0;

  // Hitung kedekatan dengan Zona Kuning Pos 1 (jika questStep === "completed")
  // Area Titik Kuning Pos 1 di CSS: x: 92%, y: 34%
  const isNearPos1Transition =
    questStep === "completed" && Math.hypot(posX - 92, posY - 34) <= 12.0;

  // Sinkronisasi posisi awal
  useEffect(() => {
    posRef.current = { x: posX, y: posY };

    // Otomatis kumpulkan bintang jika pemain menginjak trigger zone bintang (radius 3.8%)
    for (const star of STARS_DATA) {
      if (!collectedStarIds.includes(star.id)) {
        const dist = Math.hypot(posX - star.x, posY - star.y);
        if (dist <= 3.8) {
          collectStar(star.id);
        }
      }
    }
  }, [posX, posY, collectedStarIds]);

  // Cek apakah posisi koordinat (targetX, targetY) bertabrakan dengan salah satu rintangan
  const checkCollision = useCallback(
    (targetX: number, targetY: number) => {
      // Ukuran bounding box kaki karakter (disesuaikan dengan ukuran karakter 50%)
      const charRadiusX = 1.1;
      const charRadiusY = 0.9;

      for (const obs of DEFAULT_OBSTACLES) {
        // Jika tantangan Bayu sudah selesai, rute pohon-kanan-atas terbuka (bisa dilewati)
        if (obs.id === "pohon-kanan-atas" && questStep === "completed") {
          continue;
        }

        const obsLeft = obs.x;
        const obsRight = obs.x + obs.w;
        const obsTop = obs.y;
        const obsBottom = obs.y + obs.h;

        // Cek overlap bounding box
        const overlapX =
          targetX + charRadiusX >= obsLeft && targetX - charRadiusX <= obsRight;
        const overlapY =
          targetY + charRadiusY >= obsTop && targetY - charRadiusY <= obsBottom;

        if (overlapX && overlapY) {
          return true; // Tabrakan terdeteksi
        }
      }
      return false;
    },
    [questStep]
  );

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

  // Animasi frame pergantian kaki saat berjalan
  useEffect(() => {
    if (isMoving) {
      if (!walkCycleTimerRef.current) {
        walkCycleTimerRef.current = setInterval(() => {
          setFrameIndex((prev) => prev + 1);
        }, 135);
      }
    } else {
      if (walkCycleTimerRef.current) {
        clearInterval(walkCycleTimerRef.current);
        walkCycleTimerRef.current = null;
      }
      setFrameIndex(0); // Kembali ke pose diam awal
    }

    return () => {
      if (walkCycleTimerRef.current) {
        clearInterval(walkCycleTimerRef.current);
        walkCycleTimerRef.current = null;
      }
    };
  }, [isMoving]);

  // Game Loop Pergerakan Karakter (Mendukung Keyboard & Analog Mobile Legends)
  useEffect(() => {
    const loop = () => {
      const keys = keysPressedRef.current;
      const joy = joystickVectorRef.current;

      let dx = 0;
      let dy = 0;

      // 1. Input Analog Mobile Legends (Kecepatan diperlambat agar kontrol lebih stabil & rileks)
      if (joy.active) {
        const speed = 0.12;
        dx = joy.x * speed;
        dy = joy.y * speed;
      } else {
        // 2. Input Keyboard WASD & Panah
        const keySpeed = 0.12;
        if (keys["ArrowUp"] || keys["KeyW"]) dy -= keySpeed;
        if (keys["ArrowDown"] || keys["KeyS"]) dy += keySpeed;
        if (keys["ArrowLeft"] || keys["KeyA"]) dx -= keySpeed;
        if (keys["ArrowRight"] || keys["KeyD"]) dx += keySpeed;
      }

      // Gunakan threshold rendah (0.01) agar input analog lambat tetap terdeteksi berjalan
      const currentlyMoving = Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01;
      setIsMoving(currentlyMoving);

      if (currentlyMoving) {
        // Tentukan arah hadap animasi berdasarkan perbandingan vektor dx dan dy
        // Sumbu X dominan: Kanan (dx > 0) atau Kiri (dx < 0)
        // Sumbu Y dominan: Bawah/Depan (dy > 0) atau Atas/Belakang (dy < 0)
        let newDir: Direction = directionRef.current;
        if (Math.abs(dx) >= Math.abs(dy)) {
          newDir = dx > 0 ? "right" : "left";
        } else {
          newDir = dy > 0 ? "down" : "up";
        }

        if (newDir !== directionRef.current) {
          directionRef.current = newDir;
          setDirection(newDir);
        }

        // Hitung posisi baru dengan deteksi collision
        const currentPos = posRef.current;
        let nextX = currentPos.x;
        let nextY = currentPos.y;

        const candidateX = Math.max(5, Math.min(95, currentPos.x + dx));
        if (!checkCollision(candidateX, currentPos.y)) {
          nextX = candidateX;
        }

        // Batas bawah (94%) dan batas atas.
        // Jika berada di jalur kanan arah Pos 1 (x >= 65) saat tantangan selesai, batas atas dibuka sampai 16%
        const minY = questStep === "completed" && nextX >= 65 ? 16 : 40;
        const candidateY = Math.max(minY, Math.min(94, currentPos.y + dy));
        if (!checkCollision(nextX, candidateY)) {
          nextY = candidateY;
        }

        if (nextX !== currentPos.x || nextY !== currentPos.y) {
          posRef.current = { x: nextX, y: nextY };
          setPosX(nextX);
          setPosY(nextY);
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [checkCollision]);

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

  // Handler Interaksi saat tombol 'Interaksi' (Gawé Hubungan / Cecaturan) ditekan
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
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Halo kanca! Aku Bayu. Matur nuwun sanget panjenengan sampun kersa nyelaki lan paring kawigatosan.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
          {
            id: 2,
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Sakjroning atiku saiki lagi bingung banget... Kacamataku ilang lan aku ora bisa ndeleng dalan kanthi cetha.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
          {
            id: 3,
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Apa panjenengan bisa mbantu aku nggoleki kacamata kasebut? Koyo-koyone keri ing sacedhake toko piranti pendaki nalika aku lagi blanja.",
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
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Mangga tulung dipun priksani ing sacedhake toko piranti pendaki sisih kiwa ngisor, mugi-mugi kacamataku ketemu...",
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
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Wah, matur nuwun sanget panjenengan sampun manggihaken kacamata kula! Saiki pandelenganku wis padhang maneh.",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
          },
          {
            id: 2,
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Minangka piwales lan pakurmatan, panjenengan kepareng mlebu menyang Pos 1 lan gawanen Lencana Pos 1 iki!",
            character: "confusecharacter/confusedcharacterfullbody.webp",
            characterSide: "left",
            rewardItem: {
              image: "/badge/badge1.webp",
              name: "Lencana Pos 1 (Badge 1)",
            },
          },
          {
            id: 3,
            speakerName: "Pendaki Bingung (Bayu)",
            text: "Kanggo nerusake lelampahan sabanjure, panjenengan bisa mlaku nuju titik kuning ing gapura Pos 1 sisih ndhuwur.",
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
            text: "Matur nuwun sanget sedulur! Dalan nuju Pos 1 wis binuka, sugeng nglajengaken petualangan ing Gunung Lawu!",
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

  // Pilih sprite webp yang sesuai dengan arah dan frame
  const getSpriteSrc = () => {
    const list = WEBP_WALK_FRAMES[direction] || WEBP_WALK_FRAMES.down;
    if (!list || list.length === 0) return WEBP_WALK_FRAMES.down[0];
    const safeIdx = frameIndex % list.length;
    return list[safeIdx] || list[0];
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

      {/* 3. Efek Guguran Daun Khas Gunung Lawu (Panel Kiri & Panel Kanan) */}
      <FallenLeaves variant="left" />
      <FallenLeaves variant="right" />

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
          />
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
          className="ow-character-entity"
          style={{
            left: `${posX}%`,
            top: `${posY}%`,
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

          {/* Sprite Karakter Bergerak dengan 21 File WebP Lengkap */}
          <div className="ow-character-sprite-wrap">
            <img
              src={getSpriteSrc()}
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
