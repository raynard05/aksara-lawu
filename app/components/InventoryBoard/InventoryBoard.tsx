"use client";

import React, { useState, useEffect } from "react";
import inventoryDataRaw from "@/inventory.json";
import {
  InventoryItemData,
  getSavedInventoryItems,
  saveInventoryItems,
  getUnlockedLevels,
  unlockLevel,
  getUsedItems,
  markItemUsed,
} from "../../lib/inventoryStorage";
import "./inventory-board.css";

const ALL_ITEMS = inventoryDataRaw as InventoryItemData[];
const TOTAL_SLOTS = 9;

interface CardCodeModalData {
  title: string;
  cardName: string;
  passcode: string;
  levelNumber?: number | null;
}

export default function InventoryBoard() {
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);
  const [usedItemIds, setUsedItemIds] = useState<string[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [cardCodeModal, setCardCodeModal] = useState<CardCodeModalData | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Muat item kepemilikan & item yang sudah digunakan dari session/local storage
  useEffect(() => {
    const syncItems = (items: string[]) => {
      setOwnedItemIds(items);
      if (items.length > 0) {
        setSelectedItemId((prev) => (prev && items.includes(prev) ? prev : items[0]));
      } else {
        setSelectedItemId(null);
      }
    };

    syncItems(getSavedInventoryItems());
    setUsedItemIds(getUsedItems());

    const handleInvChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ items: string[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.items)) {
        syncItems(customEvent.detail.items);
      }
    };

    const handleUsedChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ usedItems: string[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.usedItems)) {
        setUsedItemIds(customEvent.detail.usedItems);
      }
    };

    window.addEventListener("aksara-lawu-inventory-change", handleInvChange);
    window.addEventListener("aksara-lawu-used-items-change", handleUsedChange);
    return () => {
      window.removeEventListener("aksara-lawu-inventory-change", handleInvChange);
      window.removeEventListener("aksara-lawu-used-items-change", handleUsedChange);
    };
  }, []);

  // Item yang sedang aktif dipilih
  const selectedItem = ALL_ITEMS.find((item) => item.id === selectedItemId) || null;
  const isSelectedUsed = Boolean(selectedItem && usedItemIds.includes(selectedItem.id));

  // Daftar item objek yang dimiliki pengguna
  const ownedItems: InventoryItemData[] = ownedItemIds
    .map((id) => ALL_ITEMS.find((it) => it.id === id))
    .filter((it): it is InventoryItemData => Boolean(it));

  // Handler klik slot item
  const handleSlotClick = (item: InventoryItemData) => {
    setSelectedItemId(item.id);
  };

  // Handler klik tombol Gunakake
  const handleGunakake = () => {
    if (!selectedItem || isSelectedUsed) return;

    if (selectedItem.type === "card" && selectedItem.passcode) {
      // Buka kunci level berikutnya di peta
      if (selectedItem.unlockLevelNumber) {
        unlockLevel(selectedItem.unlockLevelNumber);
      }
      // Simpan session item sudah dipakai
      markItemUsed(selectedItem.id);

      // Tampilkan popup papan_kode.webp beserta angka kodenya
      setCardCodeModal({
        title: "KODE AKSÈS KABUKA!",
        cardName: selectedItem.name,
        passcode: selectedItem.passcode,
        levelNumber: selectedItem.unlockLevelNumber,
      });
    } else if (selectedItem.id === "money") {
      setFeedbackMessage(
        "Dhuwit Lawu 50 wis disiyapake kanggo blanja ing Warung Ngaso (Pos 3)."
      );
    } else {
      markItemUsed(selectedItem.id);
      setFeedbackMessage(`${selectedItem.name} kasil digunakake.`);
    }
  };

  const handleCloseCardCodeModal = () => {
    setCardCodeModal(null);
  };

  const handleCloseFeedback = () => {
    setFeedbackMessage(null);
  };

  // Buat array 9 slot: slot terisi item atau null jika kosong
  const slots: (InventoryItemData | null)[] = Array.from({ length: TOTAL_SLOTS }).map(
    (_, index) => ownedItems[index] || null
  );

  return (
    <div className="invb-container" aria-label="Inventaris Aksara Lawu">
      {/* SISI KIRI: PANEL INVENTORY.PNG DENGAN 9 SLOT */}
      <section className="invb-left-panel" aria-label="Papan Penyimpenan">
        <img
          src="/assets/inventory/inventory.png"
          alt="Papan Penyimpenan"
          className="invb-board-img"
          draggable={false}
        />

        {/* Grid 3x3 slot item */}
        <div className="invb-grid-slots" role="grid" aria-label="Kothak Item">
          {slots.map((item, idx) => {
            const isSelected = item && selectedItemId === item.id;
            return (
              <button
                key={`slot-${idx}`}
                type="button"
                className={`invb-slot-btn ${
                  item ? "invb-slot-filled" : "invb-slot-empty"
                } ${isSelected ? "invb-slot-selected" : ""}`}
                onClick={() => item && handleSlotClick(item)}
                disabled={!item}
                aria-label={item ? item.name : `Kothak Kosong ${idx + 1}`}
                title={item ? item.name : "Kosong"}
              >
                {item ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="invb-item-thumb"
                    draggable={false}
                  />
                ) : (
                  <img
                    src="/assets/inventory/X.png"
                    alt="Kosong"
                    className="invb-slot-empty-icon"
                    draggable={false}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* SISI KANAN: PANEL DESC.PNG DENGAN DESKRIPSI & TOMBOL GUNAKAKE DI BAWAHNYA */}
      <section className="invb-right-panel" aria-label="Panel Katrangan Item">
        {/* Frame desc.png */}
        <div className="invb-desc-wrapper">
          <img
            src="/assets/inventory/desc.png"
            alt="Papan Katrangan"
            className="invb-desc-bg-img"
            draggable={false}
          />

          {/* Konten di atas desc.png */}
          <div className="invb-desc-content">
            {/* Sisi Kiri Frame Desc: Preview Visual Item */}
            <div className="invb-desc-preview-area">
              {selectedItem ? (
                <div className="invb-preview-card-wrap">
                  <img
                    key={selectedItem.id}
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="invb-preview-card-img"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="invb-preview-placeholder">
                  <img
                    src="/assets/inventory/X.png"
                    alt="Ora ana item"
                    className="invb-placeholder-icon"
                    draggable={false}
                  />
                  <p className="invb-placeholder-text">Pilihen item ing penyimpenan</p>
                </div>
              )}
            </div>

            {/* Sisi Kanan Frame Desc: Katrangan Deskripsi & Tombol Gunakake di bawahnya */}
            <div className="invb-desc-text-area">
              {selectedItem ? (
                <div className="invb-desc-text-inner">
                  <p className="invb-item-desc">{selectedItem.description}</p>
                  
                  {/* Tombol Gunakake ditaruh di bawah deskripsi */}
                  <div className="invb-desc-btn-wrap">
                    <button
                      type="button"
                      id="btn-inv-gunakake"
                      className={`invb-btn-gunakake ${
                        isSelectedUsed ? "invb-btn-gunakake-disabled" : ""
                      }`}
                      onClick={handleGunakake}
                      disabled={isSelectedUsed}
                      aria-disabled={isSelectedUsed}
                      aria-label={
                        isSelectedUsed
                          ? `${selectedItem.name} wis tau digunakake`
                          : "Gunakake Item"
                      }
                      title={
                        isSelectedUsed
                          ? "Item iki wis kasil digunakake lan gemboke wis kabuka!"
                          : "Pencet kanggo nggunakake item iki"
                      }
                    >
                      <span className="invb-btn-gunakake-text">
                        {isSelectedUsed ? "Wis Digunakake" : "Gunakake"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="invb-desc-text-inner">
                  <p className="invb-item-desc invb-item-desc-placeholder">
                    Pilihen salah siji item ing penyimpenan sisih kiwa kanggo mirsani
                    katranganipun.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* POP UP PAPAN KODE DENGAN PAPAN_KODE.WEBP KETIKA KARTU DIGUNAKAKE */}
      {cardCodeModal && (
        <div
          className="invb-code-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Pop up Kode Akses Kartu"
        >
          <div className="invb-code-container">
            {/* Papan Kode Kayu */}
            <div className="invb-code-board-wrapper">
              <img
                src="/assets/inventory/papan_kode.webp"
                alt="Papan Kode Akses"
                className="invb-code-board-img"
                draggable={false}
              />

              {/* 3 Kotak Angka Sesuai Digit Kode Kartu */}
              <div className="invb-code-digits-grid">
                {cardCodeModal.passcode.split("").map((digit, idx) => (
                  <div
                    key={`digit-${idx}`}
                    className="invb-code-digit-box"
                    aria-label={`Digit ${idx + 1}: ${digit}`}
                  >
                    <span className="invb-code-digit-char">{digit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keterangan & Tombol Tutup Pop up */}
            <div className="invb-code-info-box">
              <p className="invb-code-desc">
                {cardCodeModal.levelNumber
                  ? `Gembok Lèvel ${cardCodeModal.levelNumber} ing Peta wis kasil kabuka!`
                  : "Kode iki kasil digunakake kanggo mbukak akses!"}
              </p>
              <button
                type="button"
                id="btn-close-code-modal"
                className="invb-code-btn-close"
                onClick={handleCloseCardCodeModal}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup Feedback setelah klik Gunakake (untuk item non-kartu seperti money) */}
      {feedbackMessage && (
        <div className="invb-feedback-overlay" role="dialog" aria-modal="true">
          <div className="invb-feedback-modal">
            <h3 className="invb-feedback-title">Kabar Petualangan</h3>
            <p className="invb-feedback-text">{feedbackMessage}</p>
            <button
              type="button"
              className="invb-feedback-btn"
              onClick={handleCloseFeedback}
            >
              Nggih
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
