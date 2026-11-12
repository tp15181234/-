import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, Code, Terminal, GitBranch, Cpu, Sparkles } from 'lucide-react';

export const CheatSheet: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'flowchart' | 'modeling' | 'python' | 'nlp' | 'ml'>('all');

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              정보 교과 기말고사 벼락치기 핵심 요점정리
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              시험 직전 반드시 확인해야 할 순서도 기호, 실생활 모델링, 파이썬 문법, 자연어 처리, 그리고 기계학습 총정리
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: '전체 보기' },
              { id: 'flowchart', label: '순서도 도형' },
              { id: 'modeling', label: '실생활 모델링' },
              { id: 'python', label: '파이썬 문법' },
              { id: 'nlp', label: '자연어 처리' },
              { id: 'ml', label: '기계학습 ✨' },
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors min-h-[34px] ${
                  activeSection === sec.id
                    ? 'bg-white text-blue-600 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: 순서도 5대 도형 */}
      {(activeSection === 'all' || activeSection === 'flowchart') && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <GitBranch className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              1. 순서도(Flowchart) 5대 표준 도형 완벽 정리
            </h3>
          </div>

          <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-xs text-left text-slate-700 border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                  <th className="py-2.5 px-3">도형 모양</th>
                  <th className="py-2.5 px-3">기호 명칭</th>
                  <th className="py-2.5 px-3">의미 및 역할</th>
                  <th className="py-2.5 px-3">파이썬 대응 코드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3">
                    <div className="w-14 h-6 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-800">
                      타원
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">시작, 끝</td>
                  <td className="py-3 px-3">프로그램의 <strong>시작(Start)</strong>과 <strong>끝(End)</strong>을 나타냄</td>
                  <td className="py-3 px-3 font-mono text-slate-500">프로그램 시작 및 종료</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">
                    <div
                      style={{ transform: 'skewX(-15deg)' }}
                      className="w-14 h-6 border-2 border-blue-500 bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-800"
                    >
                      <span style={{ transform: 'skewX(15deg)' }}>평행사변형</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">입력 (Input)</td>
                  <td className="py-3 px-3">키보드나 센서로부터 외부 데이터를 <strong>입력</strong>받음</td>
                  <td className="py-3 px-3 font-mono text-blue-700 font-semibold">input()</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">
                    <div className="relative w-14 h-6">
                      <svg viewBox="0 0 56 24" className="w-full h-full">
                        <path
                          d="M 2 2 L 54 2 L 54 18 C 40 12, 28 24, 2 18 Z"
                          className="fill-indigo-50 stroke-indigo-600 stroke-2"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-indigo-900 pb-1">
                        물결사각형
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">출력 (Output)</td>
                  <td className="py-3 px-3">아랫변이 물결(웨이브) 모양인 직사각형으로 <strong>화면/문서 출력</strong>을 나타냄</td>
                  <td className="py-3 px-3 font-mono text-indigo-700 font-semibold">print()</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">
                    <div className="w-14 h-6 border-2 border-amber-500 bg-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-800 rounded-[2px]">
                      직사각형
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">처리 (Process)</td>
                  <td className="py-3 px-3">값의 <strong>연산</strong>, 사칙계산, 변수 값 대입 및 할당</td>
                  <td className="py-3 px-3 font-mono text-amber-700 font-semibold">total = 0, i = i + 1</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">
                    <div
                      className="w-14 h-7 border-2 border-purple-500 bg-purple-50 flex items-center justify-center text-[10px] font-bold text-purple-800"
                      style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                    >
                      마름모
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">판단 (Decision)</td>
                  <td className="py-3 px-3">조건식을 평가하여 <strong>참(Yes)/거짓(No)</strong>으로 분기</td>
                  <td className="py-3 px-3 font-mono text-purple-700 font-semibold">if score &gt;= 80:</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-center font-bold text-lg text-slate-600">→ ↓</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">흐름선 (Flowline)</td>
                  <td className="py-3 px-3">명령이 실행되는 방향과 순서를 가리키는 화살표</td>
                  <td className="py-3 px-3 font-mono text-slate-500">코드의 위→아래 실행 흐름</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: 실생활 모델링 */}
      {(activeSection === 'all' || activeSection === 'modeling') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              2. 실생활 문제 모델링 : [입력 / 출력 / 조건 / 변수] 구분 기준
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200">
              <div className="font-bold text-xs text-blue-900">📥 입력 (Input)</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                사용자나 센서가 프로그램에 제공하는 시작 정보 (예: 나이, 투입 금액, 센서 측정 온도). 파이썬의 <code className="text-blue-700 font-bold">input()</code> 함수로 받아옵니다.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
              <div className="font-bold text-xs text-emerald-900">📤 출력 (Output)</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                계산이나 판단을 거쳐 모니터 화면, 스피커로 전달하는 최종 결과 (예: 결제 요금, 합격 메시지, 잔돈). 파이썬의 <code className="text-emerald-700 font-bold">print()</code> 함수로 출력합니다.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50/70 border border-purple-200">
              <div className="font-bold text-xs text-purple-900">⚖️ 조건 (Condition)</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                상황에 따라 다른 동작을 하도록 결정하는 참(True)/거짓(False) 기준 (예: 나이가 19세 미만인가?, 온도가 28도 이상인가?). 파이썬의 <code className="text-purple-700 font-bold">if / elif</code> 문에 해당합니다.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
              <div className="font-bold text-xs text-amber-900">📦 변수 (Variable)</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                변하는 데이터나 계산 결과를 기억해 두는 이름 붙은 저장 상자 (예: age, money, current_temp, count). 필요할 때 언제든 새로운 값을 대입할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: 파이썬 필수 문법 및 시험 함정 */}
      {(activeSection === 'all' || activeSection === 'python') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Code className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              3. 파이썬 프로그래밍 시험 단골 출제 함정 총정리
            </h3>
          </div>

          <div className="space-y-3">
            {/* Trap 1 */}
            <div className="p-4 rounded-lg border border-red-200 bg-red-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>함정 1: input()의 반환값은 숫자를 입력해도 무조건 str(문자열)!</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                사용자가 키보드로 10과 20을 입력해도 <code className="bg-white px-1 py-0.5 rounded border border-red-200">a = input()</code>은 숫자가 아닌 <strong>문자열(str)</strong>로 저장됩니다.
                따라서 <code className="font-mono">a + b</code>를 하면 30이 아니라 <strong className="text-red-800">"1020"</strong>으로 문자열이 이어붙습니다! 숫자로 계산하려면 반드시 <code className="text-blue-700 font-bold">int(input())</code>를 써야 합니다.
              </p>
            </div>

            {/* Trap 2 */}
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>함정 2: range(start, stop)에서 stop 값은 절대 포함되지 않는다!</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">range(5)</code>는 1~5가 아니라 <strong className="text-amber-800">0, 1, 2, 3, 4</strong> (총 5번)입니다.<br />
                <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">range(1, 10)</code>은 1부터 10까지가 아니라 <strong className="text-amber-800">1부터 9까지</strong>입니다.
              </p>
            </div>

            {/* Trap 3 */}
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>기억하기: if 조건문의 콜론(:)과 들여쓰기(Indentation)</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                파이썬은 중괄호({}) 대신 <strong className="text-blue-800">콜론(:)</strong>과 <strong className="text-blue-800">들여쓰기(스페이스 4칸 또는 Tab)</strong>로 코드의 포함 관계를 결정합니다. 들여쓰기를 하지 않으면 <em>IndentationError</em>가 발생합니다.
              </p>
            </div>

            {/* Trap 4 */}
            <div className="p-4 rounded-lg border border-purple-200 bg-purple-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span>기억하기: while문의 무한 루프 탈출 조건</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                while문은 조건식이 참(True)인 동안 계속 실행됩니다. 루프 내부에서 <code className="font-mono bg-white px-1 py-0.5 rounded">count = count + 1</code>처럼 변수를 바꿔주지 않으면 조건이 영원히 참이 되어 프로그램이 멈추지 않는 <strong className="text-purple-800">무한 루프(Infinite Loop)</strong>에 빠집니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: 자연어 처리 핵심 요약 */}
      {(activeSection === 'all' || activeSection === 'nlp') && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Terminal className="w-4 h-4 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              4. 자연어 처리(Natural Language Processing) 핵심 개념 요약
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">자연어 vs 프로그래밍 언어</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                사람이 일상에서 소통하는 언어는 유연하지만 중의성(모호성)이 있습니다. 반면 프로그래밍 언어는 문법과 규칙이 엄격합니다.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">토큰화 (Tokenization)</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                긴 문장을 컴퓨터가 처리할 수 있도록 단어, 형태소, 음절 단위의 기본 조각(토큰)으로 잘라 나누는 전처리 작업입니다.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900">불용어 (Stopwords) 제거</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                "은, 는, 이, 가, 그리고"와 같이 빈도는 높지만 문맥의 핵심 의미에는 영향이 적은 조사와 접속사를 필터링하는 과정입니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: 기계학습 (지도학습, 비지도학습, 강화학습) 핵심 총정리 */}
      {(activeSection === 'all' || activeSection === 'ml') && (
        <div className="bg-white rounded-xl border border-indigo-200 p-4 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                5. 기계학습(Machine Learning) 3대 학습 방식 완벽 정리
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
              수업 신규 진도 필수 출제
            </span>
          </div>

          {/* 3대 학습 방식 비교 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            {/* 1. 지도학습 */}
            <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/50 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm">① 지도학습</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600 text-white font-semibold">정답(레이블) 있음</span>
                </div>
                <p className="text-[11px] text-blue-800 mt-1">
                  선생님이 정답을 알려주듯 <strong>문제와 정답(레이블/Label)</strong>을 함께 주어 둘 사이의 규칙을 학습시키는 방식
                </p>

                <div className="mt-3 space-y-2 pt-2 border-t border-blue-200/60">
                  <div className="p-2 rounded bg-white border border-blue-100">
                    <strong className="text-blue-950 block">🏷️ 분류 (Classification)</strong>
                    <span className="text-slate-600 text-[11px] block mt-0.5">
                      결과를 <strong>이산적인 범주(종류/클래스)</strong>로 나누어 예측
                    </span>
                    <span className="text-[10px] text-blue-700 block mt-1">
                      예: 스팸 메일 여부, 질병 양성/음성, 합격/불합격, 고양이/강아지 사진 판별
                    </span>
                  </div>

                  <div className="p-2 rounded bg-white border border-blue-100">
                    <strong className="text-blue-950 block">📈 회귀 (Regression)</strong>
                    <span className="text-slate-600 text-[11px] block mt-0.5">
                      결과를 <strong>연속적인 수치(숫자/크기)</strong>로 예측
                    </span>
                    <span className="text-[10px] text-blue-700 block mt-1">
                      예: 내일 낮 최고 기온(℃), 기말고사 예상 점수, 아파트 매매가 예측
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold text-blue-900 bg-blue-100/70 p-1.5 rounded text-center">
                핵심: "정답 라벨이 주어지는가?" → YES!
              </div>
            </div>

            {/* 2. 비지도학습 */}
            <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-sm">② 비지도학습</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-semibold">정답(레이블) 없음</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  <strong>정답(레이블)이 없는</strong> 대량의 데이터에서 컴퓨터가 스스로 유사도와 숨겨진 패턴, 규칙을 탐색하는 방식
                </p>

                <div className="mt-3 space-y-2 pt-2 border-t border-emerald-200/60">
                  <div className="p-2 rounded bg-white border border-emerald-100">
                    <strong className="text-emerald-950 block">🧩 군집화 (Clustering)</strong>
                    <span className="text-slate-600 text-[11px] block mt-0.5">
                      유사한 특성을 가진 데이터끼리 몇 개의 묶음(그룹)으로 묶는 작업
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-1">
                      대표 알고리즘: <strong>k-평균(K-Means)</strong>, <strong>kNN(k-최근접 이웃 거리 판별)</strong><br />
                      예: 쇼핑몰 고객 소비 패턴별 그룹화, 유사 뉴스 기사 묶기
                    </span>
                  </div>

                  <div className="p-2 rounded bg-white border border-emerald-100">
                    <strong className="text-emerald-950 block">🛒 연관 규칙 (Association Rule)</strong>
                    <span className="text-slate-600 text-[11px] block mt-0.5">
                      데이터 간에 '함께 발생하는 동시 구매 상관관계'를 분석
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-1">
                      대표 예시: <strong>장바구니 분석(Market Basket Analysis)</strong><br />
                      "기저귀를 산 고객이 맥주도 함께 구매한다", 연관 상품 추천
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold text-emerald-900 bg-emerald-100/70 p-1.5 rounded text-center">
                핵심: "정답 라벨이 없는 상태에서 그룹/규칙을 찾는가?" → YES!
              </div>
            </div>

            {/* 3. 강화학습 */}
            <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/50 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-sm">③ 강화학습</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-600 text-white font-semibold">보상과 시행착오</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  <strong>에이전트(주체)</strong>가 <strong>환경</strong>에서 수많은 행동을 해보며, 잘하면 <strong>보상(Reward)</strong>, 못하면 <strong>벌점</strong>을 받아 최적의 수를 찾는 방식
                </p>

                <div className="mt-3 space-y-2 pt-2 border-t border-amber-200/60">
                  <div className="p-2 rounded bg-white border border-amber-100">
                    <strong className="text-amber-950 block">🎯 핵심 3요소</strong>
                    <ul className="text-slate-600 text-[11px] space-y-0.5 mt-1 list-disc list-inside">
                      <li><strong>에이전트 (Agent)</strong>: 행동을 취하는 주체(AI)</li>
                      <li><strong>환경 (Environment)</strong>: 에이전트가 놓인 상황/게임판</li>
                      <li><strong>보상 (Reward)</strong>: 행동 결과에 따른 점수(+/-)</li>
                    </ul>
                  </div>

                  <div className="p-2 rounded bg-white border border-amber-100">
                    <strong className="text-amber-950 block">🎮 대표 실생활 활용 사례</strong>
                    <span className="text-[10px] text-amber-800 block mt-1">
                      • 이세돌 9단과 대국한 바둑 AI <strong>알파고(AlphaGo)</strong><br />
                      • 보행 균형을 스스로 터득하는 로봇 제어<br />
                      • 도로 상황별 최적 주행을 학습하는 자율주행 자동차<br />
                      • 스타크래프트, 체스 등 복잡한 전략 게임 AI
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold text-amber-900 bg-amber-100/70 p-1.5 rounded text-center">
                핵심: "보상(Reward)을 극대화하는 시행착오인가?" → YES!
              </div>
            </div>
          </div>

          {/* 시험 단골 함정 & 30초 암기 표 */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>기말고사 시험지에서 1초 만에 답 찾는 핵심 함정 포인트!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div className="p-2.5 rounded bg-white border border-red-200">
                <strong className="text-red-700 block mb-0.5">⚠️ 함정 1: "군집화"와 "분류"의 결정적 차이</strong>
                둘 다 데이터를 묶는 것 같지만, 사전에 <strong>정답 라벨이 있으면 지도학습(분류)</strong>이고, <strong>정답 라벨이 없으면 비지도학습(군집화)</strong>입니다!
              </div>

              <div className="p-2.5 rounded bg-white border border-red-200">
                <strong className="text-red-700 block mb-0.5">⚠️ 함정 2: "분류"와 "회귀"의 결과값 형태</strong>
                분류의 결과는 <strong>"사과/배", "스팸/정상" 같은 이름(범주)</strong>이고, 회귀의 결과는 <strong>"85.5점", "32.0도" 같은 연속적인 숫자(수치)</strong>입니다!
              </div>

              <div className="p-2.5 rounded bg-white border border-red-200 sm:col-span-2">
                <strong className="text-red-700 block mb-0.5">⚠️ 함정 3: 마트 영수증 장바구니 분석 = 연관 규칙 (비지도학습)</strong>
                "기저귀를 사면 맥주도 함께 산다"처럼 어떤 사건이 함께 일어나는지 동시 발생 규칙을 찾는 것은 무조건 <strong>비지도학습의 연관 규칙</strong>입니다!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
