import React, { useState } from 'react';
import { executeEducationalPython, RunResult } from '../utils/pythonRunner';
import { Play, RotateCcw, Terminal, HelpCircle, Code2, Sparkles } from 'lucide-react';

const CODE_TEMPLATES = [
  {
    title: '1. input()과 int() 형변환 함정',
    desc: 'input()으로 입력받은 값은 무조건 문자열(str)이라는 점을 확인합니다.',
    code: `# 두 숫자를 더하는 프로그램
# input()은 무조건 문자열(str)로 받아옵니다!
num1 = "10"
num2 = "20"

print("문자열끼리 더하기 (이어붙이기):")
print(num1 + num2)

print("int()로 형변환 후 더하기 (수학적 덧셈):")
print(int(num1) + int(num2))

print("float()로 소수점 형변환 후 더하기:")
print(float(num1) + float(num2))
`,
  },
  {
    title: '2. if - elif - else 성적 판정',
    desc: '점수에 따라 A, B, C, D 등급을 나누는 대표적인 조건문입니다.',
    code: `score = 85

print("나의 점수:", score)

if score >= 90:
    print("축하합니다! A 등급입니다.")
elif score >= 80:
    print("잘했습니다! B 등급입니다.")
elif score >= 70:
    print("노력하세요! C 등급입니다.")
else:
    print("보충 학습이 필요합니다! D 등급입니다.")
`,
  },
  {
    title: '3. for문과 range() 누적합',
    desc: 'range(1, 11)을 이용해 1부터 10까지 더하는 반복문입니다.',
    code: `total = 0

# range(1, 11)은 1부터 10까지 (11은 포함 안 됨!)
for i in range(1, 11):
    total = total + i
    print("현재 i:", i, "현재 누적합:", total)

print("최종 합계는:", total)
`,
  },
  {
    title: '4. while문 카운트다운',
    desc: '조건식이 참인 동안 반복하고, 0이 되면 탈출합니다.',
    code: `count = 5

print("카운트다운 시작!")
while count > 0:
    print(count)
    count = count - 1  # count를 1씩 줄여 탈출 조건을 만듦

print("발사! 🚀")
`,
  },
];

export const PythonSandbox: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [code, setCode] = useState(CODE_TEMPLATES[0].code);
  const [inputs, setInputs] = useState<string>('10\n20');
  const [result, setResult] = useState<RunResult | null>(() => executeEducationalPython(CODE_TEMPLATES[0].code));

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplate(idx);
    setCode(CODE_TEMPLATES[idx].code);
    const runRes = executeEducationalPython(CODE_TEMPLATES[idx].code);
    setResult(runRes);
  };

  const handleRun = () => {
    const inputArr = inputs.split('\n').map((s) => s.trim()).filter(Boolean);
    const runRes = executeEducationalPython(code, inputArr);
    setResult(runRes);
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[selectedTemplate].code);
    const runRes = executeEducationalPython(CODE_TEMPLATES[selectedTemplate].code);
    setResult(runRes);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              파이썬 인터랙티브 샌드박스 (Python Playground)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              print, input, int, str, float, if/elif/else, for, while 코드를 직접 수정하고 실행해 보세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CODE_TEMPLATES.map((tmpl, idx) => (
              <button
                key={tmpl.title}
                onClick={() => handleSelectTemplate(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
                  selectedTemplate === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                예제 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2.5 sm:mt-3">
          💡 {CODE_TEMPLATES[selectedTemplate].desc}
        </p>
      </div>

      {/* Editor & Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  파이썬 코드 편집기
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                스페이스 4칸 들여쓰기 권장
              </span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={11}
              spellCheck={false}
              className="w-full font-mono text-xs leading-relaxed p-3.5 sm:p-4 bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />

            {/* Simulated Input Section */}
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                가상 input() 입력값 (줄바꿈으로 여러 입력 구분):
              </label>
              <input
                type="text"
                value={inputs}
                onChange={(e) => setInputs(e.target.value)}
                placeholder="예: 10 또는 hello"
                className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[38px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg flex items-center gap-1.5 min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>

            <button
              onClick={handleRun}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5 shadow-xs min-h-[44px] active:scale-95 transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>코드 실행 (Run)</span>
            </button>
          </div>
        </div>

        {/* Right: Virtual Console & Variable Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {/* Terminal Console */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-300">실행 콘솔 (Output)</span>
              </div>
              <span className="text-[10px] text-slate-500">Terminal</span>
            </div>

            <div className="mt-3 font-mono text-xs min-h-[140px] max-h-[220px] overflow-y-auto leading-relaxed">
              {result?.hasError ? (
                <div className="text-red-400 bg-red-950/40 p-3 rounded border border-red-800 whitespace-pre-wrap">
                  ⚠️ {result.errorMessage}
                </div>
              ) : (
                <pre className="text-slate-200 font-mono text-xs whitespace-pre-wrap font-inherit">
                  {result?.output}
                </pre>
              )}
            </div>
          </div>

          {/* Variable Inspector Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-800">
              <span>변수 메모리 상태 (Variables)</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {result?.variables?.length || 0}개 변수 감지됨
              </span>
            </div>

            {result && result.variables && result.variables.length > 0 ? (
              <div className="divide-y divide-slate-100 mt-2">
                {result.variables.map((v) => (
                  <div key={v.name} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{v.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({v.type})</span>
                    </div>
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                변수가 할당되지 않았습니다.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              * 코드 실행 중 메모리에 저장된 변수의 실제 값과 자료형(int, str, float)을 실시간으로 확인합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
