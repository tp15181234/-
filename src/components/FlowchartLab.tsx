import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

interface FlowStep {
  id: number;
  shape: 'oval' | 'parallelogram' | 'rectangle' | 'diamond' | 'wave_rect';
  shapeName: string;
  label: string;
  description: string;
  pythonLine: string;
  varState: Record<string, any>;
}

const FLOWCHART_EXAMPLES: {
  id: string;
  title: string;
  description: string;
  initialVars: Record<string, any>;
  steps: FlowStep[];
}[] = [
  {
    id: 'sum-1-to-3',
    title: '1부터 3까지의 합 구하기 (누적합 알고리즘)',
    description: '타원(시작/끝), 평행사변형(입력), 직사각형(처리/연산), 마름모(조건/판단), 아랫변 물결 사각형(출력)의 5가지 표준 도형 흐름을 단계별로 추적합니다.',
    initialVars: { N: 3, total: 0, i: 1 },
    steps: [
      {
        id: 1,
        shape: 'oval',
        shapeName: '시작, 끝 (타원)',
        label: '시작 (Start)',
        description: '프로그램 알고리즘을 시작합니다.',
        pythonLine: '# 프로그램 시작',
        varState: { total: 0, i: 1 },
      },
      {
        id: 2,
        shape: 'parallelogram',
        shapeName: '입력 (평행사변형)',
        label: 'N = 3 입력받기',
        description: '키보드로부터 더할 최댓값 N(3)을 입력(input)받습니다.',
        pythonLine: 'N = int(input("정수 입력: "))  # 3 입력',
        varState: { N: 3, total: 0, i: 1 },
      },
      {
        id: 3,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'total = 0, i = 1 대입',
        description: '합계를 저장할 total을 0으로, 반복 횟수를 셀 i를 1로 대입하여 초기화합니다.',
        pythonLine: 'total = 0\ni = 1',
        varState: { N: 3, total: 0, i: 1 },
      },
      {
        id: 4,
        shape: 'diamond',
        shapeName: '조건/판단 (마름모)',
        label: 'i <= N (1 <= 3) ? [참/Yes]',
        description: '현재 i는 1이고 N은 3이므로 조건(1 <= 3)이 참(True)입니다. 참(Yes) 분기로 진행합니다.',
        pythonLine: 'while i <= N:  # 1 <= 3 참(True)',
        varState: { N: 3, total: 0, i: 1 },
      },
      {
        id: 5,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'total = total + i (0 + 1 = 1)',
        description: '현재 i값(1)을 total(0)에 누적하여 더합니다. total은 1이 됩니다.',
        pythonLine: '    total = total + i  # total = 0 + 1 (1)',
        varState: { N: 3, total: 1, i: 1 },
      },
      {
        id: 6,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'i = i + 1 (i = 2)',
        description: '다음 단계 반복을 위해 i를 1 증가시켜 2로 만듭니다.',
        pythonLine: '    i = i + 1  # i = 2',
        varState: { N: 3, total: 1, i: 2 },
      },
      {
        id: 7,
        shape: 'diamond',
        shapeName: '조건/판단 (마름모)',
        label: 'i <= N (2 <= 3) ? [참/Yes]',
        description: '현재 i는 2이므로 조건(2 <= 3)이 여전히 참(True)입니다.',
        pythonLine: 'while i <= N:  # 2 <= 3 참(True)',
        varState: { N: 3, total: 1, i: 2 },
      },
      {
        id: 8,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'total = total + i (1 + 2 = 3)',
        description: '현재 i값(2)을 total(1)에 더하여 total은 3이 됩니다.',
        pythonLine: '    total = total + i  # total = 1 + 2 (3)',
        varState: { N: 3, total: 3, i: 2 },
      },
      {
        id: 9,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'i = i + 1 (i = 3)',
        description: 'i를 1 증가시켜 3으로 만듭니다.',
        pythonLine: '    i = i + 1  # i = 3',
        varState: { N: 3, total: 3, i: 3 },
      },
      {
        id: 10,
        shape: 'diamond',
        shapeName: '조건/판단 (마름모)',
        label: 'i <= N (3 <= 3) ? [참/Yes]',
        description: '현재 i는 3이므로 조건(3 <= 3)이 참(True)입니다. 마지막 회차 반복을 수행합니다.',
        pythonLine: 'while i <= N:  # 3 <= 3 참(True)',
        varState: { N: 3, total: 3, i: 3 },
      },
      {
        id: 11,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'total = total + i (3 + 3 = 6)',
        description: '현재 i값(3)을 total(3)에 더하여 total은 6이 됩니다.',
        pythonLine: '    total = total + i  # total = 3 + 3 (6)',
        varState: { N: 3, total: 6, i: 3 },
      },
      {
        id: 12,
        shape: 'rectangle',
        shapeName: '처리 (직사각형)',
        label: 'i = i + 1 (i = 4)',
        description: 'i를 1 증가시켜 4로 만듭니다.',
        pythonLine: '    i = i + 1  # i = 4',
        varState: { N: 3, total: 6, i: 4 },
      },
      {
        id: 13,
        shape: 'diamond',
        shapeName: '조건/판단 (마름모)',
        label: 'i <= N (4 <= 3) ? [거짓/No]',
        description: 'i가 4가 되어 3 이하가 아닙니다. 조건이 거짓(False)이므로 반복문(while)을 탈출하여 No 분기(출력 단계)로 이동합니다.',
        pythonLine: '# 4 <= 3 거짓(False) -> 반복문 탈출',
        varState: { N: 3, total: 6, i: 4 },
      },
      {
        id: 14,
        shape: 'wave_rect',
        shapeName: '출력 (아랫변 물결 직사각형)',
        label: 'total 출력 (6)',
        description: '출력 기호(아랫변이 태극기 물결 모양인 직사각형)로 최종 누적 계산된 total값(6)을 화면에 출력합니다.',
        pythonLine: 'print("합계:", total)  # 출력: 6',
        varState: { N: 3, total: 6, i: 4 },
      },
      {
        id: 15,
        shape: 'oval',
        shapeName: '시작, 끝 (타원)',
        label: '끝 (End)',
        description: '알고리즘을 종료합니다.',
        pythonLine: '# 프로그램 종료',
        varState: { N: 3, total: 6, i: 4 },
      },
    ],
  },
  {
    id: 'even-odd',
    title: '짝수 / 홀수 판별 알고리즘 (조건 분기)',
    description: '입력과 마름모 조건 판단, 양 갈래 출력 구조를 익힙니다.',
    initialVars: { num: 7 },
    steps: [
      {
        id: 1,
        shape: 'oval',
        shapeName: '시작, 끝 (타원)',
        label: '시작 (Start)',
        description: '프로그램을 시작합니다.',
        pythonLine: '# 시작',
        varState: {},
      },
      {
        id: 2,
        shape: 'parallelogram',
        shapeName: '입력 (평행사변형)',
        label: '정수 num 입력받기 (예: 7)',
        description: '사용자로부터 숫자 7을 입력받습니다.',
        pythonLine: 'num = int(input("정수 입력: "))',
        varState: { num: 7 },
      },
      {
        id: 3,
        shape: 'diamond',
        shapeName: '조건/판단 (마름모)',
        label: 'num % 2 == 0 ? (거짓/No)',
        description: '7을 2로 나눈 나머지는 1이므로 0이 아닙니다 (False). No 분기로 이동!',
        pythonLine: 'if num % 2 == 0:',
        varState: { num: 7, remainder: 1 },
      },
      {
        id: 4,
        shape: 'wave_rect',
        shapeName: '출력 (아랫변 물결 직사각형)',
        label: '"홀수입니다" 출력',
        description: 'else 조건에 해당하므로 출력 기호(아랫변 웨이브 모양)로 홀수를 출력합니다.',
        pythonLine: 'else:\n    print("홀수입니다")',
        varState: { num: 7, result: '홀수' },
      },
      {
        id: 5,
        shape: 'oval',
        shapeName: '시작, 끝 (타원)',
        label: '끝 (End)',
        description: '알고리즘을 종료합니다.',
        pythonLine: '# 종료',
        varState: { num: 7, result: '홀수' },
      },
    ],
  },
];

