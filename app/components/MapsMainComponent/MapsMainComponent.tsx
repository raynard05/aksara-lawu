"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FlyingEagle from "../FlyingEagle/FlyingEagle";
import "./maps-main-component.css";

export interface Waypoint {
  id: number;
  name: string;
  levelNumber: number; // 0 untuk Cemoro Sewu (titik 1), 1 untuk Pos 1 (titik 2), dst.
  x: number; // Persentase X (%) di atas papan maps.webp
  y: number; // Persentase Y (%) di atas papan maps.webp
  route: string;
  bannerImg: string;
  isLocked: boolean;
}

// 6 Titik Waypoint di papan maps.webp
// Sesuai prompt: Titik 2 adalah Level 1, titik 3 sampai 6 dilock gembok.webp
export const DEFAULT_WAYPOINTS: Waypoint[] = [
  {
    id: 1,
    name: "Cemoro Sewu",
    levelNumber: 0,
    x: 6.5,
    y: 79.0,
    route: "/cemorosewu",
    bannerImg: "/maps/level1.webp",
    isLocked: false,
  },
  {
    id: 2,
    name: "Level 1 - Pos 1: Golek Pituduh",
    levelNumber: 1,
    x: 21.2,
    y: 70.8,
    route: "/level1",
    bannerImg: "/maps/level1.webp",
    isLocked: false, // Default aktif setelah selesai Cemoro Sewu
  },
  {
    id: 3,
    name: "Level 2 - Pos 2: Labirin Pendakian",
    levelNumber: 2,
    x: 33.6,
    y: 58.2,
    route: "/level2",
    bannerImg: "/maps/level2.webp",
    isLocked: true, // Lock dengan gembok.webp
  },
  {
    id: 4,
    name: "Level 3 - Pos 3: Warung Ngaso",
    levelNumber: 3,
    x: 45.7,
    y: 48.6,
    route: "/level3",
    bannerImg: "/maps/level3.webp",
    isLocked: true, // Lock dengan gembok.webp
  },
  {
    id: 5,
    name: "Level 4 - Pos 4: Nata Aksara Jawa",
    levelNumber: 4,
    x: 59.2,
    y: 42.1,
    route: "/level4",
    bannerImg: "/maps/level4.webp",
    isLocked: true, // Lock dengan gembok.webp
  },
  {
    id: 6,
    name: "Ending - Puncak Gunung Lawu",
    levelNumber: 5,
    x: 78.6,
    y: 21.6,
    route: "/levelending",
    bannerImg: "/maps/levelending.webp",
    isLocked: true, // Lock dengan gembok.webp
  },
];

interface MapsMainComponentProps {
  avatar?: string;
  initialWaypointId?: number; // Default titik ke-2 (Level 1)
  onNavigate?: (route: string, waypoint: Waypoint) => void;
}

