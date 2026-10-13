import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { basePath } from "@/lib/assets";
import "./globals.css";

const proximaFaces = `
@font-face {
  font-family: "Proxima Nova";
  src: local("Proxima Nova"), local("ProximaNova-Regular"), url("${basePath}/fonts/proxima-nova-400.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Proxima Nova";
  src: local("Proxima Nova"), local("ProximaNova-Regular"), url("${basePath}/fonts/proxima-nova-400.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Proxima Nova";
  src: local("Proxima Nova Semibold"), local("ProximaNova-Semibold"), local("Proxima Nova Bold"), local("ProximaNova-Bold"), url("${basePath}/fonts/proxima-nova-700.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Proxima Nova";
  src: local("Proxima Nova Bold"), local("ProximaNova-Bold"), url("${basePath}/fonts/proxima-nova-700.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;

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
      <body className={`${proxima.variable} ${bradford.variable}`}>
        <style dangerouslySetInnerHTML={{ __html: proximaFaces }} />
        {children}
      </body>
    </html>
  );
}
