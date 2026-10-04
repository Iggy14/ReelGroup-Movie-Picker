import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Serif display face for movie titles / section headers ("The Passenger", "Up for Debate")
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

// Clean sans for UI text, metadata, buttons
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReelGroup",
  description: "Decide what to watch, together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
