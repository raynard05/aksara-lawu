"use client";

import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "./game-popup.css";

export type GamePopupType = "correct" | "salah" | "gameover" | null;

interface GamePopupProps {
  type: GamePopupType;
  onClose?: () => void;
  onGameOverClick?: () => void;
  autoCloseDelay?: number; // ms, default 2300ms untuk correct & salah
}

export default function GamePopup({
  type,
  onClose,
  onGameOverClick,
  autoCloseDelay = 2300,
}: GamePopupProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!type) return;

    if (type === "correct") {
      // Tembakkan confetti di sudut-sudut layar
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: 0.1, y: 0.8 },
          zIndex: 900,
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: 0.9, y: 0.8 },
          zIndex: 900,
        });
        confetti({
          particleCount: 40,
          spread: 80,
          origin: { x: 0.5, y: 0.3 },
          zIndex: 900,
        });
      } catch {
        // Abaikan jika confetti belum siap
      }

      // Delay 2.3 detik lalu panggil onClose
      timerRef.current = setTimeout(() => {
        if (onClose) onClose();
      }, autoCloseDelay);
    } else if (type === "salah") {
      // Delay 2.3 detik lalu panggil onClose
      timerRef.current = setTimeout(() => {
        if (onClose) onClose();
      }, autoCloseDelay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [type, onClose, autoCloseDelay]);

  if (!type) return null;

  const handleClick = () => {
    if (type === "gameover") {
      if (onGameOverClick) {
        onGameOverClick();
      } else if (onClose) {
        onClose();
      }
    }
  };

  const imageSrc =
    type === "correct"
      ? "/gamepopup/correct.webp"
      : type === "salah"
      ? "/gamepopup/salah.webp"
      : "/gamepopup/gameover.webp";

  const isWrong = type === "salah";
  const isGameOver = type === "gameover";

  return (
    <div
      className={`gp-overlay ${isWrong ? "gp-overlay-wrong" : "gp-overlay-default"}`}
      role="dialog"
      aria-modal="true"
      aria-label={type}
      onClick={isGameOver ? handleClick : undefined}
    >
      <div
        className={`gp-box ${isWrong ? "gp-anim-shake" : "gp-anim-pop"}`}
        onClick={isGameOver ? handleClick : undefined}
      >
        <img
          src={imageSrc}
          alt={type}
          className="gp-banner-img"
          draggable={false}
        />
      </div>
    </div>
  );
}
