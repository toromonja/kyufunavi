import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { guides } from "@/data/guides";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "申請ガイド",
  description:
    "補助金・助成金の申請に役立つガイド記事を掲載。基礎知識から採択率を上げる書き方、制度別の申請ガイドまで。",
});

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <BookOpen size={28} className="text-amber-500" />
          申請ガイド
        </h1>
        <p className="text-slate-500">
          補助金・助成金の活用をサポートするガイド記事を掲載しています
        </p>
      </div>

      {/* Featured guide */}
      <div className="mb-10">
        <Link
          href={`/guide/${guides[0].slug}`}
          className="block bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 hover:from-slate-800 hover:to-slate-700 transition-all group"
        >
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
            入門ガイド
          </p>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
            {guides[0].title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{guides[0].description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                読了 {guides[0].readTime}分
              </span>
              <span>{guides[0].updatedAt ?? guides[0].publishedAt} 更新</span>
            </div>
            <span className="flex items-center gap-1 text-amber-400 font-semibold text-sm group-hover:gap-2 transition-all">
              読む
              <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </div>

      {/* Guide list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.slice(1).map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-5 group transition-all hover:shadow-sm flex flex-col gap-3"
          >
            <div className="flex flex-wrap gap-1">
              {guide.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-bold text-slate-900 group-hover:text-amber-700 leading-snug transition-colors">
              {guide.title}
            </h2>
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
              {guide.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                読了 {guide.readTime}分
              </span>
              <span>{guide.updatedAt ?? guide.publishedAt} 更新</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
