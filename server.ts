import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// In development, the AI Studio dev server must run strictly on port 3000.
// In production, use Cloud Run's process.env.PORT or default to 3000.
const PORT = process.env.NODE_ENV === 'production' && process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// CORS & Preflight handling for tablets, mobiles, and in-app webviews (KakaoTalk, etc.)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-email, Cache-Control, Pragma');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Initialize Google GenAI Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for question generation tailored to Korean Middle/High School Informatics curriculum
const SYSTEM_INSTRUCTION = `당신은 대한민국 고등학교 정보(Informatics) 교과 기말고사 출제 전문 교사입니다.
출제 대상 범위는 오직 다음 항목들로 제한됩니다:
1. 자연어 처리 (자연어와 프로그래밍 언어의 차이, 텍스트 토큰화/단어 분리, 형태소와 불용어 개념, 규칙 기반 텍스트 분석, 일상생활 활용 사례)
2. 기계학습 (Machine Learning):
   - 지도학습(Supervised Learning): 정답(레이블)이 있는 데이터를 이용한 학습
     * 분류(Classification): 이산적 범주(Category) 예측 (예: 스팸 메일 판별, 질병 양성/음성, 합격/불합격, 사과/오렌지 구분)
     * 회귀(Regression): 연속적인 수치값(Numerical value) 예측 (예: 시험 점수 예측, 아파트 가격 예측, 내일의 기온 예측)
   - 비지도학습(Unsupervised Learning): 정답(레이블) 없이 데이터 자체의 구조와 유사도 분석
     * 군집화(Clustering): 유사한 특성을 가진 데이터끼리 그룹으로 묶기 (k-평균/K-Means, kNN 등 거리 기반 군집 원리)
     * 연관 규칙(Association Rule Learning): 항목 간의 동시 발생 패턴 분석 (대형 마트의 장바구니 분석, 상품 추천)
   - 강화학습(Reinforcement Learning): 에이전트(Agent)가 환경(Environment)과 상호작용하며 좋은 행동에는 '보상(Reward)', 나쁜 행동에는 '벌점'을 받아 시행착오(Trial and Error)를 통해 최적 정책을 터득 (알파고 바둑, 자율주행차, 게임 AI)
3. 순서도 그리기 (도형 5종: 시작/끝은 타원, 입력은 평행사변형, 출력은 아랫변이 물결(웨이브) 모양인 직사각형, 처리는 직사각형, 조건/판단은 마름모, 흐름선은 화살표. 알고리즘 빈칸 채우기 및 순서도 흐름 추적)
4. 실생활 문제 모델링 (주어진 실생활 주제에서 '입력', '출력', '조건', '변수' 구분하기)
5. 파이썬 기본 프로그래밍:
   - print(), input() 문법과 특성 (input의 반환값은 항상 문자열 str)
   - 자료형 변환: int(), str(), float()
   - 조건문: if, elif, else (조건식, 비교연산자, 들여쓰기)
   - 반복문: for문(range 사용법), while문(조건식 및 탈출 조건)

★ 출제 핵심 원칙:
1. 기존 교과서나 기본 모의고사에 이미 수록된 상투적인 문제(예: 단순 1부터 3까지의 합 등)를 그대로 복제하거나 반복하지 마세요.
2. 매번 새롭고 다양한 실생활 응용 맥락(스마트워치 심박수·걸음수 감지, 배달앱 주문금액 할인 및 쿠폰 적용, 도서관 도서 연체일수 계산, 게임 캐릭터 체력/레벨업 조건, 자율주행 센서 안전거리 측정, 엑스레이 질병 분류, 기온 회귀 예측, 쇼핑몰 연관 추천 등)을 적극 도입하여 독창적인 문제를 창작하세요.
3. 반드시 모든 문항은 1번부터 5번까지 총 5개의 선택지(choices)를 갖는 "5지선다형 객관식"으로 출제하세요.
4. 정답 인덱스(correctIndex)는 0부터 4까지(0, 1, 2, 3, 4) 정확하게 지정하세요.
5. 정답 해설(explanation)은 왜 해당 선택지가 정답인지, 다른 오답 보기가 왜 틀렸는지를 학생의 눈높이에서 친절하고 명쾌하게 설명하세요.`;

