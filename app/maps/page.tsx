"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeButton from "../components/HomeButton/HomeButton";
import FogWind from "../components/FogWind/FogWind";
import MapsMainComponent from "../components/MapsMainComponent/MapsMainComponent";
import "./maps.css";

function MapsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOpenworld = searchParams.get("from") === "openworld";

  const [avatar, setAvatar] = useState<string>("avatar1.webp");
  // Fase cover penutup jika datang dari openworld: "closed" -> jeda 1.5 detik -> "opening" -> "hidden"
  const [coverPhase, setCoverPhase] = useState<"closed" | "opening" | "hidden">(
    fromOpenworld ? "closed" : "hidden"
  );

  useEffect(() => {
    if (fromOpenworld) {
      // Berikan delay 1.5 detik di mana halaman maps sudah ada di belakang,
      // lalu cover meluncur ke bawah keluar layar dan halaman maps langsung terlihat
      const timer = setTimeout(() => {
        setCoverPhase("opening");
        const hideTimer = setTimeout(() => {
          setCoverPhase("hidden");
        }, 850);
        return () => clearTimeout(hideTimer);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [fromOpenworld]);

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

        {/* Tombol Penyimpanan / Cek Item di area bawah frame legenda -> redirect /inventory */}
        <button
          type="button"
          id="btn-maps-cek-item"
          className="maps-legend-btn-cek"
          onClick={() => {
            router.push("/inventory");
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

      {/* Cover Overlay Transisi: Diam 1.5 detik menutup layar lalu meluncur turun ke bawah membuka peta */}
      {coverPhase !== "hidden" && (
        <div className={`maps-curtain-overlay maps-curtain-${coverPhase}`} />
      )}
    </main>
  );
}

export default function MapsPage() {
  return (
    <Suspense fallback={<div className="maps-curtain-overlay maps-curtain-closed" />}>
      <MapsContent />
    </Suspense>
  );
}
