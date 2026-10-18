"use client";

import React, { useState } from "react";
import FogWind from "../components/FogWind/FogWind";
import DialogPopup from "../components/DialogPopup/DialogPopup";
import "./cemorosewu.css";

export default function CemoroSewuPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  const handleDialogComplete = (selectedAvatar?: string) => {
    setIsDialogOpen(false);
    console.log("Avatar kapilih:", selectedAvatar);
  };

  return (
    <main className="cemorosewu-root" aria-label="Halaman Cemoro Sewu">
      {/* Efek angin kabut pelan dari kiri menuju kanan di atas background cemorosewu */}
      <FogWind />

      {/* Komponen dialog pop up di tengah halaman membaca data dari dialog.json */}
      <DialogPopup
        isOpen={isDialogOpen}
        pageKey="cemorosewu"
        onComplete={handleDialogComplete}
      />
    </main>
  );
}
