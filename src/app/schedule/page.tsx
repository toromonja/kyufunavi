import Link from "next/link";
import { CalendarDays, ExternalLink, AlertCircle } from "lucide-react";
import { subsidies } from "@/data/subsidies";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "公募スケジュール",
  description:
    "補助金・助成金の公募スケジュール・締切一覧。受付中・近日公募予定・締切済みの制度をひと目で確認できます。",
});

const statusConfig = {
  open: {
    label: "受付中",
    className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  upcoming: {
    label: "近日公募予定",
    className: "bg-amber-100 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
  },
  closed: {
    label: "締切済み",
    className: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
};

export default function SchedulePage() {
  const openSubsidies = subsidies.filter((s) => s.status === "open");
  const upcomingSubsidies = subsidies.filter((s) => s.status === "upcoming");
  const closedSubsidies = subsidies.filter((s) => s.status === "closed");

  const groups = [
    { title: "受付中", status: "open" as const, items: openSubsidies, accent: "text-emerald-600" },
    {
      title: "近日公募予定",
      status: "upcoming" as const,
      items: upcomingSubsidies,
      accent: "text-amber-600",
    },
    { title: "締切済み", status: "closed" as const, items: closedSubsidies, accent: "text-slate-500" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <CalendarDays size={28} className="text-amber-500" />
          公募スケジュール
        </h1>
        <p className="text-slate-500">
          補助金・助成金の受付状況・締切日を一覧で確認できます。申請の準備はお早めに。
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-4 mb-10">
        {groups.map((g) => (
          <div key={g.status} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[g.status].dot}`}></span>
            <span className="font-semibold text-slate-900">{g.title}</span>
            <span className={`font-bold text-lg ${g.accent}`}>{g.items.length}件</span>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-10">
        <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          掲載情報は参考情報です。実際の公募期間・締切は各制度の公式サイトをご確認ください。
        </p>
      </div>

      {/* Groups */}
      {groups.map((group) =>
        group.items.length === 0 ? null : (
          <section key={group.status} className="mb-12">
            <h2 className={`text-xl font-bold mb-5 flex items-center gap-2 ${group.accent}`}>
              <span className={`w-3 h-3 rounded-full ${statusConfig[group.status].dot}`}></span>
              {group.title}（{group.items.length}件）
            </h2>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                      制度名
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">
                      カテゴリ
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">
                      最大補助額
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                      締切・スケジュール
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                      状況
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((s, i) => (
                    <tr
                      key={s.slug}
                      className={`${i > 0 ? "border-t border-slate-100" : ""} hover:bg-slate-50 transition-colors`}
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/subsidy/${s.slug}`}
                          className="font-semibold text-slate-900 hover:text-amber-700 text-sm leading-snug"
                        >
                          {s.nameShort ?? s.name}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{s.ministryName}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {s.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="font-bold text-amber-600 text-sm">
                          {s.maxAmount.toLocaleString()}万円
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {s.deadline ? (
                          <span className="text-sm font-semibold text-slate-700">{s.deadline}</span>
                        ) : s.schedule ? (
                          <span className="text-xs text-slate-500">{s.schedule}</span>
                        ) : (
                          <span className="text-xs text-slate-400">要確認</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[s.status].className}`}
                          >
                            {statusConfig[s.status].label}
                          </span>
                          <a
                            href={s.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            title="公式サイト"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      )}
    </div>
  );
}
