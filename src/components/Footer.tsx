import Link from "next/link";

const footerLinks = [
  {
    title: "制度を探す",
    links: [
      { href: "/subsidy", label: "制度一覧・検索" },
      { href: "/diagnose", label: "診断ツール" },
      { href: "/schedule", label: "公募スケジュール" },
    ],
  },
  {
    title: "ツール",
    links: [
      { href: "/simulate", label: "補助額シミュレーター" },
      { href: "/diagnose", label: "あなたに合う制度を診断" },
    ],
  },
  {
    title: "ガイド・FAQ",
    links: [
      { href: "/guide", label: "申請ガイド" },
      { href: "/guide/basics", label: "補助金の基礎知識" },
      { href: "/faq", label: "よくある質問" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center font-bold text-slate-900 text-lg">
                K
              </div>
              <span className="font-bold text-lg text-white">
                <span className="text-amber-400">給付</span>ナビ
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              使える補助金・助成金を、
              <br />
              もっと身近に。
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-semibold text-sm mb-3">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs">
            © 2026 給付ナビ. 掲載情報は参考情報です。最新情報は各省庁・公式サイトをご確認ください。
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/faq" className="hover:text-amber-400 transition-colors">
              よくある質問
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
