import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSB Prep — Timed Practice",
  description:
    "Timed practice for the SSB Psychology round: TAT, WAT, SRT, and Lecturette.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ink">
        {children}
      </body>
    </html>
  );
}
