import type { Metadata } from "next";
import { Alata } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { SmoothScrollProvider } from "@/modules/_common/smooth-scroll";

const alata = Alata({
  variable: "--font-alata",
  subsets: ["latin"],
  weight: "400",
});

const description =
  "I'm Attila Tolnai, I’m a 3D artist focused on transforming ideas into fully realized 3D creations through Blender.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | 3D Artist`, template: `%s | ${SITE_NAME}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} | 3D Artist`,
    description,
    images: ["/hero-background.png"],
  },
  twitter: { card: "summary_large_image" },
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
