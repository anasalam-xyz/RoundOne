import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import ConditionalShell from "@/components/blocks/ConditionalShell";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "RoundOne — AI Mock Interview",
  description: "Practice interviews with AI. Get scored, get better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConditionalShell>
        {children}
        </ConditionalShell>
      </body>
    </html>
  );
}
