import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/modules/_common/smooth-scroll";

const alata = Alata({
  variable: "--font-alata",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Attila Tolnai",
  description:
    "I'm Attila Tolnai, I’m a 3D artist focused on transforming ideas into fully realized 3D creations through Blender.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${alata.variable} antialiased`}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
