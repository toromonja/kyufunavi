import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ChevronRight, CheckCircle, ArrowLeft } from "lucide-react";
import { subsidies } from "@/data/subsidies";
import { createMetadata } from "@/lib/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return subsidies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const subsidy = subsidies.find((s) => s.slug === slug);
  if (!subsidy) return {};
  return createMetadata({
    title: subsidy.name,
    description: subsidy.overview,
  });
}

const statusConfig = {
  open: { label: "受付中", className: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  upcoming: {
    label: "近日公募予定",
    className: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  closed: { label: "締切済み", className: "bg-slate-100 text-slate-600 border border-slate-200" },
};

export default async function SubsidyDetailPage({ params }: Props) {
  const { slug } = await params;
  const subsidy = subsidies.find((s) => s.slug === slug);
  if (!subsidy) notFound();

  const status = statusConfig[subsidy.status];
  const related = subsidies
    .filter((s) => s.slug !== subsidy.slug && s.categorySlug === subsidy.categorySlug)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-amber-600">
          トップ
        </Link>
        <ChevronRight size={14} />
        <Link href="/subsidy" className="hover:text-amber-600">
          制度一覧
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 truncate">{subsidy.nameShort ?? subsidy.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.className}`}>
              {status.label}
            </span>
            <span className="text-xs text-slate-500">{subsidy.category}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-1">
            {subsidy.name}
          </h1>
          <p className="text-sm text-slate-500 mb-6">所管：{subsidy.ministryName}</p>

          {/* Overview */}
          <section className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-8">
            <h2 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">
              制度概要
            </h2>
            <p className="text-slate-700 leading-relaxed">{subsidy.overview}</p>
          </section>

          {/* Eligibility */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-400 rounded inline-block"></span>
              申請資格
            </h2>
            <p className="text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-lg p-4">
              {subsidy.eligibility}
            </p>
          </section>

          {/* Eligible Expenses */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-400 rounded inline-block"></span>
              対象経費
            </h2>
            <ul className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
              {subsidy.eligibleExpenses.map((exp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  {exp}
                </li>
              ))}
            </ul>
          </section>

          {/* Application Steps */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-400 rounded inline-block"></span>
              申請手順
            </h2>
            <ol className="space-y-3">
              {subsidy.applicationSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-amber-400 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-slate-700 text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Official link */}
          <a
            href={subsidy.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors w-full"
          >
            <ExternalLink size={16} />
            公式サイトで詳細を確認する
          </a>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Key figures */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">補助金の概要</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-slate-500 mb-0.5">最大補助額</dt>
                <dd className="text-2xl font-bold text-amber-600">
                  {subsidy.maxAmount.toLocaleString()}万円
                </dd>
              </div>
              {subsidy.minAmount !== undefined && (
                <div>
                  <dt className="text-xs text-slate-500 mb-0.5">最小補助額</dt>
                  <dd className="font-semibold text-slate-700">
                    {subsidy.minAmount.toLocaleString()}万円
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-slate-500 mb-0.5">補助率</dt>
                <dd className="font-semibold text-slate-700">{subsidy.subsidyRate}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 mb-0.5">受付状況</dt>
                <dd>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[subsidy.status].className}`}
                  >
                    {statusConfig[subsidy.status].label}
                  </span>
                </dd>
              </div>
              {subsidy.deadline && (
                <div>
                  <dt className="text-xs text-slate-500 mb-0.5">次回締切</dt>
                  <dd className="font-semibold text-slate-700 text-sm">{subsidy.deadline}</dd>
                </div>
              )}
              {subsidy.schedule && (
                <div>
                  <dt className="text-xs text-slate-500 mb-0.5">公募スケジュール</dt>
                  <dd className="text-sm text-slate-700">{subsidy.schedule}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-slate-500 mb-1">対象者</dt>
                <dd className="flex flex-wrap gap-1">
                  {subsidy.target.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Simulate CTA */}
          <Link
            href={`/simulate?subsidy=${subsidy.slug}`}
            className="block bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-3 rounded-xl text-center text-sm transition-colors"
          >
            補助額をシミュレーションする
          </Link>

          {/* Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              ※掲載情報は参考情報です。実際の補助額・要件は公募要領をご確認ください。最新情報は公式サイトをご参照ください。
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-5">同カテゴリの制度</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/subsidy/${s.slug}`}
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 group transition-all hover:shadow-sm"
              >
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-amber-700 leading-snug mb-1">
                  {s.nameShort ?? s.name}
                </h3>
                <p className="text-xs text-amber-600 font-bold">
                  最大{s.maxAmount.toLocaleString()}万円
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link
          href="/subsidy"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <ArrowLeft size={14} />
          制度一覧に戻る
        </Link>
      </div>
    </div>
  );
}
