"use client";

import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import "./virtual-joystick.css";

export interface JoystickMoveEvent {
  x: number; // -1 to 1
  y: number; // -1 to 1
  angle: number; // Radian
  distance: number; // 0 to 1
  isMoving: boolean;
}

interface VirtualJoystickProps {
  onMove: (event: JoystickMoveEvent) => void;
  onEnd: () => void;
  className?: string;
}

function VirtualJoystick({
  onMove,
  onEnd,
  className = "",
}: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Tangkap pointer event (touch / mouse)
    if (pointerIdRef.current !== null) return;
    pointerIdRef.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsActive(true);
    handlePointerMove(e);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId || !baseRef.current) return;

      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxRadius = rect.width / 2;

      const rawDx = e.clientX - centerX;
      const rawDy = e.clientY - centerY;
      const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

      let clampedDx = rawDx;
      let clampedDy = rawDy;

      if (dist > maxRadius) {
        clampedDx = (rawDx / dist) * maxRadius;
        clampedDy = (rawDy / dist) * maxRadius;
      }

      // Update knob transform langsung di GPU tanpa me-render ulang React di setiap sentuhan
      if (knobRef.current) {
        knobRef.current.style.transform = `translate(calc(-50% + ${clampedDx}px), calc(-50% + ${clampedDy}px))`;
      }

      const normalizedDist = Math.min(1, dist / maxRadius);
      const angle = Math.atan2(clampedDy, clampedDx);
      const normalizedX = maxRadius > 0 ? clampedDx / maxRadius : 0;
      const normalizedY = maxRadius > 0 ? clampedDy / maxRadius : 0;

      onMove({
        x: normalizedX,
        y: normalizedY,
        angle,
        distance: normalizedDist,
        isMoving: normalizedDist > 0.08,
      });
    },
    [onMove]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      if (pointerIdRef.current === e.pointerId) {
        pointerIdRef.current = null;
        setIsActive(false);
        if (knobRef.current) {
          knobRef.current.style.transform = "translate(-50%, -50%)";
        }
        onEnd();
      }
    },
    [onEnd]
  );

  useEffect(() => {
    const onGlobalPointerUp = (e: PointerEvent) => {
      if (pointerIdRef.current === e.pointerId) {
        handlePointerUp(e);
      }
    };
    window.addEventListener("pointerup", onGlobalPointerUp);
    window.addEventListener("pointercancel", onGlobalPointerUp);

    return () => {
      window.removeEventListener("pointerup", onGlobalPointerUp);
      window.removeEventListener("pointercancel", onGlobalPointerUp);
    };
  }, [handlePointerUp]);

  return (
    <div
      className={`vjoy-container ${isActive ? "vjoy-active" : ""} ${className}`}
      aria-label="Analog Gerak Karakter"
    >
      {/* Base Lingkaran Luar Analog Mobile Legends */}
      <div
        ref={baseRef}
        className="vjoy-base"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Dekorasi Indikator Arah 4 Sisi */}
        <div className="vjoy-dir-arrow vjoy-arrow-up">▲</div>
        <div className="vjoy-dir-arrow vjoy-arrow-down">▼</div>
        <div className="vjoy-dir-arrow vjoy-arrow-left">◀</div>
        <div className="vjoy-dir-arrow vjoy-arrow-right">▶</div>

        {/* Ring Luar Bersinar */}
        <div className="vjoy-ring-inner" />

        {/* Knob / Tuas Analog Tengah yang Mengikuti Sentuhan (Direct DOM Transform) */}
        <div
          ref={knobRef}
          className="vjoy-knob"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="vjoy-knob-core" />
        </div>
      </div>
    </div>
  );
}

export default memo(VirtualJoystick);
