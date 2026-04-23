import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
