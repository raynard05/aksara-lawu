"use client";

import React from "react";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import ProfileButton from "../components/ProfileButton/ProfileButton";
import "./menu.css";

interface MenuOption {
  id: string;
  title: string;
  icon: string;
  href: string;
  isFullWidth?: boolean;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    id: "capaian",
    title: "CAPAIAN PEMBELAJARAN",
    icon: "/menu_assets/ikon_target.png",
    href: "/capaian",
  },
  {
    id: "cara-dolanan",
    title: "CARA DOLANAN",
    icon: "/menu_assets/ikon_peta.png",
    href: "/cara-dolanan",
  },
  {
    id: "tujuan",
    title: "TUJUAN PEMBELAJARAN",
    icon: "/menu_assets/ikon_lampu.png",
    href: "/tujuan",
  },
  {
    id: "evaluasi",
    title: "EVALUASI",
    icon: "/menu_assets/ikon_papan_ceklis.png",
    href: "/evaluasi",
  },
  {
    id: "wiwiti",
    title: "WIWIT",
    icon: "/menu_assets/ikon_papan_arah.png",
    href: "/menu_game",
  },
  {
    id: "materi",
    title: "MATERI",
    icon: "/menu_assets/ikon_buku.png",
    href: "/materi",
  },
  {
    id: "profil",
    title: "PROFIL PENGEMBANG",
    icon: "/menu_assets/ikon_profil.png",
    href: "/profil",
    isFullWidth: true,
  },
];

export default function MenuPage() {
  const leftOptions = MENU_OPTIONS.filter((_, idx) => idx % 2 === 0 && idx < 6);
  const rightOptions = MENU_OPTIONS.filter((_, idx) => idx % 2 === 1 && idx < 6);
  const fullWidthOption = MENU_OPTIONS.find((item) => item.isFullWidth);

  // Komponen Retakan Sisi Kiri (Tebal 3D Natural)
  const CrackLeft = () => (
    <svg className="menu-btn-crack-left" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 6L9 14L4 21L14 27L2 34" stroke="#362618" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 7.8L9 15.8L4 22.8L14 28.8L2 35.8" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      <path d="M9 14L18 10" stroke="#362618" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 21L12 21" stroke="#362618" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Komponen Retakan Sisi Kanan (Tebal 3D Natural)
  const CrackRight = () => (
    <svg className="menu-btn-crack-right" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M24 8L15 15L20 23L10 28L22 35" stroke="#362618" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 9.8L15 16.8L20 24.8L10 29.8L22 36.8" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      <path d="M15 15L6 12" stroke="#362618" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 23L12 23" stroke="#362618" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <main className="menu-root">
      {/* Container utama halaman menu */}
      <div className="menu-container">
        {/* Papan Slab Kayu & Batu di Tengah */}
        <div className="menu-signboard-wrapper">
          <img
            src="/menu_assets/signboard.png"
            alt="Papan Menu Aksara Lawu"
            className="menu-signboard-img"
            draggable={false}
          />

          {/* Area konten tombol di atas papan signboard */}
          <div className="menu-board-content">
            {/* 3 Baris Atas: 2 Kolom Tombol */}
            <div className="menu-grid-row">
              {/* Kolom Kiri */}
              <div className="menu-column">
                {leftOptions.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="menu-stone-btn"
                  >
                    <CrackLeft />
                    <CrackRight />
                    <span className="menu-btn-icon-wrap">
                      <img
                        src={item.icon}
                        alt=""
                        className="menu-btn-icon"
                        draggable={false}
                      />
                    </span>
                    <span className="menu-btn-label">{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Kolom Kanan */}
              <div className="menu-column">
                {rightOptions.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="menu-stone-btn"
                  >
                    <CrackLeft />
                    <CrackRight />
                    <span className="menu-btn-icon-wrap">
                      <img
                        src={item.icon}
                        alt=""
                        className="menu-btn-icon"
                        draggable={false}
                      />
                    </span>
                    <span className="menu-btn-label">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Baris Bawah: Tombol Lebar (Profil Pengembang) */}
            {fullWidthOption && (
              <div className="menu-full-row">
                <Link
                  href={fullWidthOption.href}
                  className="menu-stone-btn menu-stone-btn-full"
                >
                  <CrackLeft />
                  <CrackRight />
                  <span className="menu-btn-icon-wrap">
                    <img
                      src={fullWidthOption.icon}
                      alt=""
                      className="menu-btn-icon"
                      draggable={false}
                    />
                  </span>
                  <span className="menu-btn-label">
                    {fullWidthOption.title}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Profile di pojok kiri atas (render only in menu & game menus) */}
      <ProfileButton />

      {/* Tombol Logout di pojok kanan bawah (render only in menu & game menus) */}
      <LogoutButton />
    </main>
  );
}
