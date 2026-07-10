import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/storage";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ploy's Flashcards",
  description: "A personal English vocabulary flashcard app.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#e8815a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <DataProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
            {children}
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
