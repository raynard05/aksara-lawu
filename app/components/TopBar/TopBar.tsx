"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resetGameProgress } from "../../lib/inventoryStorage";
import "./topbar.css";

// Rute yang dikecualikan dari rendering TopBar sesuai topbarrule.txt:
// - login
// - regis
// - gamemenus (/menu_game)
// - menus (/menu)
// - maps (/maps)
const EXCLUDED_ROUTES = [
  "/",
  "/login",
  "/register",
  "/menu",
  "/menu_game",
  "/maps",
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  // State sinkronisasi status suara mute/unmute
  const [isMuted, setIsMuted] = useState<boolean>(false);
  // State untuk modal dialog konfirmasi keluar game
  const [showHomeConfirm, setShowHomeConfirm] = useState<boolean>(false);
  // State override untuk disable maps dan bag selama in-game (misal level1_game)
  const [inGameDisabled, setInGameDisabled] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem("aksara_lawu_sound_muted");
      if (savedPreference !== null) {
        setIsMuted(savedPreference === "true");
      }
    } catch {
      // Abaikan jika localStorage tidak dapat diakses
    }

    const handleSoundEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ isMuted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isMuted === "boolean") {
        setIsMuted(customEvent.detail.isMuted);
      }
    };

    window.addEventListener("aksara-lawu-sound-change", handleSoundEvent);
    return () => {
      window.removeEventListener("aksara-lawu-sound-change", handleSoundEvent);
    };
  }, []);

  useEffect(() => {
    // Jika rute adalah /level1_game, defaultnya inGameDisabled = true
    if (pathname.includes("level1_game")) {
      setInGameDisabled(true);
    } else {
      setInGameDisabled(false);
    }

    const handleTopBarToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ disableInGame?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.disableInGame === "boolean") {
        setInGameDisabled(customEvent.detail.disableInGame);
      }
    };

    window.addEventListener("aksara-lawu-topbar-toggle", handleTopBarToggle);
    return () => {
      window.removeEventListener("aksara-lawu-topbar-toggle", handleTopBarToggle);
    };
  }, [pathname]);

  // Jika berada di login, register, menu, atau menu_game, jangan render TopBar
  if (EXCLUDED_ROUTES.includes(pathname)) {
    return null;
  }

  // Cek apakah halaman saat ini adalah cemorosewu untuk men-disable tombol bag dan maps
  const isCemoroSewu = pathname === "/cemorosewu" || pathname.startsWith("/cemorosewu/");
  // Cek apakah halaman saat ini adalah inventory untuk men-disable tombol bag
  const isInventory = pathname === "/inventory" || pathname.startsWith("/inventory/");

  const isMapsDisabled = isCemoroSewu || inGameDisabled;
  const isBagDisabled = isCemoroSewu || isInventory || inGameDisabled;

  // Aksi tombol peta / maps -> buka halaman peta
  const handleMaps = () => {
    if (isMapsDisabled) return;
    router.push("/maps");
  };

  // Aksi saat tombol home ditekan -> munculkan popup konfirmasi
  const handleHomeClick = () => {
    setShowHomeConfirm(true);
  };

  // Konfirmasi Ya -> reset sesi / arahkan kembali ke menu utama
  const handleConfirmHome = () => {
    setShowHomeConfirm(false);
    resetGameProgress();
    router.push("/menu");
  };

  // Batal -> tutup popup konfirmasi
  const handleCancelHome = () => {
    setShowHomeConfirm(false);
  };

  // Aksi toggle sound
  const handleToggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    try {
      localStorage.setItem("aksara_lawu_sound_muted", String(nextState));
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("aksara-lawu-sound-change", {
            detail: { isMuted: nextState },
          })
        );
      }, 0);
    } catch {
      // Fallback jika localStorage error
    }
  };

  // Aksi tombol tas / inventaris
  const handleBag = () => {
    if (isBagDisabled) return;
    router.push("/inventory");
  };

  return (
    <>
      <aside className="topbar-wrapper" aria-label="Top Bar Navigasi">
        <nav className="topbar-plank">
          {/* Sisi Kiri: Maps dan Home */}
          {/* Sisi Kiri: Home dan Maps (Home di paling luar/kiri, Maps di sampingnya) */}
          <div className="topbar-side-left">
            <button
              type="button"
              id="btn-topbar-home"
              onClick={handleHomeClick}
              className="topbar-btn"
              aria-label="Bali menyang Menu Utama (Home)"
              title="Menu Utama"
            >
              <img
                src="/main_assets/home.png"
                alt="Home"
                className="topbar-btn-icon"
                draggable={false}
              />
            </button>

            <button
              type="button"
              id="btn-topbar-maps"
              onClick={handleMaps}
              disabled={isMapsDisabled}
              className={`topbar-btn ${isMapsDisabled ? "topbar-btn-disabled" : ""}`}
              aria-label="Peta Wilayah (Maps)"
              aria-disabled={isMapsDisabled}
              title={isMapsDisabled ? "Peta Ora Kasedhiya" : "Peta (Maps)"}
            >
              <img
                src="/main_assets/maps.png"
                alt="Peta"
                className="topbar-btn-icon"
                draggable={false}
              />
            </button>
          </div>

          {/* Sisi Tengah: Logo Title Aksara Lawu */}
          <div className="topbar-center-title">
            <img
              src="/main_assets/aksaralawu.png"
              alt="Aksara Lawu"
              className="topbar-title-img"
              draggable={false}
            />
          </div>

          {/* Sisi Kanan: Bag dan Sound On/Off (Bag di dekat logo/tengah, Sound di paling luar/kanan atau sebaliknya simetris) */}
          <div className="topbar-side-right">
            <button
              type="button"
              id="btn-topbar-bag"
              onClick={handleBag}
              disabled={isBagDisabled}
              className={`topbar-btn topbar-btn-bag ${
                isBagDisabled ? "topbar-btn-disabled" : ""
              }`}
              aria-label="Tas Inventaris (Bag)"
              aria-disabled={isBagDisabled}
              title={
                isBagDisabled
                  ? "Tas Ora Kasedhiya"
                  : isInventory
                  ? "Ing Halaman Inventaris"
                  : "Tas (Bag)"
              }
            >
              <img
                src="/main_assets/bag.png"
                alt="Tas"
                className="topbar-btn-icon"
                draggable={false}
              />
            </button>

            <button
              type="button"
              id="btn-topbar-sound"
              onClick={handleToggleSound}
              className="topbar-btn"
              aria-label={isMuted ? "Uripake Swara (Sound On)" : "Patèni Swara (Sound Off)"}
              title={isMuted ? "Uripake Swara" : "Patèni Swara"}
            >
              <img
                src={isMuted ? "/main_assets/sound_off.png" : "/main_assets/sound_on.png"}
                alt={isMuted ? "Swara Mati" : "Swara Urip"}
                className="topbar-btn-icon"
                draggable={false}
              />
            </button>
          </div>
        </nav>
      </aside>

      {/* Pop Up Modal Konfirmasi Tombol Home (Render di luar aside agar z-index mutlak di lapisan paling atas melampaui DialogPopup) */}
      {showHomeConfirm && (
        <div
          className="topbar-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="topbar-confirm-title"
        >
          <div className="topbar-modal-box">
            {/* Header / Ikon Informasi */}
            <div className="topbar-modal-icon-wrapper">
              <img
                src="/dialog/information.png"
                alt="Informasi"
                className="topbar-modal-icon"
                draggable={false}
              />
            </div>

            {/* Judul & Pesan Konfirmasi Bahasa Jawa */}
            <h2 id="topbar-confirm-title" className="topbar-modal-title">
              Pèngetan!
            </h2>
            <p className="topbar-modal-text">
              Apa kowé yakin arep metu saka game? Sesi dolananmu bakal di-reset yen kowé metu saka game iki.
            </p>

            {/* Tombol Aksi: Batal & Ya Metu */}
            <div className="topbar-modal-actions">
              <button
                type="button"
                id="btn-modal-cancel"
                onClick={handleCancelHome}
                className="topbar-modal-btn topbar-modal-btn-cancel"
              >
                Ora, Terusna
              </button>
              <button
                type="button"
                id="btn-modal-confirm"
                onClick={handleConfirmHome}
                className="topbar-modal-btn topbar-modal-btn-confirm"
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
