import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CalendarDays, Building2, MapPin, Tag } from "lucide-react";
import { getSubsidyDetail } from "@/lib/jgrants";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const subsidy = await getSubsidyDetail(id).catch(() => null);
  if (!subsidy) {
    return createMetadata({ title: "補助金詳細" });
  }
  return createMetadata({
    title: subsidy.title,
    description: subsidy.use_purpose ?? subsidy.detail?.slice(0, 100),
  });
}

function formatAmount(amount?: number): string {
  if (!amount) return "上限なし / 要問合せ";
  if (amount >= 10000) return `${(amount / 10000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function JGrantsDetailPage({ params }: Props) {
  const { id } = await params;

  let subsidy;
  try {
    subsidy = await getSubsidyDetail(id);
  } catch {
    subsidy = null;
  }

  if (!subsidy) notFound();

  const isOpen = (() => {
    if (!subsidy.acceptance_end_datetime) return true;
    return new Date(subsidy.acceptance_end_datetime) > new Date();
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/subsidy?tab=jgrants"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        制度一覧に戻る
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              isOpen
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            {isOpen ? "受付中" : "受付終了"}
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium border border-amber-200">
            Jグランツ掲載
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
          {subsidy.title}
        </h1>

        {subsidy.ministry_name && (
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <Building2 size={15} />
            <span>{subsidy.ministry_name}</span>
          </div>
        )}

        {subsidy.target_area_search && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={15} />
            <span>{subsidy.target_area_search}</span>
          </div>
        )}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-xs text-amber-600 font-semibold mb-1">補助上限額</p>
          <p className="text-2xl font-bold text-amber-700">
            {formatAmount(subsidy.subsidy_max_limit)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1.5">
            <CalendarDays size={13} />
            受付期間
          </p>
          <p className="text-base font-semibold text-slate-800">
            {formatDateTime(subsidy.acceptance_start_datetime)}
            {" 〜 "}
            {formatDateTime(subsidy.acceptance_end_datetime)}
          </p>
        </div>
      </div>

      {/* Detail sections */}
      <div className="space-y-5">
        {subsidy.use_purpose && (
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-amber-500" />
              利用目的・対象
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {subsidy.use_purpose}
            </p>
          </section>
        )}

        {subsidy.industry && (
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">対象業種</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{subsidy.industry}</p>
          </section>
        )}

        {subsidy.detail && (
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">詳細説明</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {subsidy.detail}
            </p>
          </section>
        )}

        {subsidy.supplementary && (
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">補足情報</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {subsidy.supplementary}
            </p>
          </section>
        )}

        {/* Official link */}
        {subsidy.url_1 && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">公式情報・申請</h2>
            <a
              href={subsidy.url_1}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Jグランツで申請・詳細を確認
              <ExternalLink size={16} />
            </a>
            <p className="text-xs text-slate-500 mt-3">
              申請はJグランツ（デジタル庁）の公式サイトで行います。
            </p>
          </section>
        )}

        {/* Credit */}
        <p className="text-xs text-slate-400 text-right pt-2">
          このページのデータはJグランツ（デジタル庁）のAPIから取得しています。
          最新情報は公式サイトをご確認ください。
        </p>
      </div>
    </div>
  );
}
