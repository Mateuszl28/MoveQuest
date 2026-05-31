import type { Metadata, Viewport } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/lib/game-store";
import { AchievementToast } from "@/components/game/achievement-toast";
import { LevelUpModal } from "@/components/game/level-up-modal";
import { PerfectDayModal } from "@/components/game/perfect-day-modal";
import { PwaRegister } from "@/components/pwa-register";
import { NotificationManager } from "@/components/notification-manager";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://212.132.124.0:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "MoveQuest — Turn Real-Life Movement Into Epic Adventures",
  description:
    "Complete quests, earn XP, defeat bosses, and level up your real life. The RPG that rewards you for moving.",
  applicationName: "MoveQuest",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "MoveQuest", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    title: "MoveQuest — Turn Real-Life Movement Into Epic Adventures",
    description: "Complete quests, earn XP, defeat bosses, and level up your real life.",
    siteName: "MoveQuest",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoveQuest",
    description: "Turn real-life movement into epic adventures.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0915",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GameProvider>
          {children}
          <AchievementToast />
          <LevelUpModal />
          <PerfectDayModal />
          <PwaRegister />
          <NotificationManager />
        </GameProvider>
      </body>
    </html>
  );
}
