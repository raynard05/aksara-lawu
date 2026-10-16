"use client";

import React from "react";
import ProfileButton from "../components/ProfileButton/ProfileButton";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import "./menu_game.css";

export default function MenuGamePage() {
  return (
    <main className="menu-game-root">
      {/* Container utama halaman menu game */}
      <div className="menu-game-container">
        {/* Konten menu game */}
      </div>

      {/* Tombol Profile di pojok kiri atas (render only in menu & game menus) */}
      <ProfileButton />

      {/* Tombol Logout di pojok kanan bawah (render only in menu & game menus) */}
      <LogoutButton />
    </main>
  );
}
