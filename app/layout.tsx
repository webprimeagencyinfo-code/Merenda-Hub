import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Merenda Hub | Premium Delivery",
  description: "L'hub per le tue merende.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      {/* Stile Total Black e Font */}
      <body className={`${inter.className} bg-black text-white min-h-screen selection:bg-yellow-500 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
