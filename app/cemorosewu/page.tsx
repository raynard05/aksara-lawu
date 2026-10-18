"use client";

import React, { useState } from "react";
import FogWind from "../components/FogWind/FogWind";
import DialogPopup from "../components/DialogPopup/DialogPopup";
import "./cemorosewu.css";

export default function CemoroSewuPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
  const [dialogMountKey, setDialogMountKey] = useState<number>(1);

  // Pastikan dialog selalu terbuka dan ter-reset bersih setiap kali halaman dimuat / dikunjungi kembali
  React.useEffect(() => {
    setIsDialogOpen(true);
    setDialogMountKey((prev) => prev + 1);
  }, []);

  const handleDialogComplete = (selectedAvatar?: string) => {
    setIsDialogOpen(false);
    console.log("Avatar kapilih:", selectedAvatar);
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
