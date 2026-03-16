import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { guides } from "@/data/guides";
import { createMetadata } from "@/lib/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return {};
  return createMetadata({ title: guide.title, description: guide.description });
}

function renderMarkdown(content: string): string {
  let html = content
    // h2
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-3">$1</h2>')
    // h3
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-2">$1</h3>')
    // hr
    .replace(/^---$/gm, '<hr class="border-slate-200 my-6" />')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    // table
    .replace(
      /\| (.+) \|\n\| [-| ]+ \|\n((?:\| .+ \|\n?)+)/g,
      (_match: string, header: string, rows: string) => {
        const headers = header
          .split("|")
          .filter((h: string) => h.trim())
          .map(
            (h: string) =>
              `<th class="text-left text-xs font-semibold text-slate-600 px-4 py-2.5 bg-slate-50">${h.trim()}</th>`
          )
          .join("");
        const rowHtml = rows
          .trim()
          .split("\n")
          .map((row: string) => {
            const cells = row
              .split("|")
              .filter((c: string) => c.trim())
              .map(
                (c: string) =>
                  `<td class="px-4 py-2.5 text-sm text-slate-700 border-t border-slate-100">${c.trim()}</td>`
              )
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");
        return `<div class="overflow-x-auto my-4"><table class="w-full border border-slate-200 rounded-lg overflow-hidden"><thead><tr>${headers}</tr></thead><tbody>${rowHtml}</tbody></table></div>`;
      }
    )
    // unordered list items
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-sm text-slate-700"><span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5"></span><span>$1</span></li>')
    // wrap consecutive li in ul
    .replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match: string) => `<ul class="space-y-1.5 my-3">${match}</ul>`)
    // paragraphs
    .replace(/^(?!<[h|u|o|l|d|t|h]|---|$)(.+)$/gm, '<p class="text-slate-700 leading-relaxed mb-3">$1</p>');

  return html;
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const relatedGuides = guides.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-amber-600">
          トップ
        </Link>
        <ChevronRight size={14} />
        <Link href="/guide" className="hover:text-amber-600">
          申請ガイド
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 truncate">{guide.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <article className="lg:col-span-3">
          <div className="flex flex-wrap gap-1 mb-3">
            {guide.tags.map((tag) => (
              <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{guide.title}</h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 mb-8 pb-6 border-b border-slate-200">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              読了目安 {guide.readTime}分
            </span>
            <span>公開：{guide.publishedAt}</span>
            {guide.updatedAt && <span>更新：{guide.updatedAt}</span>}
          </div>

          {/* Article content */}
          <div
            className="prose-like"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }}
          />

          <div className="mt-10">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
            >
              <ArrowLeft size={14} />
              ガイド一覧に戻る
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
              <BookOpen size={14} className="text-amber-500" />
              関連ガイド
            </h3>
            <ul className="space-y-3">
              {relatedGuides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guide/${g.slug}`}
                    className="text-sm text-slate-700 hover:text-amber-700 leading-snug"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-5">
            <h3 className="font-bold mb-2 text-sm">制度を探す</h3>
            <p className="text-slate-400 text-xs mb-3">
              あなたに合った補助金・助成金を診断ツールで見つけましょう
            </p>
            <Link
              href="/diagnose"
              className="block bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-center py-2.5 rounded-lg text-sm transition-colors"
            >
              無料診断する
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
