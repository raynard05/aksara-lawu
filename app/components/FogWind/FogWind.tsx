"use client";

import React from "react";
import "./fog-wind.css";

interface FogWindProps {
  className?: string;
  opacity?: number;
}

export default function FogWind({ className = "", opacity = 1 }: FogWindProps) {
  return (
    <aside
      className={`fog-wind-container ${className}`.trim()}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Layer Ambient Kabut Tebal Halus */}
      <div className="fog-wind-layer fog-wind-layer-1" />
      <div className="fog-wind-layer fog-wind-layer-2" />
      <div className="fog-wind-layer fog-wind-layer-3" />
      <div className="fog-wind-layer fog-wind-layer-4" />

      {/* Layer Airflow / Hembusan Alur Garis Angin Dinamis (Streamlines) */}
      <div className="fog-wind-airflow fog-wind-stream-1">
        <svg
          className="fog-wind-stream-svg"
          viewBox="0 0 900 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 65 Q 220 30, 450 70 T 900 45"
            stroke="url(#fogWindGrad1)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M80 82 Q 300 45, 520 85 T 860 60"
            stroke="url(#fogWindGrad2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="fogWindGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="65%" stopColor="#e8f4fc" stopOpacity="0.75" />
              <stop offset="90%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fogWindGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#e8f4fc" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="fog-wind-airflow fog-wind-stream-2">
        <svg
          className="fog-wind-stream-svg"
          viewBox="0 0 950 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 75 Q 260 110, 500 55 T 950 80"
            stroke="url(#fogWindGrad3)"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M60 55 Q 290 85, 540 35 T 880 65"
            stroke="url(#fogWindGrad4)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="fogWindGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#dceeff" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fogWindGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="35%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#dceeff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="fog-wind-airflow fog-wind-stream-3">
        <svg
          className="fog-wind-stream-svg"
          viewBox="0 0 850 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 50 Q 210 25, 430 65 T 850 40"
            stroke="url(#fogWindGrad5)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="fogWindGrad5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#e3f2fd" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </aside>
  );
}
