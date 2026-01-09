import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeskShare",
  description: "DeskShare - Simple, free screen sharing",
  twitter: {
    card: "summary_large_image",
    title: "DeskShare",
    description: "DeskShare - Simple, free screen sharing",
    images: ["https://deskshare.qplus.cloud/banner.png"],
  },
  openGraph: {
    siteName: "DeskShare",
    description: "DeskShare - Simple, free screen sharing",
    title: "DeskShare - Simple, free screen sharing",
    url: "https://deskshare.qplus.cloud",
    images: ["https://deskshare.qplus.cloud/banner.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-muted`}
      >
        {children}
      </body>
    </html>
  );
}
