import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rubik_Mono_One } from "next/font/google";
import "./globals.css";
import FullscreenPrompt from "./components/FullscreenPrompt/FullscreenPrompt";
import SoundToggle from "./components/SoundToggle/SoundToggle";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubikMonoOne = Rubik_Mono_One({
  variable: "--font-rubik-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Aksara Lawu — Game Petualangan",
  description: "Game sinau aksara lan budaya Jawa kanggo bocah sekolah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${rubikMonoOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FullscreenPrompt />
        <SoundToggle />
        {children}
      </body>
    </html>
  );
}
