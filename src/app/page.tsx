import Link from "next/link";
import {
  Search,
  ArrowRight,
  CheckCircle,
  ClipboardList,
  Calculator,
  CalendarDays,
  BookOpen,
  Zap,
} from "lucide-react";
import { subsidies, categories } from "@/data/subsidies";
import { createMetadata } from "@/lib/metadata";
import JGrantsLive from "@/components/JGrantsLive";

export const metadata = createMetadata();

const categoryIcons: Record<string, string> = {
  equipment: "⚙️",
  digital: "💻",
  sales: "📈",
  restructure: "🔄",
  employment: "👥",
  environment: "🌿",
  startup: "🚀",
  research: "🔬",
  finance: "💴",
  succession: "🏢",
};

const statusBadge = {
  open: { label: "受付中", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  upcoming: {
    label: "近日公募予定",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  closed: { label: "締切済み", className: "bg-stone-100 text-stone-400 border border-stone-200" },
};

export default function HomePage() {
  const featuredSubsidies = subsidies.filter((s) => s.status !== "closed").slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full bg-orange-200/20 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[180px] h-[180px] rounded-full bg-amber-100/40 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full mb-5 border border-amber-200">
              補助金・助成金ナビゲーター
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-stone-800">
              使える補助金・助成金を、
              <br />
              <span className="text-amber-500">もっと身近に。</span>
            </h1>
            <p className="text-stone-600 text-lg md:text-xl leading-relaxed mb-10">
              国・自治体の補助金・助成金を一覧で検索。
              <br className="hidden sm:block" />
              あなたの事業に合った制度を、わかりやすく解説します。
            </p>

            {/* Search Bar */}
            <form action="/subsidy" method="GET" className="flex gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  name="q"
                  placeholder="制度名・キーワードで検索..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-sm border border-amber-100"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap text-sm shadow-sm"
              >
                検索
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mt-5">
              {["ものづくり補助金", "IT導入", "持続化補助金", "雇用", "省エネ"].map((kw) => (
                <Link
                  key={kw}
                  href={`/subsidy?q=${encodeURIComponent(kw)}`}
                  className="text-xs bg-white/70 hover:bg-white text-stone-600 hover:text-amber-700 px-3 py-1.5 rounded-full transition-colors border border-amber-100 hover:border-amber-300 backdrop-blur-sm"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="text-center">
              <span className="font-bold text-2xl">15+</span>
              <span className="text-sm ml-1 text-amber-100">掲載制度数</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl">10</span>
              <span className="text-sm ml-1 text-amber-100">カテゴリ</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl">最大7,000万円</span>
              <span className="text-sm ml-1 text-amber-100">の補助実績</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl">随時更新</span>
              <span className="text-sm ml-1 text-amber-100">最新情報</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">カテゴリから探す</h2>
          <p className="text-stone-500">目的・業種に合わせて絞り込めます</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/subsidy?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all group text-center"
            >
              <span className="text-2xl">{categoryIcons[cat.slug] ?? "📌"}</span>
              <span className="text-xs font-medium text-stone-600 group-hover:text-amber-700 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Subsidies */}
      <section className="bg-amber-50/60 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">注目の制度</h2>
              <p className="text-stone-500">現在受付中・公募予定の主要制度</p>
            </div>
            <Link
              href="/subsidy"
              className="hidden sm:flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold text-sm"
            >
              すべて見る
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSubsidies.map((s) => {
              const badge = statusBadge[s.status];
              return (
                <Link
                  key={s.slug}
                  href={`/subsidy/${s.slug}`}
                  className="bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all p-5 flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-xs text-stone-400 text-right leading-tight">
                      {s.ministryName}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 leading-snug group-hover:text-amber-700 transition-colors">
                      {s.nameShort ?? s.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">{s.category}</p>
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">{s.overview}</p>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
                    <span className="text-amber-600 font-bold text-lg">
                      最大{s.maxAmount.toLocaleString()}万円
                    </span>
                    <span className="text-xs text-stone-400">補助率 {s.subsidyRate}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/subsidy"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              すべての制度を見る
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* JグランツAPIリアルタイムデータ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
                Jグランツ リアルタイム情報
              </h2>
              <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full font-semibold">
                <Zap size={11} />
                LIVE
              </span>
            </div>
            <p className="text-stone-500">
              デジタル庁Jグランツから取得した受付中の最新補助金情報
            </p>
          </div>
          <Link
            href="/subsidy"
            className="hidden sm:flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold text-sm"
          >
            Jグランツで検索
            <ArrowRight size={14} />
          </Link>
        </div>
        <JGrantsLive />
      </section>

      {/* Tools section */}
      <section className="bg-orange-50/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">便利なツール</h2>
            <p className="text-stone-500">あなたに最適な制度を見つけましょう</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                href: "/diagnose",
                icon: <ClipboardList size={28} className="text-amber-500" />,
                iconBg: "bg-amber-50",
                title: "診断ツール",
                desc: "事業者区分・目的・業種を選ぶだけで、あなたに合った補助金・助成金を提案します。",
                cta: "診断を始める",
              },
              {
                href: "/simulate",
                icon: <Calculator size={28} className="text-orange-500" />,
                iconBg: "bg-orange-50",
                title: "補助額シミュレーター",
                desc: "事業費を入力するだけで、もらえる補助金の目安額を簡単に試算できます。",
                cta: "試算する",
              },
              {
                href: "/schedule",
                icon: <CalendarDays size={28} className="text-amber-500" />,
                iconBg: "bg-amber-50",
                title: "公募スケジュール",
                desc: "制度ごとの締切日・公募状況をひと目で確認。申請漏れを防ぎましょう。",
                cta: "スケジュールを確認",
              },
              {
                href: "/guide",
                icon: <BookOpen size={28} className="text-orange-500" />,
                iconBg: "bg-orange-50",
                title: "申請ガイド",
                desc: "補助金・助成金の基礎知識から採択率を上げる書き方まで、詳しく解説します。",
                cta: "ガイドを読む",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all p-6 flex flex-col gap-3 group"
              >
                <div className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center`}>
                  {tool.icon}
                </div>
                <h3 className="font-bold text-stone-800 group-hover:text-amber-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed flex-1">{tool.desc}</p>
                <span className="text-amber-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  {tool.cta}
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-stone-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">給付ナビが選ばれる理由</h2>
            <p className="text-stone-400">補助金・助成金活用をわかりやすくサポート</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "最新情報を随時更新",
                desc: "公募期間・補助額・要件の変更を反映。常に正確な情報を提供します。",
              },
              {
                title: "初心者にもわかりやすく",
                desc: "専門用語を避け、申請の流れや注意点を平易な言葉で解説します。",
              },
              {
                title: "国の公式情報に基づく",
                desc: "各省庁・中小企業庁の公式発表をもとにした信頼性の高い情報を掲載しています。",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <CheckCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
          まず診断ツールで確認してみましょう
        </h2>
        <p className="text-stone-500 mb-8 max-w-lg mx-auto">
          事業者区分・目的・業種を選ぶだけで、
          <br />
          あなたに合った補助金・助成金をご提案します。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/diagnose"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-sm"
          >
            無料で診断する
          </Link>
          <Link
            href="/subsidy"
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            全制度を一覧で見る
          </Link>
        </div>
      </section>
    </>
  );
}
