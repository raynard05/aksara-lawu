import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rubik_Mono_One, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FullscreenPrompt from "./components/FullscreenPrompt/FullscreenPrompt";
import OrientationGuard from "./components/OrientationGuard/OrientationGuard";
import SoundToggle from "./components/SoundToggle/SoundToggle";
import TopBar from "./components/TopBar/TopBar";

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

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Aksara Lawu — Game Petualangan",
  description: "Game sinau aksara lan budaya Jawa kanggo bocah sekolah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${rubikMonoOne.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrientationGuard />
        <FullscreenPrompt />
        <SoundToggle />
        <TopBar />
        {children}
      </body>
    </html>
  );
}
