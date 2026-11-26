"use client";

import React, { useState, useEffect, useRef } from "react";
import { FastForward, ChevronLeft, ChevronRight } from "lucide-react";
import dialogData from "@/dialog.json";
import "./dialog-popup.css";

export interface DialogItem {
  id: number;
  text: string;
  character?: string;
  characterSide?: "left" | "right";
  characterHalfBody?: boolean;
  bgTexture?: string;
  speakerName?: string;
  rewardItem?: {
    image: string;
    name: string;
    position?: "top" | "bottom";
  };
  foodItem?: {
    image: string;
    name: string;
    tag?: string;
  };
  customAction?: {
    buttonText: string;
    onAction?: () => void;
  };
  systemCommand?: {
    type: "avatar_select" | string;
    avatars: string[];
  };
}

export type DialogPageKey = keyof typeof dialogData;

interface DialogPopupProps {
  pageKey?: DialogPageKey;
  dialogs?: DialogItem[];
  onComplete?: (selectedAvatar?: string) => void;
  isOpen?: boolean;
  initialDelayMs?: number;
  lastButtonText?: string;
  instantText?: boolean;
  focusBackdrop?: boolean;
  containerClassName?: string;
}

export default function DialogPopup({
  pageKey = "cemorosewu",
  dialogs,
  onComplete,
  isOpen = true,
  initialDelayMs = 3000,
  lastButtonText,
  instantText = false,
  focusBackdrop = false,
  containerClassName = "",
}: DialogPopupProps) {
  // Ambil dialogs dari props atau otomatis ambil berdasarkan pageKey dari dialog.json
  const activeDialogs: DialogItem[] =
    dialogs && dialogs.length > 0
      ? dialogs
      : ((dialogData[pageKey] as DialogItem[]) || []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleWordsCount, setVisibleWordsCount] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1.webp");
  const [delayRemaining, setDelayRemaining] = useState<number>(7.0);
  const [isWaitingDelay, setIsWaitingDelay] = useState<boolean>(false);
  const [isInitialDelayPassed, setIsInitialDelayPassed] = useState<boolean>(
    () => initialDelayMs <= 0
  );

  const currentItem = activeDialogs[currentIndex] || activeDialogs[0] || { id: 0, text: "" };
  const words = currentItem.text ? currentItem.text.split(" ") : [];
  const isLastParagraph = currentIndex === activeDialogs.length - 1;
  const isCustomActionPending = Boolean(currentItem.customAction);

  // Ref timers
  const wordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const delayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPageKeyRef = useRef<string>(pageKey);

  // Bersihkan semua timer
  const clearAllTimers = () => {
    if (wordTimerRef.current) clearInterval(wordTimerRef.current);
    if (delayIntervalRef.current) clearInterval(delayIntervalRef.current);
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    if (initialDelayTimeoutRef.current) clearTimeout(initialDelayTimeoutRef.current);
  };

  // Rule dialog.txt:
  // "berikan delay untuk menunjukkan pop up ini diawal selama 3 detik , karena saya mau diawal detik detik pertama user bisa menikmati background setiap halaman"
  useEffect(() => {
    if (!isOpen) {
      clearAllTimers();
      setIsInitialDelayPassed(initialDelayMs <= 0);
      setCurrentIndex(0);
      setVisibleWordsCount(0);
      return;
    }

    // Jika sudah lewat initial delay (sudah aktif), jangan reset saat parent re-render!
    if (isInitialDelayPassed) {
      return;
    }

    if (initialDelayMs <= 0) {
      setIsInitialDelayPassed(true);
      return;
    }

    initialDelayTimeoutRef.current = setTimeout(() => {
      setIsInitialDelayPassed(true);
    }, initialDelayMs);

    return () => {
      if (initialDelayTimeoutRef.current) clearTimeout(initialDelayTimeoutRef.current);
    };
  }, [isOpen, initialDelayMs, isInitialDelayPassed]);

  // Reset dialog jika pageKey berganti
  useEffect(() => {
    if (prevPageKeyRef.current !== pageKey) {
      prevPageKeyRef.current = pageKey;
      clearAllTimers();
      setCurrentIndex(0);
      setVisibleWordsCount(0);
      setIsInitialDelayPassed(initialDelayMs <= 0);
    }
  }, [pageKey, initialDelayMs]);

  // Efek animasi kata per kata (word-by-word, delay 0.10s) setelah initial delay 3 detik selesai
  useEffect(() => {
    if (!isOpen || !isInitialDelayPassed) return;

    clearAllTimers();

    if (instantText) {
      setVisibleWordsCount(words.length);
      setIsTyping(false);
      setIsWaitingDelay(false);
      return;
    }

    setVisibleWordsCount(0);
    setIsTyping(true);
    setIsWaitingDelay(false);
    setDelayRemaining(7.0);

    let wordIdx = 0;
    wordTimerRef.current = setInterval(() => {
      wordIdx += 1;
      setVisibleWordsCount(wordIdx);

      if (wordIdx >= words.length) {
        if (wordTimerRef.current) clearInterval(wordTimerRef.current);
        setIsTyping(false);

        // Jika ada system command, custom action (seperti "Butuh Tali"), atau ini paragraf terakhir, jangan auto-next / jangan auto-close
        if (
          currentItem.systemCommand ||
          currentItem.customAction ||
          currentIndex >= activeDialogs.length - 1
        ) {
          setIsWaitingDelay(false);
          return;
        }

        // Delay 7 detik sesuai dialog.txt rule:
        // "berikan delay setelah setiap paragraf berakhir itu 7 detik baru ke paragraf selanjutnya"
        setIsWaitingDelay(true);
        const startTime = Date.now();
        const duration = 7000;

        delayIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const left = Math.max(0, (duration - elapsed) / 1000);
          setDelayRemaining(Number(left.toFixed(1)));
        }, 100);

        autoNextTimeoutRef.current = setTimeout(() => {
          if (delayIntervalRef.current) clearInterval(delayIntervalRef.current);
          setIsWaitingDelay(false);
          handleNext(false);
        }, duration);
      }
    }, 100); // Kecepatan 0.10 detik (100ms) per kata sesuai update dialog.txt

    return () => {
      clearAllTimers();
    };
  }, [currentIndex, isOpen, isInitialDelayPassed, currentItem.text, instantText, words.length, activeDialogs.length]);

  // Handler ke paragraf sebelumnya (Previous)
  const handlePrev = () => {
    if (currentIndex <= 0) return;
    clearAllTimers();
    setCurrentIndex((prev) => prev - 1);
  };

  // Handler ke paragraf selanjutnya (Next)
  const handleNext = (manual = true) => {
    // Jika tombol pilihan kustom (misal: "Butuh Tali") wajib ditekan terlebih dahulu, blokir tombol skip/next manual
    if (manual && isCustomActionPending) {
      return;
    }

    clearAllTimers();

    // Jika user mengklik manual saat teks masih mengetik, tampilkan seluruh kata langsung
    if (manual && isTyping) {
      setVisibleWordsCount(words.length);
      setIsTyping(false);
      return;
    }

    if (currentIndex < activeDialogs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Selesai semua dialog (hanya terjadi jika diklik manual pada paragraf akhir)
      if (selectedAvatar) {
        try {
          sessionStorage.setItem("aksara_lawu_selected_avatar", selectedAvatar);
          localStorage.setItem("aksara_lawu_selected_avatar", selectedAvatar);
        } catch {
          // ignore
        }
      }
      if (onComplete) {
        onComplete(selectedAvatar);
      }
    }
  };

  // Handler lewati langsung teks yang sedang beranimasi
  const handleSkipTyping = () => {
    clearAllTimers();
    setVisibleWordsCount(words.length);
    setIsTyping(false);
    setIsWaitingDelay(false);
  };

  if (!isOpen || !isInitialDelayPassed) return null;

  // Resolusi character image path (mendukung .webp, .png, atau path kustom)
  let charSrc = "/character/guider_pose1.png";
  if (currentItem.character) {
    if (currentItem.character.startsWith("/")) {
      charSrc = currentItem.character;
    } else if (
      currentItem.character.endsWith(".webp") ||
      currentItem.character.endsWith(".png")
    ) {
      charSrc = `/character/${currentItem.character}`;
    } else {
      charSrc = `/character/${currentItem.character}.png`;
    }
  }
  const charSide = currentItem.characterSide || "left";

  return (
    <div
      className={`dialog-popup-overlay ${
        focusBackdrop ? "dialog-popup-overlay-focused" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Dialog Pop Up Game"
    >
      <div className={`dialog-popup-container ${containerClassName}`.trim()}>
        {/* Frame Box Pop Up Dialog: Warna Solid Coklat Kayu & Border Tebal Konstan */}
        <section className="dialog-popup-frame">
          {/* Header Pop Up */}
          <header className="dialog-popup-header">
            <div className="dialog-popup-speaker-badge">
              <span className="dialog-popup-speaker-dot" />
              <span>{currentItem.speakerName || "Panuntun"}</span>
            </div>

            {/* Tombol Navigasi Previous & Next di Tengah Atas (dialog.txt rule: tombol previous dan next letaknya ditengah atas dan beri gap) */}
            <div className="dialog-popup-header-nav" aria-label="Navigasi Paragraf Dialog">
              <button
                type="button"
                id="btn-dialog-header-prev"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="dialog-nav-btn dialog-nav-btn-prev"
                title="Paragraf Sadurunge (Previous)"
                aria-label="Sadurunge"
              >
                <ChevronLeft className="dialog-nav-btn-icon" />
                <span>Sadurunge</span>
              </button>

              <button
                type="button"
                id="btn-dialog-header-next"
                onClick={() => !isCustomActionPending && handleNext(true)}
                disabled={currentIndex >= activeDialogs.length - 1 || isCustomActionPending}
                className={`dialog-nav-btn dialog-nav-btn-next ${
                  isCustomActionPending ? "dialog-nav-btn-disabled" : ""
                }`}
                title={
                  isCustomActionPending
                    ? "Pencet tombol pilihan ing dhuwur dhisik"
                    : "Paragraf Sabanjure (Next)"
                }
                aria-label="Sabanjure"
              >
                <span>Sabanjure</span>
                <ChevronRight className="dialog-nav-btn-icon" />
              </button>
            </div>

            {/* Sisi Kanan Header: Progress Loading Bar & Step Counter */}
            <div className="dialog-popup-header-right">
              {isWaitingDelay && (
                <div className="dialog-delay-indicator">
                  <div className="dialog-delay-bar-container">
                    <div
                      className="dialog-delay-bar-fill"
                      style={{
                        width: `${Math.max(0, (1 - delayRemaining / 7.0) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="dialog-delay-text">
                    {delayRemaining}s
                  </span>
                </div>
              )}
              <span className="dialog-popup-step-counter">
                {currentIndex + 1} / {activeDialogs.length}
              </span>
            </div>
          </header>

          {/* Konten Utama: Teks berdampingan dengan area padding karakter */}
          <div className={`dialog-popup-content-layout ${charSide === "right" ? "char-right" : ""}`}>
            {/* Spacer kolom karakter agar teks tidak tertutup karakter */}
            <div className="dialog-popup-char-col" aria-hidden="true" />

            {/* Isi Text Paragraf dengan Animasi Kata per Kata */}
            <div className="dialog-popup-body">
              {/* Render Reward Item di atas teks dialog jika position === "top" */}
              {!currentItem.foodItem &&
                currentItem.rewardItem &&
                currentItem.rewardItem.position === "top" &&
                (!isTyping || instantText) && (
                  <div className="dialog-reward-box dialog-reward-box-top">
                    <img
                      src={currentItem.rewardItem.image}
                      alt={currentItem.rewardItem.name}
                      className="dialog-reward-badge-img"
                      draggable={false}
                    />
                    <span className="dialog-reward-badge-title">
                      {currentItem.rewardItem.name}
                    </span>
                  </div>
                )}

              <p className="dialog-popup-paragraph" aria-live="polite">
                {words.map((word, idx) => {
                  const isVisible = idx < visibleWordsCount;
                  return (
                    <span
                      key={`${currentIndex}-${idx}-${word}`}
                      className={`dialog-word ${
                        isVisible
                          ? instantText
                            ? "dialog-word-instant"
                            : "dialog-word-visible"
                          : "dialog-word-hidden"
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>

              {/* Perintah Sistem: Pemilihan Avatar jika ada */}
              {currentItem.systemCommand?.type === "avatar_select" && !isTyping && (
                <div className="dialog-system-command-box">
                  <p className="dialog-avatar-prompt-text">
                    Pilih Avatar Petualang Panjenengan:
                  </p>
                  <div className="dialog-avatar-grid">
                    {currentItem.systemCommand.avatars.map((avatarFile, idx) => {
                      const isSelected = selectedAvatar === avatarFile;
                      return (
                        <button
                          key={avatarFile}
                          type="button"
                          id={`btn-avatar-${idx + 1}`}
                          className={`dialog-avatar-card ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedAvatar(avatarFile);
                            try {
                              sessionStorage.setItem("aksara_lawu_selected_avatar", avatarFile);
                              localStorage.setItem("aksara_lawu_selected_avatar", avatarFile);
                            } catch {
                              // ignore
                            }
                          }}
                          aria-label={`Pilih Avatar ${idx + 1}`}
                        >
                          {isSelected && <span className="dialog-avatar-check">✓</span>}
                          <img
                            src={`/avatar/${avatarFile}`}
                            alt={`Avatar ${idx + 1}`}
                            className="dialog-avatar-img"
                            draggable={false}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Render Tombol Aksi Kustom jika ada (misal: "Butuh Tali" dari Rinda) */}
              {currentItem.customAction && (!isTyping || instantText) && (
                <div className="dialog-custom-action-wrap">
                  <button
                    type="button"
                    className="dialog-custom-action-btn"
                    onClick={() => {
                      if (currentItem.customAction?.onAction) {
                        currentItem.customAction.onAction();
                      }
                      handleNext(false);
                    }}
                  >
                    {currentItem.customAction.buttonText}
                  </button>
                </div>
              )}

              {/* Render Food Showcase Item (Misal Makanan Khas Magetan di Warung Ngaso) */}
              {currentItem.foodItem && (!isTyping || instantText) && (
                <div className="dialog-food-showcase-box">
                  <div className="dialog-food-showcase-img-wrap">
                    <img
                      src={currentItem.foodItem.image}
                      alt={currentItem.foodItem.name}
                      className="dialog-food-showcase-img"
                      draggable={false}
                    />
                  </div>
                  <div className="dialog-food-showcase-info">
                    <span className="dialog-food-showcase-badge">
                      {currentItem.foodItem.tag || "Panganan Khas Magetan"}
                    </span>
                    <span className="dialog-food-showcase-name">
                      {currentItem.foodItem.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Render Badge Reward jika dialog menghadiahkan item (misal: badge1.webp / tali.webp) */}
              {!currentItem.foodItem &&
                currentItem.rewardItem &&
                currentItem.rewardItem.position !== "top" &&
                (!isTyping || instantText) && (
                <div className="dialog-reward-box">
                  <img
                    src={currentItem.rewardItem.image}
                    alt={currentItem.rewardItem.name}
                    className="dialog-reward-badge-img"
                    draggable={false}
                  />
                  <span className="dialog-reward-badge-title">
                    {currentItem.rewardItem.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gambar Karakter menempel pas di bibir bawah frame dialog */}
          <div
            className={`dialog-popup-char-anchor ${charSide === "right" ? "anchor-right" : "anchor-left"} ${
              currentItem.systemCommand ? "has-system-command" : ""
            } ${currentItem.characterHalfBody ? "is-half-body" : ""}`}
          >
            <img
              src={charSrc}
              alt="Karakter Panuntun"
              className="dialog-popup-char-in-frame"
              draggable={false}
            />
          </div>

          {/* Footer: Tombol Aksi di Tengah */}
          <footer className="dialog-popup-footer">
            <div className="dialog-action-buttons">
              {isTyping && (
                <button
                  type="button"
                  id="btn-dialog-skip-typing"
                  onClick={handleSkipTyping}
                  className="dialog-btn-action dialog-btn-skip"
                  title="Tampilake kabeh teks langsung"
                >
                  <span>Cepetake</span>
                  <FastForward className="dialog-btn-skip-icon" />
                </button>
              )}

              <button
                type="button"
                id="btn-dialog-next-action"
                onClick={() => !isCustomActionPending && handleNext(true)}
                disabled={isCustomActionPending}
                className={`dialog-btn-action dialog-btn-next ${
                  isCustomActionPending ? "dialog-btn-disabled" : ""
                }`}
                title={
                  isCustomActionPending
                    ? "Pencet tombol pilihan ing dhuwur dhisik"
                    : undefined
                }
              >
                {isLastParagraph ? (lastButtonText || "Miwiti Petualangan ➔") : "Sabanjure ➔"}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
