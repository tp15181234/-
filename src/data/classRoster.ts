/**
 * 1학년 5반 공식 출석 명단 및 교사 정보
 * 여기에 등록된 26명의 학생 및 담임 교사(이은자)만 정식 1학년 5반으로 인증됩니다.
 * 다른 이름이나 다른 반 번호로 입장 시 조용히 교사 이메일(tp15181234@gmail.com)로 비인가 접근 알림이 발송됩니다.
 */

export const CLASS_5_ROSTER: string[] = [
  '김겸',
  '김단우',
  '김민재',
  '김민준',
  '김평온',
  '김형준',
  '노승균',
  '대경준',
  '박시우',
  '박은준',
  '박지온',
  '박창언',
  '박평온',
  '백승민',
  '서보광',
  '양예준',
  '양지한',
  '이동건',
  '이민준',
  '이승훈',
  '이해성',
  '정시우',
  '정우준',
  '조민규',
  '하동훈',
  '허원준',
];

export const TEACHER_NAME = '이은자';
export const TEACHER_EMAIL = 'tp15181234@gmail.com';
export const SECRET_GATE_PIN = '15181234';

/**
 * 1학년 5반 공식 소속 여부 판별 함수
 * '1', '1학년', '5', '5반', 띄어쓰기 등 다양한 사용자 입력 형식을 완벽하게 수용하여 정확하게 판별합니다.
 */
export function isAuthorized1Class5(grade: string, classNum: string, studentName: string): boolean {
  const g = String(grade || '').replace(/[^0-9]/g, '').trim() || String(grade || '').trim();
  const c = String(classNum || '').replace(/[^0-9]/g, '').trim() || String(classNum || '').trim();
  const name = String(studentName || '').trim().replace(/\s+/g, '');

  if (!name) return false;

  // 담임 선생님인 경우 즉시 인증
  if (name === TEACHER_NAME || name.includes(TEACHER_NAME)) {
    return true;
  }

  const isGrade1 = g === '1' || g === '1학년';
  const isClass5 = c === '5' || c === '5반';

  // 1학년 5반이고 26명 명단에 포함된 경우만 공식 학생으로 판별
  const isInRoster = CLASS_5_ROSTER.some((rosterName) => rosterName.replace(/\s+/g, '') === name);

  return isGrade1 && isClass5 && isInRoster;
}
