"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { subsidies, categories, targetTypes } from "@/data/subsidies";
import { Suspense } from "react";
import type { JGrantsSubsidy } from "@/lib/jgrants";

const statusBadge = {
  open: { label: "受付中", className: "bg-emerald-100 text-emerald-700" },
  upcoming: { label: "近日公募予定", className: "bg-amber-100 text-amber-700" },
  closed: { label: "締切済み", className: "bg-slate-100 text-slate-500" },
};

function formatAmount(amount?: number): string {
  if (!amount) return "—";
  if (amount >= 10000) return `${(amount / 10000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

// ---- Jグランツ検索タブ ----
function JGrantsSearch() {
  const [keyword, setKeyword] = useState("中小企業");
  const [inputValue, setInputValue] = useState("中小企業");
  const [results, setResults] = useState<JGrantsSubsidy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function doSearch(kw: string) {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/jgrants/search?keyword=${encodeURIComponent(kw)}&acceptance=0&limit=20`
      );
      if (!res.ok) throw new Error("取得失敗");
      const data: JGrantsSubsidy[] = await res.json();
      setResults(data);
    } catch {
      setError("Jグランツ APIからのデータ取得に失敗しました。");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    doSearch("中小企業");
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setKeyword(inputValue);
    doSearch(inputValue);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="キーワードで検索（例：IT導入、省エネ、雇用）"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60"
        >
          検索
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
          <Loader2 size={20} className="animate-spin text-amber-500" />
          <span className="text-sm">Jグランツからデータを取得中...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 py-10 text-slate-500 text-sm">
          <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          「{keyword}」に一致する制度が見つかりませんでした。
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-slate-500 mb-5">
            <span className="font-semibold text-slate-900">{results.length}件</span> が見つかりました
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                    受付中
                  </span>
                  {s.ministry_name && (
                    <span className="text-xs text-slate-400 text-right leading-tight">
                      {s.ministry_name}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 leading-snug line-clamp-2">
                    {s.title}
                  </h2>
                </div>
                {s.use_purpose && (
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {s.use_purpose}
                  </p>
                )}
                <div className="mt-auto pt-3 border-t border-slate-100 space-y-1">
                  {s.subsidy_max_limit != null && (
                    <span className="text-amber-600 font-bold text-xl block">
                      最大{formatAmount(s.subsidy_max_limit)}
                    </span>
                  )}
                  {(s.acceptance_start_datetime || s.acceptance_end_datetime) && (
                    <p className="text-xs text-slate-400">
                      受付期間: {formatDate(s.acceptance_start_datetime)} 〜 {formatDate(s.acceptance_end_datetime)}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Link
                      href={`/subsidy/jgrants/${s.id}`}
                      className="flex-1 text-center text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      詳細を見る
                      <ArrowRight size={12} className="inline ml-1" />
                    </Link>
                    {s.url_1 && (
                      <a
                        href={s.url_1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors"
                      >
                        Jグランツ
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-6 text-right">
            Jグランツ（デジタル庁）のリアルタイムデータを表示しています
          </p>
        </>
      )}
    </div>
  );
}

// ---- 静的データ検索タブ ----
function StaticSearch() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [selectedTarget, setSelectedTarget] = useState(searchParams.get("target") ?? "");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filtered = useMemo(() => {
    return subsidies.filter((s) => {
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.ministryName.toLowerCase().includes(q);
      const matchCategory = !selectedCategory || s.categorySlug === selectedCategory;
      const matchTarget = !selectedTarget || s.targetSlugs.includes(selectedTarget);
      const matchStatus = !selectedStatus || s.status === selectedStatus;
      return matchQuery && matchCategory && matchTarget && matchStatus;
    });
  }, [query, selectedCategory, selectedTarget, selectedStatus]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedTarget("");
    setSelectedStatus("");
  };

  const hasFilter = query || selectedCategory || selectedTarget || selectedStatus;

  return (
    <div>
      {/* Search controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="制度名・キーワードで検索..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-700"
          >
            <option value="">全カテゴリ</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-700"
          >
            <option value="">全対象者</option>
            {targetTypes.map((t) => (
              <option key={t.slug} value={t.slug}>{t.name}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-700"
          >
            <option value="">全ステータス</option>
            <option value="open">受付中</option>
            <option value="upcoming">近日公募予定</option>
            <option value="closed">締切済み</option>
          </select>
          {hasFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <X size={14} />
              リセット
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{filtered.length}件</span> が見つかりました
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-3">条件に合う制度が見つかりませんでした</p>
          <button onClick={clearFilters} className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
            絞り込みをリセット
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => {
            const badge = statusBadge[s.status];
            return (
              <Link
                key={s.slug}
                href={`/subsidy/${s.slug}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all p-5 flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs text-slate-400 text-right">{s.ministryName}</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors">
                    {s.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{s.category}</p>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{s.overview}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {s.target.map((t) => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-amber-600 font-bold text-xl">
                      最大{s.maxAmount.toLocaleString()}万円
                    </span>
                    <span className="text-slate-400 text-xs ml-2">補助率 {s.subsidyRate}</span>
                  </div>
                  <span className="text-amber-600 group-hover:text-amber-700 flex items-center gap-1 text-sm font-semibold">
                    詳細
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- メインコンポーネント ----
type TabType = "static" | "jgrants";

function SubsidyListContent() {
  const [activeTab, setActiveTab] = useState<TabType>("static");

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">制度一覧・検索</h1>
        <p className="text-slate-500">
          {subsidies.length}件の補助金・助成金から条件に合う制度を探せます
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("static")}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 ${
            activeTab === "static"
              ? "border-amber-500 text-amber-700 bg-amber-50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          掲載制度一覧
        </button>
        <button
          onClick={() => setActiveTab("jgrants")}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px border-b-2 flex items-center gap-2 ${
            activeTab === "jgrants"
              ? "border-amber-500 text-amber-700 bg-amber-50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          Jグランツで検索
          <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
            リアルタイム
          </span>
        </button>
      </div>

      {activeTab === "static" ? <StaticSearch /> : <JGrantsSearch />}
    </div>
  );
}

export default function SubsidyPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10">読み込み中...</div>}>
      <SubsidyListContent />
    </Suspense>
  );
}
