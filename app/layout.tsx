import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const proxima = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-proxima-fallback",
});

const bradford = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-bradford-fallback",
});

export const metadata: Metadata = {
  title: "Patient Room Whiteboard",
  description: "LG TV landscape and portrait whiteboard for the patient room, starting with device PIN registration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${proxima.variable} ${bradford.variable}`}>{children}</body>
    </html>
  );
}
