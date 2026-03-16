"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "基礎知識",
    items: [
      {
        q: "補助金と助成金の違いは何ですか？",
        a: "補助金は経済産業省・中小企業庁が所管し、審査があり競争性があります。採択されない場合もあります。助成金は厚生労働省が所管し、雇用・人材関連の取り組みを行った事業主が要件を満たせば原則支給されます。どちらも返済不要です。詳しくは「補助金と助成金の違いガイド」をご参照ください。",
      },
      {
        q: "補助金はもらった後に返済が必要ですか？",
        a: "原則として返済は不要です。ただし、補助事業の目的外使用・不正受給・報告義務違反などがあった場合には返還を求められる場合があります。採択後も適切に事業を実施し、報告義務を果たすことが重要です。",
      },
      {
        q: "個人事業主でも申請できますか？",
        a: "制度によって異なります。デジタル化・AI導入補助金（開業1年以上）、小規模事業者持続化補助金、創業支援補助金などは個人事業主でも申請できます。各制度の「対象者」欄をご確認ください。",
      },
      {
        q: "複数の補助金・助成金を同時に申請・受給できますか？",
        a: "同一経費への二重申請は禁止されていますが、異なる経費に対して複数の制度を活用することは可能です。また、補助金と助成金を組み合わせるケースもあります。申請前に認定支援機関・社会保険労務士に相談することをおすすめします。",
      },
    ],
  },
  {
    category: "申請手続き",
    items: [
      {
        q: "GビズIDとは何ですか？必要ですか？",
        a: "GビズIDとは、国が運営する法人・個人事業主向けの共通認証システムです。ものづくり補助金・IT導入補助金・持続化補助金など多くの補助金の電子申請（jGrants）に必要です。取得には2〜3週間かかる場合があるため、早めに取得しましょう。",
      },
      {
        q: "採択通知を受けた後、すぐに発注・購入してもよいですか？",
        a: "いいえ。採択通知後、交付申請を行い「交付決定通知書」を受け取ってから初めて発注・契約・購入が可能になります。交付決定前の支出は補助対象外となりますのでご注意ください。",
      },
      {
        q: "申請書類はどのように作成すればよいですか？",
        a: "各制度の公式サイトから公募要領・申請書類の様式をダウンロードして作成します。事業計画書が審査の鍵を握ります。中小企業診断士や認定支援機関（税理士・金融機関等）に相談することで、採択率を高めることができます。",
      },
      {
        q: "採択されなかった場合、再申請できますか？",
        a: "はい、多くの補助金は複数回の公募があるため、次回の公募で再申請することができます。採択されなかった場合は、不採択理由を踏まえて事業計画書を改善して再挑戦しましょう。",
      },
    ],
  },
  {
    category: "補助金の仕組み",
    items: [
      {
        q: "補助金は先に支払いをして後で受け取るのですか？",
        a: "多くの補助金は「精算払い」です。交付決定後に自己資金等で先に支出し、事業完了後に実績報告書を提出し、確認後に補助金が振り込まれます。そのため、一時的な資金手当てが必要になる場合があります。日本政策金融公庫等の低利融資を組み合わせる方法もあります。",
      },
      {
        q: "補助金の「補助率」とはどういう意味ですか？",
        a: "補助率とは、対象経費のうち補助金で賄われる割合です。例えば補助率1/2・補助上限100万円の場合、200万円の事業費のうち最大100万円が補助され、残り100万円が自己負担になります。事業費が200万円を超えても補助金は最大100万円です。",
      },
      {
        q: "消費税は補助金の対象になりますか？",
        a: "原則として消費税は補助対象外です。消費税分は自己負担となります。ただし、免税事業者の場合は仕入税額控除ができないため、消費税を含めて対象とする制度もあります。各公募要領をご確認ください。",
      },
      {
        q: "補助金を受け取った後に何か義務はありますか？",
        a: "補助金受領後も一定期間（通常3〜5年）は事業化状況報告の義務があります。また、取得した設備は処分制限期間内に無断で売却・転用することができません。書類の保管義務（5年程度）もあります。",
      },
    ],
  },
  {
    category: "このサイトについて",
    items: [
      {
        q: "掲載情報の正確性について教えてください",
        a: "本サイトに掲載している情報は各省庁・公式サイトをもとに作成していますが、制度の詳細・要件・補助額・公募スケジュールは変更される場合があります。必ず最新の公募要領・公式サイトをご確認ください。本サイトの情報による損害について弊サイトは責任を負いません。",
      },
      {
        q: "診断ツールの結果は正確ですか？",
        a: "診断ツールはあくまでも候補制度をご提案するための簡易ツールです。実際に申請できるかどうかは、各制度の公募要領・要件をご確認の上、認定支援機関等の専門家にご相談ください。",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-sm leading-snug">
          <span className="text-amber-500 font-bold mr-2">Q.</span>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="text-amber-500 font-bold mr-2">A.</span>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <HelpCircle size={28} className="text-amber-500" />
          よくある質問
        </h1>
        <p className="text-slate-500">
          補助金・助成金に関するよくあるご質問をまとめました
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3 px-1">
              {section.category}
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">まだ疑問が解決しない場合</h2>
        <p className="text-slate-400 text-sm mb-6">
          中小企業診断士・認定支援機関への相談がおすすめです。
          <br />
          まずは診断ツールで候補制度を確認しましょう。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/diagnose"
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            診断ツールで確認する
          </Link>
          <Link
            href="/guide/basics"
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            基礎知識ガイドを読む
          </Link>
        </div>
      </div>
    </div>
  );
}
