"use client";

import React from "react";
import Link from "next/link";
import ProfileButton from "../components/ProfileButton/ProfileButton";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import MainMenuButton from "../components/MainMenuButton/MainMenuButton";
import "./menu_game.css";

export default function MenuGamePage() {
  return (
    <main className="menu-game-root">
      {/* Container utama halaman menu game */}
      <div className="menu-game-container">
        {/* Papan Informasi Game Menus (gamemenus.webp) di Tengah */}
        <div className="menu-game-board-wrapper">
          <img
            src="/gamemenus/gamemenus.webp"
            alt="Papan Informasi Game Menus"
            className="menu-game-board-img"
            draggable={false}
          />

          {/* Area konten di atas papan */}
          <div className="menu-game-board-content">
            {/* Kartu Wiwit (Escape Room Game) */}
            <Link href="/game" className="menu-game-card">
              {/* Panah di pojok kanan atas kartu */}
              <div className="menu-game-arrow-wrap" aria-hidden="true">
                <svg
                  className="menu-game-arrow-svg"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26 6L8 24"
                    stroke="#5a3818"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 12V24H20"
                    stroke="#5a3818"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Karakter Chibi Petualang */}
              <div className="menu-game-chibi-wrap">
                <img
                  src="/character_assets/chibi.png"
                  alt="Karakter Petualang Lawu"
                  className="menu-game-chibi-img"
                  draggable={false}
                />
              </div>

              {/* Teks Judul Kartu: WIWIT */}
              <h2 className="menu-game-card-title">WIWIT</h2>
            </Link>
          </div>
        </div>
      </div>

      {/* Tombol Profile di pojok kiri atas (render only in menu & game menus) */}
      <ProfileButton />

      {/* Tombol Menu di pojok kiri bawah (render only in game menus, redirect to /menu) */}
      <MainMenuButton />

      {/* Tombol Logout di pojok kanan bawah (render only in menu & game menus) */}
      <LogoutButton />
    </main>
  );
}
