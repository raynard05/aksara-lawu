import React from "react";
import "./fallen-leaves.css";

interface LeafConfig {
  id: number;
  src: string;
  leftVw: number;
  widthVw: number;
  durationSec: number;
  delaySec: number;
  swayDistanceVw: number;
  startRotateDeg: number;
  endRotateDeg: number;
  opacity: number;
}

const LEAF_ASSETS = [
  "/daun/Daun 02.png",
  "/daun/Daun 04.png",
  "/daun/Daun 07.png",
  "/daun/Daun 10.png",
  "/daun/Daun 11.png",
  "/daun/Daun 14.png",
  "/daun/Daun 17.png",
  "/daun/Daun 18.png",
];

// Daun berjatuhan khusus di panel kiri (area langit dan tugu Lawu: 0vw s/d 52vw)
const LEAVES: LeafConfig[] = [
  {
    id: 1,
    src: LEAF_ASSETS[0],
    leftVw: 5,
    widthVw: 2.8,
    durationSec: 8.5,
    delaySec: 0,
    swayDistanceVw: 3.5,
    startRotateDeg: -20,
    endRotateDeg: 160,
    opacity: 0.9,
  },
  {
    id: 2,
    src: LEAF_ASSETS[1],
    leftVw: 14,
    widthVw: 2.2,
    durationSec: 10.2,
    delaySec: 2.4,
    swayDistanceVw: 4.2,
    startRotateDeg: 15,
    endRotateDeg: -190,
    opacity: 0.85,
  },
  {
    id: 3,
    src: LEAF_ASSETS[2],
    leftVw: 22,
    widthVw: 3.2,
    durationSec: 9.0,
    delaySec: 4.8,
    swayDistanceVw: 3.8,
    startRotateDeg: -35,
    endRotateDeg: 210,
    opacity: 0.95,
  },
  {
    id: 4,
    src: LEAF_ASSETS[3],
    leftVw: 31,
    widthVw: 2.6,
    durationSec: 11.5,
    delaySec: 1.2,
    swayDistanceVw: 4.5,
    startRotateDeg: 40,
    endRotateDeg: -160,
    opacity: 0.88,
  },
  {
    id: 5,
    src: LEAF_ASSETS[4],
    leftVw: 8,
    widthVw: 2.4,
    durationSec: 9.8,
    delaySec: 6.0,
    swayDistanceVw: 3.2,
    startRotateDeg: -10,
    endRotateDeg: 180,
    opacity: 0.9,
  },
  {
    id: 6,
    src: LEAF_ASSETS[5],
    leftVw: 18,
    widthVw: 3.0,
    durationSec: 12.0,
    delaySec: 3.6,
    swayDistanceVw: 4.0,
    startRotateDeg: 25,
    endRotateDeg: -220,
    opacity: 0.92,
  },
  {
    id: 7,
    src: LEAF_ASSETS[6],
    leftVw: 38,
    widthVw: 2.5,
    durationSec: 10.8,
    delaySec: 5.5,
    swayDistanceVw: 3.6,
    startRotateDeg: -45,
    endRotateDeg: 175,
    opacity: 0.85,
  },
  {
    id: 8,
    src: LEAF_ASSETS[7],
    leftVw: 46,
    widthVw: 2.9,
    durationSec: 9.4,
    delaySec: 7.2,
    swayDistanceVw: 4.1,
    startRotateDeg: 30,
    endRotateDeg: -195,
    opacity: 0.9,
  },
  {
    id: 9,
    src: LEAF_ASSETS[2],
    leftVw: 11,
    widthVw: 2.3,
    durationSec: 11.0,
    delaySec: 8.5,
    swayDistanceVw: 3.4,
    startRotateDeg: -15,
    endRotateDeg: 150,
    opacity: 0.8,
  },
  {
    id: 10,
    src: LEAF_ASSETS[0],
    leftVw: 26,
    widthVw: 3.1,
    durationSec: 10.0,
    delaySec: 9.8,
    swayDistanceVw: 4.4,
    startRotateDeg: 50,
    endRotateDeg: -180,
    opacity: 0.92,
  },
];

interface FallenLeavesProps {
  className?: string;
}

export default function FallenLeaves({ className = "" }: FallenLeavesProps) {
  return (
    <div
      className={`fallen-leaves-container ${className}`.trim()}
      aria-hidden="true"
    >
      {LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          className="fallen-leaf-wrapper"
          style={
            {
              left: `${leaf.leftVw}vw`,
              animationDuration: `${leaf.durationSec}s`,
              animationDelay: `${leaf.delaySec}s`,
              "--sway-x": `${leaf.swayDistanceVw}vw`,
              "--start-deg": `${leaf.startRotateDeg}deg`,
              "--end-deg": `${leaf.endRotateDeg}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={leaf.src}
            alt=""
            className="fallen-leaf-image"
            style={{
              width: `${leaf.widthVw}vw`,
              opacity: leaf.opacity,
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