// API: Generate Questions
// Fallback Question Bank for curriculum-tailored generation (Strictly 5 choices)
const FALLBACK_BANK = [
  {
    topic: '자연어 처리',
    question: '다음 중 자연어 처리(NLP) 파이프라인에서 불용어(Stopwords)를 제거하는 주된 목적으로 가장 알맞은 것은?',
    choices: [
      '문장의 문법적 오류를 자동으로 교정하기 위해',
      '의미 전달에 큰 기여를 하지 않는 빈출 단어를 제거하여 핵심 단어 분석에 집중하기 위해',
      '단어의 글자 수를 균일하게 맞추기 위해',
      '자연어를 기계어로 직접 변환하기 위해',
      '컴퓨터 메모리 용량을 영구적으로 절약하기 위해'
    ],
    correctIndex: 1,
    explanation: '조사(은/는/이/가), 접속사(그리고, 하지만) 등의 불용어는 문장의 핵심 주제를 나타내지 않으므로 전처리 단계에서 제거하여 분석 효율을 높입니다.',
    difficulty: '보통',
    conceptTip: '불용어(Stopwords)는 빈도는 높지만 분석 가치가 적은 단어들을 의미합니다.'
  },
  {
    topic: '자연어 처리',
    question: '자연어와 프로그래밍 언어의 특성을 비교한 것으로 옳지 않은 것은?',
    choices: [
      '자연어는 문맥과 화자의 의도에 따라 중의적(모호한) 의미를 가질 수 있다.',
      '프로그래밍 언어는 문법 규칙이 엄격하여 사소한 오타도 SyntaxError가 발생한다.',
      '컴퓨터는 사람의 감정과 뉘앙스가 담긴 자연어를 별도의 전처리 없이 바로 이해할 수 있다.',
      '프로그래밍 언어는 컴퓨터에게 명확한 명령을 전달하기 위해 인위적으로 설계된 형식 언어이다.',
      '자연어는 시간의 흐름과 사회적 환경에 따라 새로운 어휘와 문맥이 지속적으로 진화한다.'
    ],
    correctIndex: 2,
    explanation: '컴퓨터는 이진 기계어 기반이므로 사람이 사용하는 자연어의 뉘앙스를 바로 이해하지 못하며, 토큰화와 수치화(벡터화) 전처리가 필수입니다.',
    difficulty: '기초',
    conceptTip: '자연어는 융통성과 중의성이 있고, 프로그래밍 언어는 엄격성과 명확성을 지닙니다.'
  },
  {
    topic: '기계학습',
    question: '기계학습(Machine Learning)의 세 가지 학습 유형(지도학습, 비지도학습, 강화학습)에 대한 설명으로 옳은 것은?',
    choices: [
      '지도학습은 정답(레이블)이 없는 데이터에서 숨겨진 패턴을 스스로 발견한다.',
      '비지도학습은 문제와 정답(레이블)을 함께 제공하여 오차를 줄이도록 학습시킨다.',
      '지도학습은 정답(레이블)이 있는 데이터로 학습하고, 비지도학습은 정답 없이 데이터 간의 구조와 유사성을 파악한다.',
      '강화학습은 모든 정답을 사전에 암기하여 한 번에 계산하는 방식이다.',
      '비지도학습은 에이전트가 행동을 취할 때마다 점수나 벌점을 주는 방식으로 학습한다.'
    ],
    correctIndex: 2,
    explanation: '지도학습(Supervised Learning)은 레이블(정답)이 주어지는 학습이며, 비지도학습(Unsupervised Learning)은 정답 없이 데이터 자체의 군집이나 규칙을 찾는 방식입니다.',
    difficulty: '기초',
    conceptTip: '지도학습 = 문제+정답 | 비지도학습 = 정답 없음(스스로 탐색) | 강화학습 = 보상과 벌점(시행착오)'
  },
  {
    topic: '기계학습',
    question: '지도학습의 세부 분야인 "분류(Classification)"와 "회귀(Regression)"의 예시를 올바르게 짝지은 것은?',
    choices: [
      '분류: 내일 서울의 낮 최고 기온(℃) 예측 / 회귀: 수신된 이메일이 스팸인지 정상인지 판별',
      '분류: 고객의 결제 영수증 연관 규칙 분석 / 회귀: 사진 속 강아지와 고양이 구분',
      '분류: 환자의 엑스레이 폐렴 양성/음성 판별 / 회귀: 지난 시험 점수와 공부 시간을 통한 기말고사 점수 예측',
      '분류: 데이터를 k개의 무리로 묶는 군집화 / 회귀: 바둑 게임에서 다음 수의 승률 계산',
      '분류: 텍스트 문장의 형태소 토큰화 / 회귀: 불용어 사전 구축'
    ],
    correctIndex: 2,
    explanation: '분류는 이산적 범주(양성/음성, 스팸/정상)를 나누는 것이며, 회귀는 연속적인 숫자(기온, 시험 점수, 집값 등)를 예측하는 기법입니다.',
    difficulty: '보통',
    conceptTip: '분류 = 범주/라벨 예측 (합격/불합격) | 회귀 = 수치 예측 (몇 점, 몇 도)'
  },
  {
    topic: '기계학습',
    question: '비지도학습의 대표적 기법인 "군집화(Clustering)"와 "연관 규칙(Association Rule)"에 대한 설명으로 올바른 것은?',
    choices: [
      '군집화는 사전에 정답 그룹 번호가 각 데이터에 반드시 적혀 있어야만 수행할 수 있다.',
      '연관 규칙은 대형 마트의 "장바구니 분석"처럼 함께 자주 구매되는 상품 간의 규칙을 찾는 기법이다.',
      '군집화에서 k-평균(K-Means) 알고리즘은 에이전트에게 보상을 주며 바둑을 두게 하는 방법이다.',
      '연관 규칙은 내일의 주식 가격을 실수 단위로 정확히 예측하는 회귀 기법이다.',
      '군집화와 연관 규칙은 둘 다 문제와 정답이 주어지는 지도학습 알고리즘이다.'
    ],
    correctIndex: 1,
    explanation: '연관 규칙은 항목들 간의 동시 발생 패턴을 분석하는 기법으로 마트의 장바구니 분석(기저귀와 맥주 동시 구매 등)에 대표적으로 쓰입니다. 군집화(k-평균, kNN 등)는 정답 라벨 없이 데이터 유사도에 따라 k개 그룹으로 묶는 기법입니다.',
    difficulty: '보통',
    conceptTip: '군집화 = 유사한 것끼리 묶기(k-평균, kNN) | 연관 규칙 = 함께 일어나는 규칙(장바구니 분석)'
  },
  {
    topic: '순서도 도형',
    question: '순서도를 작성할 때 "사용자로부터 나이를 입력받는 단계"와 "성인 여부를 화면에 출력하는 단계"에 알맞은 기호를 바르게 짝지은 것은?',
    choices: [
      '입력: 평행사변형, 출력: 아랫변이 물결(웨이브) 모양인 직사각형',
      '입력: 타원, 출력: 마름모',
      '입력: 직사각형, 출력: 평행사변형',
      '입력: 마름모, 출력: 직사각형',
      '입력: 원(연결자), 출력: 육각형(준비)'
    ],
    correctIndex: 0,
    explanation: '순서도에서 데이터의 입력은 평행사변형, 화면 인쇄/출력은 아랫변이 물결(태극기 웨이브) 모양인 직사각형을 사용합니다.',
    difficulty: '기초',
    conceptTip: '시작/끝=타원, 입력=평행사변형, 출력=아랫변 물결 직사각형, 처리=직사각형, 판단/조건=마름모'
  },
  {
    topic: '순서도 도형',
    question: '순서도에서 마름모 기호 안에 "점수 >= 80"이라고 작성되어 있다. 이 마름모 기호의 역할로 올바른 것은?',
    choices: [
      '점수 변수에 80을 대입하여 저장하는 처리 단계이다.',
      '조건의 참(Yes) 또는 거짓(No) 여부에 따라 실행 경로를 나누는 판단 단계이다.',
      '화면에 "점수 >= 80" 문구를 인쇄하여 보여주는 출력 단계이다.',
      '프로그램의 전체 실행을 종료하는 단말 단계이다.',
      '외부 데이터베이스와 통신을 시작하는 준비 기호이다.'
    ],
    correctIndex: 1,
    explanation: '마름모는 조건식의 결과에 따라 두 갈래 이상의 흐름선(참/거짓)으로 분기하는 판단(조건) 기호입니다.',
    difficulty: '보통',
    conceptTip: '마름모는 파이썬의 if 조건문과 대응되며 반드시 분기되는 화살표(Yes/No)가 있어야 합니다.'
  },
  {
    topic: '실생활 모델링',
    question: '"무인 아이스크림 매장 결제 시스템"을 모델링할 때, 요소와 항목의 연결이 옳지 않은 것은?',
    choices: [
      '입력 (Input): 바코드 리더기로 스캔한 상품 바코드 번호',
      '변수 (Variable): 장바구니에 담긴 상품들의 누적 총 금액',
      '조건 (Condition): 투입된 현금 또는 결제 카드 잔액이 총 금액 이상인가?',
      '출력 (Output): 결제할 상품의 정가 및 할인율 데이터베이스',
      '처리 (Process): 상품 가격을 총 금액 변수에 더하고 수량을 갱신하는 연산'
    ],
    correctIndex: 3,
    explanation: '상품 정가 및 할인율 데이터는 저장된 데이터 또는 입력 참조값이며, 출력(Output)은 "결제 영수증 발행", "결제 완료 화면 안내" 등이 해당합니다.',
    difficulty: '보통',
    conceptTip: '입력은 들어오는 데이터, 출력은 나오는 결과, 조건은 판별 기준, 변수는 변하는 저장값입니다.'
  },
  {
    topic: '실생활 모델링',
    question: '"스마트폰 배터리 절전 모드"에서 [조건]에 해당하는 가장 알맞은 상황은?',
    choices: [
      '현재 남은 배터리 잔량 수치(%)',
      '사용자가 화면 밝기 슬라이더를 터치한 입력값',
      '배터리 잔량이 20% 이하로 떨어졌는가?',
      '화면 상단에 절전 모드 아이콘이 표시됨',
      '배터리 충전기 연결 알림 효과음 발생'
    ],
    correctIndex: 2,
    explanation: '"배터리 잔량이 20% 이하인가?"는 참(True)/거짓(False)을 판단하여 절전 모드를 켤지 결정하는 조건(Condition)입니다.',
    difficulty: '기초',
    conceptTip: '조건은 참과 거짓을 가를 수 있는 의문문/비교식 형태입니다.'
  },
  {
    topic: '파이썬 입출력·자료형',
    question: '다음 파이썬 코드를 실행했을 때 출력 결과로 알맞은 것은?\n\na = "30"\nb = "40"\nprint(int(a) + int(b))\nprint(a + b)',
    codeSnippet: 'a = "30"\nb = "40"\nprint(int(a) + int(b))\nprint(a + b)',
    choices: [
      '70\n3040',
      '3040\n70',
      '70\n70',
      '3040\n3040',
      'TypeError 발생'
    ],
    correctIndex: 0,
    explanation: 'int(a) + int(b)는 정수 덧셈이므로 30 + 40 = 70이 되고, a + b는 문자열 이어붙이기이므로 "3040"이 출력됩니다.',
    difficulty: '보통',
    conceptTip: 'input()으로 입력받은 값은 문자열(str)이므로 숫자로 계산하려면 int() 또는 float() 변환이 필요합니다.'
  },
  {
    topic: '파이썬 입출력·자료형',
    question: '다음 파이썬 코드의 실행 결과로 올바른 것은?\n\nval = "5.5"\nnum = float(val)\nprint(type(num))',
    codeSnippet: 'val = "5.5"\nnum = float(val)\nprint(type(num))',
    choices: [
      "<class 'int'>",
      "<class 'str'>",
      "<class 'float'>",
      "<class 'bool'>",
      "<class 'list'>"
    ],
    correctIndex: 2,
    explanation: 'float() 함수는 실수를 생성하므로 num의 자료형은 <class \'float\'>입니다.',
    difficulty: '기초',
    conceptTip: '정수는 int, 실수는 float, 문자열은 str, 참/거짓은 bool 자료형입니다.'
  },
  {
    topic: 'if·elif 조건문',
    question: '다음 파이썬 코드를 실행했을 때 출력되는 결과는?\n\nscore = 75\nif score >= 90:\n    print("우수")\nelif score >= 70:\n    print("보통")\nelse:\n    print("노력")',
    codeSnippet: 'score = 75\nif score >= 90:\n    print("우수")\nelif score >= 70:\n    print("보통")\nelse:\n    print("노력")',
    choices: ['우수', '보통', '노력', '우수\n보통', '보통\n노력'],
    correctIndex: 1,
    explanation: 'score가 75이므로 첫 번째 if (75 >= 90)은 거짓이고, 두 번째 elif (75 >= 70)이 참이 되어 "보통"이 출력되고 조건문이 종료됩니다.',
    difficulty: '기초',
    conceptTip: 'if - elif - else 문에서는 위에서부터 검사하여 처음 참이 되는 블록 하나만 실행됩니다.'
  },
  {
    topic: 'if·elif 조건문',
    question: '파이썬 조건문 작성 시 들여쓰기(Indentation)에 대한 설명으로 올바른 것은?',
    choices: [
      '들여쓰기는 가독성을 위한 것일 뿐, 들여쓰기를 하지 않아도 정상 실행된다.',
      '조건문 콜론(:) 아랫줄의 코드 블록은 반드시 일정한 들여쓰기(스페이스 4칸 권장)를 해야 한다.',
      '들여쓰기에는 오직 탭(Tab) 키만 사용해야 하며 스페이스는 사용할 수 없다.',
      'elif와 else 뒤에는 조건식을 필수적으로 적어야 한다.',
      '들여쓰기 칸 수는 한 블록 안에서 줄마다 제각각 달라도 문법 오류가 나지 않는다.'
    ],
    correctIndex: 1,
    explanation: '파이썬은 들여쓰기로 코드 블록의 포함 관계를 결정하므로 들여쓰기가 맞지 않으면 IndentationError가 발생합니다.',
    difficulty: '보통',
    conceptTip: '콜론(:) 다음 줄은 반드시 들여쓰기해야 하며, else 뒤에는 조건식을 적지 않습니다.'
  },
  {
    topic: 'for·while 반복문',
    question: '다음 파이썬 코드를 실행했을 때 화면에 출력되는 마지막 숫자는?\n\nfor i in range(1, 6):\n    print(i)',
    codeSnippet: 'for i in range(1, 6):\n    print(i)',
    choices: ['3', '4', '5', '6', '7'],
    correctIndex: 2,
    explanation: 'range(start, stop)은 start부터 stop-1까지의 정수를 생성하므로 range(1, 6)은 1, 2, 3, 4, 5를 생성하여 마지막에 5가 출력됩니다.',
    difficulty: '기초',
    conceptTip: 'range(1, 6)에서 끝 숫자 6은 포함되지 않고 5까지만 반복됩니다!'
  },
  {
    topic: 'for·while 반복문',
    question: '다음 while문 코드의 실행 결과 변수 s의 최종 값은?\n\ns = 0\ni = 1\nwhile i <= 4:\n    s = s + i\n    i = i + 1\nprint(s)',
    codeSnippet: 's = 0\ni = 1\nwhile i <= 4:\n    s = s + i\n    i = i + 1\nprint(s)',
    choices: ['0', '4', '6', '10', '15'],
    correctIndex: 3,
    explanation: 'i가 1, 2, 3, 4일 때 s에 누적합이 더해지므로 1 + 2 + 3 + 4 = 10이 됩니다.',
    difficulty: '보통',
    conceptTip: 'while문은 조건식이 참인 동안 반복되며, i = i + 1과 같은 증감식을 통해 탈출 조건을 만들어야 합니다.'
  }
];

