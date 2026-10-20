"use client";

import React from "react";
import FogWind from "../components/FogWind/FogWind";
import InventoryBoard from "../components/InventoryBoard/InventoryBoard";
import "./inventory.css";

export default function InventoryPage() {
  return (
    <main className="invp-root" aria-label="Halaman Inventaris Aksara Lawu">
      {/* Efek kabut angin seperti pada /maps */}
      <FogWind />

      {/* Komponen Gabungan Inventory & Katrangan (UI & Logic) */}
      <InventoryBoard />

      {/* Logo Aksara Lawu di Pojok Kanan Bawah seperti di /maps */}
      <aside className="invp-logo-wrapper" aria-label="Logo Aksara Lawu">
        <img
          src="/main_assets/aksaralawu.png"
          alt="Aksara Lawu"
          className="invp-logo-img"
          draggable={false}
        />
      </aside>
    </main>
  );
}
