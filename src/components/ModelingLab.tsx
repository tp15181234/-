import React, { useState } from 'react';
import { MODELING_SCENARIOS } from '../data/modelingScenarios';
import { ModelingCategory, ModelingItem } from '../types/quiz';
import { CheckCircle2, RotateCcw, AlertCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: { key: ModelingCategory; label: string; desc: string; color: string }[] = [
  {
    key: '입력 (Input)',
    label: '입력 (Input)',
    desc: '키보드, 마우스, 센서 등 외부에서 프로그램 안으로 들어오는 데이터',
    color: 'border-blue-300 bg-blue-50/60 text-blue-900',
  },
  {
    key: '출력 (Output)',
    label: '출력 (Output)',
    desc: '계산이나 판단을 마친 후 모니터, 스피커 등으로 내보내는 결과',
    color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
  },
  {
    key: '조건 (Condition)',
    label: '조건 (Condition)',
    desc: '프로그램의 실행 흐름을 가르는 참(True)/거짓(False) 판단 기준',
    color: 'border-purple-300 bg-purple-50/60 text-purple-900',
  },
  {
    key: '변수 (Variable)',
    label: '변수 (Variable)',
    desc: '데이터를 기억하고 값을 변경할 수 있는 이름 붙은 메모리 공간',
    color: 'border-amber-300 bg-amber-50/60 text-amber-900',
  },
];

export const ModelingLab: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, ModelingCategory>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeHintItem, setActiveHintItem] = useState<string | null>(null);

  const scenario = MODELING_SCENARIOS[selectedScenarioIdx];

  const handleAssign = (itemId: string, category: ModelingCategory) => {
    if (isSubmitted) return;
    setAssignments((prev) => ({
      ...prev,
      [itemId]: category,
    }));
  };

  const handleReset = () => {
    setAssignments({});
    setIsSubmitted(false);
    setActiveHintItem(null);
  };

  const handleSwitchScenario = (idx: number) => {
    setSelectedScenarioIdx(idx);
    setAssignments({});
    setIsSubmitted(false);
    setActiveHintItem(null);
  };

  const handleCheck = () => {
    setIsSubmitted(true);
    // Check if all are correct
    const allCorrect = scenario.items.every(
      (item) => assignments[item.id] === item.category
    );
    if (allCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  // Calculate score
  const correctCount = scenario.items.filter(
    (item) => assignments[item.id] === item.category
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              실생활 문제 모델링 : [입력 / 출력 / 조건 / 변수] 구분 훈련
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              정보 수업에서 배운 핵심! 실생활 문제 상황을 프로그램으로 만들기 전에 4가지 요소를 완벽하게 분석하고 분류해 보세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {MODELING_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => handleSwitchScenario(idx)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[38px] ${
                  selectedScenarioIdx === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                주제 {idx + 1}: {sc.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Current Scenario Context */}
        <div className="mt-3 sm:mt-4 p-3.5 sm:p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-blue-600 mb-0.5">
            📌 실생활 문제 상황 #{selectedScenarioIdx + 1}
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {scenario.title}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {scenario.context}
          </p>
        </div>
      </div>

      {/* Main Interactive Sorting Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Unassigned / Assignment Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              분류할 항목 카드 ({scenario.items.length}개)
            </h3>
            <span className="text-[11px] text-slate-500">
              카드를 눌러 바구니에 담으세요
            </span>
          </div>

          <div className="space-y-2.5">
            {scenario.items.map((item) => {
              const currentCategory = assignments[item.id];
              const isCorrect = isSubmitted && currentCategory === item.category;
              const isWrong = isSubmitted && currentCategory && currentCategory !== item.category;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border bg-white transition-all ${
                    isCorrect
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : isWrong
                      ? 'border-red-300 bg-red-50/40'
                      : 'border-slate-200 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 leading-snug">
                      {item.text}
                    </span>
                    <button
                      onClick={() => setActiveHintItem(activeHintItem === item.id ? null : item.id)}
                      className="text-slate-400 hover:text-blue-600 shrink-0 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                      title="힌트 보기"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {activeHintItem === item.id && (
                    <div className="text-[11px] text-blue-700 bg-blue-50 p-2.5 rounded-lg mt-2 border border-blue-100">
                      💡 힌트: {item.hint}
                    </div>
                  )}

                  {/* Category Quick Selector Buttons - Touch ergonomic */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    {CATEGORIES.map((cat) => {
                      const isSelected = currentCategory === cat.key;
                      return (
                        <button
                          key={cat.key}
                          disabled={isSubmitted}
                          onClick={() => handleAssign(item.id, cat.key)}
                          className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors truncate text-left min-h-[38px] flex items-center ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          } disabled:cursor-not-allowed`}
                        >
                          {isSelected ? '✓ ' : ''}{cat.label.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-2 text-[11px] font-medium flex items-center gap-1">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 정답! ({item.category})
                        </span>
                      ) : (
                        <span className="text-red-700 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> 정답: [{item.category}]
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2.5">
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg flex items-center gap-1 min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 풀기</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleCheck}
                disabled={Object.keys(assignments).length === 0}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 shadow-xs min-h-[44px]"
              >
                정답 채점 ({Object.keys(assignments).length}/{scenario.items.length}개)
              </button>
            ) : (
              <div className="flex-1 text-right text-xs font-bold text-blue-600">
                점수: {correctCount} / {scenario.items.length} 점 ({Math.round((correctCount / scenario.items.length) * 100)}%)
              </div>
            )}
          </div>
        </div>

        {/* Right: 4 Buckets Preview & Python Translation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const assignedItems = scenario.items.filter(
                (i) => assignments[i.id] === cat.key
              );

              return (
                <div
                  key={cat.key}
                  className={`p-4 rounded-xl border ${cat.color} flex flex-col justify-between min-h-[140px]`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-bold text-xs">{cat.label}</span>
                      <span className="text-[11px] font-mono font-semibold">
                        {assignedItems.length}개
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mb-2">
                      {cat.desc}
                    </p>

                    <div className="space-y-1">
                      {assignedItems.map((ai) => (
                        <div
                          key={ai.id}
                          className="text-xs bg-white/90 p-1.5 rounded border border-slate-200/60 font-medium text-slate-800 shadow-2xs"
                        >
                          {ai.text}
                        </div>
                      ))}
                      {assignedItems.length === 0 && (
                        <div className="text-[11px] text-slate-400 italic py-2 text-center">
                          담긴 항목 없음
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Python Code Translation Box */}
          <div className="bg-slate-900 rounded-xl p-5 text-slate-100 border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                실생활 모델링 결과가 파이썬 코드로 바뀌는 과정
              </span>
              <span className="text-[11px] text-blue-400 font-mono">Real-world to Code</span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              우리가 구분한 입력, 출력, 조건, 변수가 실제 파이썬 코드에서는 각각 input(), print(), if문, 변수 할당문이 됩니다!
            </p>

            <pre className="mt-3 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {scenario.pythonCodePreview}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