export default function MapsMainComponent({
  avatar = "avatar1.webp",
  initialWaypointId = 2,
  onNavigate,
}: MapsMainComponentProps) {
  const router = useRouter();

  // State titik aktif / posisi avatar saat ini di peta
  // Default otomatis di titik ke-2 (Level 1) sesuai instruksi prompt
  const [currentWaypointId, setCurrentWaypointId] = useState<number>(initialWaypointId);

  // Ambil data avatar terpilih dari sessionStorage/localStorage jika prop kosong/default
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatar);

  useEffect(() => {
    try {
      const storedAvatar =
        sessionStorage.getItem("aksara_lawu_selected_avatar") ||
        localStorage.getItem("aksara_lawu_selected_avatar");
      if (storedAvatar) {
        setSelectedAvatar(storedAvatar);
      }
    } catch {
      // ignore
    }
  }, []);

  // Temukan waypoint yang sedang aktif
  const currentWaypoint =
    DEFAULT_WAYPOINTS.find((wp) => wp.id === currentWaypointId) ||
    DEFAULT_WAYPOINTS[1]; // Fallback titik 2 (Level 1)

  // Handler saat tombol Njlajahi diklik
  const handleNjlajahi = () => {
    console.log(`Miwiti Njlajahi: ${currentWaypoint.name} -> ${currentWaypoint.route}`);
    if (onNavigate) {
      onNavigate(currentWaypoint.route, currentWaypoint);
    } else {
      router.push(currentWaypoint.route);
    }
  };

  // Handler saat titik / waypoint diklik (untuk memilih titik & tes animasi perpindahan)
  const handleWaypointClick = (wp: Waypoint) => {
    // Jika terkunci, tetap izinkan melihat lokasi atau beri notifikasi
    setCurrentWaypointId(wp.id);
  };

  return (
    <div className="mmc-container" aria-label="Komponen Utama Peta Lawu">
      {/* Header Atas: Banner Level Dinamis & Tombol Njlajahi */}
      <section className="mmc-top-header" aria-label="Navigasi Misi Peta">
        {/* Banner Kayu Level (Berubah sesuai Waypoint yang aktif) */}
        <div className="mmc-level-banner-wrapper">
          <img
            src={currentWaypoint.bannerImg}
            alt={currentWaypoint.name}
            className="mmc-level-banner-img"
            draggable={false}
          />
        </div>

        {/* Tombol Njlajahi (Aksi redirect dinamis sesuai waypoint/level) */}
        <button
          type="button"
          id="btn-maps-njlajahi"
          className="mmc-btn-njlajahi"
          onClick={handleNjlajahi}
          aria-label={`Njlajahi ${currentWaypoint.name}`}
          title={`Njlajahi ${currentWaypoint.name}`}
        >
          <span className="mmc-btn-njlajahi-text">Njlajahi</span>
        </button>
      </section>

      {/* Papan Peta Kayu (maps.webp) beserta titik navigasi & avatar */}
      <section className="mmc-board-wrapper" aria-label="Peta Jelajah Aksara Lawu">
        <img
          src="/maps/maps.webp"
          alt="Peta Petualangan Lawu Quest"
          className="mmc-board-img"
          draggable={false}
        />

        {/* Elang Terbang Melingkari maps.webp dengan Rute Lingkaran Merah */}
        <FlyingEagle mode="map-circle" showRoute={true} />

        {/* Render 6 Titik Merah Penanda (Waypoints 1 - 6) */}
        {DEFAULT_WAYPOINTS.map((wp) => {
          return (
            <button
              key={`waypoint-${wp.id}`}
              type="button"
              id={`btn-waypoint-${wp.id}`}
              className="mmc-waypoint-marker"
              style={{
                left: `${wp.x}%`,
                top: `${wp.y}%`,
              }}
              onClick={() => handleWaypointClick(wp)}
              aria-label={`Titik ${wp.id}: ${wp.name}`}
              title={`Titik ${wp.id}: ${wp.name} (Klik kanggo mindhah avatar)`}
            >
              <span className="mmc-waypoint-label">{wp.id}</span>
            </button>
          );
        })}

        {/* Render Gembok Lock (gembok.webp) untuk Level 3 sampai 6 (Waypoint 3 - 6) */}
        {DEFAULT_WAYPOINTS.filter((wp) => wp.isLocked).map((wp) => {
          return (
            <div
              key={`lock-${wp.id}`}
              className="mmc-lock-wrapper"
              style={{
                left: `${wp.x}%`,
                top: `${wp.y}%`,
              }}
              aria-label={`Terkunci: ${wp.name}`}
              title={`Level Terkunci: ${wp.name}`}
            >
              <img
                src="/maps/gembok.webp"
                alt="Level Terkunci"
                className="mmc-lock-img"
                draggable={false}
              />
            </div>
          );
        })}

        {/* Avatar Pin / Token di atas titik aktif (berpindah halus secara animasi CSS) */}
        <div
          className="mmc-board-avatar-pin"
          style={{
            left: `${currentWaypoint.x}%`,
            top: `${currentWaypoint.y}%`,
          }}
          aria-label={`Avatar ing ${currentWaypoint.name}`}
        >
          <div className="mmc-board-avatar-circle">
            <img
              src={`/avatar/${selectedAvatar}`}
              alt="Avatar Pemain ing Peta"
              className="mmc-board-avatar-img"
              draggable={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
