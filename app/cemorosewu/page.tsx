"use client";

import React from "react";
import FogWind from "../components/FogWind/FogWind";
import "./cemorosewu.css";

export default function CemoroSewuPage() {
  return (
    <main className="cemorosewu-root" aria-label="Halaman Cemoro Sewu">
      {/* Efek angin kabut pelan dari kiri menuju kanan di atas background cemorosewu */}
      <FogWind />
    </main>
  );
}
