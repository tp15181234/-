import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { Printer, X, CheckSquare, Eye, EyeOff } from 'lucide-react';

interface PrintExamModalProps {
  questions: Question[];
  onClose: () => void;
}

export const PrintExamModal: React.FC<PrintExamModalProps> = ({
  questions,
  onClose,
}) => {
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [examTitle, setExamTitle] = useState('2026학년도 1학년 5반 정보 기말고사 평가 문제지');
  const [schoolName, setSchoolName] = useState('1학년 5반 정보 교실');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Toolbar (hidden during actual browser print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm text-slate-900">
              1학년 5반 시험지 인쇄 및 PDF 저장
            </span>
            <span className="text-xs text-slate-500">
              (총 {questions.length}문항 · 제한시간 50분)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncludeAnswers(!includeAnswers)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              {includeAnswers ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                  <span>정답·해설 숨기기</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>정답·해설 포함하기</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>지금 인쇄하기 (Ctrl+P)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto font-sans text-slate-900 print:p-6 print:overflow-visible">
          {/* Header */}
          <div className="border-4 border-slate-900 p-4 text-center mb-6">
            <div className="text-xs font-bold text-slate-600 tracking-widest">
              {schoolName}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {examTitle}
            </h1>
            <div className="mt-3 pt-3 border-t-2 border-slate-900 flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 gap-2">
              <span>과목: 정보 (파이썬·순서도·실생활모델링·자연어처리)</span>
              <span>배점: 각 문항 동일</span>
              <div className="flex items-center gap-3">
                <span>학년: 1</span>
                <span>반: 5</span>
                <span>번호: ____</span>
                <span>이름: ____________</span>
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="text-[11px] text-slate-600 mb-6 pb-2 border-b border-slate-300 flex justify-between items-center">
            <span>※ 문제지의 각 문항을 잘 읽고 정답을 고르시오. (총 {questions.length}문항)</span>
            <span>제한시간: 50분 (고등학교 정규 시험)</span>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="break-inside-avoid text-xs sm:text-sm">
                <div className="font-bold flex items-start gap-1.5 text-slate-950">
                  <span className="font-mono text-blue-700">[{idx + 1}]</span>
                  <span className="whitespace-pre-line leading-snug">{q.question}</span>
                </div>

                {q.codeSnippet && (
                  <div className="my-2 p-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-900 leading-relaxed whitespace-pre-wrap">
                    {q.codeSnippet}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-slate-800 pl-4">
                  {q.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1.5 py-0.5">
                      <span className="font-bold text-slate-600">{['①', '②', '③', '④', '⑤'][cIdx] || `(${cIdx + 1})`}</span>
                      <span>{choice}</span>
                    </div>
                  ))}
                </div>

                {includeAnswers && (
                  <div className="mt-2 p-2 rounded bg-slate-100 text-[11px] text-slate-700 border-l-2 border-blue-600 pl-2">
                    <span className="font-bold text-blue-700">
                      [정답: {q.correctIndex + 1}번]
                    </span>{' '}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Answer Key Sheet at bottom if included */}
          {includeAnswers && (
            <div className="mt-12 pt-6 border-t-2 border-dashed border-slate-400 break-before-page">
              <h3 className="text-base font-bold text-center mb-4">
                [ 정답 및 해설표 ]
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center text-xs">
                {questions.map((q, idx) => (
                  <div key={q.id} className="border border-slate-300 p-1.5 rounded">
                    <div className="font-bold text-slate-500 font-mono">Q{idx + 1}</div>
                    <div className="font-bold text-blue-700 text-sm">{q.correctIndex + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
