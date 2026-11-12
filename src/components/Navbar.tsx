import React from 'react';
import { Printer, UserCheck, Lock, LogIn, LogOut, Shield } from 'lucide-react';
import { GoogleUser, TEACHER_EMAIL } from './GoogleAuthModal';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPrint: () => void;
  onOpenAiMaker: () => void;
  onOpenTeacher: () => void;
  onLock: () => void;
  currentUser: GoogleUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  submissionCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPrint,
  onOpenAiMaker,
  onOpenTeacher,
  onLock,
  currentUser,
  onOpenAuth,
  onLogout,
  submissionCount = 0,
}) => {
  const isTeacher = Boolean(
    currentUser && currentUser.email.trim().toLowerCase() === TEACHER_EMAIL.toLowerCase()
  );

  const navItems = [
    { id: 'exam', label: '기말 모의고사' },
    { id: 'topics', label: '단원별 문제집' },
    { id: 'aimaker', label: 'AI 문제 출제소 ✨' },
    { id: 'modeling', label: '입·출·조·변 훈련소' },
    { id: 'ml', label: '기계학습 판별소 🤖' },
    { id: 'flowchart', label: '순서도 스튜디오' },
    { id: 'sandbox', label: '파이썬 샌드박스' },
    { id: 'cheatsheet', label: '벼락치기 요점노트' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand title wordmark */}
        <div 
          onClick={() => onSelectTab('exam')}
          className="cursor-pointer flex items-center gap-2 shrink-0 group min-h-[40px]"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:bg-blue-700 transition-colors shrink-0">
            1-5
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              1학년 5반 정보
            </span>
            <span className="hidden sm:inline text-[10px] text-slate-500 font-medium -mt-0.5">
              기말고사 완벽대비
            </span>
          </div>
        </div>

        {/* Zone 2: Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-100 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Authentication & Action CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* ONLY SHOWN WHEN LOGGED IN AS TEACHER (tp15181234@gmail.com) */}
          {isTeacher && (
            <button
              onClick={onOpenTeacher}
              title="선생님 답안 확인 대시보드"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0 min-h-[36px] shadow-2xs animate-fade-in"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden xs:inline sm:inline">선생님 확인</span>
              {submissionCount > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full font-mono text-[10px] font-bold">
                  {submissionCount}
                </span>
              )}
            </button>
          )}

          {/* Google Auth Status Badge / Login Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                title={`Google 계정: ${currentUser.email}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors min-h-[36px] ${
                  isTeacher
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {isTeacher ? (
                  <span className="text-xs">👑</span>
                ) : (
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span className="font-semibold truncate max-w-[100px] sm:max-w-[130px]">
                  {isTeacher ? '선생님 계정' : (currentUser.name || currentUser.email.split('@')[0])}
                </span>
              </button>

              <button
                onClick={onLogout}
                title="로그아웃"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors min-h-[36px] min-w-[32px] flex items-center justify-center"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Google 계정으로 로그인"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[36px] shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>구글 로그인</span>
            </button>
          )}

          {/* Print button on desktop */}
          <button
            onClick={onOpenPrint}
            title="시험지 A4 인쇄"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>시험지 인쇄</span>
          </button>

          {/* Access Lock button */}
          <button
            onClick={onLock}
            title="앱 잠금 (비밀번호 모드로 전환)"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav touch tab bar */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-2 border-t border-slate-100 overflow-x-auto bg-slate-50/90 backdrop-blur-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 min-h-[38px] transition-all active:scale-95 flex items-center justify-center ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
