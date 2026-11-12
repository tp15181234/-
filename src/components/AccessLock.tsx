import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, ArrowRight, KeyRound, User, Hash } from 'lucide-react';
import { isAuthorized1Class5, SECRET_GATE_PIN } from '../data/classRoster';

export interface StudentAuthInfo {
  grade: string;
  classNum: string;
  studentNumber: string;
  studentName: string;
}

interface AccessLockProps {
  onUnlock: (info: StudentAuthInfo) => void;
}

export const AccessLock: React.FC<AccessLockProps> = ({ onUnlock }) => {
  // Student identification inputs (Required before gatekeeper unlock)
  const [grade, setGrade] = useState('1');
  const [classNum, setClassNum] = useState('5');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentName, setStudentName] = useState('');

  // 8-digit PIN state
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedGrade = grade.trim();
    const trimmedClass = classNum.trim();
    const trimmedNum = studentNumber.trim();
    const trimmedName = studentName.trim();
    const trimmedCode = inputCode.trim();

    // 1. Validate complete student info
    if (!trimmedGrade || !trimmedClass || !trimmedNum || !trimmedName) {
      setIsShaking(true);
      setErrorMessage('학년, 반, 번호, 이름을 모두 작성해야 입장이 가능합니다.');
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // 2. Validate PIN code
    if (trimmedCode !== SECRET_GATE_PIN) {
      setIsShaking(true);
      setErrorMessage('입장 코드가 일치하지 않습니다. 8자리 비밀번호를 다시 확인해 주세요.');
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsSubmitting(true);

    // 3. Check if legitimate 1-5 student or teacher
    const isAuthorized = isAuthorized1Class5(trimmedGrade, trimmedClass, trimmedName);

    // 4. Silent Teacher Notification: If external student (other class or unauthorized name),
    // silently notify teacher email without showing ANY alert or hint to the student.
    if (!isAuthorized) {
      try {
        await fetch('/api/alerts/unauthorized', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            grade: trimmedGrade,
            classNum: trimmedClass,
            studentNumber: trimmedNum,
            studentName: trimmedName,
            eventType: 'GATEKEEPER_ENTRY',
          }),
        });
      } catch {
        // Silently ignore background network errors
      }
    }

    // 5. Unlock and pass student info seamlessly into the app
    onUnlock({
      grade: trimmedGrade,
      classNum: trimmedClass,
      studentNumber: trimmedNum,
      studentName: trimmedName,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-3 sm:p-4 py-6 sm:py-8 font-sans">
      <div
        className={`w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-8 text-white shadow-2xl transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Header Lock Icon */}
        <div className="text-center space-y-2.5 sm:space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div>
            <div className="text-xs font-bold text-blue-400 tracking-wider">
              1학년 5반 전용 보안 인증 게이트
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              정보 기말고사 마스터
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              본 앱은 1학년 5반 학생 전용 학습 시스템입니다.<br />
              수험자 정보와 <strong>보안 입장 코드(8자리)</strong>를 입력하여 입장하세요.
            </p>
          </div>
        </div>

        {/* Gatekeeper Form */}
        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4">
          {/* Student Info Inputs: 학년, 반, 번호, 이름 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 pb-1 border-b border-slate-800">
              <User className="w-3.5 h-3.5" />
              <span>수험자 기본 정보</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">학년</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="1"
                  className="w-full text-center py-2 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">반</label>
                <input
                  type="text"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  placeholder="5"
                  className="w-full text-center py-2 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">번호</label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="예: 7"
                  className="w-full text-center py-2 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">이름</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full text-center py-2 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 8-Digit PIN Code Input */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>보안 비밀번호</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">8자리 숫자</span>
            </div>

            <div className="relative mt-2">
              <input
                type="password"
                maxLength={8}
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.replace(/[^0-9]/g, ''));
                  setErrorMessage('');
                }}
                placeholder="비밀번호 8자리"
                className="w-full text-center tracking-[0.3em] font-mono text-xl py-3 px-4 min-h-[46px] bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 pt-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < inputCode.length
                      ? 'bg-blue-500 scale-110 shadow-xs shadow-blue-500'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98] disabled:opacity-50"
          >
            <span>보안 인증 및 입장하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Notice Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500">
          <span>* 시험 보안 관리를 위해 수험자 입장 내역이 안전하게 기록됩니다.</span>
        </div>
      </div>
    </div>
  );
};
