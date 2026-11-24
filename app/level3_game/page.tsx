"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DialogPopup, { DialogItem } from "../components/DialogPopup/DialogPopup";
import "./level3-game.css";

// 9 Slide Dialog Penjaga Warung Ngaso (Basa Jawa Ngoko)
// Ngenalake 6 panganan khas Magetan siji-siji kanthi gambar lan jeneng
const WARUNG_DIALOGS: DialogItem[] = [
  {
    id: 1,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Sugeng rawuh ing Warung Ngaso, papan kanggo ngaso lan lerem para pendaki Gunung Lawu!",
  },
  {
    id: 2,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Kene nyediakake maneka warna panganan khas Magetan sing enak lan mantep kanggo mulihake tenaga.",
  },
  {
    id: 3,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Iki ana Ayam Panggang Gandu, olahan ayam panggang kanthi bumbu gurih lan pedhes sing ngresep tekan jero.",
    foodItem: {
      image: "/warungngaso/makanan/ayampangangganggandu.webp",
      name: "Ayam Panggang Gandu",
      tag: "Panganan Khas Magetan",
    },
    rewardItem: {
      image: "/warungngaso/makanan/ayampangangganggandu.webp",
      name: "Ayam Panggang Gandu",
    },
  },
  {
    id: 4,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Sing iki Bolu Magetan, bolu empuk kanthi rasa legi sing pas banget kanggo nyamikan nalika ngaso.",
    foodItem: {
      image: "/warungngaso/makanan/bolumagetan.webp",
      name: "Bolu Magetan",
      tag: "Panganan Khas Magetan",
    },
    rewardItem: {
      image: "/warungngaso/makanan/bolumagetan.webp",
      name: "Bolu Magetan",
    },
  },
  {
    id: 5,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Iki jenenge Jenang Candi, jenang legi kenyal lan legit warisan kuliner asli saka Desa Candi Magetan.",
    foodItem: {
      image: "/warungngaso/makanan/jenangcandi.webp",
      name: "Jenang Candi",
      tag: "Panganan Khas Magetan",
    },
    rewardItem: {
      image: "/warungngaso/makanan/jenangcandi.webp",
      name: "Jenang Candi",
    },
  },
  {
    id: 6,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Banjur iki Kerupuk Lempeng, krupuk puli saka beras sing renyah lan gurih, tansah dadi kanca mangan.",
    foodItem: {
      image: "/warungngaso/makanan/kerupuklempeng.webp",
      name: "Kerupuk Lempeng",
      tag: "Panganan Khas Magetan",
    },
    rewardItem: {
      image: "/warungngaso/makanan/kerupuklempeng.webp",
      name: "Kerupuk Lempeng",
    },
  },
  {
    id: 7,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Iki ana Sego Rogoh, sega bungkus khas Magetan kanthi lawuh komplit sing maregi kanggo ngisi tenaga.",
    foodItem: {
      image: "/warungngaso/makanan/segorogoh.webp",
      name: "Sego Rogoh",
      tag: "Panganan Khas Magetan",
    },
    rewardItem: {
      image: "/warungngaso/makanan/segorogoh.webp",
      name: "Sego Rogoh",
    },
  },
  {
    id: 8,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Lan iki Tepo Tahu, kupat tepo empuk kanthi tahu goreng, endhog, lan duduh kecap pedhes gurih sing seger tenan.",
    foodItem: {
      image: "/warungngaso/makanan/tepotahu.webp",
      name: "Tepo Tahu",
      tag: "Panganan Khas Magetan",
    },
    rewardItem: {
      image: "/warungngaso/makanan/tepotahu.webp",
      name: "Tepo Tahu",
    },
  },
  {
    id: 9,
    speakerName: "Penjaga Warung",
    character: "/warungngaso/penjagawarung.webp",
    text: "Ayo, jupuk panganan sing kok karepake trep karo kertas pesenan, jupuk panganane banjur delehna menyang nampan!",
    customAction: {
      buttonText: "Ambil Makanan",
      onAction: () => {},
    },
  },
];

export default function Level3GamePage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  // Aksi menuju ke halaman pemesanan makanan (/pesanmakanan)
  const handleGoToPesanMakanan = () => {
    setIsDialogOpen(false);
    router.push("/pesanmakanan");
  };

  // Memoize dialogs dan pasang handler redirect untuk tombol aksi custom pada slide terakhir
  const dialogList: DialogItem[] = useMemo(() => {
    return WARUNG_DIALOGS.map((item) => {
      if (item.id === 9 && item.customAction) {
        return {
          ...item,
          customAction: {
            ...item.customAction,
            onAction: handleGoToPesanMakanan,
          },
        };
      }
      return item;
    });
  }, []);

  return (
    <main
      className="l3g-root"
      aria-label="Halaman Level 3 - Pos 3: Warung Ngaso"
    >
      <div className="l3g-viewport">
        {/* Efek pencahayaan hangat khas warung */}
        <div className="l3g-ambient-glow" />

        {/* Badge Info Warung Ngaso di Kiri Atas */}
        <header className="l3g-top-info-banner" aria-label="Label Lokasi">
          <span className="l3g-top-info-dot" />
          <span className="l3g-top-info-title">POS 3: WARUNG NGASO</span>
        </header>

        {/* Komponen Dialog Karakter Penjaga Warung (Delay 1.5 detik) */}
        {isDialogOpen && (
          <DialogPopup
            key="warung-ngaso-dialog-popup"
            isOpen={isDialogOpen}
            dialogs={dialogList}
            initialDelayMs={1500}
            instantText={false}
            focusBackdrop={true}
            lastButtonText="Ambil Makanan ➔"
            onComplete={handleGoToPesanMakanan}
          />
        )}
      </div>
    </main>
  );
}
