"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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

  // Jika berada di login, register, menu, atau menu_game, jangan render TopBar
  if (EXCLUDED_ROUTES.includes(pathname)) {
    return null;
  }

  // Aksi tombol previous / back
  const handlePrevious = () => {
    // Jika ada history atau tombol kembali, kembali ke halaman sebelumnya
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/menu_game");
    }
  };

  // Aksi tombol home -> kembali ke menu utama
  const handleHome = () => {
    router.push("/menu");
  };

  // Aksi toggle sound
  const handleToggleSound = () => {
    setIsMuted((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem("aksara_lawu_sound_muted", String(nextState));
        window.dispatchEvent(
          new CustomEvent("aksara-lawu-sound-change", {
            detail: { isMuted: nextState },
          })
        );
      } catch {
        // Fallback jika localStorage error
      }
      return nextState;
    });
  };

  // Aksi tombol next / lanjut
  const handleNext = () => {
    // Sesuai alur petualangan dari pos cemoro sewu ke game/pos berikutnya
    router.push("/game");
  };

  return (
    <aside className="topbar-wrapper" aria-label="Top Bar Navigasi">
      <nav className="topbar-plank">
        {/* Sisi Kiri: Previous dan Home */}
        <div className="topbar-side-left">
          <button
            type="button"
            id="btn-topbar-prev"
            onClick={handlePrevious}
            className="topbar-btn"
            aria-label="Bali menyang kaca sadurunge (Previous)"
            title="Sadurunge"
          >
            <img
              src="/main_assets/previous.png"
              alt="Sadurunge"
              className="topbar-btn-icon"
              draggable={false}
            />
          </button>

          <button
            type="button"
            id="btn-topbar-home"
            onClick={handleHome}
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

        {/* Sisi Kanan: Sound On/Off dan Next */}
        <div className="topbar-side-right">
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

          <button
            type="button"
            id="btn-topbar-next"
            onClick={handleNext}
            className="topbar-btn topbar-btn-next"
            aria-label="Lanjut menyang kaca sabanjure (Next)"
            title="Sabanjure"
          >
            <img
              src="/main_assets/next.png"
              alt="Sabanjure"
              className="topbar-btn-icon"
              draggable={false}
            />
          </button>
        </div>
      </nav>
    </aside>
  );
}
