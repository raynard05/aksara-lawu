"use client";

import React from "react";
import FogWind from "../components/FogWind/FogWind";
import FallenLeaves from "../components/fallenleaves/FallenLeaves";
import CraftingGame from "../components/CraftingGame/CraftingGame";
import "./crafting.css";

export default function CraftingPage() {
  return (
    <main className="crf-page-root" aria-label="Halaman Crafting Aksara Lawu">
      {/* Efek kabut angin lembut khas Gunung Lawu */}
      <FogWind />

      {/* Efek dedaunan gugur melayang di perkemahan */}
      <FallenLeaves />

      {/* Vignette fokus meja kerja */}
      <div className="crf-page-vignette" aria-hidden="true" />

      {/* Komponen Utama Permainan Crafting (Storage di Kiri, Crafting di Kanan) */}
      <CraftingGame />
    </main>
  );
}

