"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./home-button.css";

interface HomeButtonProps {
  className?: string;
  redirectTo?: string;
}

export default function HomeButton({
  className = "",
  redirectTo = "/menu",
}: HomeButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Munculkan popup konfirmasi
  const handleHomeClick = () => {
    setShowConfirm(true);
  };

  // Konfirmasi Ya -> reset sesi / pindah ke menu utama
  const handleConfirmHome = () => {
    setShowConfirm(false);
    try {
      sessionStorage.removeItem("aksara_lawu_current_session");
    } catch {
      // Abaikan jika storage tidak dapat diakses
    }
    router.push(redirectTo);
  };

  // Batal -> tutup popup
  const handleCancelHome = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <aside
        className={`home-btn-wrapper ${className}`}
        aria-label="Tombol Bali menyang Menu Utama"
      >
        <button
          type="button"
          id="btn-standalone-home"
          onClick={handleHomeClick}
          className="home-btn-action"
          aria-label="Bali menyang Menu Utama (Home)"
          title="Menu Utama"
        >
          <img
            src="/main_assets/home.png"
            alt="Home"
            className="home-btn-icon"
            draggable={false}
          />
        </button>
      </aside>

      {/* Pop Up Modal Konfirmasi Tombol Home Bahasa Jawa */}
      {showConfirm && (
        <div
          className="home-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-confirm-title"
        >
          <div className="home-modal-box">
            {/* Header / Ikon Informasi */}
            <div className="home-modal-icon-wrapper">
              <img
                src="/dialog/information.png"
                alt="Informasi"
                className="home-modal-icon"
                draggable={false}
              />
            </div>

            {/* Judul & Pesan Konfirmasi Bahasa Jawa */}
            <h2 id="home-confirm-title" className="home-modal-title">
              Pèngetan!
            </h2>
            <p className="home-modal-text">
              Apa kowé yakin arep metu saka game? Sesi dolananmu bakal di-reset yen kowé metu saka game iki.
            </p>

            {/* Tombol Aksi: Batal & Ya Metu */}
            <div className="home-modal-actions">
              <button
                type="button"
                id="btn-home-modal-cancel"
                onClick={handleCancelHome}
                className="home-modal-btn home-modal-btn-cancel"
              >
                Ora, Terusna
              </button>
              <button
                type="button"
                id="btn-home-modal-confirm"
                onClick={handleConfirmHome}
                className="home-modal-btn home-modal-btn-confirm"
              >
                Iya, Metu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
