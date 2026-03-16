"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, X, ArrowRight, ExternalLink } from "lucide-react";
import { subsidies, categories, targetTypes } from "@/data/subsidies";
import { Suspense } from "react";

const statusBadge = {
  open: { label: "受付中", className: "bg-emerald-100 text-emerald-700" },
  upcoming: { label: "近日公募予定", className: "bg-amber-100 text-amber-700" },
  closed: { label: "締切済み", className: "bg-slate-100 text-slate-500" },
};

function SubsidyListContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [selectedTarget, setSelectedTarget] = useState(searchParams.get("target") ?? "");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">制度一覧・検索</h1>
        <p className="text-slate-500">
          {subsidies.length}件の補助金・助成金から条件に合う制度を探せます
        </p>
      </div>

      {/* Search */}
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
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-700"
          >
            <option value="">全対象者</option>
            {targetTypes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
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

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{filtered.length}件</span> が見つかりました
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-3">条件に合う制度が見つかりませんでした</p>
          <button
            onClick={clearFilters}
            className="text-amber-600 hover:text-amber-700 font-semibold text-sm"
          >
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
                    <span
                      key={t}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
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

export default function SubsidyPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10">読み込み中...</div>}>
      <SubsidyListContent />
    </Suspense>
  );
}
