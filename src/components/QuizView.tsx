import React, { useState, useEffect } from 'react';
import { Question, TopicType } from '../types/quiz';
import { CheckCircle2, AlertCircle, Sparkles, Clock, HelpCircle, ArrowRight, ArrowLeft, RotateCcw, BookOpen, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  questions: Question[];
  mode: 'exam' | 'topics';
  selectedTopicFilter?: TopicType | 'all';
  onFilterTopic?: (t: TopicType | 'all') => void;
  onNavigateTab?: (tab: string) => void;
  initialStudentInfo?: {
    grade: string;
    classNum: string;
    studentNumber: string;
    studentName: string;
  };
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  mode,
  selectedTopicFilter = 'all',
  onFilterTopic,
  onNavigateTab,
  initialStudentInfo,
}) => {

  // Filter questions based on topic in 'topics' mode
  const filteredQuestions = mode === 'topics' && selectedTopicFilter !== 'all'
    ? questions.filter((q) => q.topic === selectedTopicFilter)
    : questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [examFinished, setExamFinished] = useState(false);
  const [onlyWrongNotes, setOnlyWrongNotes] = useState(false);

  // AI Explanation state
  const [aiExplanation, setAiExplanation] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});

  // Timer for exam mode (고등학교 정규 시험시간 50분)
  const [secondsLeft, setSecondsLeft] = useState(50 * 60); // 50 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);

  // Student identification state (학년, 반, 번호, 이름) - Pre-filled from initial gatekeeper
  const [grade, setGrade] = useState(initialStudentInfo?.grade || '1');
  const [classNum, setClassNum] = useState(initialStudentInfo?.classNum || '5');
  const [studentName, setStudentName] = useState(initialStudentInfo?.studentName || '');
  const [studentNumber, setStudentNumber] = useState(initialStudentInfo?.studentNumber || '');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToTeacher, setSubmittedToTeacher] = useState(false);

  useEffect(() => {
    if (initialStudentInfo) {
      if (initialStudentInfo.grade) setGrade(initialStudentInfo.grade);
      if (initialStudentInfo.classNum) setClassNum(initialStudentInfo.classNum);
      if (initialStudentInfo.studentName) setStudentName(initialStudentInfo.studentName);
      if (initialStudentInfo.studentNumber) setStudentNumber(initialStudentInfo.studentNumber);
    }
  }, [initialStudentInfo]);

  useEffect(() => {
    let interval: any = null;
    if (mode === 'exam' && isExamStarted && timerActive && !examFinished) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, isExamStarted, timerActive, examFinished]);

  // Reset when questions or mode changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmitted({});
    setExamFinished(false);
    setOnlyWrongNotes(false);
    setAiExplanation({});
    setSecondsLeft(50 * 60);
    setTimerActive(false);
    setIsExamStarted(false);
  }, [mode, selectedTopicFilter]);

  const isStudentInfoComplete = Boolean(
    grade.trim() && classNum.trim() && studentNumber.trim() && studentName.trim()
  );

  const handleStartExam = () => {
    // 1. 학년, 반, 번호, 이름을 모두 작성해야 시험 시작 가능
    if (!isStudentInfoComplete) {
      return;
    }

    // 2. 시험 시작: 불필요한 중복 이메일 알림 없이 즉시 시험 타이머 및 풀이 시작
    setIsExamStarted(true);
    setTimerActive(true);
    setSecondsLeft(50 * 60);
    setCurrentIndex(0);
  };

  const activeQuestions = onlyWrongNotes
    ? filteredQuestions.filter(
        (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctIndex
      )
    : filteredQuestions;

  const currentQ = activeQuestions[currentIndex];

  const handleSelectChoice = (choiceIdx: number) => {
    if (!currentQ || (mode === 'topics' && submitted[currentQ.id])) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: choiceIdx,
    }));

    // In topic mode, submit immediately
    if (mode === 'topics') {
      setSubmitted((prev) => ({
        ...prev,
        [currentQ.id]: true,
      }));
      if (choiceIdx === currentQ.correctIndex) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    }
  };

  // Submission error state
  const [submitError, setSubmitError] = useState<string | null>(null);

  const executeSendSubmission = async (overrideName?: string, overrideNum?: string) => {
    const targetName = (overrideName ?? studentName).trim();
    const targetNumber = (overrideNum ?? studentNumber).trim();
    const targetGrade = (grade || '1').trim();
    const targetClass = (classNum || '5').trim();

    setSubmitError(null);
    if (!targetName || !targetNumber) {
      setShowSubmitModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const timeSpent = Math.max(1, 50 * 60 - secondsLeft);
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          grade: targetGrade,
          classNum: targetClass,
          studentName: targetName,
          studentNumber: targetNumber,
          score: scorePercent,
          totalQuestions: filteredQuestions.length,
          correctCount,
          timeSpentSeconds: timeSpent,
          userAnswers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedToTeacher(true);
        setShowSubmitModal(false);
      } else {
        setSubmitError(data.error || '서버 제출에 실패했습니다.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitError('서버 제출 중 네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishExam = () => {
    setExamFinished(true);
    setTimerActive(false);

    // Calculate score
    const correctNum = filteredQuestions.filter(
      (q) => userAnswers[q.id] === q.correctIndex
    ).length;
    const ratio = correctNum / (filteredQuestions.length || 1);

    if (ratio >= 0.8) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
      });
    }

    // Auto-send submission to teacher immediately if student info is present
    if (studentName.trim() && studentNumber.trim()) {
      executeSendSubmission();
    } else {
      setShowSubmitModal(true);
    }
  };

  const handleSendSubmissionToServer = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSendSubmission();
  };

  const handleAskAi = async (q: Question) => {
    if (aiExplanation[q.id] || loadingAi[q.id]) return;

    setLoadingAi((prev) => ({ ...prev, [q.id]: true }));
    try {
      const res = await fetch('/api/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          choices: q.choices,
          answer: q.choices[q.correctIndex],
          studentChoice:
            userAnswers[q.id] !== undefined
              ? q.choices[userAnswers[q.id]]
              : '선택 안 함',
          topic: q.topic,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanation((prev) => ({ ...prev, [q.id]: data.explanation }));
      } else {
        setAiExplanation((prev) => ({
          ...prev,
          [q.id]: q.explanation,
        }));
      }
    } catch {
      setAiExplanation((prev) => ({
        ...prev,
        [q.id]: q.explanation,
      }));
    } finally {
      setLoadingAi((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Scores
  const correctCount = filteredQuestions.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length;
  const scorePercent = Math.round(
    (correctCount / (filteredQuestions.length || 1)) * 100
  );

  const topicsList: { label: string; value: TopicType | 'all' }[] = [
    { label: '전체 단원', value: 'all' },
    { label: '자연어 처리', value: '자연어 처리' },
    { label: '기계학습', value: '기계학습' },
    { label: '순서도 도형', value: '순서도 도형' },
    { label: '실생활 모델링', value: '실생활 모델링' },
    { label: '파이썬 입출력·자료형', value: '파이썬 입출력·자료형' },
    { label: 'if·elif 조건문', value: 'if·elif 조건문' },
    { label: 'for·while 반복문', value: 'for·while 반복문' },
  ];

  if (!currentQ && activeQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-xl border border-slate-200">
        <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">
          풀어볼 문제가 없거나 모든 오답을 확인했습니다!
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          단원 필터를 변경하거나 전체 문제로 돌아가 보세요.
        </p>
        <button
          onClick={() => setOnlyWrongNotes(false)}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          전체 문제 다시 보기
        </button>
      </div>
    );
  }

  // If in exam mode and student hasn't clicked "시험 시작하기" yet, show the exam lobby gate
  if (mode === 'exam' && !isExamStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              <span>🏫 1학년 5반 전용</span>
              <span>·</span>
              <span>정보 교과 기말고사 실전 모의평가</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              기말고사 실전 모의평가 대기실
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              실제 고등학교 시험 환경과 동일한 <strong className="text-slate-900">50분 제한 시간</strong>으로 진행됩니다.<br />
              <strong className="text-blue-600 font-bold">‘시험 시작하기’</strong> 버튼을 눌러야 50분 타이머가 작동하고 문제를 열람 및 풀이할 수 있습니다.
            </p>
          </div>

          {/* 3 Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-center">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs text-slate-500 font-medium">시험 시간</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">50분 (카운트다운)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">고등학교 정규 시험 시간</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-center">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs text-slate-500 font-medium">문항 구성</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">총 {filteredQuestions.length}문항</div>
              <div className="text-[11px] text-slate-400 mt-0.5">4지 선다형 객관식</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-center">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-xs text-slate-500 font-medium">성적 피드백</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">자동 채점 & 제출</div>
              <div className="text-[11px] text-slate-400 mt-0.5">선생님 확인 시스템 연동</div>
            </div>
          </div>

          {/* Student Info Entry */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-blue-50/60 rounded-xl border border-blue-200/80">
            <h3 className="text-xs font-bold text-blue-950 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>수험자 학년·반·번호 입력 (필수 입력)</span>
              <span className="text-[11px] font-semibold text-blue-700">
                * 4가지 정보를 모두 입력해야 시험이 시작됩니다
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  학년 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="1"
                    className="w-full text-sm px-3 py-2.5 min-h-[44px] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 font-mono"
                  />
                  <span className="absolute right-2.5 top-3 text-xs text-slate-400">학년</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  반 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={classNum}
                    onChange={(e) => setClassNum(e.target.value)}
                    placeholder="5"
                    className="w-full text-sm px-3 py-2.5 min-h-[44px] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 font-mono text-slate-900"
                  />
                  <span className="absolute right-2.5 top-3 text-xs text-slate-400">반</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  출석 번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="예: 15"
                    className="w-full text-sm px-3 py-2.5 min-h-[44px] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 font-mono"
                  />
                  <span className="absolute right-2.5 top-3 text-xs text-slate-400">번</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  학생 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full text-sm px-3 py-2.5 min-h-[44px] bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {!isStudentInfoComplete && (
              <p className="text-[11px] text-amber-700 font-semibold mt-2.5 flex items-center gap-1">
                <span>⚠️</span>
                <span>시험을 시작하려면 위의 <strong>학년, 반, 번호, 이름</strong>을 모두 작성해 주세요.</span>
              </p>
            )}

            {isStudentInfoComplete && (
              <p className="text-[11px] text-blue-800/80 mt-2 flex items-center gap-1">
                <span>✓</span>
                <span>수험자 정보 확인 완료: <strong>{grade}학년 {classNum}반 {studentNumber}번 {studentName}</strong> 학생</span>
              </p>
            )}
          </div>

          {/* Exam Scope Checklist */}
          <div className="mt-6 border-t border-slate-100 pt-5 sm:pt-6">
            <h4 className="text-xs font-bold text-slate-700 mb-2.5 sm:mb-3">📋 1학년 5반 시험 출제 범위</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>1. 자연어 처리 (언어 차이, 토큰화, 불용어)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>2. 기계학습 (지도: 분류·회귀 / 비지도: 군집화(k평균·kNN)·연관규칙 / 강화학습: 보상)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>3. 순서도 5대 도형 (타원, 평행사변형, 물결 직사각형, 직사각형, 마름모)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>4. 실생활 모델링 (주제별 입력, 출력, 조건, 변수 구분)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>5. 파이썬 기초 (print, input, int/str/float, if/elif/else, for/while)</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 text-center space-y-2.5 sm:space-y-3">
            <button
              onClick={handleStartExam}
              disabled={!isStudentInfoComplete}
              className={`w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-black rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 min-h-[48px] ${
                isStudentInfoComplete
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:shadow-lg cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <Clock className="w-5 h-5 shrink-0" />
              <span className="truncate">
                {isStudentInfoComplete
                  ? `${grade}학년 ${classNum}반 ${studentName} - 기말고사 시작하기 (50분)`
                  : '학년, 반, 번호, 이름을 먼저 입력해 주세요'}
              </span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
            <p className="text-xs text-slate-400">
              {isStudentInfoComplete
                ? "※ '시험 시작하기'를 누르면 50분 제한 시간 카운트다운과 함께 문제 풀이가 시작됩니다."
                : "※ 수험자 정보를 모두 입력해야 시작 버튼이 활성화됩니다."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {mode === 'exam' ? '1학년 5반 기말 실전 모의고사' : '단원별 집중 문제풀이'}
              </span>
              <span className="text-xs text-slate-500">
                총 {filteredQuestions.length}문항 · 제한시간 50분
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {mode === 'exam'
                ? '1학년 5반 정보 기말고사 실전 모의평가'
                : '기출 & 예상 단원별 문제 은행'}
            </h2>
          </div>

          {/* Mode Controls */}
          {mode === 'exam' ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-900 text-xs font-mono font-bold border border-blue-200 min-h-[38px]">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>남은 시간: {formatTime(secondsLeft)}</span>
              </div>
              {!examFinished ? (
                <button
                  onClick={handleFinishExam}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs min-h-[38px] active:scale-95 transition-transform"
                >
                  답안 제출 및 채점
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setExamFinished(false);
                    setSecondsLeft(50 * 60);
                    setTimerActive(false);
                    setIsExamStarted(false);
                    setSubmittedToTeacher(false);
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 min-h-[38px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  시험 다시 보기
                </button>
              )}
            </div>
          ) : (
            /* Topic filter tabs */
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
              {topicsList.map((t) => (
                <button
                  key={t.value}
                  onClick={() => onFilterTopic && onFilterTopic(t.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] ${
                    selectedTopicFilter === t.value
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exam Finished Score Banner */}
        {mode === 'exam' && examFinished && (
          <div className="mt-4 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="text-xs font-bold text-blue-700">시험 채점 결과</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {scorePercent}점{' '}
                  <span className="text-sm font-normal text-slate-600">
                    ({correctCount} / {filteredQuestions.length} 정답)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {scorePercent >= 90
                    ? '🎉 대단합니다! 기말고사 1등급 유력권입니다!'
                    : scorePercent >= 70
                    ? '👍 좋습니다! 틀린 문제를 오답노트로 복습하면 만점 가능!'
                    : '💪 부족한 개념을 단원별 문제집과 벼락치기 요점노트로 보충해 보세요!'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isSubmitting ? (
                  <span className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1.5 min-h-[38px] animate-pulse">
                    <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>선생님께 채점 결과 전송 중...</span>
                  </span>
                ) : submittedToTeacher ? (
                  <div className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 min-h-[38px] shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>선생님께 제출 완료! ({grade}학년 {classNum}반 {studentNumber}번 {studentName})</span>
                  </div>
                ) : (
                  <button
                    onClick={() => executeSendSubmission()}
                    disabled={isSubmitting}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs min-h-[38px] flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <span>선생님께 내 답안 전송하기</span>
                  </button>
                )}

                {submitError && (
                  <button
                    onClick={() => executeSendSubmission()}
                    className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-100 border border-red-300 rounded hover:bg-red-200 transition-colors"
                  >
                    전송 재시도
                  </button>
                )}

                <button
                  onClick={() => setOnlyWrongNotes(!onlyWrongNotes)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
                    onlyWrongNotes
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {onlyWrongNotes ? '전체 문항 보기' : '오답노트만 보기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Question Card & OMR Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Question Body (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Question Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600 font-mono text-sm">
                  Q{currentIndex + 1}.
                </span>
                <span className="font-medium text-slate-700">[{currentQ.topic}]</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium">난이도: {currentQ.difficulty}</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">
                {currentIndex + 1} / {activeQuestions.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-slate-900 leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </div>

            {/* Code Snippet Box (if available) */}
            {currentQ.codeSnippet && (
              <div className="mt-3 sm:mt-4 bg-slate-950 p-3 sm:p-4 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto max-w-full">
                {currentQ.codeSnippet}
              </div>
            )}

            {/* Choices List - Touch ergonomic */}
            <div className="space-y-2 sm:space-y-2.5 mt-4 sm:mt-5">
              {currentQ.choices.map((choice, cIdx) => {
                const isSelected = userAnswers[currentQ.id] === cIdx;
                const showValidation =
                  (mode === 'topics' && submitted[currentQ.id]) ||
                  (mode === 'exam' && examFinished);
                const isCorrect = cIdx === currentQ.correctIndex;
                const isWrongSelection = showValidation && isSelected && !isCorrect;

                let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                if (showValidation) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-semibold';
                  } else if (isWrongSelection) {
                    btnStyle = 'border-red-400 bg-red-50 text-red-950';
                  } else {
                    btnStyle = 'border-slate-200 bg-white/70 text-slate-500';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-blue-500 bg-blue-50 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-500';
                }

                return (
                  <button
                    key={cIdx}
                    onClick={() => handleSelectChoice(cIdx)}
                    disabled={showValidation && mode === 'topics'}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 min-h-[48px] active:scale-[0.99] ${btnStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cIdx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer & Explanation Box (in topic mode or finished exam) */}
            {((mode === 'topics' && submitted[currentQ.id]) ||
              (mode === 'exam' && examFinished)) && (
              <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {userAnswers[currentQ.id] === currentQ.correctIndex ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 정답입니다!
                      </span>
                    ) : (
                      <span className="text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> 오답입니다. 정답은 {currentQ.correctIndex + 1}번 입니다.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAskAi(currentQ)}
                    disabled={loadingAi[currentQ.id]}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors min-h-[32px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{loadingAi[currentQ.id] ? '생성 중...' : 'AI 해설'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900 block mb-1">💡 문제 해설:</span>
                  {currentQ.explanation}
                </div>

                {currentQ.conceptTip && (
                  <div className="text-[11px] text-blue-900 bg-blue-50/80 p-2.5 rounded-lg border border-blue-100 leading-relaxed">
                    <span className="font-bold">⭐ 핵심 요점:</span> {currentQ.conceptTip}
                  </div>
                )}

                {/* AI Explanation Stream */}
                {aiExplanation[currentQ.id] && (
                  <div className="mt-2 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
                    <div className="font-bold text-indigo-900 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI 맞춤 보충 해설
                    </div>
                    <div className="whitespace-pre-line">
                      {aiExplanation[currentQ.id]}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-4 mt-5 sm:mt-6 border-t border-slate-100 gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전 문제</span>
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(activeQuestions.length - 1, prev + 1)
                )
              }
              disabled={currentIndex === activeQuestions.length - 1}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 flex items-center gap-1.5 shadow-xs min-h-[44px]"
            >
              <span>다음 문제</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: OMR Navigator (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-800">문항 바로가기 (OMR)</span>
            <span className="text-slate-500 font-mono text-[11px]">
              {Object.keys(userAnswers).length} / {activeQuestions.length} 마킹
            </span>
          </div>

          {/* OMR Grid of buttons - Touch friendly */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-h-[300px] overflow-y-auto p-1">
            {activeQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswered = userAnswers[q.id] !== undefined;
              const isExamDone = mode === 'exam' && examFinished;
              const isTopicDone = mode === 'topics' && submitted[q.id];
              const isCorrect = userAnswers[q.id] === q.correctIndex;

              let btnBg = 'bg-slate-50 text-slate-700 border-slate-200';
              if (isExamDone || isTopicDone) {
                if (isCorrect) {
                  btnBg = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                } else {
                  btnBg = 'bg-red-500 text-white border-red-600 font-bold';
                }
              } else if (hasAnswered) {
                btnBg = 'bg-blue-600 text-white border-blue-700 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 min-h-[40px] text-xs font-mono font-bold rounded-lg border transition-all flex items-center justify-center ${btnBg} ${
                    isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 scale-105' : ''
                  }`}
                >
                  <span>{idx + 1}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" />
              <span>답안 마킹 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block" />
              <span>미작성 문항</span>
            </div>
            {(mode === 'topics' || (mode === 'exam' && examFinished)) && (
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold">● 정답</span>
                <span className="text-red-600 font-bold">● 오답</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Submission to Teacher Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                제출
              </div>
              <h3 className="text-base font-bold text-slate-900">
                시험 답안 선생님께 제출
              </h3>
              <p className="text-xs text-slate-500">
                선생님에게 학생의 점수와 답안지가 안전하게 기록됩니다.
              </p>
            </div>

            <form onSubmit={handleSendSubmissionToServer} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    학년
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="1"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    반
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    required
                    value={classNum}
                    onChange={(e) => setClassNum(e.target.value)}
                    placeholder="5"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    출석 번호
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    required
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="예: 15"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    학생 이름
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="예: 김철수"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-[11px] text-blue-900 flex justify-between">
                <span>내 채점 점수:</span>
                <span className="font-bold">{scorePercent}점 ({correctCount}/{filteredQuestions.length}문항 정답)</span>
              </div>

              {submitError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ⚠️ {submitError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  나중에 하기
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  {isSubmitting ? '전송 중...' : '선생님께 제출하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
