import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: {
    default: "ブログサイト",
    template: "%s | ブログサイト",
  },
  description:
    "落ち着いた雰囲気のブログサイトです。技術記事や日常の出来事など、様々な内容をお届けします。",
  keywords: ["ブログ", "技術", "プログラミング", "Web開発", "React", "Next.js"],
  authors: [{ name: "ブログサイト" }],
  creator: "ブログサイト",
  publisher: "ブログサイト",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "ブログサイト",
    description:
      "落ち着いた雰囲気のブログサイトです。技術記事や日常の出来事など、様々な内容をお届けします。",
  },
  twitter: {
    card: "summary_large_image",
    title: "ブログサイト",
    description:
      "落ち着いた雰囲気のブログサイトです。技術記事や日常の出来事など、様々な内容をお届けします。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full">
        <div className="min-h-full flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
