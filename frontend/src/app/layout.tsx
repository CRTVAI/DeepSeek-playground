// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deepseek.playground.crtvai.com"),
  title: "Deepseek Playground by CRTVAI - Advanced AI Chat Platform",
  description:
    "Experience the power of Deepseek AI with our interactive playground. Test, experiment, and chat with state-of-the-art language models. Built by CRTVAI, your trusted AI solutions partner.",
  keywords:
    "Deepseek, AI Playground, Language Models, CRTVAI, AI Chat, Machine Learning, AI Development Platform",
  authors: [{ name: "CRTVAI" }],
  creator: "CRTVAI",
  publisher: "CRTVAI",
  formatDetection: {
    email: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Deepseek Playground - Advanced AI Chat Platform | CRTVAI",
    description:
      "Interactive AI playground for testing and chatting with Deepseek language models. Built by CRTVAI.",
    url: "https://deepseek.playground.crtvai.com",
    siteName: "Deepseek Playground",
    images: [
      {
        url: "/metaimage.png",
        width: 1200,
        height: 630,
        alt: "Deepseek Playground Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepseek Playground - AI Chat Platform",
    description:
      "Experience the next generation of AI chat with Deepseek Playground",
    images: ["/metaimage.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // manifest: "/manifest.json",
  alternates: {
    canonical: "https://deepseek.playground.crtvai.com",
  },
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  // },
  category: "technology",
  verification: {
    // google: "your-google-site-verification", // Add your Google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
