"use client";

import React, { useState, useEffect } from "react";
import HomeButton from "../components/HomeButton/HomeButton";
import FogWind from "../components/FogWind/FogWind";
import MapsMainComponent from "../components/MapsMainComponent/MapsMainComponent";
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

      {/* Komponen Utama Peta: Maps, All Level Banner, Titik Merah 1-6, Gembok 3-6, dan Tombol Njlajahi */}
      <MapsMainComponent avatar={avatar} />

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
