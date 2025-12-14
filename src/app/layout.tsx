import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://convertflow.com'),
  title: {
    default: "ConvertFlow - Free Online PDF, Image, Video & Audio Converter Tools",
    template: "%s | ConvertFlow"
  },
  description: "Convert, compress, merge PDFs, images, videos and audio files for free. No signup, no upload - everything runs in your browser. 100% private and secure. 30+ free tools.",
  keywords: [
    "PDF converter", "merge PDF online free", "compress PDF", "split PDF", 
    "PDF to JPG", "JPG to PDF", "image converter", "video converter",
    "audio converter", "compress video", "compress image", "resize image",
    "QR code generator", "YouTube thumbnail downloader", "favicon generator",
    "free online tools", "file converter", "document converter"
  ],
  authors: [{ name: "Ricks Limited", url: "https://convertflow.com" }],
  creator: "ConvertFlow by Ricks Limited",
  publisher: "Ricks Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convertflow.com",
    siteName: "ConvertFlow",
    title: "ConvertFlow - Free Online PDF, Image, Video & Audio Converter",
    description: "30+ free tools to convert, compress, merge PDFs, images, videos and audio. No signup required. 100% private - files never leave your device.",
    images: [{ 
      url: "/og-image.png", 
      width: 1200, 
      height: 630, 
      alt: "ConvertFlow - Free PDF, Image, Video & Audio Tools" 
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvertFlow - Free Online Converter Tools",
    description: "30+ free tools to convert PDFs, images, videos and audio. No signup required.",
    images: ["/og-image.png"],
    creator: "@convertflow",
  },
  verification: {
    google: "google18702c24803ee8f3",
  },
  alternates: {
    canonical: "https://convertflow.com",
  },
  category: "technology",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://convertflow.com/#website",
      "url": "https://convertflow.com",
      "name": "ConvertFlow",
      "description": "Free online tools to convert, compress, and edit PDFs, images, videos, and audio files",
      "publisher": {
        "@id": "https://convertflow.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://convertflow.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://convertflow.com/#organization",
      "name": "ConvertFlow",
      "url": "https://convertflow.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://convertflow.com/logo.png"
      },
      "sameAs": []
    },
    {
      "@type": "SoftwareApplication",
      "name": "ConvertFlow",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6471791415788302"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
