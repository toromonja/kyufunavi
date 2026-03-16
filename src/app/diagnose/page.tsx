"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";
import { subsidies } from "@/data/subsidies";

const steps = [
  {
    id: "target",
    title: "Step 1 / 3",
    question: "事業者区分を選んでください",
    options: [
      { value: "individual", label: "個人事業主", desc: "フリーランス・自営業者" },
      { value: "small", label: "小規模事業者", desc: "従業員20人以下（製造業等）、5人以下（商業・サービス業）" },
      { value: "medium", label: "中小企業", desc: "中小企業基本法の定義内の法人" },
      { value: "large", label: "大企業", desc: "中小企業の定義を超える規模の法人" },
    ],
  },
  {
    id: "purpose",
    title: "Step 2 / 3",
    question: "補助金・助成金の目的を選んでください",
    options: [
      { value: "equipment", label: "設備投資・機器購入", desc: "製造機械・IT機器などの購入" },
      { value: "digital", label: "IT化・デジタル化", desc: "ソフトウェア・システム導入" },
      { value: "employment", label: "雇用・人材育成", desc: "採用・研修・正社員転換" },
      { value: "sales", label: "販路開拓・広告", desc: "ウェブサイト・展示会・チラシ" },
      { value: "environment", label: "省エネ・環境対策", desc: "省エネ設備への更新" },
      { value: "startup", label: "創業・起業", desc: "新規事業立ち上げ" },
      { value: "restructure", label: "事業転換・新規事業", desc: "新しい市場への挑戦" },
    ],
  },
  {
    id: "industry",
    title: "Step 3 / 3",
    question: "業種を選んでください",
    options: [
      { value: "manufacturing", label: "製造業", desc: "工業製品・加工" },
      { value: "service", label: "サービス業", desc: "各種サービス・コンサルティング" },
      { value: "retail", label: "小売・卸売業", desc: "物品販売" },
      { value: "food", label: "飲食業", desc: "飲食店・食品関連" },
      { value: "it", label: "IT・情報通信", desc: "ソフトウェア・WEB" },
      { value: "construction", label: "建設業", desc: "建築・土木・設備工事" },
      { value: "other", label: "その他", desc: "上記以外の業種" },
    ],
  },
];

export default function DiagnosePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const step = steps[currentStep];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const getResults = () => {
    const targetSlug = answers.target;
    const purposeSlug = answers.purpose;

    return subsidies
      .filter((s) => {
        const matchTarget = !targetSlug || s.targetSlugs.includes(targetSlug);
        const matchPurpose = !purposeSlug || s.categorySlug === purposeSlug;
        return matchTarget && matchPurpose && s.status !== "closed";
      })
      .slice(0, 5);
  };

  const statusBadge = {
    open: "bg-emerald-100 text-emerald-700",
    upcoming: "bg-amber-100 text-amber-700",
    closed: "bg-slate-100 text-slate-500",
  };
  const statusLabel = { open: "受付中", upcoming: "近日公募予定", closed: "締切済み" };

  if (showResult) {
    const results = getResults();
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-slate-900" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">診断結果</h1>
          <p className="text-slate-500">
            あなたの条件に合う制度が <span className="font-bold text-amber-600">{results.length}件</span> 見つかりました
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 mb-4">条件に完全にマッチする制度が見つかりませんでした。</p>
            <Link
              href="/subsidy"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              全制度を検索する
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {results.map((s, i) => (
              <Link
                key={s.slug}
                href={`/subsidy/${s.slug}`}
                className="flex gap-4 bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-5 group transition-all hover:shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[s.status]}`}>
                      {statusLabel[s.status]}
                    </span>
                    <span className="text-xs text-slate-400">{s.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-amber-700 mb-1">
                    {s.nameShort ?? s.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{s.overview}</p>
                  <p className="text-amber-600 font-bold text-sm mt-1">
                    最大{s.maxAmount.toLocaleString()}万円 / 補助率 {s.subsidyRate}
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-400 flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw size={15} />
            もう一度診断する
          </button>
          <Link
            href="/subsidy"
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            全制度を検索する
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">診断ツール</h1>
        <p className="text-slate-500">3つの質問に答えるだけで、最適な制度をご提案します</p>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              i <= currentStep ? "bg-amber-400" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="mb-8">
        <p className="text-xs text-amber-600 font-semibold mb-2">{step.title}</p>
        <h2 className="text-xl font-bold text-slate-900">{step.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="w-full text-left bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl px-5 py-4 transition-all group"
          >
            <p className="font-semibold text-slate-900 group-hover:text-amber-700">{opt.label}</p>
            <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Back */}
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <ArrowLeft size={14} />
          前の質問に戻る
        </button>
      )}
    </div>
  );
}
