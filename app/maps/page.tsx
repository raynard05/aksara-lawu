"use client";

import React from "react";
import "./maps.css";

export default function MapsPage() {
  return (
    <main className="maps-root" aria-label="Halaman Maps">
      {/* Panel Legenda Papan Kayu (legenda.webp) di sisi kiri */}
      <section className="maps-legend-wrapper" aria-label="Legenda Peta">
        <img
          src="/maps/legenda.webp"
          alt="Legenda Peta Aksara Lawu"
          className="maps-legend-img"
          draggable={false}
        />
      </section>

      {/* Gambar Konten Peta Papan Kayu / Map Board (maps.webp) */}
      <section className="maps-board-wrapper" aria-label="Peta Jelajah Aksara Lawu">
        <img
          src="/maps/maps.webp"
          alt="Peta Petualangan Lawu Quest"
          className="maps-board-img"
          draggable={false}
        />
      </section>

      {/* Logo Aksara Lawu di Pojok Kanan Bawah */}
      <aside className="maps-logo-wrapper" aria-label="Logo Aksara Lawu">
        <img
          src="/main_assets/aksaralawu.png"
          alt="Aksara Lawu"
          className="maps-logo-img"
          draggable={false}
        />
      </aside>
    </main>
  );
}
