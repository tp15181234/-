import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Download, CheckCircle2, XCircle, Users, Award, Trash2, X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { Question } from '../types/quiz';

export interface SubmissionData {
  id: string;
  grade?: string;
  classNum?: string;
  studentName: string;
  studentNumber: string;
  isUnauthorizedClass?: boolean;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, number>;
  topicScores: Record<string, { correct: number; total: number }>;
  submittedAt: string;
  targetTeacherEmail: string;
}

export interface UnauthorizedAlert {
  id: string;
  grade: string;
  classNum: string;
  studentNumber: string;
  studentName: string;
  eventType: 'SUBMISSION' | 'GATEKEEPER_ENTRY';
  score?: number | null;
  emailRecipient: string;
  emailSubject: string;
  emailBody: string;
  emailStatus: 'RECORDED';
  timestamp: string;
}

interface TeacherDashboardProps {
  questions: Question[];
  onClose: () => void;
  currentUserEmail?: string;
}

const TEACHER_EMAIL = 'tp15181234@gmail.com';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  questions,
  onClose,
  currentUserEmail = TEACHER_EMAIL,
}) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [alerts, setAlerts] = useState<UnauthorizedAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubmissionData | null>(null);
  const [viewingAlert, setViewingAlert] = useState<UnauthorizedAlert | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-app interactive delete confirmation modal state (replaces window.confirm)
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'submission' | 'alert';
    id: string;
    title: string;
    subtitle?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearAlertsModal, setShowClearAlertsModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bulk delete all alerts (휴지통 한 번에 비우기)
  const handleClearAllAlerts = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/alerts/all', {
        method: 'DELETE',
        headers: { 'x-user-email': TEACHER_EMAIL },
      });
      const data = await res.json();
      if (data.success) {
        setAlerts([]);
        setViewingAlert(null);
        showToast('외부 반 침입 경고 내역이 모두 비워졌습니다.');
      } else {
        showToast(data.error || '알림 비우기에 실패했습니다.');
      }
    } catch {
      showToast('네트워크 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setShowClearAlertsModal(false);
    }
  };

  const isAuthorizedTeacher = currentUserEmail.trim().toLowerCase() === TEACHER_EMAIL.toLowerCase();

  const fetchSubmissionsAndAlerts = async () => {
    if (!isAuthorizedTeacher) return;
    setLoading(true);
    try {
      const cacheBuster = `_t=${Date.now()}`;
      const [resSub, resAlerts] = await Promise.all([
        fetch(`/api/submissions?${cacheBuster}`, {
          headers: {
            'x-user-email': TEACHER_EMAIL,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        }),
        fetch(`/api/alerts?${cacheBuster}`, {
          headers: {
            'x-user-email': TEACHER_EMAIL,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
        })
      ]);
      const dataSub = await resSub.json();
      const dataAlerts = await resAlerts.json();

      if (dataSub.success && dataSub.submissions) {
        setSubmissions(dataSub.submissions);
      }
      if (dataAlerts.success && dataAlerts.alerts) {
        setAlerts(dataAlerts.alerts);
      }
    } catch (err) {
      console.error('Failed to load submissions or alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionsAndAlerts();
    const interval = setInterval(fetchSubmissionsAndAlerts, 5000); // 5s auto poll for rapid feedback
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  // Handle actual confirmed deletion without window.confirm
  const handleExecuteDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      if (itemToDelete.type === 'submission') {
        const res = await fetch(`/api/submissions/${itemToDelete.id}`, {
          method: 'DELETE',
          headers: { 'x-user-email': TEACHER_EMAIL }
        });
        const data = await res.json();
        if (data.success) {
          setSubmissions((prev) => prev.filter((s) => s.id !== itemToDelete.id));
          if (selectedSub?.id === itemToDelete.id) {
            setSelectedSub(null);
          }
          showToast('해당 학생의 제출 기록이 성공적으로 삭제되었습니다.');
        } else {
          showToast(data.error || '삭제에 실패했습니다.');
        }
      } else {
        const res = await fetch(`/api/alerts/${itemToDelete.id}`, {
          method: 'DELETE',
          headers: { 'x-user-email': TEACHER_EMAIL }
        });
        const data = await res.json();
        if (data.success) {
          setAlerts((prev) => prev.filter((a) => a.id !== itemToDelete.id));
          if (viewingAlert?.id === itemToDelete.id) {
            setViewingAlert(null);
          }
          showToast('해당 보안 알림이 성공적으로 삭제되었습니다.');
        } else {
          showToast(data.error || '삭제에 실패했습니다.');
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('삭제 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Stats
  const totalSubmissions = submissions.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, cur) => acc + cur.score, 0) / totalSubmissions)
    : 0;
  const maxScore = totalSubmissions > 0
    ? Math.max(...submissions.map((s) => s.score))
    : 0;

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}분 ${s}초`;
  };

  // Export CSV
  const handleExportCsv = () => {
    if (submissions.length === 0) {
      showToast('내보낼 제출 기록이 없습니다.');
      return;
    }
    const header = '학년,반,출석번호,이름,외부반경고여부,점수,맞힌개수,총문항수,소요시간,제출시간,선생님계정\n';
    const rows = submissions.map((s) => 
      `"${s.grade || '1'}","${s.classNum || '5'}","${s.studentNumber}","${s.studentName}","${s.isUnauthorizedClass ? '외부반침입경고' : '정상(5반)'}",${s.score},${s.correctCount},${s.totalQuestions},"${formatTime(s.timeSpentSeconds)}","${new Date(s.submittedAt).toLocaleString('ko-KR')}","${TEACHER_EMAIL}"`
    ).join('\n');

    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `1학년5반_정보_기말고사_제출결과_${new Date().toLocaleDateString('ko-KR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV 성적표가 다운로드되었습니다.');
  };

  // Generate Email Text Report
  const generateReportSummary = () => {
    let summary = `[1학년 5반 정보 기말고사 응시 결과 보고서]\n수신: ${TEACHER_EMAIL}\n일시: ${new Date().toLocaleString('ko-KR')}\n총 응시 인원: ${totalSubmissions}명 (외부 반 침입 경고: ${alerts.length}건)\n반 평균 점수: ${avgScore}점 / 최고 점수: ${maxScore}점\n\n[학생별 점수 목록]\n`;
    submissions.forEach((s, idx) => {
      const nonClassAlert = (s.classNum && s.classNum !== '5') ? ` [⚠️ ${s.classNum}반 외부생]` : '';
      summary += `${idx + 1}. [${s.grade || 1}-${s.classNum || 5} ${s.studentNumber}번] ${s.studentName}${nonClassAlert}: ${s.score}점 (${s.correctCount}/${s.totalQuestions}문항 정답, ${formatTime(s.timeSpentSeconds)})\n`;
    });

    if (alerts.length > 0) {
      summary += `\n[🚨 5반이 아닌 타 반 학생 접근 및 제출 경고 목록 (${alerts.length}건)]\n`;
      alerts.forEach((a, i) => {
        summary += `${i + 1}) [${a.grade}학년 ${a.classNum}반 ${a.studentNumber}번 ${a.studentName}] - ${a.eventType === 'SUBMISSION' ? '답안 제출' : '시험 시작 접속'} (${new Date(a.timestamp).toLocaleString('ko-KR')})\n`;
      });
    }

    return summary;
  };

  const handleCopyReport = () => {
    const text = generateReportSummary();
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    showToast('전체 보고서가 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`[1학년 5반 정보 기말고사] 학생 제출 답안 현황 (${submissions.length}명 응시, 외부반 경고 ${alerts.length}건)`);
    const body = encodeURIComponent(generateReportSummary());
    window.location.href = `mailto:${TEACHER_EMAIL}?subject=${subject}&body=${body}`;
  };

  if (!isAuthorizedTeacher) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">접근 권한 제한</h3>
            <p className="text-xs text-slate-600 mt-1">
              선생님 전용 확인 화면은 <strong>{TEACHER_EMAIL}</strong> 계정으로 Google 로그인했을 때만 열람할 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              선생님
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  1학년 5반 친구들 제출 답안 & 성적 현황
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                  인증 계정: {TEACHER_EMAIL}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                친구들이 모의고사를 풀고 제출하면 실시간으로 이곳에 답안과 성적이 전송됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={fetchSubmissionsAndAlerts}
              disabled={loading}
              title="새로고침 / 최신 답안 및 알림 불러오기"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 rounded-lg transition-colors min-h-[38px] shadow-2xs active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? '불러오는 중...' : '새로고침'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-700">
            <div className="flex items-center gap-1.5 font-semibold">
              <Users className="w-4 h-4 text-blue-600" />
              <span>총 제출: <strong className="text-blue-700 font-mono">{totalSubmissions}명</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>반 평균: <strong className="text-emerald-700 font-mono">{avgScore}점</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <span>최고: <strong className="text-indigo-700 font-mono">{maxScore}점</strong></span>
            </div>

            {alerts.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-800 font-bold border border-red-200 animate-pulse text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>외부 반 경고: {alerts.length}건</span>
              </div>
            )}
          </div>

          {/* Export / Notification Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyReport}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition-colors flex items-center gap-1.5 min-h-[34px]"
            >
              <span>{copiedNotice ? '✓ 복사됨' : '보고서 복사'}</span>
            </button>
            <button
              onClick={handleSendEmail}
              className="px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-blue-200 min-h-[34px]"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>메일 전송</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-emerald-200 min-h-[34px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 저장</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Security Alert Section: Non-5 class attempts */}
          {alerts.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🚨
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-red-950 flex items-center gap-1.5">
                      외부 반(비 5반) 학생 침입·접속 기록 ({alerts.length}건)
                    </h3>
                    <p className="text-[11px] text-red-700">
                      1학년 5반 공식 명부 외 학생이 입장하거나 제출했을 때 선생님께만 안전하게 기록됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowClearAlertsModal(true)}
                    className="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-white hover:bg-red-100 rounded-lg border border-red-300 transition-colors flex items-center gap-1 shadow-2xs"
                    title="모든 외부 반 알림을 한 번에 비웁니다"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>휴지통 전체 비우기</span>
                  </button>
                  <span className="text-[10px] text-red-700 bg-red-100 px-2 py-1 rounded border border-red-200 font-semibold shrink-0">
                    비공개 기록
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-white rounded-lg border border-red-200 shadow-2xs text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                          {alert.grade}학년 {alert.classNum}반
                        </span>
                        <span className="font-bold text-slate-900">
                          {alert.studentNumber ? `${alert.studentNumber}번 ` : ''}{alert.studentName || '이름 미입력'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>
                          {alert.eventType === 'SUBMISSION'
                            ? `📝 타반 답안 제출 (${alert.score}점)`
                            : '🔒 보안 잠금 진입 감지'}
                        </span>
                        <span>·</span>
                        <span>{new Date(alert.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingAlert(alert)}
                        className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                      >
                        상세 확인
                      </button>
                      <button
                        onClick={() => setItemToDelete({
                          type: 'alert',
                          id: alert.id,
                          title: `[${alert.grade}학년 ${alert.classNum}반 ${alert.studentName}] 외부 반 침입 알림`,
                          subtitle: '이 보안 알림을 목록에서 삭제하시겠습니까?'
                        })}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="알림 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submissions.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">
                아직 제출된 시험 답안이 없습니다.
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                친구들이 '기말 모의고사'를 풀고 답안을 제출하면, 즉시 이곳에 점수와 답안지가 자동으로 등록됩니다!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
              <table className="w-full text-xs text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">소속 / 출석번호</th>
                    <th className="py-2.5 px-3">학생 이름</th>
                    <th className="py-2.5 px-3">시험 점수</th>
                    <th className="py-2.5 px-3">정답 수</th>
                    <th className="py-2.5 px-3">풀이 시간</th>
                    <th className="py-2.5 px-3">제출 일시</th>
                    <th className="py-2.5 px-3 text-right">상세 답안 / 관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((s) => {
                    const isNon5Class = s.isUnauthorizedClass || (s.classNum && s.classNum !== '5');
                    return (
                      <tr
                        key={s.id}
                        className={`transition-colors ${
                          isNon5Class
                            ? 'bg-red-50/40 hover:bg-red-50/70'
                            : selectedSub?.id === s.id
                            ? 'bg-blue-50/70 font-semibold'
                            : 'hover:bg-blue-50/40'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{s.grade || 1}학년 {s.classNum || 5}반 {s.studentNumber}번</span>
                            {isNon5Class && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                                🚨 외부반({s.classNum}반)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {s.studentName}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                            s.score >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.score >= 70
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {s.score}점
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {s.correctCount} / {s.totalQuestions}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {formatTime(s.timeSpentSeconds)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {new Date(s.submittedAt).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedSub(selectedSub?.id === s.id ? null : s)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            >
                              {selectedSub?.id === s.id ? '답안 닫기' : '답안지 확인'}
                            </button>
                            <button
                              onClick={() => setItemToDelete({
                                type: 'submission',
                                id: s.id,
                                title: `[${s.grade || 1}학년 ${s.classNum || 5}반 ${s.studentNumber}번 ${s.studentName}] 제출 답안 기록`,
                                subtitle: '삭제하면 해당 학생의 점수와 OMR 답안이 완전히 제거됩니다.'
                              })}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                              title="삭제하기"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Selected Student Answer Sheet Inspector */}
          {selectedSub && (
            <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    [{selectedSub.grade || 1}학년 {selectedSub.classNum || 5}반 {selectedSub.studentNumber}번 {selectedSub.studentName} 학생 상세 OMR 답안지]
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {selectedSub.score}점 ({selectedSub.correctCount} / {selectedSub.totalQuestions} 정답)
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  ✕ 닫기
                </button>
              </div>

              {/* Questions Answer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const studentAnsIdx = selectedSub.userAnswers[q.id];
                  const hasAnswered = studentAnsIdx !== undefined;
                  const isCorrect = studentAnsIdx === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg border text-xs bg-white ${
                        isCorrect
                          ? 'border-emerald-300'
                          : 'border-red-300 bg-red-50/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="font-bold text-slate-900">
                          Q{idx + 1}. [{q.topic}]
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 정답
                          </span>
                        ) : (
                          <span className="text-red-600 font-bold flex items-center gap-0.5 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> 오답
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 line-clamp-2 mt-1 text-[11px]">
                        {q.question}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-slate-500">학생 선택: </span>
                          <strong className={isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                            {hasAnswered ? `${studentAnsIdx + 1}번 (${q.choices[studentAnsIdx]})` : '미응답'}
                          </strong>
                        </div>
                        {!isCorrect && (
                          <div className="text-slate-500">
                            정답: <strong className="text-emerald-700">{q.correctIndex + 1}번</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (In-App dialog replacing blocked window.confirm) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                기록 삭제 확인
              </h3>
              <p className="font-semibold text-xs text-red-700">
                {itemToDelete.title}
              </p>
              {itemToDelete.subtitle && (
                <p className="text-[11px] text-slate-500">
                  {itemToDelete.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg text-xs transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <span>삭제 중...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제 확인</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Alerts Modal */}
      {showClearAlertsModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                휴지통 전체 비우기
              </h3>
              <p className="text-xs text-slate-600">
                기록된 외부 반 침입/접속 알림 <strong>{alerts.length}건</strong>을 모두 삭제하시겠습니까?
              </p>
              <p className="text-[11px] text-slate-400">
                삭제된 알림은 복구할 수 없습니다.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAlertsModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg text-xs transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleClearAllAlerts}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                {isDeleting ? '비우는 중...' : '전체 비우기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Email Modal */}
      {viewingAlert && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                  📧
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    선생님께 발송된 외부 반 접속 경고 메일 전문
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    수신자: {viewingAlert.emailRecipient} (상태: {viewingAlert.emailStatus})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingAlert(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-0.5">메일 제목:</span>
                <span className="font-bold text-slate-900">{viewingAlert.emailSubject}</span>
              </div>

              <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {viewingAlert.emailBody}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${viewingAlert.emailRecipient}?subject=${encodeURIComponent(viewingAlert.emailSubject)}&body=${encodeURIComponent(viewingAlert.emailBody)}`}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>선생님 메일로 바로 열기</span>
              </a>

              <button
                onClick={() => setViewingAlert(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
