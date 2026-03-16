"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/subsidy", label: "制度を探す" },
  { href: "/diagnose", label: "診断ツール" },
  { href: "/simulate", label: "補助額シミュレーター" },
  { href: "/schedule", label: "公募スケジュール" },
  { href: "/guide", label: "申請ガイド" },
  { href: "/faq", label: "よくある質問" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center font-bold text-slate-900 text-lg group-hover:bg-amber-300 transition-colors">
              K
            </div>
            <span className="font-bold text-lg tracking-wide">
              <span className="text-amber-400">給付</span>ナビ
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Mobile menu */}
          <div className="flex items-center gap-2">
            <Link
              href="/subsidy"
              className="hidden sm:flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded text-sm transition-colors"
            >
              <Search size={14} />
              制度を検索
            </Link>
            <button
              className="lg:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm text-slate-300 hover:text-amber-400 hover:bg-slate-700 rounded transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
