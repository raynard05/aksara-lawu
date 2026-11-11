"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Hammer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  X,
  Compass,
} from "lucide-react";
import {
  getSavedInventoryItems,
  saveInventoryItems,
} from "../../lib/inventoryStorage";
import "./crafting-game.css";

export interface CraftingItem {
  id: string;
  name: string;
  image: string;
  isTall?: boolean;
}

// Data Item Resmi sesuai crafting.txt
export const ITEM_TIANG: CraftingItem = {
  id: "tiang_tinggi",
  name: "Kayu (Tiang)",
  image: "/openworld2/tiang_tinggi.webp",
  isTall: true,
};

export const ITEM_TALI: CraftingItem = {
  id: "tali",
  name: "Tali Tambang",
  image: "/openworld2/tali.webp",
};

export const ITEM_ARAH1: CraftingItem = {
  id: "arah1",
  name: "Papan Pituduh Arah 1",
  image: "/openworld2/arah1.webp",
};

export const ITEM_ARAH2: CraftingItem = {
  id: "arah2",
  name: "Papan Pituduh Arah 2",
  image: "/openworld2/arah2.webp",
};

export const ITEM_ARAH: CraftingItem = ITEM_ARAH1;

// Interface Sumber Drag
interface DragSource {
  source: "storage" | "crafting";
  index: number;
  item: CraftingItem;
}

const TOTAL_STORAGE_SLOTS = 5;
const TOTAL_CRAFTING_SLOTS = 3;

