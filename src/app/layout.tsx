import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adiisingh.xyz"),
  title: "ADITYA RATHORE — The Developer Issue",
  description:
    "Full Stack Developer. Web3 Developer. DevOps Engineer. Cloud architecture, trustless protocols, and infrastructure that never asks for credit.",
  keywords: [
    "Aditya Rathore",
    "Full Stack Developer",
    "Web3 Developer",
    "DevOps Engineer",
    "AWS Certified Solutions Architect",
    "portfolio",
  ],
  authors: [{ name: "Aditya Rathore", url: "https://github.com/adirathoreudr" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ADITYA RATHORE — The Developer Issue",
    description:
      "Full Stack Developer. Web3 Developer. DevOps Engineer. An editorial portfolio, № 001.",
    type: "website",
    url: "https://adiisingh.xyz",
    siteName: "The Developer Issue",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@adirathoreudr",
    title: "ADITYA RATHORE — The Developer Issue",
    description:
      "Full Stack Developer. Web3 Developer. DevOps Engineer. An editorial portfolio, № 001.",
  },
};

export const viewport: Viewport = {
  themeColor: "#7a0e12",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
