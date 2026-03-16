"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, AlertCircle } from "lucide-react";
import type { JGrantsSubsidy } from "@/lib/jgrants";

function formatAmount(amount?: number): string {
  if (!amount) return "—";
  if (amount >= 10000) {
    return `${(amount / 10000).toLocaleString()}万円`;
  }
  return `${amount.toLocaleString()}円`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function JGrantsLive() {
  const [subsidies, setSubsidies] = useState<JGrantsSubsidy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          "/api/jgrants/search?keyword=%E4%B8%AD%E5%B0%8F%E4%BC%81%E6%A5%AD&acceptance=1&limit=6"
        );
        if (!res.ok) throw new Error("取得失敗");
        const data: JGrantsSubsidy[] = await res.json();
        if (!cancelled) {
          setSubsidies(data.slice(0, 6));
        }
      } catch {
        if (!cancelled) {
          setError("データの取得に失敗しました。しばらくしてから再度お試しください。");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-stone-500">
        <Loader2 size={20} className="animate-spin text-amber-500" />
        <span className="text-sm">Jグランツからデータを取得中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 py-10 text-stone-500 text-sm">
        <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (subsidies.length === 0) {
    return (
      <div className="py-10 text-center text-stone-400 text-sm">
        現在受付中の制度が見つかりませんでした。
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subsidies.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                受付中
              </span>
              {s.ministry_name && (
                <span className="text-xs text-stone-400 text-right leading-tight line-clamp-2">
                  {s.ministry_name}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-stone-800 leading-snug line-clamp-2">
                {s.title}
              </h3>
            </div>

            {s.use_purpose && (
              <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                {s.use_purpose}
              </p>
            )}

            <div className="mt-auto pt-3 border-t border-stone-100 space-y-2">
              {s.subsidy_max_limit != null && (
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-bold text-lg">
                    最大{formatAmount(s.subsidy_max_limit)}
                  </span>
                </div>
              )}
              {(s.acceptance_start_datetime || s.acceptance_end_datetime) && (
                <p className="text-xs text-stone-400">
                  受付期間: {formatDate(s.acceptance_start_datetime)} 〜 {formatDate(s.acceptance_end_datetime)}
                </p>
              )}
              <div className="flex gap-2 mt-1">
                <Link
                  href={`/subsidy/jgrants/${s.id}`}
                  className="flex-1 text-center text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  詳細を見る
                </Link>
                {s.url_1 && (
                  <a
                    href={s.url_1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-600 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-amber-300 transition-colors"
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

      <p className="text-xs text-stone-400 mt-6 text-right">
        Jグランツ（デジタル庁）のリアルタイムデータを表示しています
      </p>
    </div>
  );
}