export default function CraftingGame() {
  const router = useRouter();

  // 1. State Slot Storage (5 Slot di Kiri)
  // Default awal: Slot 0 = Kayu (tiang_tinggi), Slot 1 = Tali (tali), Sisanya kosong (null)
  const [storageSlots, setStorageSlots] = useState<(CraftingItem | null)[]>([
    ITEM_TIANG,
    ITEM_TALI,
    null,
    null,
    null,
  ]);

  // 2. State Slot Input Crafting (3 Slot di Kanan)
  const [craftingSlots, setCraftingSlots] = useState<(CraftingItem | null)[]>([
    null,
    null,
    null,
  ]);

  // 3. State Drag & Drop
  const [draggedItem, setDraggedItem] = useState<DragSource | null>(null);
  const [isDragOverCrafting, setIsDragOverCrafting] = useState<boolean>(false);
  const [isDragOverStorage, setIsDragOverStorage] = useState<boolean>(false);
  const [hoveredCraftSlot, setHoveredCraftSlot] = useState<number | null>(null);
  const [hoveredStorageSlot, setHoveredStorageSlot] = useState<number | null>(null);

  // 4. State Modal & Feedback
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
  const [hasCraftedOnce, setHasCraftedOnce] = useState<boolean>(false);
  const [targetSpotId, setTargetSpotId] = useState<number>(1);

  // Inisialisasi dan Reset State setiap kali halaman Crafting dimuat
  useEffect(() => {
    // Selalu pastikan modal tertutup dan slot dalam kondisi awal siap rakit
    setShowSuccessModal(false);
    setShowRecipeModal(false);
    setHasCraftedOnce(false);
    setDraggedItem(null);
    setHoveredCraftSlot(null);
    setHoveredStorageSlot(null);
    setCraftingSlots([null, null, null]);
    setStorageSlots([ITEM_TIANG, ITEM_TALI, null, null, null]);

    try {
      const sp =
        sessionStorage.getItem("aksara_lawu_crafting_target_spot") ||
        localStorage.getItem("aksara_lawu_crafting_target_spot");
      if (sp === "2") {
        setTargetSpotId(2);
      } else {
        setTargetSpotId(1);
      }
    } catch { }
  }, []);

  // 5. Touch Drag State untuk Device Layar Sentuh (Mobile/Tablet)
  const [touchGhostPos, setTouchGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [touchItem, setTouchItem] = useState<DragSource | null>(null);
  const touchGhostRef = useRef<HTMLDivElement | null>(null);

  // Ref container untuk perhitungan drop target
  const craftingFrameRef = useRef<HTMLDivElement | null>(null);
  const storageFrameRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------------------------
  // PENGECEKAN RESEP (Minecraft-style Recipe Check)
  // Resep: Kayu (tiang_tinggi) + Tali (tali) = Papan Pituduh Arah (arah1 / arah2)
  // -------------------------------------------------------------------------
  const hasKayu = craftingSlots.some((slot) => slot?.id === "tiang_tinggi");
  const hasTali = craftingSlots.some((slot) => slot?.id === "tali");
  const isRecipeMatch = hasKayu && hasTali;
  const currentArahItem = targetSpotId === 2 ? ITEM_ARAH2 : ITEM_ARAH1;
  const craftedResult: CraftingItem | null = isRecipeMatch ? currentArahItem : null;

  // -------------------------------------------------------------------------
  // HANDLER DRAG & DROP DESKTOP (HTML5 DRAG API)
  // -------------------------------------------------------------------------

  // Memulai Drag dari Slot Storage
  const handleDragStartStorage = (e: React.DragEvent, index: number, item: CraftingItem) => {
    const dragData: DragSource = { source: "storage", index, item };
    setDraggedItem(dragData);
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
  };

  // Memulai Drag dari Slot Crafting Input
  const handleDragStartCrafting = (e: React.DragEvent, index: number, item: CraftingItem) => {
    const dragData: DragSource = { source: "crafting", index, item };
    setDraggedItem(dragData);
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
  };

  // Drop ke Slot Input Crafting Spesifik
  const handleDropOnCraftSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCrafting(false);
    setHoveredCraftSlot(null);

    if (!draggedItem) return;

    if (draggedItem.source === "storage") {
      // Pindahkan dari storage ke crafting slot tertentu
      const prevItemAtCraft = craftingSlots[targetIndex];

      setCraftingSlots((prev) => {
        const next = [...prev];
        next[targetIndex] = draggedItem.item;
        return next;
      });

      setStorageSlots((prev) => {
        const next = [...prev];
        next[draggedItem.index] = prevItemAtCraft; // Tukar jika ada item di target
        return next;
      });
    } else if (draggedItem.source === "crafting") {
      // Geser antar slot crafting
      if (draggedItem.index !== targetIndex) {
        setCraftingSlots((prev) => {
          const next = [...prev];
          const temp = next[targetIndex];
          next[targetIndex] = next[draggedItem.index];
          next[draggedItem.index] = temp;
          return next;
        });
      }
    }

    setDraggedItem(null);
  };

  // Drop di Area Frame Crafting (di mana saja di atas asset crafting sebelah kanan)
  const handleDropOnCraftingFrame = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCrafting(false);
    setHoveredCraftSlot(null);

    if (!draggedItem) return;

    // Cari slot input crafting pertama yang masih kosong
    const firstEmptyIndex = craftingSlots.findIndex((slot) => slot === null);

    if (draggedItem.source === "storage") {
      if (firstEmptyIndex !== -1) {
        setCraftingSlots((prev) => {
          const next = [...prev];
          next[firstEmptyIndex] = draggedItem.item;
          return next;
        });

        setStorageSlots((prev) => {
          const next = [...prev];
          next[draggedItem.index] = null;
          return next;
        });
      } else {
        // Jika semua 3 slot penuh, tukar dengan slot 0
        const prevItem = craftingSlots[0];
        setCraftingSlots((prev) => {
          const next = [...prev];
          next[0] = draggedItem.item;
          return next;
        });
        setStorageSlots((prev) => {
          const next = [...prev];
          next[draggedItem.index] = prevItem;
          return next;
        });
      }
    }

    setDraggedItem(null);
  };

  // Drop ke Slot Storage Spesifik
  const handleDropOnStorageSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverStorage(false);
    setHoveredStorageSlot(null);

    if (!draggedItem) return;

    if (draggedItem.source === "crafting") {
      // Kembalikan dari crafting ke storage
      const prevItemAtStorage = storageSlots[targetIndex];

      setStorageSlots((prev) => {
        const next = [...prev];
        next[targetIndex] = draggedItem.item;
        return next;
      });

      setCraftingSlots((prev) => {
        const next = [...prev];
        next[draggedItem.index] = prevItemAtStorage;
        return next;
      });
    } else if (draggedItem.source === "storage") {
      // Geser antar slot storage
      if (draggedItem.index !== targetIndex) {
        setStorageSlots((prev) => {
          const next = [...prev];
          const temp = next[targetIndex];
          next[targetIndex] = next[draggedItem.index];
          next[draggedItem.index] = temp;
          return next;
        });
      }
    }

    setDraggedItem(null);
  };

  // Drop di Area Frame Storage (kembalikan ke storage di slot kosong pertama)
  const handleDropOnStorageFrame = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverStorage(false);
    setHoveredStorageSlot(null);

    if (!draggedItem) return;

    if (draggedItem.source === "crafting") {
      const firstEmptyStorage = storageSlots.findIndex((s) => s === null);
      if (firstEmptyStorage !== -1) {
        setStorageSlots((prev) => {
          const next = [...prev];
          next[firstEmptyStorage] = draggedItem.item;
          return next;
        });
        setCraftingSlots((prev) => {
          const next = [...prev];
          next[draggedItem.index] = null;
          return next;
        });
      }
    }

    setDraggedItem(null);
  };

  // -------------------------------------------------------------------------
  // KLIK CEPAT (TAP-TO-MOVE) ALA MINECRAFT
  // -------------------------------------------------------------------------

  // Klik item di storage: otomatis pindah ke slot crafting kosong pertama
  const handleStorageItemClick = (index: number) => {
    const item = storageSlots[index];
    if (!item) return;

    const firstEmptyCraft = craftingSlots.findIndex((s) => s === null);
    if (firstEmptyCraft !== -1) {
      setCraftingSlots((prev) => {
        const next = [...prev];
        next[firstEmptyCraft] = item;
        return next;
      });
      setStorageSlots((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    }
  };

  // Klik item di crafting: otomatis kembali ke slot storage kosong pertama
  const handleCraftingItemClick = (index: number) => {
    const item = craftingSlots[index];
    if (!item) return;

    const firstEmptyStorage = storageSlots.findIndex((s) => s === null);
    if (firstEmptyStorage !== -1) {
      setStorageSlots((prev) => {
        const next = [...prev];
        next[firstEmptyStorage] = item;
        return next;
      });
      setCraftingSlots((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    }
  };

  // -------------------------------------------------------------------------
  // KLAIM HASIL RAKITAN (AMBIL ARAH1 DARI RESULT SLOT)
  // -------------------------------------------------------------------------
  const handleClaimCraftResult = () => {
    if (!craftedResult) return;

    // Cari slot storage kosong untuk menampung hasil
    const emptyStorageIndex = storageSlots.findIndex((s) => s === null);

    if (emptyStorageIndex === -1) {
      alert("Kothak panyimpenanmu kebak! Balekake utawa resiki kothak dhisik.");
      return;
    }

    // 1. Kurangi bahan (1x tiang_tinggi & 1x tali) dari crafting slots
    setCraftingSlots((prev) => {
      const next = [...prev];
      let removedTiang = false;
      let removedTali = false;

      for (let i = 0; i < next.length; i++) {
        if (!removedTiang && next[i]?.id === "tiang_tinggi") {
          next[i] = null;
          removedTiang = true;
        } else if (!removedTali && next[i]?.id === "tali") {
          next[i] = null;
          removedTali = true;
        }
      }
      return next;
    });

    // 2. Simpan arah1 ke storage
    setStorageSlots((prev) => {
      const next = [...prev];
      next[emptyStorageIndex] = craftedResult;
      return next;
    });

    // 3. Simpan juga ke Inventory global jika memungkinkan
    try {
      const savedItems = getSavedInventoryItems();
      const craftedId = targetSpotId === 2 ? "arah2" : "arah1";
      if (!savedItems.includes(craftedId)) {
        saveInventoryItems([...savedItems, craftedId]);
      }
      sessionStorage.setItem("aksara_lawu_crafted_" + craftedId, "true");
      sessionStorage.setItem("aksara_lawu_just_crafted", "true");
    } catch {
      // ignore
    }

    setHasCraftedOnce(true);

    // 4. Efek Konfeti Perayaan Kemenangan
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f7d070", "#4ade80", "#fbbf24", "#ffffff"],
    });

    // 5. Tampilkan Modal Sukses
    setShowSuccessModal(true);
  };

  // Nglanjutake Petualangan menyang OpenWorld 2
  const handleProceedAdventure = () => {
    try {
      const craftedId = targetSpotId === 2 ? "arah2" : "arah1";
      sessionStorage.setItem("aksara_lawu_just_crafted", "true");
      sessionStorage.setItem("aksara_lawu_crafted_" + craftedId, "true");
    } catch {
      // ignore
    }

    // Pastikan modal sukses tertutup dan meja rakitan direset sebelum navigasi
    setShowSuccessModal(false);
    setCraftingSlots([null, null, null]);
    setStorageSlots([ITEM_TIANG, ITEM_TALI, null, null, null]);
    setHasCraftedOnce(false);

    router.push("/openworld2");
  };

  // -------------------------------------------------------------------------
  // RESET & BALEKAKE BAHAN
  // -------------------------------------------------------------------------
  const handleReturnAllIngredients = () => {
    const itemsInCraft = craftingSlots.filter((item): item is CraftingItem => item !== null);
    if (itemsInCraft.length === 0) return;

    setStorageSlots((prev) => {
      const next = [...prev];
      itemsInCraft.forEach((item) => {
        const emptyIdx = next.findIndex((s) => s === null);
        if (emptyIdx !== -1) {
          next[emptyIdx] = item;
        }
      });
      return next;
    });

    setCraftingSlots([null, null, null]);
  };

  // -------------------------------------------------------------------------
  // TOUCH DRAG & DROP HANDLER (UNTUK MOBILE / TABLET TOUCHSCREEN)
  // -------------------------------------------------------------------------
  const handleTouchStart = (source: "storage" | "crafting", index: number, item: CraftingItem, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dragData: DragSource = { source, index, item };
    setTouchItem(dragData);
    setTouchGhostPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchItem) return;
    const touch = e.touches[0];
    setTouchGhostPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchItem || !touchGhostPos) {
      setTouchItem(null);
      setTouchGhostPos(null);
      return;
    }

    const changedTouch = e.changedTouches[0];
    const dropTargetEl = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

    if (dropTargetEl) {
      // Cek apakah di-drop di atas slot crafting spesifik
      const craftSlotEl = dropTargetEl.closest("[data-craft-slot]");
      if (craftSlotEl) {
        const slotIdx = parseInt(craftSlotEl.getAttribute("data-craft-slot") || "0", 10);
        executeTouchDropOnCraftSlot(touchItem, slotIdx);
        setTouchItem(null);
        setTouchGhostPos(null);
        return;
      }

      // Cek apakah di-drop di frame crafting (kanan)
      const craftFrameEl = dropTargetEl.closest("#crf-frame-crafting");
      if (craftFrameEl) {
        executeTouchDropOnCraftFrame(touchItem);
        setTouchItem(null);
        setTouchGhostPos(null);
        return;
      }

      // Cek apakah di-drop di atas slot storage
      const storageSlotEl = dropTargetEl.closest("[data-storage-slot]");
      if (storageSlotEl) {
        const slotIdx = parseInt(storageSlotEl.getAttribute("data-storage-slot") || "0", 10);
        executeTouchDropOnStorageSlot(touchItem, slotIdx);
        setTouchItem(null);
        setTouchGhostPos(null);
        return;
      }

      // Cek apakah di-drop di frame storage (kiri)
      const storageFrameEl = dropTargetEl.closest("#crf-frame-storage");
      if (storageFrameEl) {
        executeTouchDropOnStorageFrame(touchItem);
        setTouchItem(null);
        setTouchGhostPos(null);
        return;
      }
    }

    setTouchItem(null);
    setTouchGhostPos(null);
  };

  const executeTouchDropOnCraftSlot = (drag: DragSource, targetIndex: number) => {
    if (drag.source === "storage") {
      const prev = craftingSlots[targetIndex];
      setCraftingSlots((c) => {
        const next = [...c];
        next[targetIndex] = drag.item;
        return next;
      });
      setStorageSlots((s) => {
        const next = [...s];
        next[drag.index] = prev;
        return next;
      });
    }
  };

  const executeTouchDropOnCraftFrame = (drag: DragSource) => {
    if (drag.source === "storage") {
      const emptyIdx = craftingSlots.findIndex((s) => s === null);
      if (emptyIdx !== -1) {
        setCraftingSlots((c) => {
          const next = [...c];
          next[emptyIdx] = drag.item;
          return next;
        });
        setStorageSlots((s) => {
          const next = [...s];
          next[drag.index] = null;
          return next;
        });
      }
    }
  };

  const executeTouchDropOnStorageSlot = (drag: DragSource, targetIndex: number) => {
    if (drag.source === "crafting") {
      const prev = storageSlots[targetIndex];
      setStorageSlots((s) => {
        const next = [...s];
        next[targetIndex] = drag.item;
        return next;
      });
      setCraftingSlots((c) => {
        const next = [...c];
        next[drag.index] = prev;
        return next;
      });
    }
  };

  const executeTouchDropOnStorageFrame = (drag: DragSource) => {
    if (drag.source === "crafting") {
      const emptyIdx = storageSlots.findIndex((s) => s === null);
      if (emptyIdx !== -1) {
        setStorageSlots((s) => {
          const next = [...s];
          next[emptyIdx] = drag.item;
          return next;
        });
        setCraftingSlots((c) => {
          const next = [...c];
          next[drag.index] = null;
          return next;
        });
      }
    }
  };

  // Bersihkan ghost jika unmount
  useEffect(() => {
    const cancelTouch = () => {
      setTouchItem(null);
      setTouchGhostPos(null);
    };
    window.addEventListener("touchend", cancelTouch);
    return () => window.removeEventListener("touchend", cancelTouch);
  }, []);

  return (
    <div
      className="crf-board-container"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Papan Crafting Aksara Lawu"
    >
      {/* Panggung Utama Split: Storage di Kiri, Crafting di Kanan */}
      <main className="crf-stage-split" aria-label="Area Papan Rakit dan Panyimpenan">
        {/* ===================================================================
            SISI KIRI: STORAGE CRAFT (storage_craft.webp)
            =================================================================== */}
        <section
          id="crf-frame-storage"
          ref={storageFrameRef}
          className="crf-left-panel"
          aria-label="Kothak Panyimpenan Bahan"
        >
          <div
            className={`crf-storage-frame ${isDragOverStorage ? "crf-storage-frame-dragover" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverStorage(true);
            }}
            onDragLeave={() => setIsDragOverStorage(false)}
            onDrop={handleDropOnStorageFrame}
          >
            {/* Asset Asli storage_craft.webp */}
            <img
              src="/openworld2/crafting/storage_craft.webp"
              alt="Papan Panyimpenan"
              className="crf-storage-bg-img"
              draggable={false}
            />

            {/* Judul Panyimpenan di Atas Banner Kayu */}
            <div className="crf-storage-title-overlay" aria-hidden="true">
              <span className="crf-storage-title-text">PANYIMPENAN</span>
            </div>

            {/* 5 Slot Horizontal Storage */}
            {storageSlots.map((slotItem, idx) => {
              // Persentase posisi horizontal tiap slot
              const slotLeftPercentages = [11.5, 27.31, 42.92, 58.73, 74.64];
              const leftPercent = slotLeftPercentages[idx] || 11.5;

              return (
                <div
                  key={`storage-slot-${idx}`}
                  data-storage-slot={idx}
                  className={`crf-storage-slot ${
                    hoveredStorageSlot === idx ? "crf-storage-slot-dragover" : ""
                  }`}
                  style={{ left: `${leftPercent}%` }}
                  onClick={() => handleStorageItemClick(idx)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setHoveredStorageSlot(idx);
                  }}
                  onDragLeave={() => setHoveredStorageSlot(null)}
                  onDrop={(e) => handleDropOnStorageSlot(e, idx)}
                  aria-label={
                    slotItem
                      ? `Slot ${idx + 1}: ${slotItem.name}`
                      : `Slot ${idx + 1}: Kothak Kosong`
                  }
                  title={
                    slotItem
                      ? `${slotItem.name} (Tarik utawa klik kanggo ngrakit)`
                      : "Kothak Kosong"
                  }
                >
                  {slotItem ? (
                    <>
                      <img
                        src={slotItem.image}
                        alt={slotItem.name}
                        className={`crf-slot-item-img ${
                          slotItem.isTall ? "crf-slot-item-tall" : ""
                        }`}
                        draggable={true}
                        onDragStart={(e) => handleDragStartStorage(e, idx, slotItem)}
                        onTouchStart={(e) => handleTouchStart("storage", idx, slotItem, e)}
                      />
                      <span className="crf-item-label-badge">{slotItem.name}</span>
                    </>
                  ) : (
                    /* Sesuai prompt: isi dengan silang terhadap kotak yang kosong dengan x png */
                    <img
                      src="/assets/inventory/X.png"
                      alt="Kosong"
                      className="crf-slot-empty-x"
                      draggable={false}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tombol Kontrol Cepat di Bawah Storage */}
          <div className="crf-left-controls">
            <button
              type="button"
              className="crf-btn-action"
              onClick={handleReturnAllIngredients}
              title="Balekake kabeh bahan saka papan rakit menyang panyimpenan"
            >
              <RotateCcw className="crf-btn-icon" aria-hidden="true" />
              <span>Balekake Bahan</span>
            </button>

            <button
              type="button"
              className="crf-btn-action"
              onClick={() => setShowRecipeModal(true)}
              title="Deleng buku resep rakitan"
            >
              <HelpCircle className="crf-btn-icon" aria-hidden="true" />
              <span>Buku Resep</span>
            </button>
          </div>
        </section>

        {/* ===================================================================
            SISI KANAN: CRAFTING PANEL (crafting.webp)
            =================================================================== */}
        <section
          id="crf-frame-crafting"
          ref={craftingFrameRef}
          className="crf-right-panel"
          aria-label="Papan Rakit Barang"
        >
          <div
            className={`crf-crafting-frame ${
              isDragOverCrafting ? "crf-crafting-frame-dragover" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverCrafting(true);
            }}
            onDragLeave={() => setIsDragOverCrafting(false)}
            onDrop={handleDropOnCraftingFrame}
          >
            {/* Asset Asli crafting.webp */}
            <img
              src="/openworld2/crafting/crafting.webp"
              alt="Papan Rakitan"
              className="crf-crafting-bg-img"
              draggable={false}
            />

            {/* 3 Input Slot Crafting */}
            {craftingSlots.map((slotItem, idx) => {
              const inputSlotLeftPercentages = [12.72, 27.91, 43.09];
              const leftPercent = inputSlotLeftPercentages[idx] || 12.72;

              return (
                <div
                  key={`craft-slot-${idx}`}
                  data-craft-slot={idx}
                  className={`crf-craft-input-slot ${
                    hoveredCraftSlot === idx ? "crf-craft-input-slot-dragover" : ""
                  }`}
                  style={{ left: `${leftPercent}%` }}
                  onClick={() => handleCraftingItemClick(idx)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setHoveredCraftSlot(idx);
                  }}
                  onDragLeave={() => setHoveredCraftSlot(null)}
                  onDrop={(e) => handleDropOnCraftSlot(e, idx)}
                  aria-label={
                    slotItem
                      ? `Slot Rakit ${idx + 1}: ${slotItem.name}`
                      : `Slot Rakit ${idx + 1}: Kothak Kosong`
                  }
                  title={
                    slotItem
                      ? `${slotItem.name} (Klik kanggo mbalekake menyang panyimpenan)`
                      : "Kothak Kosong (Delehake bahan ing kene)"
                  }
                >
                  {slotItem ? (
                    <>
                      <img
                        src={slotItem.image}
                        alt={slotItem.name}
                        className={`crf-slot-item-img ${
                          slotItem.isTall ? "crf-slot-item-tall" : ""
                        }`}
                        draggable={true}
                        onDragStart={(e) => handleDragStartCrafting(e, idx, slotItem)}
                        onTouchStart={(e) => handleTouchStart("crafting", idx, slotItem, e)}
                      />
                      <span className="crf-item-label-badge">{slotItem.name}</span>
                    </>
                  ) : (
                    /* Sesuai prompt: isi dengan silang terhadap kotak yang kosong dengan x png */
                    <img
                      src="/assets/inventory/X.png"
                      alt="Kosong"
                      className="crf-slot-empty-x"
                      draggable={false}
                    />
                  )}
                </div>
              );
            })}

            {/* 1 Output / Result Slot di Kanan */}
            <div
              className={`crf-craft-result-slot ${
                craftedResult ? "crf-craft-result-slot-ready" : ""
              }`}
              onClick={handleClaimCraftResult}
              title={
                craftedResult
                  ? "Kasil dirakit! Pencet kanggo njupuk Papan Pituduh Arah"
                  : "Kothak Asil Kosong (Lengkapi resep ing kothak sisih kiwa)"
              }
              aria-label={
                craftedResult
                  ? `Hasil Rakitan: ${craftedResult.name}. Pencet kanggo njupuk!`
                  : "Kothak Asil Kosong"
              }
            >
              {craftedResult ? (
                <>
                  <img
                    src={craftedResult.image}
                    alt={craftedResult.name}
                    className="crf-slot-item-img crf-slot-result-img"
                    draggable={false}
                  />
                  <span className="crf-item-label-badge">{craftedResult.name}</span>
                </>
              ) : (
                /* Sesuai prompt: isi dengan silang terhadap kotak yang kosong dengan x png */
                <img
                  src="/assets/inventory/X.png"
                  alt="Kosong"
                  className="crf-slot-empty-x"
                  draggable={false}
                />
              )}
            </div>

            {/* Area Perkamen Bawah di Dalam crafting.webp */}
            <div className="crf-parchment-content" aria-live="polite">
              {craftedResult ? (
                <>
                  <h3 className="crf-parchment-heading crf-parchment-heading-success">
                    ★ RESEP KASIL JANGKEP! ★
                  </h3>
                  <p className="crf-parchment-desc crf-parchment-desc-ready">
                    Papan Pituduh Arah wis siyap! Pencet kothak asil ing dhuwur kanggo nyimpen menyang panyimpenanmu.
                  </p>
                </>
              ) : (hasKayu || hasTali) ? (
                <>
                  <h3 className="crf-parchment-heading">
                    BAHAN DURUNG JANGKEP
                  </h3>
                  <p className="crf-parchment-desc">
                    {hasKayu && !hasTali && "Kurang 1x Tali Tambang kanggo ngrakit papan arah."}
                    {!hasKayu && hasTali && "Kurang 1x Kayu (Tiang) kanggo ngrakit papan arah."}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="crf-parchment-heading">PAPAN RAKIT LAWU</h3>
                  <p className="crf-parchment-desc">
                    Tarik bahan saka panyimpenan ing sisih kiwa, banjur delehake ing kothak rakitan kanggo nggawe barang anyar.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 3. Touch Drag Ghost Preview (Mengikuti Jari di Layar Sentuh) */}
      {touchGhostPos && touchItem && (
        <div
          ref={touchGhostRef}
          className="crf-drag-ghost"
          style={{
            left: `${touchGhostPos.x}px`,
            top: `${touchGhostPos.y}px`,
          }}
        >
          <img
            src={touchItem.item.image}
            alt={touchItem.item.name}
            className="crf-drag-ghost-img"
          />
        </div>
      )}

      {/* 4. Modal Sukses Merakit (Celebration Modal) */}
      {showSuccessModal && (
        <div className="crf-modal-backdrop" role="dialog" aria-modal="true">
          <div className="crf-modal-box">
            <h2 className="crf-modal-title">MANGAYUBAGYA, KASIL NGRAKIT!</h2>

            <div className="crf-modal-img-wrap">
              <img
                src={targetSpotId === 2 ? "/openworld2/arah2.webp" : "/openworld2/arah1.webp"}
                alt={`Papan Pituduh Arah ${targetSpotId}`}
                className="crf-modal-img"
              />
            </div>

            <p className="crf-modal-desc">
              Kowe kasil ngrakit <strong>Papan Pituduh Arah {targetSpotId}</strong>! Barang iki wis disimpen kanthi aman ing panyimpenanmu kanggo nulungi para pendaki ing Gunung Lawu.
            </p>

            <div className="crf-modal-actions">
              <button
                type="button"
                className="crf-btn-modal crf-btn-modal-primary"
                onClick={handleProceedAdventure}
              >
                <Compass className="crf-btn-icon" aria-hidden="true" />
                <span>Nglanjutake Petualangan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Petunjuk Resep */}
      {showRecipeModal && (
        <div className="crf-modal-backdrop" role="dialog" aria-modal="true">
          <div className="crf-modal-box">
            <h2 className="crf-modal-title">BUKU RESEP RAKITAN</h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.2vw",
                margin: "2vh 0",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <img
                  src="/openworld2/tiang_tinggi.webp"
                  alt="Kayu"
                  style={{ width: "4vw", height: "8vh", objectFit: "contain" }}
                />
                <div style={{ fontSize: "0.85vw", color: "#5a2e0e", fontWeight: 700 }}>
                  1x Kayu
                </div>
              </div>

              <span style={{ fontSize: "1.8vw", color: "#78350f" }}>+</span>

              <div style={{ textAlign: "center" }}>
                <img
                  src="/openworld2/tali.webp"
                  alt="Tali"
                  style={{ width: "5vw", height: "8vh", objectFit: "contain" }}
                />
                <div style={{ fontSize: "0.85vw", color: "#5a2e0e", fontWeight: 700 }}>
                  1x Tali
                </div>
              </div>

              <ArrowRight style={{ width: "2vw", height: "2vw", color: "#b45309" }} />

              <div style={{ textAlign: "center" }}>
                <img
                  src="/openworld2/arah1.webp"
                  alt="Papan Arah"
                  style={{ width: "6vw", height: "8vh", objectFit: "contain" }}
                />
                <div style={{ fontSize: "0.85vw", color: "#166534", fontWeight: 700 }}>
                  Papan Arah
                </div>
              </div>
            </div>

            <p className="crf-modal-desc">
              Gabungake 1 Kayu (Tiang) lan 1 Tali ing kothak rakitan kanggo nggawe Papan Pituduh Arah.
            </p>

            <button
              type="button"
              className="crf-btn-modal crf-btn-modal-primary"
              onClick={() => setShowRecipeModal(false)}
            >
              <span>Tutup Buku Resep</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

