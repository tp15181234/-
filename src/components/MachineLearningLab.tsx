import React, { useState } from 'react';
import {
  MLCategory,
  ML_CATEGORIES,
  ML_PROBLEM_PACKS,
  ML_SPEED_QUIZ_LIST,
  MLCategoryInfo,
  MLProblemItem,
} from '../data/machineLearningData';
import {
  Cpu,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Award,
  Zap,
  Layers,
  BookOpen,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MachineLearningLabProps {
  onNavigateTab?: (tab: string) => void;
}

export const MachineLearningLab: React.FC<MachineLearningLabProps> = ({ onNavigateTab }) => {
  // Main Sub-Tab: 'scenarios' | 'speedQuiz' | 'guide'
  const [activeTab, setActiveTab] = useState<'scenarios' | 'speedQuiz' | 'guide'>('scenarios');

  // Scenario Pack Mode State
  const [selectedPackIdx, setSelectedPackIdx] = useState(0);
  const [userAssignments, setUserAssignments] = useState<Record<string, MLCategory>>({});
  const [isPackSubmitted, setIsPackSubmitted] = useState(false);
  const [activeHintItem, setActiveHintItem] = useState<string | null>(null);

  const currentPack = ML_PROBLEM_PACKS[selectedPackIdx];

  const handleSelectCategory = (itemId: string, category: MLCategory) => {
    if (isPackSubmitted) return;
    setUserAssignments((prev) => ({
      ...prev,
      [itemId]: category,
    }));
  };

  const handleCheckPack = () => {
    setIsPackSubmitted(true);
    const allCorrect = currentPack.items.every(
      (item) => userAssignments[item.id] === item.correctCategory
    );
    if (allCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetPack = () => {
    setUserAssignments({});
    setIsPackSubmitted(false);
    setActiveHintItem(null);
  };

  const handleSwitchPack = (idx: number) => {
    setSelectedPackIdx(idx);
    setUserAssignments({});
    setIsPackSubmitted(false);
    setActiveHintItem(null);
  };

  const packScore = currentPack.items.filter(
    (item) => userAssignments[item.id] === item.correctCategory
  ).length;

  // Speed Quiz Mode State
  const [speedQuizIdx, setSpeedQuizIdx] = useState(0);
  const [speedQuizAnswers, setSpeedQuizAnswers] = useState<Record<number, MLCategory>>({});
  const [speedQuizScore, setSpeedQuizScore] = useState(0);
  const [speedQuizFinished, setSpeedQuizFinished] = useState(false);

  const currentQuiz = ML_SPEED_QUIZ_LIST[speedQuizIdx];

  const handleAnswerSpeedQuiz = (choice: MLCategory) => {
    if (speedQuizAnswers[speedQuizIdx]) return; // Already answered

    const isCorrect = choice === currentQuiz.correctAnswer;
    setSpeedQuizAnswers((prev) => ({ ...prev, [speedQuizIdx]: choice }));

    if (isCorrect) {
      setSpeedQuizScore((prev) => prev + 1);
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNextSpeedQuiz = () => {
    if (speedQuizIdx < ML_SPEED_QUIZ_LIST.length - 1) {
      setSpeedQuizIdx((prev) => prev + 1);
    } else {
      setSpeedQuizFinished(true);
      if (speedQuizScore >= ML_SPEED_QUIZ_LIST.length * 0.8) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }
  };

  const handleRestartSpeedQuiz = () => {
    setSpeedQuizIdx(0);
    setSpeedQuizAnswers({});
    setSpeedQuizScore(0);
    setSpeedQuizFinished(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                NEW 수업 진도
              </span>
              <span className="text-xs text-slate-500 font-medium">
                고등학교 정보 교과 기계학습 마스터
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              기계학습 판별 훈련소 : [지도 · 비지도 · 강화학습]
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              수업 시간에 배운 지도학습(<strong>분류·회귀</strong>), 비지도학습(<strong>군집화-k평균/kNN·연관 규칙</strong>), 그리고 <strong>강화학습</strong>의 차이를 완벽하게 구별하고 실생활 사례를 분류해 보세요!
            </p>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[34px] flex items-center gap-1.5 ${
                activeTab === 'scenarios'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>실전 사례 판별소</span>
            </button>

            <button
              onClick={() => setActiveTab('speedQuiz')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[34px] flex items-center gap-1.5 ${
                activeTab === 'speedQuiz'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1초 판별 스피드 퀴즈</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[34px] flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>3초 판별 공식 가이드</span>
            </button>
          </div>
        </div>

        {/* 5 Core Categories Quick Cheat Pills */}
        <div className="mt-3.5 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {ML_CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className={`p-2.5 rounded-lg border ${cat.borderColor} ${cat.bgColor} space-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${cat.badgeColor}`}>
                  {cat.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">{cat.shortLabel.split(' ')[0]}</span>
              </div>
              <div className="font-bold text-slate-900 text-xs truncate">
                {cat.shortLabel}
              </div>
              <p className="text-[10px] text-slate-600 leading-tight line-clamp-2">
                {cat.rule3Sec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: 실전 사례 판별소 (Scenario Pack Lab)            */}
      {/* ======================================================== */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Theme Pack Switcher Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full md:w-auto">
              {ML_PROBLEM_PACKS.map((pack, idx) => {
                const isSelected = selectedPackIdx === idx;
                return (
                  <button
                    key={pack.id}
                    onClick={() => handleSwitchPack(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors min-h-[36px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{pack.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pack.items.length}문항
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 text-xs">
              {isPackSubmitted ? (
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold px-2.5 py-1.5 rounded-lg border ${
                      packScore === currentPack.items.length
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    결과: {packScore} / {currentPack.items.length} 정답
                  </span>
                  <button
                    onClick={handleResetPack}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center gap-1 min-h-[34px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>다시 풀기</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCheckPack}
                  disabled={Object.keys(userAssignments).length === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 min-h-[36px] active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>판별 채점하기 ({Object.keys(userAssignments).length}/{currentPack.items.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Problem Cards List */}
          <div className="space-y-4">
            {currentPack.items.map((item, itemIdx) => {
              const assigned = userAssignments[item.id];
              const isChecked = isPackSubmitted;
              const isCorrect = assigned === item.correctCategory;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all p-4 sm:p-5 shadow-xs ${
                    isChecked
                      ? isCorrect
                        ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/20'
                        : 'border-red-300 ring-1 ring-red-200 bg-red-50/20'
                      : assigned
                      ? 'border-indigo-300 shadow-2xs'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    {/* Item Text & Context */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                          {itemIdx + 1}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {item.title}
                        </h3>

                        {isChecked && (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> 정답!
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> 오답
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8">
                        {item.description}
                      </p>

                      <div className="ml-8 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-mono">
                        💡 <strong>데이터 입출력 조건:</strong> {item.contextData}
                      </div>
                    </div>

                    {/* Category Selection Buttons */}
                    <div className="lg:w-80 shrink-0 pt-2 lg:pt-0">
                      <div className="text-[11px] font-bold text-slate-500 mb-1.5">
                        알맞은 기계학습 유형을 선택하세요:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                        {ML_CATEGORIES.map((cat) => {
                          const isSelected = assigned === cat.key;
                          const isAnswerCategory = isChecked && item.correctCategory === cat.key;

                          return (
                            <button
                              key={cat.key}
                              onClick={() => handleSelectCategory(item.id, cat.key)}
                              disabled={isChecked}
                              className={`px-3 py-2 text-xs font-semibold rounded-lg text-left transition-all border flex items-center justify-between min-h-[36px] ${
                                isAnswerCategory
                                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs ring-2 ring-emerald-300'
                                  : isSelected
                                  ? isChecked && !isCorrect
                                    ? 'bg-red-600 text-white border-red-700'
                                    : 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-[10px] font-mono opacity-80">[{cat.tag}]</span>
                                <span className="truncate">{cat.shortLabel}</span>
                              </div>
                              {isSelected && !isAnswerCategory && isChecked && !isCorrect && (
                                <XCircle className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                              )}
                              {isAnswerCategory && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Checked Explanation Section */}
                  {isChecked && (
                    <div className="mt-4 pt-3 border-t border-slate-200 pl-8 space-y-1.5 text-xs">
                      <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-950">
                        <div className="font-bold flex items-center gap-1.5 text-indigo-900 mb-1">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>정답: {item.correctCategory}</span>
                        </div>
                        <p className="leading-relaxed">{item.whyCorrect}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        <strong>⚠️ 시험 출제 함정 피하기:</strong> {item.pitfallTip}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: 1초 판별 스피드 퀴즈 (Speed Quiz Mode)            */}
      {/* ======================================================== */}
      {activeTab === 'speedQuiz' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
          {!speedQuizFinished ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Progress Bar & Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    문항 {speedQuizIdx + 1} / {ML_SPEED_QUIZ_LIST.length}
                  </span>
                  <span className="font-mono text-indigo-600 font-bold">
                    현재 득점: {speedQuizScore}점
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${((speedQuizIdx + 1) / ML_SPEED_QUIZ_LIST.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quiz Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-100 space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  {currentQuiz.context}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuiz.question}
                </h3>
              </div>

              {/* 5 Choices */}
              <div className="space-y-2">
                {currentQuiz.choices.map((choice) => {
                  const selectedAnswer = speedQuizAnswers[speedQuizIdx];
                  const hasAnswered = Boolean(selectedAnswer);
                  const isThisChoice = selectedAnswer === choice;
                  const isCorrectChoice = choice === currentQuiz.correctAnswer;

                  let buttonStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200';
                  if (hasAnswered) {
                    if (isCorrectChoice) {
                      buttonStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs';
                    } else if (isThisChoice) {
                      buttonStyle = 'bg-red-600 text-white border-red-700 font-bold';
                    } else {
                      buttonStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={choice}
                      onClick={() => handleAnswerSpeedQuiz(choice)}
                      disabled={hasAnswered}
                      className={`w-full p-3.5 text-xs sm:text-sm font-semibold rounded-xl border text-left transition-all flex items-center justify-between min-h-[44px] ${buttonStyle}`}
                    >
                      <span>{choice}</span>
                      {hasAnswered && isCorrectChoice && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                      {hasAnswered && isThisChoice && !isCorrectChoice && (
                        <XCircle className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation after click */}
              {speedQuizAnswers[speedQuizIdx] && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-fade-in">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>정답 해설: {currentQuiz.correctAnswer}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{currentQuiz.explanation}</p>
                  <button
                    onClick={handleNextSpeedQuiz}
                    className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>{speedQuizIdx < ML_SPEED_QUIZ_LIST.length - 1 ? '다음 문제 풀기' : '결과 확인하기'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Speed Quiz Result Screen */
            <div className="max-w-md mx-auto text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">스피드 퀴즈 완료!</h3>
                <div className="text-3xl font-black text-indigo-600 mt-2">
                  {speedQuizScore} / {ML_SPEED_QUIZ_LIST.length}점
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {speedQuizScore === ML_SPEED_QUIZ_LIST.length
                    ? '🎉 완벽합니다! 기계학습 구분 문제는 기말고사에서 100% 맞힐 수 있습니다!'
                    : speedQuizScore >= 8
                    ? '👍 좋습니다! 틀린 개념은 [3초 판별 공식 가이드]를 통해 한 번 더 복습하세요!'
                    : '💪 괜찮습니다! 3초 판별 공식을 읽고 다시 도전해 보세요!'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleRestartSpeedQuiz}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  퀴즈 다시 풀기
                </button>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  실전 사례 풀러가기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: 3초 판별 공식 가이드 (Decision Tree Guide)         */}
      {/* ======================================================== */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              기말고사 시험지에서 3초 만에 기계학습 유형 가려내는 판별 공식
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              어떤 문제가 나와도 다음 3단계 질문만 던지면 100% 정답을 찾을 수 있습니다.
            </p>
          </div>

          {/* 3-Step Decision Flowchart Visual Cards */}
          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 text-sm">
                  1단계: "문제에 정답(레이블/Label)이 주어지는가?"
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white">
                  핵심 질문
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                컴퓨터에게 사전에 알려주는 <strong>정답(레이블)</strong>이 있다면 무조건 <strong>[지도학습]</strong>입니다!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                  <strong className="text-blue-900 block font-bold">Q. 예측하려는 결과가 '이름/종류(범주)'인가?</strong>
                  <span className="text-slate-600 block mt-0.5">
                    → <strong>지도학습 (분류)</strong> 선택! (예: 스팸/정상, 양성/음성, 합격/불합격)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                  <strong className="text-indigo-900 block font-bold">Q. 예측하려는 결과가 '연속된 숫자(수치)'인가?</strong>
                  <span className="text-slate-600 block mt-0.5">
                    → <strong>지도학습 (회귀)</strong> 선택! (예: 기온 25.4도, 시험 점수 95점, 집값)
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">
                  2단계: 정답은 없는데, "보상(Reward)을 받으며 시행착오를 겪는가?"
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-600 text-white">
                  보상 & 벌점
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                정답을 알려주는 대신 행동에 대해 <strong>'상(보상)'과 '벌(감점)'</strong>을 주어 스스로 수만 번 연습(시행착오)하며 기술을 익힌다면 무조건 <strong>[강화학습]</strong>입니다!
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-amber-200">
                <span className="text-amber-900 font-bold block">대표 키워드:</span>
                <span className="text-slate-700 block mt-0.5">
                  에이전트(주체), 환경, 보상(Reward), 벌점, 시행착오(Trial and Error), 알파고, 자율주행, 로봇 보행 균형 제어
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm">
                  3단계: 정답도 없고 보상도 없다면? "비지도학습"의 2가지!
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white">
                  라벨 없음
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                정답 라벨이 없는 대량의 데이터에서 컴퓨터가 스스로 패턴이나 무리를 찾는다면 <strong>[비지도학습]</strong>입니다!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                  <strong className="text-emerald-900 block font-bold">Q. 비슷한 특성끼리 몇 개의 무리(그룹)로 묶는가?</strong>
                  <span className="text-slate-600 block mt-0.5">
                    → <strong>비지도학습 (군집화)</strong> 선택!<br />
                    ★ 대표 알고리즘: <strong>k-평균 (K-Means)</strong>, <strong>kNN (k-최근접 이웃)</strong> 거리 계산
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-teal-200">
                  <strong className="text-teal-900 block font-bold">Q. "A를 사면 B도 함께 산다"처럼 함께 발생하는 규칙인가?</strong>
                  <span className="text-slate-600 block mt-0.5">
                    → <strong>비지도학습 (연관 규칙)</strong> 선택!<br />
                    ★ 대표 예시: <strong>대형 마트 장바구니 분석</strong> (기저귀와 맥주 동시 구매, 함께 본 영상 추천)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Call-to-action */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-sm text-indigo-300">
                기계학습 단원별 실전 문제도 바로 풀어보세요!
              </div>
              <p className="text-slate-400 mt-0.5">
                단원별 문제집에서 기계학습 기출 문제 7문항과 AI가 출제한 신유형 문제를 풀 수 있습니다.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('topics')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto min-h-[38px] flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>단원별 문제 풀러가기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
