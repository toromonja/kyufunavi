"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calculator, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { subsidies } from "@/data/subsidies";
import { Suspense } from "react";

// Parse subsidyRate string to get a numeric ratio for simulation
function parseRate(rateStr: string): { min: number; max: number } {
  // Handle patterns like "1/2", "2/3", "1/2〜2/3", "3/4〜4/5"
  const fractions = rateStr.match(/\d+\/\d+/g);
  if (!fractions || fractions.length === 0) {
    // Handle percentage like "45〜75%"
    const percentages = rateStr.match(/(\d+)/g);
    if (percentages) {
      const nums = percentages.map(Number);
      return { min: Math.min(...nums) / 100, max: Math.max(...nums) / 100 };
    }
    return { min: 0.5, max: 0.5 };
  }

  const values = fractions.map((f) => {
    const [n, d] = f.split("/").map(Number);
    return n / d;
  });
  return { min: Math.min(...values), max: Math.max(...values) };
}

function SimulateContent() {
  const searchParams = useSearchParams();
  const defaultSlug = searchParams.get("subsidy") ?? "";

  const [selectedSlug, setSelectedSlug] = useState(defaultSlug);
  const [projectCost, setProjectCost] = useState("");

  const subsidy = subsidies.find((s) => s.slug === selectedSlug);

  const result = useMemo(() => {
    if (!subsidy || !projectCost) return null;
    const cost = parseFloat(projectCost);
    if (isNaN(cost) || cost <= 0) return null;

    const rate = parseRate(subsidy.subsidyRate);
    const isSpecialRate = subsidy.subsidyRate.includes("定額") || subsidy.subsidyRate.includes("融資");

    if (isSpecialRate) return null;

    const minSubsidy = Math.floor(cost * rate.min * 10) / 10;
    const maxSubsidy = Math.floor(cost * rate.max * 10) / 10;

    const cappedMin = subsidy.minAmount ? Math.max(minSubsidy, 0) : minSubsidy;
    const cappedMax = Math.min(maxSubsidy, subsidy.maxAmount);

    return {
      minRate: rate.min,
      maxRate: rate.max,
      estimatedMin: Math.max(0, cappedMin),
      estimatedMax: Math.max(0, cappedMax),
      selfBurdenMin: cost - cappedMax,
      selfBurdenMax: cost - cappedMin,
    };
  }, [subsidy, projectCost]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator size={32} className="text-slate-900" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">補助額シミュレーター</h1>
        <p className="text-slate-500">事業費を入力して、補助金の目安額を試算しましょう</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        {/* Subsidy selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            対象の補助金・助成金を選択
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-slate-700"
          >
            <option value="">-- 制度を選択してください --</option>
            {subsidies
              .filter(
                (s) =>
                  !s.subsidyRate.includes("定額") &&
                  !s.subsidyRate.includes("融資") &&
                  s.status !== "closed"
              )
              .map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.nameShort ?? s.name}（最大{s.maxAmount.toLocaleString()}万円）
                </option>
              ))}
          </select>
        </div>

        {/* Project cost input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            事業費（総費用）
          </label>
          <div className="relative">
            <input
              type="number"
              value={projectCost}
              onChange={(e) => setProjectCost(e.target.value)}
              placeholder="例：1000"
              min="1"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 pr-14"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              万円
            </span>
          </div>
        </div>

        {/* Result */}
        {subsidy && projectCost && result === null && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-slate-500 text-sm">
              この制度は補助率が定額・融資型のため、シミュレーションができません。
              <br />
              詳細は
              <Link href={`/subsidy/${subsidy.slug}`} className="text-amber-600 hover:underline ml-1">
                制度詳細ページ
              </Link>
              をご確認ください。
            </p>
          </div>
        )}

        {result && subsidy && (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
            <h2 className="font-bold text-slate-900 mb-4 text-center">試算結果</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-slate-500 mb-1">補助金見込み額（最大）</p>
                <p className="text-3xl font-bold text-amber-600">
                  {result.estimatedMax.toLocaleString()}
                  <span className="text-lg">万円</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">補助率 {Math.round(result.maxRate * 100)}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <p className="text-xs text-slate-500 mb-1">自己負担額（最小）</p>
                <p className="text-3xl font-bold text-slate-700">
                  {result.selfBurdenMin.toLocaleString()}
                  <span className="text-lg">万円</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">事業費の残り</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-sm text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>入力した事業費</span>
                <span className="font-semibold">{parseFloat(projectCost).toLocaleString()}万円</span>
              </div>
              <div className="flex justify-between">
                <span>補助率</span>
                <span className="font-semibold">{subsidy.subsidyRate}</span>
              </div>
              <div className="flex justify-between">
                <span>補助上限額</span>
                <span className="font-semibold">{subsidy.maxAmount.toLocaleString()}万円</span>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/subsidy/${subsidy.slug}`}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                制度詳細を見る
                <ArrowRight size={14} />
              </Link>
              <a
                href={subsidy.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <ExternalLink size={13} />
                公式
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>免責事項：</strong>
          この試算はあくまでも目安です。実際の補助額は申請内容・審査結果・公募要領の条件により異なります。正確な情報は各制度の公式サイトや認定支援機関にご確認ください。
        </p>
      </div>
    </div>
  );
}

export default function SimulatePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 text-center">読み込み中...</div>}>
      <SimulateContent />
    </Suspense>
  );
}
