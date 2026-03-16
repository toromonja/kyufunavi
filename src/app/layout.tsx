import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "給付ナビ - 使える補助金・助成金を、もっと身近に。",
  description:
    "国の補助金・助成金情報を一覧で検索。ものづくり補助金、IT導入補助金、持続化補助金など主要制度の概要・補助額・申請方法をわかりやすく解説します。",
  metadataBase: new URL("https://kyufunavi.toromonja.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "給付ナビ - 使える補助金・助成金を、もっと身近に。",
    description:
      "国の補助金・助成金情報を一覧で検索。ものづくり補助金、IT導入補助金、持続化補助金など主要制度の概要・補助額・申請方法をわかりやすく解説します。",
    siteName: "給付ナビ",
    images: [{ url: "/ogp.svg", width: 1200, height: 630 }],
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "給付ナビ - 使える補助金・助成金を、もっと身近に。",
    description:
      "国の補助金・助成金情報を一覧で検索。ものづくり補助金、IT導入補助金、持続化補助金など主要制度の概要・補助額・申請方法をわかりやすく解説します。",
    images: ["/ogp.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
