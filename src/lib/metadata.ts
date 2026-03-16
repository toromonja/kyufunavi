import type { Metadata } from "next";

interface PageMeta {
  title?: string;
  description?: string;
}

export function createMetadata(page?: PageMeta): Metadata {
  const siteName = "給付ナビ";
  const defaultDescription =
    "国の補助金・助成金情報を一覧で検索。ものづくり補助金、IT導入補助金、持続化補助金など主要制度の概要・補助額・申請方法をわかりやすく解説します。";

  const title = page?.title
    ? `${page.title} | ${siteName}`
    : `${siteName} - 使える補助金・助成金を、もっと身近に。`;

  const description = page?.description ?? defaultDescription;

  return {
    title,
    description,
    metadataBase: new URL("https://kyufunavi.toromonja.com"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      siteName,
      images: [{ url: "/ogp.svg", width: 1200, height: 630 }],
      type: "website",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/ogp.svg"],
    },
  };
}