function getFallbackQuestions(requestedTopics: string[], requestedCount: number): any[] {
  const normTopics = Array.isArray(requestedTopics) ? requestedTopics : [requestedTopics];
  const matched = FALLBACK_BANK.filter((q) => 
    normTopics.length === 0 || normTopics.some((t) => q.topic.includes(t) || t.includes(q.topic))
  );

  const pool = matched.length > 0 ? matched : FALLBACK_BANK;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, requestedCount);

  // If requested count > available, duplicate with randomized IDs
  while (selected.length < requestedCount && pool.length > 0) {
    selected.push(pool[selected.length % pool.length]);
  }

  return selected.map((q, idx) => ({
    id: `ai-gen-${Date.now()}-${idx + 1}`,
    topic: q.topic,
    question: q.question,
    codeSnippet: q.codeSnippet || undefined,
    choices: q.choices,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    difficulty: q.difficulty,
    conceptTip: q.conceptTip
  }));
}

// API: Generate Questions
app.post('/api/generate-questions', async (req: Request, res: Response) => {
  const { topics = ['자연어 처리', '기계학습', '순서도 도형', '실생활 모델링', '파이썬 입출력·자료형', 'if·elif 조건문', 'for·while 반복문'], count = 5, difficulty = '보통', customPrompt = '' } = req.body;
  const targetCount = Math.min(Math.max(Number(count) || 5, 1), 10);

  if (!ai) {
    const fallbackList = getFallbackQuestions(topics, targetCount);
    return res.json({
      success: true,
      questions: fallbackList,
      source: 'curriculum-bank',
      message: `1학년 5반 시험 범위 맞춤 ${fallbackList.length}문항이 출제되었습니다.`
    });
  }

  try {
    const promptText = `다음 조건에 맞춰 대한민국 고등학교 정보 기말고사 문제 ${targetCount}문항을 출제해 주세요:
- 출제 단원: ${Array.isArray(topics) ? topics.join(', ') : topics}
- 난이도: ${difficulty}
- 핵심 지침:
  1. 기존 교과서나 기본 모의고사 문제 은행의 상투적인 예시(예: 단순 1부터 3까지의 합 등)를 그대로 복제하지 마세요.
  2. 일상생활의 참신하고 흥미로운 맥락(자율주행차 거리 감지 센서, 배달앱 쿠폰 자동 할인율 계산, 스마트워치 운동 목표 도달 판별, 챗봇 대화 토큰 분석, 질병 분류 모델, 연속 기온 회귀 예측, 쇼핑몰 연관 추천 등)을 활용해 신선한 문제를 창작하세요.
  3. ★필수: 각 문제는 반드시 1번부터 5번까지 총 5개의 선택지(choices)를 갖는 5지선다형으로 출제해야 합니다.
  4. 정답 인덱스(correctIndex)는 0부터 4까지(0, 1, 2, 3, 4) 정확하게 지정하세요.
  5. 추가 요청사항: ${customPrompt || '기출 변형 및 신유형 중심의 완성도 높은 5지선다형 객관식 문제'}
반드시 제공된 JSON 스키마를 엄격히 준수하여 응답하세요.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), 45000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topic: { 
                    type: Type.STRING,
                    description: '자연어 처리 | 기계학습 | 순서도 도형 | 실생활 모델링 | 파이썬 입출력·자료형 | if·elif 조건문 | for·while 반복문'
                  },
                  question: { type: Type.STRING, description: '문제 본문 (코드나 상황 설명 포함)' },
                  codeSnippet: { type: Type.STRING, description: '필요한 경우 파이썬 코드 또는 순서도 텍스트 표기' },
                  choices: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '반드시 5개의 선택지 (1번부터 5번까지 5지선다)'
                  },
                  correctIndex: { type: Type.INTEGER, description: '0부터 4까지 정답 인덱스' },
                  explanation: { type: Type.STRING, description: '자세하고 친절한 정답 및 오답 해설' },
                  difficulty: { type: Type.STRING, description: '기초 | 보통 | 심화' },
                  conceptTip: { type: Type.STRING, description: '꼭 기억해야 할 핵심 개념 한 줄 요약' }
                },
                required: ['id', 'topic', 'question', 'choices', 'correctIndex', 'explanation', 'difficulty']
              }
            }
          },
          required: ['questions']
        }
      }
    });

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    const parsed = JSON.parse(response.text || '{"questions": []}');
    if (parsed.questions && parsed.questions.length > 0) {
      return res.json({ success: true, questions: parsed.questions, source: 'gemini' });
    } else {
      const fallbackList = getFallbackQuestions(topics, targetCount);
      return res.json({ success: true, questions: fallbackList, source: 'curriculum-bank' });
    }
  } catch (err: any) {
    console.error('Gemini question generation error, falling back:', err);
    const fallbackList = getFallbackQuestions(topics, targetCount);
    return res.json({
      success: true,
      questions: fallbackList,
      source: 'curriculum-bank',
      notice: 'AI 백엔드 연결 지연으로 검증된 기말고사 문제 은행에서 출제되었습니다.'
    });
  }
});

// API: Explain Question
app.post('/api/explain-question', async (req: Request, res: Response) => {
  try {
    const { question, choices, answer, studentChoice, topic } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: false,
        explanation: 'AI 서비스가 준비 중입니다. 기본 문제 해설을 참고해 주세요.'
      });
    }

    const prompt = `문제 정보:
- 단원: ${topic}
- 문제: ${question}
- 보기: ${JSON.stringify(choices)}
- 정답: ${answer}
- 학생이 고른 답: ${studentChoice ?? '모름'}

학생이 왜 정답이 ${answer}인지 쉽게 이해할 수 있도록 중학생·고등학생 눈높이에서 단계별로 친절하게 설명해 주세요. 학생이 헷갈리기 쉬운 함정(예: input은 문자열이라는 점, range의 끝 번호 미포함, 순서도 마름모는 조건문이라는 점 등)을 짚어주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '당신은 따뜻하고 명쾌하게 설명해주는 대한민국 학교 정보 선생님입니다. 핵심을 3단계로 알기 쉽게 설명해 주세요.',
      }
    });

    return res.json({ success: true, explanation: response.text });
  } catch (err: any) {
    console.error('Gemini explanation error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Python virtual trace / simulation helper
app.post('/api/simulate-python', async (req: Request, res: Response) => {
  try {
    const { code, simulatedInput = '' } = req.body;

    if (!ai) {
      return res.json({
        success: false,
        message: 'Gemini 키가 필요합니다.'
      });
    }

    const prompt = `다음 파이썬 코드를 실행했을 때의 결과를 단계별로 시뮬레이션해 주세요.
사용자 입력값(input()): "${simulatedInput}"

코드:
\`\`\`python
${code}
\`\`\`

출력 결과와 각 단계별 변수들의 값 변화를 JSON 형태로 알려주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            output: { type: Type.STRING, description: '실제 터미널에 출력될 전체 텍스트' },
            hasError: { type: Type.BOOLEAN, description: '문법 에러나 런타임 에러 여부' },
            errorMessage: { type: Type.STRING, description: '에러 발생 시 설명' },
            variables: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            },
            explanation: { type: Type.STRING, description: '코드 실행 흐름 요약' }
          },
          required: ['output', 'hasError']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// In-memory & file-backed store for student test submissions
import fs from 'fs';

const DATA_DIR = path.resolve(__dirname, 'data');
const SUBMISSIONS_FILE = path.resolve(DATA_DIR, 'submissions.json');
const ALERTS_FILE = path.resolve(DATA_DIR, 'unauthorized_alerts.json');
const TEACHER_EMAIL = 'tp15181234@gmail.com';

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(ALERTS_FILE)) {
    fs.writeFileSync(ALERTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

let memorySubmissions: any[] = [];
let memoryAlerts: any[] = [];

function loadDataFromDisk() {
  ensureDataFile();
  try {
    const rawSub = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    const parsed = JSON.parse(rawSub);
    if (Array.isArray(parsed)) memorySubmissions = parsed;
  } catch {
    memorySubmissions = [];
  }
  try {
    const rawAlerts = fs.readFileSync(ALERTS_FILE, 'utf-8');
    const parsed = JSON.parse(rawAlerts);
    if (Array.isArray(parsed)) memoryAlerts = parsed;
  } catch {
    memoryAlerts = [];
  }
}
loadDataFromDisk();

function getSubmissions(): any[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memorySubmissions = parsed;
    }
  } catch {
    // Fall back to memory
  }
  return memorySubmissions;
}

function saveSubmissions(list: any[]) {
  memorySubmissions = list;
  try {
    ensureDataFile();
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save submissions:', err);
  }
}

function getAlerts(): any[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(ALERTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      memoryAlerts = parsed;
    }
  } catch {
    // Fall back to memory
  }
  return memoryAlerts;
}

function saveAlerts(list: any[]) {
  memoryAlerts = list;
  try {
    ensureDataFile();
    fs.writeFileSync(ALERTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save alerts:', err);
  }
}

const CLASS_5_ROSTER = [
  '김겸', '김단우', '김민재', '김민준', '김평온', '김형준',
  '노승균', '대경준', '박시우', '박은준', '박지온', '박창언',
  '박평온', '백승민', '서보광', '양예준', '양지한', '이동건',
  '이민준', '이승훈', '이해성', '정시우', '정우준', '조민규',
  '하동훈', '허원준'
];
const TEACHER_NAME = '이은자';

function isAuthorized1Class5(grade: string, classNum: string, studentName: string): boolean {
  const g = String(grade || '').replace(/[^0-9]/g, '').trim() || String(grade || '').trim();
  const c = String(classNum || '').replace(/[^0-9]/g, '').trim() || String(classNum || '').trim();
  const name = String(studentName || '').trim().replace(/\s+/g, '');

  if (!name) return false;
  if (name === TEACHER_NAME || name.includes(TEACHER_NAME)) return true;

  const isGrade1 = g === '1' || g === '1학년';
  const isClass5 = c === '5' || c === '5반';
  const isInRoster = CLASS_5_ROSTER.some((rosterName) => rosterName.replace(/\s+/g, '') === name);

  return isGrade1 && isClass5 && isInRoster;
}

// Helper to record unauthorized (non-5 class) student events strictly
function recordUnauthorizedAlert(payload: {
  grade: string;
  classNum: string;
  studentNumber: string;
  studentName: string;
  eventType: 'GATEKEEPER_ENTRY' | 'SUBMISSION';
  score?: number | null;
}) {
  const { grade, classNum, studentNumber, studentName, eventType, score } = payload;
  const isAuthorized = isAuthorized1Class5(grade, classNum, studentName);

  // If student is in the official 26-roster of 1학년 5반 (e.g. 김겸), NEVER record as unauthorized!
  if (isAuthorized) {
    return null;
  }

  const newAlert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    grade,
    classNum,
    studentNumber,
    studentName,
    eventType,
    score: score !== undefined ? score : null,
    emailRecipient: TEACHER_EMAIL,
    emailSubject:
      eventType === 'SUBMISSION'
        ? `[📝 타반 답안 제출] ${grade}학년 ${classNum}반 ${studentName} 학생 제출 (${score}점)`
        : `[🚨 타반 보안 잠금 통과] ${grade}학년 ${classNum}반 ${studentName} 학생 진입`,
    emailBody: `1학년 5반 미등록 학생(${grade}학년 ${classNum}반 ${studentNumber ? studentNumber + '번 ' : ''}${studentName}) 감지`,
    emailStatus: 'RECORDED',
    timestamp: new Date().toISOString(),
  };

  const currentAlerts = getAlerts();
  currentAlerts.unshift(newAlert);
  saveAlerts(currentAlerts);

  console.log(`[🚨 타반 학생 감지 및 기록] ${grade}학년 ${classNum}반 ${studentNumber}번 ${studentName} (${eventType})`);
  return newAlert;
}

// API: Get all submissions for teacher (tp15181234@gmail.com)
app.get('/api/submissions', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
  if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: `선생님 계정(${TEACHER_EMAIL})으로 Google 로그인한 경우에만 전체 답안을 열람할 수 있습니다.`,
      submissions: [],
    });
  }
  const list = getSubmissions();
  return res.json({ success: true, submissions: list });
});

// API: Submission count endpoint
app.get('/api/submissions/count', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
  if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
    return res.json({ success: true, count: 0, isTeacher: false });
  }
  const list = getSubmissions();
  return res.json({ success: true, count: list.length, isTeacher: true });
});

// API: Get all unauthorized class alerts
app.get('/api/alerts', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
  if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: `선생님 계정(${TEACHER_EMAIL})만 외부 반 경고 내역을 열람할 수 있습니다.`,
      alerts: [],
    });
  }
  const alerts = getAlerts();
  return res.json({ success: true, alerts });
});

// API: Delete all alerts at once (휴지통 한 번에 비우기)
app.delete('/api/alerts/all', (req: Request, res: Response) => {
  try {
    const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
    if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `선생님 계정(${TEACHER_EMAIL})만 알림을 비울 수 있습니다.`,
      });
    }
    saveAlerts([]);
    return res.json({ success: true, message: '모든 외부 반 알림이 완전히 비워졌습니다.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Delete an alert
app.delete('/api/alerts/:id', (req: Request, res: Response) => {
  try {
    const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
    if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `선생님 계정(${TEACHER_EMAIL})만 알림을 삭제할 수 있습니다.`,
      });
    }
    const { id } = req.params;
    const current = getAlerts();
    const updated = current.filter((item: any) => item.id !== id);
    saveAlerts(updated);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Report unauthorized non-5 class access in real-time
app.post('/api/alerts/unauthorized', (req: Request, res: Response) => {
  try {
    const {
      grade = '1',
      classNum = '',
      studentNumber = '',
      studentName = '',
      eventType = 'GATEKEEPER_ENTRY',
    } = req.body;

    const trimmedGrade = String(grade).trim() || '1';
    const trimmedClass = String(classNum).trim();
    const trimmedName = String(studentName).trim();
    const isAuthorized = isAuthorized1Class5(trimmedGrade, trimmedClass, trimmedName);

    // Only record if truly unauthorized (타반)
    if (!isAuthorized) {
      const alert = recordUnauthorizedAlert({
        grade: trimmedGrade,
        classNum: trimmedClass,
        studentNumber: String(studentNumber).trim(),
        studentName: trimmedName,
        eventType,
      });
      return res.json({ success: true, alert, isUnauthorized: true });
    }

    // 1학년 5반 학생(김겸 등)은 정상 통과 - 경고 기록하지 않음!
    return res.json({ success: true, isUnauthorized: false });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Handle Google Login detection (simple acknowledgement, no false alerts)
app.post('/api/alerts/login', (req: Request, res: Response) => {
  try {
    const { email = '' } = req.body;
    const trimmedEmail = String(email).trim().toLowerCase();
    const isTeacher = trimmedEmail === TEACHER_EMAIL.toLowerCase();
    return res.json({ success: true, isTeacher });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Submit student exam answers
app.post('/api/submissions', (req: Request, res: Response) => {
  try {
    const {
      grade = '1',
      classNum = '5',
      studentName,
      studentNumber,
      score,
      totalQuestions,
      correctCount,
      timeSpentSeconds,
      userAnswers,
      topicScores,
    } = req.body;

    if (!studentName || !studentNumber) {
      return res.status(400).json({ success: false, error: '학생 이름과 번호를 입력해 주세요.' });
    }

    const trimmedGrade = String(grade).trim() || '1';
    const trimmedClass = String(classNum).trim() || '5';
    const trimmedName = String(studentName).trim();
    const isAuthorized = isAuthorized1Class5(trimmedGrade, trimmedClass, trimmedName);
    const isUnauthorized = !isAuthorized;

    // 타반(비 5반 또는 미등록) 학생일 때만 외부 반 경고 기록에 추가!
    // 1학년 5반 학생(김겸 등)은 정상 학생이므로 절대 외부 반 경고로 기록하지 않습니다.
    if (isUnauthorized) {
      recordUnauthorizedAlert({
        grade: trimmedGrade,
        classNum: trimmedClass,
        studentNumber: String(studentNumber).trim(),
        studentName: trimmedName,
        eventType: 'SUBMISSION',
        score: Number(score) || 0,
      });
    }

    const newSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      grade: trimmedGrade,
      classNum: trimmedClass,
      studentName: String(studentName).trim(),
      studentNumber: String(studentNumber).trim(),
      isUnauthorizedClass: isUnauthorized,
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 0,
      correctCount: Number(correctCount) || 0,
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      userAnswers: userAnswers || {},
      topicScores: topicScores || {},
      submittedAt: new Date().toISOString(),
      targetTeacherEmail: TEACHER_EMAIL,
    };

    const currentList = getSubmissions();
    currentList.unshift(newSubmission);
    saveSubmissions(currentList);

    console.log(
      `[Exam Submission] ${newSubmission.grade}학년 ${newSubmission.classNum}반 ${newSubmission.studentNumber}번 ${newSubmission.studentName} 점수: ${newSubmission.score}점 (${newSubmission.correctCount}/${newSubmission.totalQuestions}) [${isUnauthorized ? '⚠️ 타반' : '✅ 5반 정상'}]`
    );

    return res.json({
      success: true,
      message: '성공적으로 제출되었습니다! 시험 답안이 안전하게 기록되었습니다.',
      submission: newSubmission,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Delete all submissions (전체 제출 답안 비우기)
app.delete('/api/submissions/all', (req: Request, res: Response) => {
  try {
    const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
    if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `선생님 계정(${TEACHER_EMAIL})만 제출 기록을 비울 수 있습니다.`,
      });
    }
    saveSubmissions([]);
    return res.json({ success: true, message: '모든 학생 제출 기록이 삭제되었습니다.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Delete a single submission
app.delete('/api/submissions/:id', (req: Request, res: Response) => {
  try {
    const userEmail = String(req.headers['x-user-email'] || req.query.email || '').trim().toLowerCase();
    if (userEmail !== TEACHER_EMAIL.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: `선생님 계정(${TEACHER_EMAIL})만 제출 기록을 삭제할 수 있습니다.`,
      });
    }
    const { id } = req.params;
    const currentList = getSubmissions();
    const updated = currentList.filter((item: any) => item.id !== id);
    saveSubmissions(updated);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
