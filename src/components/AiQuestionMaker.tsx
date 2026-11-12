import React, { useState } from 'react';
import { Question, TopicType, DifficultyType } from '../types/quiz';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check,
  X,
  BookOpen,
  Award,
  HelpCircle,
  CheckCheck,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiQuestionMakerProps {
  onNavigateTab?: (tab: string) => void;
}

export const AiQuestionMaker: React.FC<AiQuestionMakerProps> = ({
  onNavigateTab,
}) => {
  // Generation Options State
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([
    '자연어 처리',
    '기계학습',
    '순서도 도형',
    '실생활 모델링',
    '파이썬 입출력·자료형',
    'if·elif 조건문',
    'for·while 반복문',
  ]);
  const [difficulty, setDifficulty] = useState<DifficultyType>('보통');
  const [count, setCount] = useState<number>(5);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Self-Study Interactive Practice State (Strictly isolated from final exam)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});

  const allTopics: TopicType[] = [
    '자연어 처리',
    '기계학습',
    '순서도 도형',
    '실생활 모델링',
    '파이썬 입출력·자료형',
    'if·elif 조건문',
    'for·while 반복문',
  ];

  const handleToggleTopic = (topic: TopicType) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length === 1) return; // Keep at least one
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSelectAllTopics = () => {
    setSelectedTopics([...allTopics]);
  };

  const handlePresetPrompt = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  // Generate Questions from Server (Isolated for Self-Study)
  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: selectedTopics,
          difficulty,
          count,
          customPrompt:
            customPrompt ||
            '기존 모의고사나 교과서에 나오지 않은 신선하고 참신한 실생활 중심 5지선다형(1~5번 선택지) 기출 변형 문제',
        }),
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
          id: `ai-practice-${Date.now()}-${idx}`,
          topic: q.topic as TopicType,
          question: q.question,
          codeSnippet: q.codeSnippet || undefined,
          choices: q.choices,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          difficulty: (q.difficulty as DifficultyType) || '보통',
          conceptTip: q.conceptTip || undefined,
        }));

        setGeneratedQuestions(formatted);
        setUserAnswers({});
        setCheckedAnswers({});
        setStatusMessage({
          type: 'success',
          text: `🎉 AI가 맞춤 보충 문제 ${formatted.length}문항을 출제했습니다! 아래 문제지에서 직접 풀어보세요.`,
        });

        // Scroll down smoothly to problem sheet
        setTimeout(() => {
          const el = document.getElementById('ai-practice-sheet');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || '문제 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: '서버와 통신 중 오류가 발생했습니다: ' + err.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Interactive Solving Handlers
  const handleSelectChoice = (questionId: string, choiceIdx: number) => {
    // If already checked, don't allow changing unless reset
    if (checkedAnswers[questionId]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: choiceIdx,
    }));
  };

  const handleCheckAnswer = (q: Question) => {
    if (userAnswers[q.id] === undefined) return;
    setCheckedAnswers((prev) => ({
      ...prev,
      [q.id]: true,
    }));

    // Trigger celebration if correct
    if (userAnswers[q.id] === q.correctIndex) {
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.65 },
      });
    }
  };

  const handleCheckAll = () => {
    const newChecked: Record<string, boolean> = { ...checkedAnswers };
    let correctCount = 0;

    generatedQuestions.forEach((q) => {
      if (userAnswers[q.id] !== undefined) {
        newChecked[q.id] = true;
        if (userAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      }
    });

    setCheckedAnswers(newChecked);

    if (correctCount > 0 && correctCount === generatedQuestions.length) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handleResetQuestion = (questionId: string) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setCheckedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleResetAll = () => {
    setUserAnswers({});
    setCheckedAnswers({});
  };

  // Scores & Stats
  const totalCount = generatedQuestions.length;
  const answeredCount = generatedQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  const checkedCount = generatedQuestions.filter((q) => checkedAnswers[q.id]).length;
  const correctCount = generatedQuestions.filter(
    (q) => checkedAnswers[q.id] && userAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                1학년 5반 자율 학습
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                기말 모의고사와 독립된 나만의 보충 문제 풀이실
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI 맞춤 보충 문제 출제소
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              기말고사 시험 범위 중 내가 더 공부하고 싶은 단원을 골라 AI에게 문제를 출제받고, <strong>여기서 직접 풀어보며</strong> 정답과 해설을 실시간으로 확인하세요.
              <br />
              <span className="text-slate-400 text-[11px]">
                (※ 본 AI 출제 문제는 학생 본인의 보충 공부용이며, 기말 모의고사 시험 문항에는 추가되지 않습니다.)
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleSelectAllTopics}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shrink-0"
          >
            전체 단원 선택
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Topic Select */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800">
              1. 출제할 단원 선택 (복수 선택 가능)
            </label>
            <span className="text-[11px] text-slate-500">
              {selectedTopics.length}개 단원 선택됨
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleToggleTopic(topic)}
                  className={`p-3 text-left rounded-lg border text-xs transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-mono text-[10px] text-slate-400">
                    {isSelected ? '✓ 포함됨' : '○ 제외됨'}
                  </span>
                  <span className="mt-0.5 block">{topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty & Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2">
              2. 문제 난이도
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['기초', '보통', '심화'] as DifficultyType[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    difficulty === d
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2">
              3. 출제 문항 수
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    count === num
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {num}문항
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Prompt & Quick Presets */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">
            4. 세부 출제 요청사항
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="예: input() 문자열 형변환 함정 문제, for문 range 끝 번호 미포함 문제 위주로 출제해줘"
            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 py-1">자주 쓰는 요청:</span>
            {[
              'input() 문자열 반환 함정 & int() 형변환',
              '순서도 마름모 조건식 & 직사각형 연산',
              '실생활 문제 입력/출력/조건/변수 구분',
              'for문 range(stop) 끝값 미포함 & while 무한루프',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetPrompt(preset)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            onClick={handleGenerateAi}
            disabled={isGenerating || selectedTopics.length === 0}
            className="w-full py-3.5 text-xs sm:text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating
                ? 'AI가 맞춤 보충 문제를 출제하고 있습니다...'
                : `AI로 ${count}문항 보충 문제 출제받기`}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Problem Solving Sheet (The core interactive practice space!) */}
      {generatedQuestions.length > 0 && (
        <div id="ai-practice-sheet" className="space-y-6 pt-2">
          {/* Practice Session Header & Score Bar */}
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                    보충 문제 풀이 모드
                  </span>
                  <span className="text-xs text-slate-500">
                    총 {totalCount}문항 · 실시간 채점
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  선택한 {selectedTopics.join(', ')} 집중 훈련
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  1번부터 5번까지 보기를 직접 클릭하여 선택한 뒤 <strong className="text-blue-600">[정답 확인]</strong>을 누르면 실시간 채점 결과와 상세 해설이 열립니다.
                </div>
              </div>

              {/* Progress & Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
                  <span>채점 완료: </span>
                  <strong className="text-blue-600">{checkedCount}</strong> / {totalCount}문항
                  {checkedCount > 0 && (
                    <span className="ml-2 font-bold text-emerald-600">
                      (정답 {correctCount}개)
                    </span>
                  )}
                </div>

                {answeredCount > checkedCount && (
                  <button
                    type="button"
                    onClick={handleCheckAll}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>전체 채점하기</span>
                  </button>
                )}

                {checkedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>다시 풀기</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List of Interactive Question Cards */}
          <div className="space-y-4 sm:space-y-6">
            {generatedQuestions.map((q, qIdx) => {
              const selectedChoice = userAnswers[q.id];
              const isChecked = Boolean(checkedAnswers[q.id]);
              const isCorrect = isChecked && selectedChoice === q.correctIndex;
              const isWrong = isChecked && selectedChoice !== q.correctIndex;

              return (
                <div
                  key={q.id || qIdx}
                  className={`bg-white rounded-xl border transition-all p-5 sm:p-6 shadow-xs space-y-4 ${
                    isChecked
                      ? isCorrect
                        ? 'border-emerald-300 ring-1 ring-emerald-200'
                        : 'border-red-300 ring-1 ring-red-200'
                      : selectedChoice !== undefined
                      ? 'border-blue-300 ring-1 ring-blue-100'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Question Card Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 font-mono text-sm">
                        Q{qIdx + 1}.
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {q.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        난이도: {q.difficulty}
                      </span>
                    </div>

                    {/* Result Status Badge */}
                    <div>
                      {isChecked ? (
                        isCorrect ? (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            정답입니다! (+1점)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" />
                            오답 (정답: {q.correctIndex + 1}번)
                          </span>
                        )
                      ) : selectedChoice !== undefined ? (
                        <span className="text-xs text-blue-600 font-medium">
                          {selectedChoice + 1}번 선택됨
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          문제를 읽고 보기를 선택하세요
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </div>

                  {/* Code Snippet (if present) */}
                  {q.codeSnippet && (
                    <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-4">
                      <div className="text-[10px] text-slate-400 font-mono mb-2 flex items-center justify-between border-b border-slate-800 pb-1">
                        <span>Python / Code Snippet</span>
                        <span>실행 코드</span>
                      </div>
                      <pre className="font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* 4 Clickable Choices (The Interactive Solving Core!) */}
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.choices.map((choice, cIdx) => {
                      const isThisSelected = selectedChoice === cIdx;
                      const isThisCorrect = cIdx === q.correctIndex;

                      // Style determination based on checked status
                      let buttonStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
                      let badgeStyle = 'bg-slate-100 text-slate-700';

                      if (isChecked) {
                        if (isThisCorrect) {
                          // Correct choice is highlighted in emerald
                          buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-300';
                          badgeStyle = 'bg-emerald-600 text-white font-bold';
                        } else if (isThisSelected) {
                          // Student chose this wrong choice
                          buttonStyle = 'border-red-400 bg-red-50 text-red-900 line-through ring-1 ring-red-200';
                          badgeStyle = 'bg-red-600 text-white font-bold';
                        } else {
                          // Other wrong choices subdued
                          buttonStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                          badgeStyle = 'bg-slate-200 text-slate-500';
                        }
                      } else if (isThisSelected) {
                        // User selected this choice before checking
                        buttonStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-500/20 shadow-xs';
                        badgeStyle = 'bg-blue-600 text-white font-bold';
                      }

                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSelectChoice(q.id, cIdx)}
                          disabled={isChecked}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all min-h-[44px] ${buttonStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${badgeStyle}`}
                            >
                              {cIdx + 1}
                            </span>
                            <span className="leading-relaxed">{choice}</span>
                          </div>

                          {isChecked && isThisCorrect && (
                            <span className="shrink-0 flex items-center gap-1 text-xs text-emerald-700 font-bold">
                              <Check className="w-4 h-4 text-emerald-600" />
                              정답
                            </span>
                          )}
                          {isChecked && isThisSelected && !isThisCorrect && (
                            <span className="shrink-0 flex items-center gap-1 text-xs text-red-700 font-bold">
                              <X className="w-4 h-4 text-red-600" />
                              내가 고른 오답
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Bar for this question */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    {!isChecked ? (
                      <button
                        type="button"
                        onClick={() => handleCheckAnswer(q)}
                        disabled={selectedChoice === undefined}
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs min-h-[38px]"
                      >
                        <Check className="w-4 h-4" />
                        <span>정답 확인하기</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleResetQuestion(q.id)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 min-h-[34px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>이 문제 다시 풀기</span>
                        </button>
                      </div>
                    )}

                    {selectedChoice === undefined && !isChecked && (
                      <span className="text-[11px] text-slate-400">
                        * 보기를 누른 후 [정답 확인하기]를 클릭하세요.
                      </span>
                    )}
                  </div>

                  {/* Revealed Explanation & Concept Tip (Only shown after student checks answer!) */}
                  {isChecked && (
                    <div className="mt-3 space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed animate-fade-in">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>정답 해설 (정답: {q.correctIndex + 1}번)</span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap pl-5">
                        {q.explanation}
                      </p>

                      {q.conceptTip && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-blue-900 bg-blue-50/80 p-2.5 rounded-lg flex items-start gap-2">
                          <span className="font-bold shrink-0 text-blue-700">💡 핵심 팁:</span>
                          <span className="text-[11px] leading-relaxed">{q.conceptTip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State before generating questions */}
      {generatedQuestions.length === 0 && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            아직 생성된 보충 문제가 없습니다
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            상단에서 원하는 단원과 난이도를 고르고 <strong>[AI로 보충 문제 출제받기]</strong>를 누르면, 정답이 바로 보이지 않고 직접 풀 수 있는 문제지가 바로 열립니다.
          </p>
        </div>
      )}
    </div>
  );
};
