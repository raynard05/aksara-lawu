"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FogWind from "../components/FogWind/FogWind";
import DialogPopup from "../components/DialogPopup/DialogPopup";
import { DEFAULT_UNLOCKED_LEVELS, UNLOCKED_LEVELS_KEY, markLevelCompleted } from "../lib/inventoryStorage";
import "./cemorosewu.css";

export default function CemoroSewuPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
  const [dialogMountKey, setDialogMountKey] = useState<number>(1);

  // Pastikan dialog selalu terbuka saat halaman Cemoro Sewu dimuat
  useEffect(() => {
    setIsDialogOpen(true);
    setDialogMountKey((prev) => prev + 1);
  }, []);

  const handleDialogComplete = (selectedAvatar?: string) => {
    setIsDialogOpen(false);
    console.log("Avatar kapilih:", selectedAvatar);

    // Simpan sesi cemoro sewu & avatar yang dipilih
    try {
      if (selectedAvatar) {
        sessionStorage.setItem("aksara_lawu_selected_avatar", selectedAvatar);
        localStorage.setItem("aksara_lawu_selected_avatar", selectedAvatar);
      }
      sessionStorage.setItem("aksara_lawu_cemorosewu_completed", "true");
      localStorage.setItem("aksara_lawu_cemorosewu_completed", "true");
      markLevelCompleted(0);

      // Pastikan posisi default di /maps adalah Titik 2 (Level 1)
      sessionStorage.setItem("aksara_lawu_current_waypoint", "2");

      // Pastikan level selanjutnya (titik 3 sampai 6) terkunci gembok (hanya level 1 yang terbuka)
      const initialLevelsJson = JSON.stringify(DEFAULT_UNLOCKED_LEVELS);
      sessionStorage.setItem(UNLOCKED_LEVELS_KEY, initialLevelsJson);
      localStorage.setItem(UNLOCKED_LEVELS_KEY, initialLevelsJson);
    } catch {
      // ignore
    }

    // Beranjak ke halaman petualangan Open World (/openworld)
    router.push("/openworld");
  };

  return (
    <main className="cemorosewu-root" aria-label="Halaman Cemoro Sewu">
      {/* Efek angin kabut pelan dari kiri menuju kanan di atas background cemorosewu */}
      <FogWind />

      {/* Komponen dialog pop up di tengah halaman membaca data dari dialog.json */}
      {isDialogOpen && (
        <DialogPopup
          key={`dialog-${dialogMountKey}`}
          isOpen={true}
          pageKey="cemorosewu"
          onComplete={handleDialogComplete}
        />
      )}
    </main>
  );
}
