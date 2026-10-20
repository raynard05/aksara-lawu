"use client";

import React, { useState, useEffect } from "react";
import inventoryDataRaw from "@/inventory.json";
import {
  InventoryItemData,
  getSavedInventoryItems,
  saveInventoryItems,
  getUnlockedLevels,
  unlockLevel,
} from "../../lib/inventoryStorage";
import "./inventory-board.css";

const ALL_ITEMS = inventoryDataRaw as InventoryItemData[];
const TOTAL_SLOTS = 9;

export default function InventoryBoard() {
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Muat item kepemilikan dari session/local storage
  useEffect(() => {
    const items = getSavedInventoryItems();
    setOwnedItemIds(items);
    if (items.length > 0) {
      setSelectedItemId(items[0]);
    }
  }, []);

  // Item yang sedang aktif dipilih
  const selectedItem = ALL_ITEMS.find((item) => item.id === selectedItemId) || null;

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
    if (!selectedItem) return;

    if (selectedItem.type === "card" && selectedItem.unlockLevelNumber) {
      // Membuka gembok level berikutnya di maps
      unlockLevel(selectedItem.unlockLevelNumber);
      setFeedbackMessage(
        `Sukses! ${selectedItem.name} wis digunakake. Gembok Level ${selectedItem.unlockLevelNumber} ing Peta wis kabuka!`
      );
    } else if (selectedItem.id === "money") {
      setFeedbackMessage(
        "Dhuwit Lawu 50 wis disiyapake kanggo blanja ing Warung Ngaso (Pos 3)."
      );
    } else {
      setFeedbackMessage(`${selectedItem.name} kasil digunakake.`);
    }
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
                      className="invb-btn-gunakake"
                      onClick={handleGunakake}
                      aria-label="Gunakake Item"
                    >
                      <span className="invb-btn-gunakake-text">Gunakake</span>
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

      {/* Modal Popup Feedback setelah klik Gunakake */}
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
