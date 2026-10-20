"use client";

import React, { useState, useEffect } from "react";
import HomeButton from "../components/HomeButton/HomeButton";
import FogWind from "../components/FogWind/FogWind";
import "./maps.css";

export default function MapsPage() {
  const [avatar, setAvatar] = useState<string>("avatar1.webp");

  useEffect(() => {
    try {
      const storedAvatar =
        sessionStorage.getItem("aksara_lawu_selected_avatar") ||
        localStorage.getItem("aksara_lawu_selected_avatar");
      if (storedAvatar) {
        setAvatar(storedAvatar);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="maps-root" aria-label="Halaman Maps">
      {/* Efek angin kabut pelan dari kiri menuju kanan di atas background peta */}
      <FogWind />

      {/* Tombol Home Mandiri di Pojok Atas Kiri (tanpa TopBar UI) */}
      <HomeButton />

      {/* Header Atas: Banner Level 1 dan Tombol Njlajahi */}
      <section className="maps-top-header" aria-label="Navigasi Misi Level 1">
        {/* Banner Kayu Level 1 (level1.webp) */}
        <div className="maps-level-banner-wrapper">
          <img
            src="/maps/level1.webp"
            alt="Level 1 - Pos 1: Golek Pituduh"
            className="maps-level-banner-img"
            draggable={false}
          />
        </div>

        {/* Tombol Njlajahi (Jelajah Game) */}
        <button
          type="button"
          id="btn-maps-njlajahi"
          className="maps-btn-njlajahi"
          onClick={() => {
            console.log("Miwiti Njlajahi Level 1...");
          }}
          aria-label="Njlajahi Level 1"
        >
          <span className="maps-btn-njlajahi-text">Njlajahi</span>
        </button>
      </section>

      {/* Panel Legenda Papan Kayu (legenda.webp) di sisi kiri */}
      <section className="maps-legend-wrapper" aria-label="Legenda Peta">
        <img
          src="/maps/legenda.webp"
          alt="Legenda Peta Aksara Lawu"
          className="maps-legend-img"
          draggable={false}
        />

        {/* Avatar di dalam panel legenda (di sebelah kiri label AVATAR) */}
        <div className="maps-legend-avatar-slot" aria-label="Avatar Pemain di Legenda">
          <div className="maps-legend-avatar-circle">
            <img
              src={`/avatar/${avatar}`}
              alt="Avatar Terpilih"
              className="maps-legend-avatar-img"
              draggable={false}
            />
          </div>
        </div>

        {/* Tombol Penyimpanan / Cek Item di area bawah frame legenda */}
        <button
          type="button"
          id="btn-maps-cek-item"
          className="maps-legend-btn-cek"
          onClick={() => {
            console.log("Mbukak Penyimpenan / Cek Item...");
          }}
          aria-label="Cek Item Penyimpenan"
        >
          <span className="maps-legend-btn-text">Penyimpenan</span>
          <span className="maps-legend-btn-indicator" aria-hidden="true" />
        </button>
      </section>

      {/* Gambar Konten Peta Papan Kayu / Map Board (maps.webp) */}
      <section className="maps-board-wrapper" aria-label="Peta Jelajah Aksara Lawu">
        <img
          src="/maps/maps.webp"
          alt="Peta Petualangan Lawu Quest"
          className="maps-board-img"
          draggable={false}
        />

        {/* Avatar Pin / Token di atas jalur peta (Posisi Level 1 Cemoro Sewu) */}
        <div className="maps-board-avatar-pin" aria-label="Posisi Avatar di Peta">
          <div className="maps-board-avatar-circle">
            <img
              src={`/avatar/${avatar}`}
              alt="Avatar di Peta"
              className="maps-board-avatar-img"
              draggable={false}
            />
          </div>
        </div>
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
