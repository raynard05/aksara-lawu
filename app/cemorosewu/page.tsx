"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FogWind from "../components/FogWind/FogWind";
import DialogPopup from "../components/DialogPopup/DialogPopup";
import "./cemorosewu.css";

export default function CemoroSewuPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
  const [dialogMountKey, setDialogMountKey] = useState<number>(1);

  // Jika sesi cemorosewu sudah selesai (sudah pilih avatar & mulai petualangan),
  // cegah kembali ke halaman ini dan otomatis alihkan ke /maps
  useEffect(() => {
    try {
      const isCompleted =
        sessionStorage.getItem("aksara_lawu_cemorosewu_completed") ||
        localStorage.getItem("aksara_lawu_cemorosewu_completed");
      if (isCompleted === "true") {
        router.replace("/maps");
        return;
      }
    } catch {
      // ignore
    }

    setIsDialogOpen(true);
    setDialogMountKey((prev) => prev + 1);
  }, [router]);

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
    } catch {
      // ignore
    }

    // Beranjak ke halaman berikutnya (/maps)
    router.push("/maps");
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
