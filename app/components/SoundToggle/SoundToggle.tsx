"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./sound-toggle.css";

interface SoundToggleProps {
  initialMuted?: boolean;
}

const STANDALONE_ROUTES = ["/", "/login", "/register", "/menu", "/menu_game"];

export default function SoundToggle({ initialMuted = false }: SoundToggleProps) {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState<boolean>(initialMuted);

  // Membaca preferensi suara dari localStorage saat pertama kali dimuat
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

  // Hanya tampilkan standalone SoundToggle di login, register, menu, menu_game.
  // Di halaman lain (seperti Cemoro Sewu), kontrol sound sudah terintegrasi rapi di dalam TopBar.
  if (!STANDALONE_ROUTES.includes(pathname)) {
    return null;
  }

  // Fungsi toggle suara on/off
  const toggleSound = () => {
    setIsMuted((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem("aksara_lawu_sound_muted", String(nextState));
        // Kirim custom event agar modul audio background dapat mendengarkan perubahan secara global
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

  return (
    <aside className="sound-toggle-wrapper" aria-label="Pengaturan Suara">
      <button
        type="button"
        id="btn-sound-toggle"
        onClick={toggleSound}
        className="sound-toggle-btn"
        aria-label={isMuted ? "Uripake Swara (Sound On)" : "Patèni Swara (Sound Off)"}
        title={isMuted ? "Uripake Swara" : "Patèni Swara"}
      >
        <img
          src={isMuted ? "/main_assets/sound_off.png" : "/main_assets/sound_on.png"}
          alt={isMuted ? "Swara Mati" : "Swara Urip"}
          className="sound-toggle-icon"
          draggable={false}
        />
      </button>
    </aside>
  );
}
