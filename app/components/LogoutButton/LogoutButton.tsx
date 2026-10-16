"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./logout-button.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    try {
      // Hapus data sesi pengguna jika ada di localStorage
      localStorage.removeItem("aksara_lawu_user");
      sessionStorage.removeItem("aksara_lawu_user");
    } catch {
      // Abaikan jika storage tidak dapat diakses
    }

    // Arahkan kembali ke halaman login
    router.push("/login");
  };

  return (
    <aside className="logout-btn-wrapper" aria-label="Metu saka Game">
      <button
        type="button"
        id="btn-logout"
        onClick={handleLogout}
        className="logout-btn-action"
        aria-label="Metu (Log Out)"
        title="Metu (Log Out)"
      >
        <img
          src="/main_assets/logout.png"
          alt="Metu saka Game"
          className="logout-btn-icon"
          draggable={false}
        />
      </button>
    </aside>
  );
}
