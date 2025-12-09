import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConvertFlow - Free Online PDF & Image Converter Tools",
  description: "Convert, compress, merge, split PDFs and images for free. No signup, no upload - everything runs in your browser. 100% private and secure.",
  keywords: "PDF converter, merge PDF online free, compress PDF, split PDF, PDF to JPG, JPG to PDF, image converter, JPG to PNG, PNG to JPG, WebP converter, resize image online, compress image, crop image, rotate PDF, watermark PDF, add page numbers PDF, free PDF tools, online PDF editor",
  authors: [{ name: "Ricks Limited" }],
  creator: "ConvertFlow by Ricks Limited",
  publisher: "Ricks Limited",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convertflow.com",
    siteName: "ConvertFlow",
    title: "ConvertFlow - Free Online PDF & Image Converter",
    description: "Convert, compress, merge PDFs and images for free. No signup required. 100% private - files never leave your device.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ConvertFlow - Free PDF & Image Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvertFlow - Free Online PDF & Image Converter",
    description: "Convert, compress, merge PDFs and images for free. No signup required.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://convertflow.com" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
