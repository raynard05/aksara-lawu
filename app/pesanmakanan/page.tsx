"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import {
  FOOD_ITEMS,
  WARUNG_ORDERS,
  FoodItemInfo,
  WarungOrder,
} from "./ordersData";
import "./pesanmakanan.css";

// Helper Web Audio API untuk efek suara interaktif tanpa ketergantungan file eksternal
function playWebAudioTone(type: "success" | "error" | "victory") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "success") {
      // Dua nada melodi ceria: C5 (523Hz) -> E5 (659Hz)
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "error") {
      // Nada rendah peringatan: 170Hz -> 120Hz
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.28);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "victory") {
      // Arpeggio kemenangan: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.12;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    }
  } catch {
    // Ignore audio errors jika diblokir browser autoplay policy
  }
}

// Data dialog karakter Penjaga Warung (Bahasa Jawa Ngoko)
const SUCCESS_DIALOG_LIST: DialogItem[] = [
  {
    id: 1,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Sugeng ngrahapi panganane! Sadurunge kowe nerusake lakumu, aku ana barang mligi kanggo kowe.",
  },
];

export default function PesanMakananPage() {
  const router = useRouter();

  // Pesanan aktif yang dipilih secara acak dari 50 daftar pesanan
  const [currentOrder, setCurrentOrder] = useState<WarungOrder>(WARUNG_ORDERS[0]);

  // Daftar ID makanan yang sudah berhasil diletakkan pemain di nampan
  const [placedFoods, setPlacedFoods] = useState<string[]>([]);

  // State makanan yang sedang dipilih (Click-to-place untuk perangkat sentuh / keyboard)
  const [selectedFood, setSelectedFood] = useState<FoodItemInfo | null>(null);

  // State makanan yang sedang di-hover / di-hold (menampilkan nama Aksara Jawa)
  const [hoveredFood, setHoveredFood] = useState<FoodItemInfo | null>(null);

  // State feedback getar nampan & flash merah sisi layar
  const [isNampanShaking, setIsNampanShaking] = useState<boolean>(false);
  const [isRedFlashing, setIsRedFlashing] = useState<boolean>(false);
  const [isDragOverTray, setIsDragOverTray] = useState<boolean>(false);

  // Notifikasi Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  // Modal Kertas Pesanan (pesananpendaki.webp)
  // Default terbuka diawal agar pemain langsung membaca pesanan dalam Aksara Jawa
  const [showOrderModal, setShowOrderModal] = useState<boolean>(true);

  // Dialog ucapan sukses dari Penjaga Warung sebelum menuju ke selebrasi
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState<boolean>(false);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inisialisasi: Pilih 1 pesanan acak dari 50 pesanan saat halaman dimuat
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WARUNG_ORDERS.length);
    const chosen = WARUNG_ORDERS[randomIndex];
    setCurrentOrder(chosen);
    setPlacedFoods([]);
    setShowOrderModal(true);
  }, []);

  // Tampilkan notifikasi toast sementara
  const showToast = (text: string, type: "error" | "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage({ text, type });
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Logika memproses peletakan makanan ke nampan
  const processFoodDrop = (foodId: string) => {
    if (!currentOrder) return;

    // Cek apakah makanan ini sudah pernah diletakkan di nampan
    if (placedFoods.includes(foodId)) {
      showToast("Panganan iki wis ana ing nampan!", "error");
      playWebAudioTone("error");
      return;
    }

    // Cek apakah makanan ini sesuai dengan target pesanan
    const isTargetFood = currentOrder.targetFoodIds.includes(foodId);

    if (isTargetFood) {
      // Benar! Tambahkan makanan ke nampan
      playWebAudioTone("success");
      const nextPlaced = [...placedFoods, foodId];
      setPlacedFoods(nextPlaced);
      setSelectedFood(null);
      showToast("Panganan trep! Kasil diselehake ing nampan.", "success");

      // Cek apakah seluruh makanan target pesanan sudah lengkap
      if (nextPlaced.length === currentOrder.targetFoodIds.length) {
        // Semua pesanan sukses dirampungkan!
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
          toastTimerRef.current = null;
        }
        setToastMessage(null);

        // Berikan jeda sejenak, lalu munculkan dialog Penjaga Warung untuk menuju selebrasi
        setTimeout(() => {
          playWebAudioTone("victory");
          setIsSuccessDialogOpen(true);
        }, 700);
      }
    } else {
      // Salah! Nampan bergetar dan sisi-sisi layar memerah sementara
      playWebAudioTone("error");
      setIsNampanShaking(true);
      setIsRedFlashing(true);
      showToast("Panganan iki ora cocog karo pesenan!", "error");

      setTimeout(() => {
        setIsNampanShaking(false);
        setIsRedFlashing(false);
      }, 600);
    }
  };

  // Drag and drop handlers untuk browser desktop
  const handleDragStart = (e: React.DragEvent, food: FoodItemInfo) => {
    e.dataTransfer.setData("text/plain", food.id);
    setSelectedFood(food);
  };

  const handleTrayDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverTray(true);
  };

  const handleTrayDragLeave = () => {
    setIsDragOverTray(false);
  };

  const handleTrayDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverTray(false);
    const foodId = e.dataTransfer.getData("text/plain") || selectedFood?.id;
    if (foodId) {
      processFoodDrop(foodId);
    }
  };

  // Click-to-place handler untuk nampan
  const handleTrayClick = () => {
    if (selectedFood) {
      processFoodDrop(selectedFood.id);
    } else {
      showToast("Pilih panganan ing menu luwih dhisik!", "error");
    }
  };

  // Setelah dialog sukses selesai, arahkan ke halaman selebrasi level 3
  const handleCompleteSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    router.push("/level3celebretion");
  };

  return (
    <main
      className="pm-root"
      aria-label="Halaman Pesan Makanan - Pos 3: Warung Ngaso"
    >
      <div className="pm-viewport">
        {/* Efek ambient glow khas warung */}
        <div className="pm-ambient-glow" />

        {/* Efek flash merah pada sisi layar jika salah drop makanan */}
        {isRedFlashing && <div className="pm-screen-red-flash" aria-hidden="true" />}

        {/* Header Bar */}
        <header className="pm-header-bar">
          <div className="pm-header-left">
            <button
              type="button"
              className="pm-btn-back"
              onClick={() => router.push("/level3_game")}
              aria-label="Balik menyang Warung"
              title="Balik menyang Warung"
            >
              ← Balik menyang Warung
            </button>


          </div>

          {/* Indikator Status Berapa Makanan yang Berhasil */}
          <div className="pm-progress-badge" aria-label="Status Pesanan">
            <span className="pm-progress-label">
              Panganan Kasil: {placedFoods.length} / {currentOrder.targetFoodIds.length}
            </span>
            <div className="pm-progress-dots" aria-hidden="true">
              {currentOrder.targetFoodIds.map((_, idx) => (
                <span
                  key={`dot-${idx}`}
                  className={`pm-progress-dot ${idx < placedFoods.length ? "pm-progress-dot-active" : ""
                    }`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Notifikasi Toast Feedback */}
        {toastMessage && (
          <div
            className={`pm-toast-banner ${toastMessage.type === "error" ? "pm-toast-error" : "pm-toast-success"
              }`}
            role="status"
            aria-live="polite"
          >
            {toastMessage.text}
          </div>
        )}

        {/* =============================================
            MAIN WORKBENCH: MENU (KIRI) & NAMPAN (KANAN)
            ============================================= */}
        <section className="pm-workbench" aria-label="Meja Pemesanan Makanan">
          {/* Komponen Sisi Kiri: Frame Menu Kayu (menu.webp) */}
          <div className="pm-menu-wrapper" aria-label="Pilihan Menu Makanan">
            <img
              src="/warungngaso/menu.webp"
              alt="Menu Makanan Magetan"
              className="pm-menu-bg"
              draggable={false}
            />

            {/* 6 Slot Makanan Tradisional Magetan */}
            {FOOD_ITEMS.map((food, idx) => {
              const isPlaced = placedFoods.includes(food.id);
              const isSelected = selectedFood?.id === food.id;
              const isHovered = hoveredFood?.id === food.id;

              return (
                <div
                  key={food.id}
                  className={`pm-food-slot pm-food-slot-${idx} ${isPlaced ? "pm-food-slot-placed" : ""
                    } ${isSelected ? "pm-food-slot-selected" : ""}`}
                  draggable={!isPlaced}
                  onDragStart={(e) => handleDragStart(e, food)}
                  onClick={() => {
                    if (!isPlaced) {
                      setSelectedFood(isSelected ? null : food);
                    }
                  }}
                  onMouseEnter={() => setHoveredFood(food)}
                  onMouseLeave={() => setHoveredFood(null)}
                  onTouchStart={() => setHoveredFood(food)}
                  onTouchEnd={() => setHoveredFood(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Panganan: ${food.aksara}`}
                  title={isPlaced ? "Panganan iki wis ana ing nampan" : "Tarik utawa pencet kanggo milih"}
                >
                  {/* Tooltip Teks Aksara Jawa Murni saat makanan di-hold / di-hover */}
                  {(isHovered || isSelected) && (
                    <div className="pm-food-tooltip-aksara" aria-hidden="true">
                      {food.aksara}
                    </div>
                  )}

                  <img
                    src={food.image}
                    alt={food.aksara}
                    className="pm-food-img"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          {/* Komponen Sisi Kanan: Nampan Kayu (nampan.webp - Drop Area) */}
          <div
            className={`pm-nampan-wrapper ${isNampanShaking ? "pm-nampan-shaking" : ""
              } ${isDragOverTray ? "pm-nampan-dragover" : ""}`}
            onDragOver={handleTrayDragOver}
            onDragLeave={handleTrayDragLeave}
            onDrop={handleTrayDrop}
            onClick={handleTrayClick}
            role="region"
            aria-label="Nampan Panganan Magetan - Area Drop Makanan"
            title="Selehna panganan ing kene sesuai pesenan"
          >
            <img
              src="/warungngaso/nampan.webp"
              alt="Nampan Panganan"
              className="pm-nampan-bg"
              draggable={false}
            />

            {/* Label Petunjuk saat nampan masih kosong */}
            {placedFoods.length === 0 && (
              <div className="pm-nampan-hint" aria-hidden="true">
                Tarik panganan menyang nampan iki
              </div>
            )}

            {/* Render Makanan yang Sudah Berhasil Ditaruh di Atas Nampan */}
            {placedFoods.map((foodId, idx) => {
              const food = FOOD_ITEMS.find((f) => f.id === foodId);
              if (!food) return null;

              return (
                <div
                  key={`tray-${foodId}`}
                  className={`pm-tray-food-slot pm-tray-food-slot-${idx}`}
                  aria-label={`Makanan di nampan: ${food.aksara}`}
                >
                  <img
                    src={food.image}
                    alt={food.aksara}
                    className="pm-tray-food-img"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Tombol Kertas Pesanan di Pojok Bawah Kanan (pesanan.webp) */}
        <button
          type="button"
          className="pm-pesanan-btn-wrapper"
          onClick={() => setShowOrderModal(true)}
          aria-label="Maca Kertas Pesenan Pendaki"
          title="Klik kanggo maca kertas pesenan"
        >
          <img
            src="/warungngaso/pesanan.webp"
            alt="Kertas Pesenan"
            className="pm-pesanan-btn-img"
            draggable={false}
          />
        </button>

        {/* =============================================
            MODAL POP UP KERTAS PESENAN (PESANANPENDAKI.WEBP)
            ============================================= */}
        {showOrderModal && (
          <div
            className="pm-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Pop Up Kertas Pesenan Pendaki"
          >
            <div className="pm-order-modal-card">
              {/* Parchment Scroll Frame */}
              <div className="pm-parchment-wrapper">
                <img
                  src="/warungngaso/pesananpendaki.webp"
                  alt="Kertas Gulungan Pesenan"
                  className="pm-parchment-img"
                  draggable={false}
                />

                {/* Konten Teks Aksara Jawa di atas parchment */}
                <div className="pm-parchment-content">
                  {/* Teks Pesanan dalam Aksara Jawa */}
                  <div className="pm-order-text-aksara">
                    {currentOrder.aksara}
                  </div>
                </div>
              </div>

              {/* Tombol Kembali ke Menu (Bahasa Jawa Ngoko) */}
              <button
                type="button"
                className="pm-btn-close-order"
                onClick={() => setShowOrderModal(false)}
                aria-label="Mbalik menyang Menu"
              >
                Mbalik menyang Menu
              </button>
            </div>
          </div>
        )}

        {/* =============================================
            DIALOG SUKSES PENJAGA WARUNG MENUJU SELEBRASI
            ============================================= */}
        {isSuccessDialogOpen && (
          <DialogPopup
            key="pesanmakanan-success-dialog"
            isOpen={isSuccessDialogOpen}
            dialogs={SUCCESS_DIALOG_LIST}
            initialDelayMs={0}
            instantText={false}
            focusBackdrop={true}
            lastButtonText="Nerusake ➔"
            onComplete={handleCompleteSuccessDialog}
          />
        )}
      </div>
    </main>
  );
}
