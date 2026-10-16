"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./profile-button.css";

export default function ProfileButton() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profil");
  };

  return (
    <aside className="profile-btn-wrapper" aria-label="Profil Panganggo">
      <button
        type="button"
        id="btn-profile"
        onClick={handleProfileClick}
        className="profile-btn-action"
        aria-label="Profil Pengembang / Panganggo"
        title="Profil"
      >
        <img
          src="/main_assets/profile.png"
          alt="Profil"
          className="profile-btn-icon"
          draggable={false}
        />
      </button>
    </aside>
  );
}
