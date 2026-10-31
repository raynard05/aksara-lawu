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

// Daun berjatuhan khusus di panel kiri (area langit dan tugu Lawu: 0vw s/d 52vw) untuk login/register
const LEFT_PANEL_LEAVES: LeafConfig[] = [
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

// Daun berjatuhan khusus di tengah atas (area papan menu & game menus: 20vw s/d 80vw)
const CENTER_LEAVES: LeafConfig[] = [
  {
    id: 101,
    src: LEAF_ASSETS[0],
    leftVw: 24,
    widthVw: 2.7,
    durationSec: 8.8,
    delaySec: 0,
    swayDistanceVw: 3.2,
    startRotateDeg: -25,
    endRotateDeg: 170,
    opacity: 0.9,
  },
  {
    id: 102,
    src: LEAF_ASSETS[1],
    leftVw: 33,
    widthVw: 2.3,
    durationSec: 10.5,
    delaySec: 2.2,
    swayDistanceVw: 3.8,
    startRotateDeg: 20,
    endRotateDeg: -180,
    opacity: 0.86,
  },
  {
    id: 103,
    src: LEAF_ASSETS[2],
    leftVw: 42,
    widthVw: 3.2,
    durationSec: 9.2,
    delaySec: 4.5,
    swayDistanceVw: 3.5,
    startRotateDeg: -30,
    endRotateDeg: 200,
    opacity: 0.95,
  },
  {
    id: 104,
    src: LEAF_ASSETS[3],
    leftVw: 51,
    widthVw: 2.5,
    durationSec: 11.2,
    delaySec: 1.5,
    swayDistanceVw: 4.2,
    startRotateDeg: 35,
    endRotateDeg: -165,
    opacity: 0.88,
  },
  {
    id: 105,
    src: LEAF_ASSETS[4],
    leftVw: 60,
    widthVw: 2.9,
    durationSec: 9.6,
    delaySec: 5.8,
    swayDistanceVw: 3.4,
    startRotateDeg: -15,
    endRotateDeg: 185,
    opacity: 0.9,
  },
  {
    id: 106,
    src: LEAF_ASSETS[5],
    leftVw: 69,
    widthVw: 2.4,
    durationSec: 10.8,
    delaySec: 3.2,
    swayDistanceVw: 3.6,
    startRotateDeg: 25,
    endRotateDeg: -210,
    opacity: 0.92,
  },
  {
    id: 107,
    src: LEAF_ASSETS[6],
    leftVw: 76,
    widthVw: 2.8,
    durationSec: 11.8,
    delaySec: 6.8,
    swayDistanceVw: 3.9,
    startRotateDeg: -40,
    endRotateDeg: 165,
    opacity: 0.86,
  },
  {
    id: 108,
    src: LEAF_ASSETS[7],
    leftVw: 28,
    widthVw: 2.6,
    durationSec: 9.8,
    delaySec: 7.5,
    swayDistanceVw: 3.5,
    startRotateDeg: 30,
    endRotateDeg: -190,
    opacity: 0.88,
  },
  {
    id: 109,
    src: LEAF_ASSETS[2],
    leftVw: 47,
    widthVw: 3.0,
    durationSec: 10.2,
    delaySec: 8.8,
    swayDistanceVw: 4.0,
    startRotateDeg: -20,
    endRotateDeg: 160,
    opacity: 0.9,
  },
  {
    id: 110,
    src: LEAF_ASSETS[0],
    leftVw: 64,
    widthVw: 2.5,
    durationSec: 11.5,
    delaySec: 9.5,
    swayDistanceVw: 3.3,
    startRotateDeg: 45,
    endRotateDeg: -175,
    opacity: 0.87,
  },
];

// Daun berjatuhan khusus di panel kanan (50vw s/d 95vw)
const RIGHT_PANEL_LEAVES: LeafConfig[] = [
  {
    id: 201,
    src: LEAF_ASSETS[0],
    leftVw: 55,
    widthVw: 2.8,
    durationSec: 8.7,
    delaySec: 0.5,
    swayDistanceVw: 3.5,
    startRotateDeg: -20,
    endRotateDeg: 165,
    opacity: 0.9,
  },
  {
    id: 202,
    src: LEAF_ASSETS[1],
    leftVw: 64,
    widthVw: 2.3,
    durationSec: 10.4,
    delaySec: 2.8,
    swayDistanceVw: 4.0,
    startRotateDeg: 15,
    endRotateDeg: -185,
    opacity: 0.85,
  },
  {
    id: 203,
    src: LEAF_ASSETS[2],
    leftVw: 73,
    widthVw: 3.1,
    durationSec: 9.3,
    delaySec: 4.2,
    swayDistanceVw: 3.6,
    startRotateDeg: -35,
    endRotateDeg: 205,
    opacity: 0.95,
  },
  {
    id: 204,
    src: LEAF_ASSETS[3],
    leftVw: 82,
    widthVw: 2.6,
    durationSec: 11.2,
    delaySec: 1.8,
    swayDistanceVw: 4.2,
    startRotateDeg: 38,
    endRotateDeg: -170,
    opacity: 0.88,
  },
  {
    id: 205,
    src: LEAF_ASSETS[4],
    leftVw: 90,
    widthVw: 2.4,
    durationSec: 9.7,
    delaySec: 6.2,
    swayDistanceVw: 3.2,
    startRotateDeg: -15,
    endRotateDeg: 175,
    opacity: 0.9,
  },
  {
    id: 206,
    src: LEAF_ASSETS[5],
    leftVw: 58,
    widthVw: 3.0,
    durationSec: 11.8,
    delaySec: 3.4,
    swayDistanceVw: 3.9,
    startRotateDeg: 22,
    endRotateDeg: -215,
    opacity: 0.92,
  },
  {
    id: 207,
    src: LEAF_ASSETS[6],
    leftVw: 77,
    widthVw: 2.5,
    durationSec: 10.6,
    delaySec: 5.2,
    swayDistanceVw: 3.7,
    startRotateDeg: -40,
    endRotateDeg: 170,
    opacity: 0.86,
  },
  {
    id: 208,
    src: LEAF_ASSETS[7],
    leftVw: 86,
    widthVw: 2.9,
    durationSec: 9.5,
    delaySec: 7.0,
    swayDistanceVw: 4.0,
    startRotateDeg: 32,
    endRotateDeg: -190,
    opacity: 0.9,
  },
  {
    id: 209,
    src: LEAF_ASSETS[2],
    leftVw: 68,
    widthVw: 2.3,
    durationSec: 10.9,
    delaySec: 8.3,
    swayDistanceVw: 3.3,
    startRotateDeg: -12,
    endRotateDeg: 155,
    opacity: 0.82,
  },
  {
    id: 210,
    src: LEAF_ASSETS[0],
    leftVw: 93,
    widthVw: 2.7,
    durationSec: 10.1,
    delaySec: 9.2,
    swayDistanceVw: 3.5,
    startRotateDeg: 45,
    endRotateDeg: -175,
    opacity: 0.89,
  },
];

interface FallenLeavesProps {
  className?: string;
  variant?: "left" | "center" | "right" | "all";
  countLimit?: number;
}

export default function FallenLeaves({
  className = "",
  variant = "left",
  countLimit,
}: FallenLeavesProps) {
  let leaves: LeafConfig[];
  let variantClass: string;

  if (variant === "center") {
    leaves = CENTER_LEAVES;
    variantClass = "fallen-leaves-center";
  } else if (variant === "right") {
    leaves = RIGHT_PANEL_LEAVES;
    variantClass = "fallen-leaves-right";
  } else if (variant === "all") {
    leaves = [...LEFT_PANEL_LEAVES, ...RIGHT_PANEL_LEAVES];
    variantClass = "fallen-leaves-all";
  } else {
    leaves = LEFT_PANEL_LEAVES;
    variantClass = "fallen-leaves-left";
  }

  if (typeof countLimit === "number" && countLimit > 0) {
    leaves = leaves.slice(0, countLimit);
  }

  return (
    <div
      className={`fallen-leaves-container ${variantClass} ${className}`.trim()}
      aria-hidden="true"
    >
      {leaves.map((leaf) => (
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