export const FlowchartLab: React.FC = () => {
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [activeShapeInspect, setActiveShapeInspect] = useState<string | null>(null);

  const currentExample = FLOWCHART_EXAMPLES[selectedExampleIdx];
  const currentStep = currentExample.steps[currentStepIdx] || currentExample.steps[0];

  const handleNext = () => {
    if (currentStepIdx < currentExample.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  // Render SVG Node based on shape type
  const renderShapeNode = (step: FlowStep, isCurrent: boolean) => {
    let shapeClasses = 'transition-all duration-300 ';
    if (isCurrent) {
      shapeClasses += 'ring-4 ring-blue-500 shadow-md font-semibold ';
    } else {
      shapeClasses += 'opacity-85 hover:opacity-100 ';
    }

    if (step.shapeName.includes('되돌아가기') || step.shapeName.includes('루프')) {
      return (
        <div className="flex flex-col items-center">
          <div className={`px-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/90 text-indigo-950 text-xs text-center min-w-[170px] flex items-center justify-center gap-2 ${shapeClasses}`}>
            <span className="text-base font-bold text-indigo-600">↺</span>
            <div className="text-left">
              <div className="font-bold text-[11px]">{step.label}</div>
              <div className="text-[10px] text-indigo-700 font-semibold">반복문 흐름선: 마름모(조건)로 복귀</div>
            </div>
          </div>
        </div>
      );
    }

    if (step.shape === 'oval') {
      return (
        <div className={`px-5 py-2.5 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-900 text-xs text-center min-w-[130px] ${shapeClasses}`}>
          <div className="font-bold">{step.label}</div>
          <div className="text-[10px] text-emerald-700">타원: 시작, 끝</div>
        </div>
      );
    }

    if (step.shape === 'parallelogram') {
      return (
        <div
          style={{ transform: 'skewX(-14deg)' }}
          className={`px-5 py-2.5 border-2 border-blue-500 bg-blue-50 text-blue-950 text-xs text-center min-w-[140px] ${shapeClasses}`}
        >
          <div style={{ transform: 'skewX(14deg)' }}>
            <div className="font-bold">{step.label}</div>
            <div className="text-[10px] text-blue-700 font-semibold">평행사변형: 입력</div>
          </div>
        </div>
      );
    }

    // 출력: 아랫변이 태극기 물결/웨이브 모양인 직사각형
    if (step.shape === 'wave_rect') {
      return (
        <div className="flex flex-col items-center">
          <div className={`relative w-42 h-14 ${shapeClasses}`}>
            <svg viewBox="0 0 168 56" className="w-full h-full drop-shadow-2xs">
              <path
                d="M 4 4 L 164 4 L 164 38 C 124 24, 84 52, 4 38 Z"
                className="fill-indigo-50 stroke-indigo-600 stroke-2"
              />
            </svg>
            <div className="absolute inset-0 pb-2.5 flex flex-col items-center justify-center text-center px-2">
              <span className="font-bold text-xs text-indigo-950 truncate max-w-[140px]">
                {step.label}
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold">출력 (물결 사각형)</span>
            </div>
          </div>
        </div>
      );
    }

    if (step.shape === 'rectangle') {
      return (
        <div className={`px-5 py-2.5 rounded-md border-2 border-amber-500 bg-amber-50 text-amber-950 text-xs text-center min-w-[140px] ${shapeClasses}`}>
          <div className="font-bold">{step.label}</div>
          <div className="text-[10px] text-amber-700 font-semibold">직사각형: 처리/연산</div>
        </div>
      );
    }

    if (step.shape === 'diamond') {
      return (
        <div className="flex flex-col items-center">
          <div
            className={`w-28 h-16 border-2 border-purple-500 bg-purple-50 text-purple-950 flex items-center justify-center text-center p-2 text-xs relative ${shapeClasses}`}
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          >
            <span className="font-bold text-[11px] px-1 line-clamp-2 leading-tight">
              {step.label.split('(')[0]}
            </span>
          </div>
          <span className="text-[10px] text-purple-700 font-semibold mt-1">마름모: 조건/판단</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              순서도(Flowchart) 표준 도형 & 알고리즘 시뮬레이터
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              우리가 배운 <strong>시작, 끝(타원)</strong>, <strong>입력(평행사변형)</strong>, <strong>출력(아랫변 물결 모양 사각형)</strong>, <strong>처리(직사각형)</strong>, <strong>조건(마름모)</strong>이 어떻게 작동하는지 단계별로 확인해보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
            {FLOWCHART_EXAMPLES.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setSelectedExampleIdx(idx);
                  setCurrentStepIdx(0);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
                  selectedExampleIdx === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                예제 {idx + 1}: {idx === 0 ? '1부터 3까지 합 (누적합)' : '홀짝 판별 (if 조건문)'}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Standard Shapes Summary Guide (정확한 1학년 5반 교과서 기준) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mt-4">
          {/* 1. 타원 */}
          <div
            onClick={() => setActiveShapeInspect('oval')}
            className="cursor-pointer p-2.5 sm:p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-3 rounded-full border border-emerald-600 bg-emerald-100" />
              <span className="text-xs font-bold text-emerald-900">타원</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold mt-1">시작, 끝</p>
            <p className="text-[10px] text-slate-500">프로그램 시작(Start)과 끝(End)</p>
          </div>

          {/* 2. 평행사변형 */}
          <div
            onClick={() => setActiveShapeInspect('parallelogram')}
            className="cursor-pointer p-2.5 sm:p-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                style={{ transform: 'skewX(-15deg)' }}
                className="w-5 h-3 border border-blue-600 bg-blue-100"
              />
              <span className="text-xs font-bold text-blue-900">평행사변형</span>
            </div>
            <p className="text-[11px] text-blue-800 font-semibold mt-1">입력</p>
            <p className="text-[10px] text-slate-500">키보드 데이터 입력 (input)</p>
          </div>

          {/* 3. 아랫변 물결 사각형 (출력) */}
          <div
            onClick={() => setActiveShapeInspect('wave_rect')}
            className="cursor-pointer p-2.5 sm:p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 14" className="w-5 h-3">
                <path
                  d="M 1 1 L 23 1 L 23 10 C 17 6, 11 13, 1 9 Z"
                  className="fill-indigo-100 stroke-indigo-600 stroke-[1.5]"
                />
              </svg>
              <span className="text-xs font-bold text-indigo-900">물결 사각형</span>
            </div>
            <p className="text-[11px] text-indigo-800 font-semibold mt-1">출력</p>
            <p className="text-[10px] text-slate-500">화면 및 결과물 출력 (print)</p>
          </div>

          {/* 4. 직사각형 */}
          <div
            onClick={() => setActiveShapeInspect('rectangle')}
            className="cursor-pointer p-2.5 sm:p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-3 border border-amber-600 bg-amber-100 rounded-[2px]" />
              <span className="text-xs font-bold text-amber-900">직사각형</span>
            </div>
            <p className="text-[11px] text-amber-800 font-semibold mt-1">처리 / 연산</p>
            <p className="text-[10px] text-slate-500">사칙계산, 변수 대입 (할당)</p>
          </div>

          {/* 5. 마름모 */}
          <div
            onClick={() => setActiveShapeInspect('diamond')}
            className="col-span-2 sm:col-span-1 cursor-pointer p-2.5 sm:p-3 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-3 border border-purple-600 bg-purple-100"
                style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
              />
              <span className="text-xs font-bold text-purple-900">마름모</span>
            </div>
            <p className="text-[11px] text-purple-800 font-semibold mt-1">조건 / 판단</p>
            <p className="text-[10px] text-slate-500">참/거짓 분기 (if문, while문)</p>
          </div>
        </div>
      </div>

      {/* Interactive Stage & Python Code Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Flowchart Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 sm:mb-4">
              <div className="text-sm font-semibold text-slate-800">
                {currentExample.title}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                단계 {currentStepIdx + 1} / {currentExample.steps.length}
              </div>
            </div>

            {/* Active Step Highlight Box */}
            <div className="p-3.5 sm:p-4 rounded-lg bg-blue-50/80 border border-blue-200 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-blue-900 text-xs font-semibold">
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px]">현재 실행 위치</span>
                <span>{currentStep.shapeName}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {currentStep.label}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentStep.description}
              </p>
            </div>

            {/* Visual Step Nodes Sequence (Vertical Flow) */}
            <div className="py-2 flex flex-col items-center gap-3 max-h-[360px] sm:max-h-[380px] overflow-y-auto px-2 sm:px-4">
              {currentExample.steps.map((step, idx) => {
                const isCurrent = idx === currentStepIdx;
                const isPassed = idx < currentStepIdx;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      onClick={() => setCurrentStepIdx(idx)}
                      className="cursor-pointer transform hover:scale-102 transition-transform"
                    >
                      {renderShapeNode(step, isCurrent)}
                    </div>
                    {idx < currentExample.steps.length - 1 && (
                      <div className="text-slate-400 flex flex-col items-center">
                        <div className={`w-0.5 h-3 ${isPassed ? 'bg-blue-500' : 'bg-slate-300'}`} />
                        <div className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] ${isPassed ? 'border-t-blue-500' : 'border-t-slate-400'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between pt-4 mt-5 sm:mt-6 border-t border-slate-100 gap-2">
            <button
              onClick={handleReset}
              className="px-3 sm:px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg flex items-center gap-1.5 min-h-[42px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>처음으로</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 min-h-[42px]"
              >
                이전 단계
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIdx === currentExample.steps.length - 1}
                className="px-4 sm:px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg disabled:opacity-40 hover:bg-blue-700 flex items-center gap-1.5 shadow-xs min-h-[42px]"
              >
                <span>다음 단계</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Python Code & Variable Memory State (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {/* Matching Python Code */}
          <div className="bg-slate-900 rounded-xl p-4 sm:p-5 text-slate-100 border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">대응되는 파이썬 코드</span>
              <span className="text-[11px]">Python 3</span>
            </div>
            <pre className="mt-3 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {currentStep.pythonLine}
            </pre>
            <div className="text-[11px] text-slate-400 mt-2">
              💡 {currentStep.shapeName}는 파이썬의 이 문장과 정확히 1:1로 대응됩니다.
            </div>
          </div>

          {/* Variable State Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>변수 메모리 상태 추적표 (Trace Table)</span>
              <span className="text-[11px] text-slate-500 font-normal">Step {currentStepIdx + 1}</span>
            </div>

            {Object.keys(currentStep.varState).length > 0 ? (
              <div className="divide-y divide-slate-100 mt-2">
                {Object.entries(currentStep.varState).map(([key, val]) => (
                  <div key={key} className="py-2 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600 font-semibold">{key}</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                변수가 아직 생성되지 않았습니다.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              * 기말고사 주관식/객관식에서 순서도의 변수 변화를 묻는 문제가 자주 출제됩니다. 각 단계마다 변수 값이 어떻게 바뀌는지 주의깊게 보세요!
            </div>
          </div>

          {/* Flowchart Schema Guide */}
          {selectedExampleIdx === 0 && (
            <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/60 rounded-xl border border-indigo-200 p-4 space-y-2 text-xs">
              <div className="font-bold text-indigo-950 flex items-center justify-between">
                <span>🔄 1부터 3까지 합 순서도 핵심 원리</span>
                <span className="text-[10px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                  5대 도형 완벽 반영
                </span>
              </div>
              <div className="text-[11px] text-indigo-900 space-y-1.5 leading-relaxed pt-1">
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                  <span><strong>시작(타원)</strong>: 프로그램 시작</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                  <span><strong>입력(평행사변형)</strong>: <code>N = 3</code> 키보드로부터 입력받기 (input)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                  <span><strong>처리(직사각형)</strong>: <code>total = 0, i = 1</code> 초기값 대입</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold text-[10px]">4</span>
                  <div>
                    <strong>조건(마름모)</strong>: <code>i &lt;= 3</code> 인가?
                    <div className="text-slate-600 pl-1 mt-0.5">
                      • <strong>Yes(참)</strong> ➔ <code>total = total + i</code> ➔ <code>i = i + 1</code> (1, 2, 3회차 반복 누적)
                      <br />
                      • <strong>No(거짓)</strong> ➔ i가 4가 되면 조건 거짓 ➔ 반복문 탈출 후 출력 단계로 이동
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 font-bold text-[10px]">5</span>
                  <span><strong>출력(물결 사각형)</strong>: 최종 계산된 합계 <code>total(6)</code> 화면 출력 (print)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-[10px]">6</span>
                  <span><strong>끝(타원)</strong>: 프로그램 종료</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
