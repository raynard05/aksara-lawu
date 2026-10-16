"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./menu-button.css";

export default function MainMenuButton() {
  const router = useRouter();

  const handleMenuClick = () => {
    router.push("/menu");
  };

  return (
    <aside className="menu-btn-main-wrapper" aria-label="Menu Utama">
      <button
        type="button"
        id="btn-main-menu"
        onClick={handleMenuClick}
        className="menu-btn-main-action"
        aria-label="Bali menyang Menu Utama"
        title="Menu Utama"
      >
        <img
          src="/main_assets/menu.png"
          alt="Menu Utama"
          className="menu-btn-main-icon"
          draggable={false}
        />
      </button>
    </aside>
  );
}
