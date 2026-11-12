import { Question } from '../types/quiz';

export const INITIAL_QUESTIONS: Question[] = [
  // --- 1. 자연어 처리 (NLP) ---
  {
    id: 'nlp-1',
    topic: '자연어 처리',
    difficulty: '기초',
    question: '다음 중 일상생활에서 인간이 생각과 감정을 표현할 때 사용하는 언어를 가리키는 말로 가장 알맞은 것은?',
    choices: [
      '인공어 (Artificial Language)',
      '기계어 (Machine Language)',
      '자연어 (Natural Language)',
      '어셈블리어 (Assembly Language)',
      '컴파일 언어 (Compiled Language)'
    ],
    correctIndex: 2,
    explanation: '우리가 일상에서 말하고 쓰는 한국어, 영어 등은 오랜 역사를 통해 자연스럽게 형성된 "자연어(Natural Language)"입니다. 반면 파이썬, C언어 등은 컴퓨터 명령을 위해 인위적으로 만든 프로그래밍 언어입니다.',
    conceptTip: '자연어는 인간이 소통하는 언어이며, 문맥에 따라 의미가 달라질 수 있는 중의성(모호성)을 가집니다.'
  },
  {
    id: 'nlp-2',
    topic: '자연어 처리',
    difficulty: '보통',
    question: '자연어 처리(NLP) 과정에서 문장을 컴퓨터가 분석하기 쉬운 최소 의미 단위인 단어나 형태소 단위로 잘라내는 작업을 무엇이라고 하는가?',
    choices: [
      '토큰화 (Tokenization)',
      '컴파일 (Compilation)',
      '렌더링 (Rendering)',
      '인코딩 (Encoding)',
      '디버깅 (Debugging)'
    ],
    correctIndex: 0,
    explanation: '문장을 단어, 음절, 형태소 등의 기본 조각(토큰, Token)으로 나누는 전처리 과정을 "토큰화(Tokenization)"라고 부릅니다. 예: "나는 사과를 먹었다" -> ["나", "는", "사과", "를", "먹었다"].',
    conceptTip: '컴퓨터는 긴 통문장을 한 번에 이해하지 못하므로, 먼저 토큰 단위로 잘라 분석합니다.'
  },
  {
    id: 'nlp-3',
    topic: '자연어 처리',
    difficulty: '보통',
    question: '자연어와 프로그래밍 언어의 차이점에 대한 설명으로 옳지 않은 것은?',
    choices: [
      '자연어는 상황과 억양에 따라 의미가 달라지는 모호성이 있다.',
      '프로그래밍 언어는 오타나 문법 규칙 위반(SyntaxError)에 매우 엄격하다.',
      '컴퓨터는 복잡한 전처리 없이도 사람의 자연어 뉘앙스를 곧바로 100% 이해한다.',
      '자연어 처리를 위해서는 형태소 분석, 불용어 제거 등의 전처리 단계가 필요하다.',
      '프로그래밍 언어는 컴퓨터에게 명확한 명령을 내리기 위해 인위적으로 설계된 언어이다.'
    ],
    correctIndex: 2,
    explanation: '컴퓨터는 0과 1의 이진수 기반 기계어로 작동하므로, 사람이 쓰는 자연어를 곧바로 이해할 수 없습니다. 따라서 컴퓨터가 자연어를 이해하려면 토큰화, 형태소 분석, 수치화(벡터화) 등 복잡한 자연어 처리 기술이 필수적입니다.',
    conceptTip: '프로그래밍 언어는 정확하고 엄격한 규칙을 가지며, 자연어는 유연하지만 모호성이 큽니다.'
  },
  {
    id: 'nlp-4',
    topic: '자연어 처리',
    difficulty: '심화',
    question: '텍스트 분석 시 "은/는/이/가", "그리고", "하지만"과 같이 문장의 핵심 의미 파악에는 큰 영향을 주지 않아 제거하는 단어들을 가리키는 용어는?',
    choices: [
      '핵심어 (Keyword)',
      '불용어 (Stopword)',
      '복합어 (Compound word)',
      '대명사 (Pronoun)',
      '식별자 (Identifier)'
    ],
    correctIndex: 1,
    explanation: '분석에 큰 가치가 없고 빈도수만 높은 단어들을 "불용어(Stopwords)"라고 부르며, 의미 있는 단어들만 남기기 위해 자연어 전처리 과정에서 제거합니다.',
    conceptTip: '불용어를 제거하면 데이터 크기가 줄어들고 컴퓨터가 핵심 주제어에 집중할 수 있습니다.'
  },

  // --- 2. 기계학습 (Machine Learning) ---
  {
    id: 'ml-1',
    topic: '기계학습',
    difficulty: '기초',
    question: '기계학습(Machine Learning)의 세 가지 대표적인 학습 방식(지도학습, 비지도학습, 강화학습)에 대한 설명으로 가장 알맞은 것은?',
    choices: [
      '지도학습은 정답(레이블)이 없는 데이터에서 스스로 패턴을 찾아 그룹을 묶는다.',
      '비지도학습은 문제와 정답(레이블)을 컴퓨터에 함께 제공하여 둘 사이의 관계를 학습시킨다.',
      '지도학습은 정답이 주어지는 학습이며, 비지도학습은 정답 없이 데이터 자체의 구조나 규칙을 찾는 학습이다.',
      '강화학습은 사전에 모든 정답을 외우게 한 뒤 오차를 계산하지 않고 1회만 학습하는 방식이다.',
      '비지도학습은 행동에 대한 즉각적인 점수(보상)를 통해 시행착오로 행동 정책을 익힌다.'
    ],
    correctIndex: 2,
    explanation: '지도학습(Supervised Learning)은 문제와 정답(레이블)이 함께 주어지는 학습 방식이며, 비지도학습(Unsupervised Learning)은 정답 없이 데이터 간의 유사도와 규칙을 파악하는 방식입니다. 강화학습은 시행착오와 보상 기반입니다.',
    conceptTip: '지도학습 = 문제+정답(선생님 지도) | 비지도학습 = 정답 없음(스스로 군집/규칙 탐색) | 강화학습 = 보상과 벌점(시행착오)'
  },
  {
    id: 'ml-2',
    topic: '기계학습',
    difficulty: '보통',
    question: '지도학습(Supervised Learning)의 두 가지 핵심 분야인 "분류(Classification)"와 "회귀(Regression)"를 올바르게 비교한 것은?',
    choices: [
      '분류는 연속적인 숫자(온도, 키 등)를 예측하고, 회귀는 이산적인 범주(스팸 메일 여부 등)를 예측한다.',
      '분류는 정답(레이블)이 필요 없고, 회귀는 정답(레이블)이 반드시 필요하다.',
      '분류는 "합격/불합격", "개/고양이"와 같은 범주를 예측하고, 회귀는 "내일의 기온", "아파트 가격"과 같은 연속적인 수치를 예측한다.',
      '분류와 회귀는 모두 정답이 없는 비지도학습 알고리즘에 해당한다.',
      '회귀는 여러 데이터를 k개의 그룹으로 묶는 군집화 기법이다.'
    ],
    correctIndex: 2,
    explanation: '지도학습에서 "분류(Classification)"는 결과를 몇 개의 클래스(범주/카테고리)로 판별하는 것이고, "회귀(Regression)"는 숫자(수치값)의 크기나 변화를 예측하는 것입니다.',
    conceptTip: '분류 = Yes/No, A/B/C 등 범주 예측 | 회귀 = 85점, 24.5도 등 연속된 수치값 예측'
  },
  {
    id: 'ml-3',
    topic: '기계학습',
    difficulty: '보통',
    question: '정답(레이블)이 없는 대규모 고객 데이터를 유사한 소비 특성을 가진 여러 그룹으로 묶으려고 한다. 이에 해당하는 기계학습 유형과 대표 알고리즘으로 가장 알맞은 것은?',
    choices: [
      '지도학습 - 선형 회귀 (Linear Regression)',
      '비지도학습 - 군집화 (Clustering: k-평균, kNN 등)',
      '강화학습 - 큐러닝 (Q-Learning)',
      '지도학습 - 의사결정나무 분류 (Decision Tree)',
      '비지도학습 - 자연어 토큰화 (Tokenization)'
    ],
    correctIndex: 1,
    explanation: '정답 라벨 없이 데이터들의 거리와 유사성을 계산하여 비슷한 특성을 가진 무리로 묶는 것을 "군집화(Clustering)"라고 하며, 이는 비지도학습의 대표적인 작업입니다. 학교 수업에서 다룬 k-평균(K-Means)과 kNN(k-최근접 이웃)의 거리 계산 원리가 여기에 해당합니다.',
    conceptTip: '군집화(Clustering)는 라벨 없는 데이터를 유사도에 따라 k개 그룹으로 묶는 비지도학습 기법입니다.'
  },
  {
    id: 'ml-4',
    topic: '기계학습',
    difficulty: '보통',
    question: '대형 마트의 영수증 결제 데이터를 분석하여 "기저귀를 카트에 담은 고객은 맥주도 함께 구매할 확률이 높다"는 동시 구매 상품 간의 규칙을 발견했다. 이와 가장 관련 깊은 기계학습 기법은?',
    choices: [
      '연관 규칙 학습 (Association Rule Learning - 장바구니 분석)',
      '강화학습 (Reinforcement Learning - 에이전트 보상)',
      '수치 회귀 분석 (Numerical Regression)',
      '이진 분류 (Binary Classification)',
      '형태소 불용어 제거 (Stopwords Cleaning)'
    ],
    correctIndex: 0,
    explanation: '데이터 속에서 사건이나 항목 간의 상관관계와 동시 발생 규칙을 찾는 것을 "연관 규칙 학습(Association Rule Learning)"이라 하며, 대표적으로 마트의 \'장바구니 분석\'에 활용되는 비지도학습 기법입니다.',
    conceptTip: '연관 규칙 = A를 사면 B도 함께 산다 (장바구니 분석 / 상품 추천의 핵심 원리)'
  },
  {
    id: 'ml-5',
    topic: '기계학습',
    difficulty: '보통',
    question: '바둑 인공지능 "알파고"나 자율주행차처럼, 인공지능(에이전트)이 주어진 환경에서 수많은 시행착오(Trial and Error)를 겪으며 좋은 행동에는 "보상(Reward)"을, 나쁜 행동에는 "벌점"을 받아 스스로 최적의 행동 전략을 찾아가는 학습 방법은?',
    choices: [
      '지도학습 (Supervised Learning)',
      '비지도학습 (Unsupervised Learning)',
      '강화학습 (Reinforcement Learning)',
      '규칙 기반 전문가 시스템 (Rule-based System)',
      '텍스트 토큰화 (Tokenization)'
    ],
    correctIndex: 2,
    explanation: '에이전트가 환경과 상호작용하며 누적 보상(Reward)을 최대화하도록 시행착오를 통해 학습하는 방식을 "강화학습(Reinforcement Learning)"이라고 부릅니다.',
    conceptTip: '강화학습의 3요소 = 에이전트(주체), 환경(상황), 보상(잘하면 상, 못하면 벌)'
  },
  {
    id: 'ml-6',
    topic: '기계학습',
    difficulty: '심화',
    question: '다음 [보기]의 실생활 인공지능 활용 사례와 기계학습 유형의 연결로 가장 바르게 짝지어진 것은?\n\n[보기]\nㄱ. 흉부 X-ray 사진을 보고 폐렴 "양성"인지 "음성"인지 판별한다.\nㄴ. 학생의 지난 모의고사 성적과 공부 시간을 바탕으로 기말고사 "점수"를 예측한다.\nㄷ. 온라인 쇼핑몰에서 상품을 조회한 사람들에게 "함께 많이 팔린 연관 상품"을 추천한다.\nㄹ. 로봇 팔이 물건을 떨어뜨리지 않도록 수천 번 떨어뜨려 보며 성공 시 보상을 주는 방식으로 균형을 잡는다.',
    choices: [
      'ㄱ: 지도학습(회귀), ㄴ: 지도학습(분류), ㄷ: 강화학습, ㄹ: 비지도학습(군집화)',
      'ㄱ: 지도학습(분류), ㄴ: 지도학습(회귀), ㄷ: 비지도학습(연관 규칙), ㄹ: 강화학습',
      'ㄱ: 비지도학습(군집화), ㄴ: 강화학습, ㄷ: 지도학습(분류), ㄹ: 지도학습(회귀)',
      'ㄱ: 지도학습(분류), ㄴ: 강화학습, ㄷ: 비지도학습(연관 규칙), ㄹ: 지도학습(회귀)',
      'ㄱ: 강화학습, ㄴ: 비지도학습(연관 규칙), ㄷ: 지도학습(회귀), ㄹ: 지도학습(분류)'
    ],
    correctIndex: 1,
    explanation: 'ㄱ은 양성/음성 범주 판별이므로 지도학습의 분류, ㄴ은 점수(수치) 예측이므로 지도학습의 회귀, ㄷ은 동시 발생 항목 탐색이므로 비지도학습의 연관 규칙, ㄹ은 보상 기반 시행착오이므로 강화학습입니다.',
    conceptTip: '양성/음성=분류 | 점수 예측=회귀 | 함께 구매=연관 규칙 | 보상과 시행착오=강화학습'
  },
  {
    id: 'ml-7',
    topic: '기계학습',
    difficulty: '심화',
    question: '기계학습을 학습한 1학년 5반 학생들의 토론 내용 중 개념이 잘못된 학생은 누구인가?',
    choices: [
      '김겸: "지도학습의 분류는 사진 속 동물이 고양이인지 강아지인지 판별할 때 쓸 수 있어."',
      '김단우: "회귀는 내일 서울의 낮 최고 기온이 몇 도(℃)일지 연속적인 실수값으로 예측할 때 사용해."',
      '박시우: "비지도학습의 군집화(k-평균 등)를 수행하려면 사전에 각 데이터가 어느 그룹인지 정답 라벨이 꼭 붙어 있어야 해."',
      '이동건: "비지도학습의 연관 규칙은 편의점에서 삼각김밥과 함께 라면을 자주 사는지 패턴을 파악할 때 유용해."',
      '하동훈: "강화학습은 게임을 수만 번 반복하면서 이기면 보상을, 지면 벌점을 주어 최적의 플레이 방식을 스스로 익혀."'
    ],
    correctIndex: 2,
    explanation: '박시우 학생의 설명이 틀렸습니다. 군집화(Clustering)는 "비지도학습"이므로 사전에 정답 라벨(어느 그룹인지)이 주어지지 않은 상태에서 데이터 자체의 유사도를 기반으로 그룹을 묶는 기법입니다. 정답 라벨이 미리 주어져 있다면 이는 "지도학습의 분류"입니다.',
    conceptTip: '군집화는 정답 라벨이 없을 때 쓰는 비지도학습입니다. 정답 라벨이 있으면 분류(지도학습)입니다!'
  },

  // --- 3. 순서도 도형 (Flowchart) ---
  {
    id: 'flow-1',
    topic: '순서도 도형',
    difficulty: '기초',
    question: '순서도에서 프로그램의 "시작(Start)"과 "끝(End)"을 나타낼 때 사용하는 올바른 도형 기호는 무엇인가?',
    choices: [
      '타원 (또는 둥근 직사각형)',
      '평행사변형',
      '직사각형',
      '마름모',
      '밑변 물결 직사각형'
    ],
    correctIndex: 0,
    explanation: '프로그램의 "시작"과 "끝"을 표시하는 도형은 "타원(또는 둥근 직사각형)"입니다.',
    conceptTip: '시작과 끝 = 타원 | 입력 = 평행사변형 | 출력 = 아랫변 물결(웨이브) 사각형 | 처리 = 직사각형 | 조건 = 마름모'
  },
  {
    id: 'flow-2',
    topic: '순서도 도형',
    difficulty: '기초',
    question: '순서도에서 사용자로부터 키보드 등으로 데이터를 "입력(input)"받을 때 사용하는 기호는 무엇인가?',
    choices: [
      '직사각형',
      '평행사변형',
      '원형',
      '마름모',
      '타원'
    ],
    correctIndex: 1,
    explanation: '키보드나 센서로부터 데이터를 입력(input)받는 기호는 "평행사변형"입니다.',
    conceptTip: '입력 = 평행사변형 | 출력 = 직사각형 아랫변 물결(웨이브) 모양'
  },
  {
    id: 'flow-2-out',
    topic: '순서도 도형',
    difficulty: '기초',
    question: '순서도에서 계산된 결과나 안내 문구를 화면에 "출력(print)"할 때 사용하는 기호로 가장 알맞은 것은?',
    choices: [
      '직사각형의 아랫변이 태극기 물결(웨이브) 모양인 도형',
      '평행사변형',
      '타원',
      '마름모',
      '사다리꼴'
    ],
    correctIndex: 0,
    explanation: '화면이나 문서로 결과를 "출력(print)"할 때는 직사각형의 아랫변이 태극기 물결 모양(웨이브)으로 곡선 처리된 출력 기호를 사용합니다.',
    conceptTip: '출력(print) 기호는 직사각형 밑변이 물결(웨이브) 모양입니다.'
  },
  {
    id: 'flow-3',
    topic: '순서도 도형',
    difficulty: '보통',
    question: '순서도에서 변수 값을 계산하거나 대입하는 연산(예: sum = sum + i, count = count + 1)을 나타내는 도형은?',
    choices: [
      '마름모',
      '평행사변형',
      '직사각형',
      '타원',
      '물결 직사각형'
    ],
    correctIndex: 2,
    explanation: '직사각형(Process/처리) 기호는 사칙연산, 값의 대입 및 할당, 내부 데이터 가공 등 일반적인 처리 동작을 나타냅니다.',
    conceptTip: '직사각형 안에는 `a = 10`, `total = total + num`과 같은 대입문/연산식이 들어갑니다.'
  },
  {
    id: 'flow-4',
    topic: '순서도 도형',
    difficulty: '보통',
    question: '순서도에서 참(True)과 거짓(False)에 따라 실행 흐름이 두 갈래 이상으로 분기되는 조건(예: score >= 80?)을 검사하는 도형은?',
    choices: [
      '마름모 (조건/판단)',
      '직사각형 (처리/연산)',
      '타원 (시작/끝)',
      '평행사변형 (데이터 입력)',
      '물결 사각형 (화면 출력)'
    ],
    correctIndex: 0,
    explanation: '마름모(조건/판단) 기호는 조건식을 평가하여 "예(Yes/참)"와 "아니오(No/거짓)"로 화살표가 갈라지는 분기점 역할을 합니다. 파이썬의 if 조건문에 해당합니다.',
    conceptTip: '마름모는 반드시 2개 이상의 화살표(Yes, No)가 뻗어나와야 합니다.'
  },
  {
    id: 'flow-5',
    topic: '순서도 도형',
    difficulty: '심화',
    question: '다음 순서도 흐름을 읽고 [빈칸]에 들어갈 올바른 도형과 내용의 짝으로 알맞은 것은?\n\n[시작(타원)] → [N 입력받기(평행사변형)] → [ ?빈칸? ] → [Yes: "합격" 출력 / No: "불합격" 출력] → [끝(타원)]',
    choices: [
      '직사각형 : N = N + 10',
      '마름모 : N >= 60 ?',
      '물결 직사각형 : N 출력',
      '타원 : 재시험',
      '평행사변형 : N 재입력'
    ],
    correctIndex: 1,
    explanation: '결과가 "합격"과 "불합격"으로 두 갈래(Yes/No)로 갈라져 출력되므로, 판단을 내리는 마름모 도형과 기준 점수를 비교하는 조건식(N >= 60 ?)이 들어가야 합니다.',
    conceptTip: '조건 검사는 항상 마름모 도형에 들어가며, 파이썬의 if 조건문과 1:1 대응됩니다.'
  },

  // --- 3. 실생활 모델링 (입력, 출력, 조건, 변수 구분) ---
  {
    id: 'model-1',
    topic: '실생활 모델링',
    difficulty: '기초',
    question: '주제: [자동 온도 조절 에어컨]\n실내 온도가 28도 이상이면 에어컨을 켜고, 그렇지 않으면 끈다.\n이 시스템에서 "조건(Condition)"에 해당하는 것은?',
    choices: [
      '온도 센서로부터 측정한 현재 실내 온도',
      '에어컨 전원 ON / OFF 상태',
      '현재 실내 온도가 28도 이상인가?',
      '온도를 저장하는 변수 current_temp',
      '에어컨 제조사 모델명'
    ],
    correctIndex: 2,
    explanation: '"현재 실내 온도가 28도 이상인가?"는 참/거짓을 판별하여 동작을 결정하는 판단 기준이므로 "조건(Condition)"입니다. (입력: 센서 온도, 출력: 에어컨 ON/OFF, 변수: current_temp)',
    conceptTip: '입력: 들어오는 값 / 출력: 나오는 결과 / 조건: 결정을 내리는 기준(True/False) / 변수: 값을 저장하는 이름'
  },
  {
    id: 'model-2',
    topic: '실생활 모델링',
    difficulty: '보통',
    question: '주제: [영화관 티켓 요금 계산 프로그램]\n나이가 19세 미만이면 청소년 요금(9,000원), 19세 이상이면 일반 요금(14,000원)을 결제창에 띄운다.\n다음 중 "입력(Input)"과 "출력(Output)"의 짝으로 가장 적절한 것은?',
    choices: [
      '입력: 관람객의 나이  /  출력: 최종 결제 요금',
      '입력: 최종 결제 요금  /  출력: 관람객의 나이',
      '입력: 19세 미만인가  /  출력: 티켓 출력 기계',
      '입력: 변수 age  /  출력: 변수 price',
      '입력: 상영관 번호  /  출력: 팝콘 세트 가격'
    ],
    correctIndex: 0,
    explanation: '사용자가 키보드나 화면을 통해 입력하는 데이터는 "관람객의 나이(입력)"이며, 프로그램을 거쳐 사용자에게 보여주는 최종 결과는 "최종 결제 요금(출력)"입니다.',
    conceptTip: '입력은 사용자가 프로그램에 주는 정보, 출력은 프로그램이 계산 후 돌려주는 결과입니다.'
  },
  {
    id: 'model-3',
    topic: '실생활 모델링',
    difficulty: '보통',
    question: '주제: [음료수 자동판매기]\n자판기에 투입한 금액과 선택한 음료수 가격을 비교하여 음료수를 제공하고 거스름돈을 계산한다.\n이 프로그램에서 값이 계속 바뀔 수 있어 메모리에 저장해야 하는 "변수(Variable)"에 해당하는 것은?',
    choices: [
      '투입 금액이 음료수 가격보다 크거나 같은가?',
      '음료수 배출구 및 동전 반환구',
      '투입금액(money), 선택음료(choice), 거스름돈(change)',
      '자판기 판매 안내 스티커',
      '음료 캔의 알루미늄 재질'
    ],
    correctIndex: 2,
    explanation: '변수(Variable)는 프로그램이 실행되는 동안 입력받거나 계산된 값을 기억해 두는 저장소입니다. 사용자가 넣은 돈(money), 고른 번호(choice), 남은 돈(change)은 모두 변수입니다.',
    conceptTip: '변수는 데이터를 담아두는 이름 붙은 상자입니다.'
  },
  {
    id: 'model-4',
    topic: '실생활 모델링',
    difficulty: '심화',
    question: '주제: [롤러코스터 탑승 검사기]\n키(height)가 130cm 이상이고 심장질환(heart_disease)이 없어야 탑승 가능.\n다음 분류 중 잘못 연결된 것은?',
    choices: [
      '입력(Input): 탑승 희망자의 키, 심장질환 여부',
      '변수(Variable): height, has_heart_disease',
      '조건(Condition): height >= 130 and not has_heart_disease',
      '출력(Output): 키를 재는 신장계 기계 장비',
      '처리(Process): 탑승 가능 여부를 판단하는 논리 연산'
    ],
    correctIndex: 3,
    explanation: '신장계 기계 장비는 하드웨어 도구일 뿐 프로그램의 "출력"이 아닙니다. 이 소프트웨어의 올바른 출력은 화면에 표시되는 "탑승 가능" 또는 "탑승 불가" 메시지입니다.',
    conceptTip: '출력(Output)은 화면 출력 메시지, 소리, 파일 저장 등 프로그램이 만들어낸 결과 정보입니다.'
  },

  // --- 4. 파이썬 기초 (입출력 및 자료형 변환) ---
  {
    id: 'py-basic-1',
    topic: '파이썬 입출력·자료형',
    difficulty: '기초',
    question: '파이썬에서 화면에 글자나 변수의 값을 출력할 때 사용하는 기본 내장 함수는 무엇인가?',
    choices: [
      'input()',
      'print()',
      'output()',
      'write()',
      'display()'
    ],
    correctIndex: 1,
    explanation: '파이썬에서 화면에 데이터를 출력하는 함수는 `print()`입니다.',
    conceptTip: '화면 출력 = print(...) | 키보드 입력 = input(...)'
  },
  {
    id: 'py-basic-2',
    topic: '파이썬 입출력·자료형',
    difficulty: '보통',
    codeSnippet: 'a = input("첫 번째 숫자: ")  # 사용자가 10을 입력함\nb = input("두 번째 숫자: ")  # 사용자가 20을 입력함\nprint(a + b)',
    question: '위 코드를 실행하여 10과 20을 입력했을 때, 화면에 출력되는 결과로 알맞은 것은?',
    choices: [
      '30',
      '1020',
      '"30"',
      '에러 발생 (TypeError)',
      '10 20'
    ],
    correctIndex: 1,
    explanation: '★시험 단골 함정! 파이썬의 input() 함수는 숫자를 입력하더라도 무조건 "문자열(str)" 형태로 읽어옵니다. 따라서 문자열 "10"과 "20"을 더하면 이어붙이기가 되어 "1020"이 출력됩니다. 수학적인 덧셈(30)을 하려면 int(a) + int(b)로 변환해야 합니다.',
    conceptTip: 'input()으로 입력받은 값은 숫자를 입력해도 무조건 문자열입니다. 숫자로 계산하려면 int() 또는 float()를 씌워주어야 합니다!'
  },
  {
    id: 'py-basic-3',
    topic: '파이썬 입출력·자료형',
    difficulty: '보통',
    codeSnippet: 'x = "20"\ny = "30"\nprint(x + y)',
    question: '위 파이썬 코드를 실행했을 때 화면에 출력되는 결과로 알맞은 것은?',
    choices: [
      '50',
      '2030',
      '"50"',
      '에러 발생 (TypeError)',
      '"2030"'
    ],
    correctIndex: 1,
    explanation: 'x와 y는 따옴표로 감싸진 문자열(str)입니다. 문자열 사이에 덧셈(+) 기호를 사용하면 두 문자열을 이어붙이므로 "20" + "30" = "2030"이 출력됩니다.',
    conceptTip: '문자열 + 문자열은 이어붙이기, 숫자 + 숫자는 사칙연산 덧셈입니다.'
  },
  {
    id: 'py-basic-4',
    topic: '파이썬 입출력·자료형',
    difficulty: '보통',
    codeSnippet: 'a = int("15")\nb = float("3.5")\nprint(a + b)',
    question: '위 파이썬 코드를 실행했을 때 화면에 출력되는 결과는 무엇인가?',
    choices: [
      '18.5',
      '18',
      '"153.5"',
      '에러 발생',
      '18.0'
    ],
    correctIndex: 0,
    explanation: 'int("15")는 정수 15가 되고, float("3.5")는 실수 3.5가 됩니다. 정수와 실수를 더하면 실수형인 18.5가 출력됩니다.',
    conceptTip: 'int()는 정수 변환, float()는 소수점을 가진 실수 변환, str()은 문자열 변환입니다.'
  },
  {
    id: 'py-basic-5',
    topic: '파이썬 입출력·자료형',
    difficulty: '심화',
    codeSnippet: 'num1 = input() # 5 입력\nnum2 = input() # 3 입력\n# 두 숫자를 곱하여 15를 출력하고 싶다.\nprint( [ 빈 칸 ] )',
    question: '위 코드의 [ 빈 칸 ]에 들어갈 코드로 가장 올바른 것은?',
    choices: [
      'num1 * num2',
      'int(num1) * int(num2)',
      'str(num1) * str(num2)',
      'float(num1 * num2)',
      'int(num1 + num2)'
    ],
    correctIndex: 1,
    explanation: 'input()으로 입력받은 num1, num2는 문자열이므로 곱셈 연산을 하려면 `int(num1) * int(num2)`와 같이 정수형으로 변환해야 올바른 곱셈 결과 15가 나옵니다. (문자열끼리 곱하면 TypeError 발생)',
    conceptTip: '사칙연산을 하려면 반드시 int() 또는 float()로 형변환을 해야 합니다.'
  },

  // --- 5. 조건문 (if, elif, else) ---
  {
    id: 'py-if-1',
    topic: 'if·elif 조건문',
    difficulty: '기초',
    question: '파이썬에서 if문 작성 시 조건식 끝에 반드시 붙여야 하는 문장 부호와 그 아래 실행 블록에 필수적인 작성 규칙의 조합은?',
    choices: [
      '세미콜론(;)과 대괄호([ ])',
      '콜론(:)과 들여쓰기(Indentation)',
      '마침표(.)와 띄어쓰기 1칸',
      '화살표(->)와 중괄호({ })',
      '물음표(?)와 밑줄(_)'
    ],
    correctIndex: 1,
    explanation: '파이썬에서는 if, elif, else 등의 조건문 뒤에 반드시 쌍점 콜론(:)을 붙이고, 해당 조건이 참일 때 실행할 코드들은 들여쓰기(스페이스 4칸 또는 Tab)를 해야 합니다.',
    conceptTip: '콜론(:)과 들여쓰기는 파이썬 문법의 가장 핵심적인 규칙입니다.'
  },
  {
    id: 'py-if-2',
    topic: 'if·elif 조건문',
    difficulty: '보통',
    codeSnippet: 'score = 75\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("D")',
    question: '위 코드를 실행했을 때 최종적으로 출력되는 알파벳은 무엇인가?',
    choices: [
      'A',
      'B',
      'C',
      'D',
      'F'
    ],
    correctIndex: 2,
    explanation: 'score가 75이므로, 90 이상(False) → 80 이상(False)을 지나 `score >= 70`(True) 조건에 해당되어 "C"가 출력됩니다.',
    conceptTip: 'if - elif - else 문은 위에서부터 차례대로 검사하며, 처음으로 참이 되는 블록 하나만 실행합니다.'
  },
  {
    id: 'py-if-3',
    topic: 'if·elif 조건문',
    difficulty: '보통',
    codeSnippet: 'age = 15\n\nif age >= 20:\n    print("성인")\nelse:\n    print("청소년")',
    question: '위 코드에서 age가 15일 때 실행 흐름으로 옳은 것은?',
    choices: [
      'if 조건이 참이므로 "성인"이 출력된다.',
      'if 조건이 거짓이므로 else 블록의 "청소년"이 출력된다.',
      '"성인"과 "청소년"이 모두 출력된다.',
      '문법 에러가 발생한다.',
      '아무것도 출력되지 않는다.'
    ],
    correctIndex: 1,
    explanation: 'age >= 20 조건식이 15 >= 20으로 거짓(False)이 되므로, else 블록으로 넘어가 "청소년"이 출력됩니다.',
    conceptTip: 'if 조건이 거짓(False)이면 else 블록이 실행됩니다.'
  },
  {
    id: 'py-if-4',
    topic: 'if·elif 조건문',
    difficulty: '심화',
    codeSnippet: 'n = 12\n\nif n % 2 == 0 and n % 3 == 0:\n    print("2와 3의 공배수")\nelif n % 2 == 0:\n    print("2의 배수")\nelse:\n    print("기타")',
    question: '위 코드에서 n = 12일 때 화면에 출력되는 문장은?',
    choices: [
      '2의 배수',
      '2와 3의 공배수',
      '2와 3의 공배수\n2의 배수',
      '기타',
      '12'
    ],
    correctIndex: 1,
    explanation: '12는 2로 나눈 나머지(n % 2)가 0이고 3으로 나눈 나머지(n % 3)도 0이므로 첫 번째 if 조건이 참(True)입니다. 따라서 "2와 3의 공배수"만 출력하고 조건문을 빠져나옵니다.',
    conceptTip: '`%` 연산자는 나눗셈의 나머지를 구하며, 짝수/배수 판별에 자주 사용됩니다.'
  },

  // --- 6. 반복문 (for, while) ---
  {
    id: 'py-loop-1',
    topic: 'for·while 반복문',
    difficulty: '기초',
    codeSnippet: 'for i in range(5):\n    print(i, end=" ")',
    question: '위 코드를 실행했을 때 출력되는 숫자의 나열로 올바른 것은?',
    choices: [
      '1 2 3 4 5',
      '0 1 2 3 4',
      '0 1 2 3 4 5',
      '1 2 3 4',
      '0 1 2 3'
    ],
    correctIndex: 1,
    explanation: '★시험 단골 출제! `range(5)`는 0부터 시작하여 5개의 정수(0, 1, 2, 3, 4)를 생성합니다. 끝 번호인 5는 포함되지 않습니다.',
    conceptTip: '`range(n)`은 0부터 n-1까지 총 n번 반복합니다.'
  },
  {
    id: 'py-loop-2',
    topic: 'for·while 반복문',
    difficulty: '보통',
    codeSnippet: 'total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)',
    question: '위 코드를 실행했을 때 출력되는 total의 값은 무엇인가?',
    choices: [
      '10',
      '15',
      '21',
      '6',
      '20'
    ],
    correctIndex: 1,
    explanation: 'range(1, 6)은 1, 2, 3, 4, 5까지 반복합니다. total에는 0 + 1 + 2 + 3 + 4 + 5 = 15가 저장되어 최종 15가 출력됩니다.',
    conceptTip: '`range(start, stop)`은 start부터 stop-1까지의 정수를 만듭니다.'
  },
  {
    id: 'py-loop-3',
    topic: 'for·while 반복문',
    difficulty: '보통',
    codeSnippet: 'count = 1\nwhile count < 4:\n    print(count)\n    count = count + 1',
    question: '위 while문 코드를 실행했을 때 화면에 출력되는 내용으로 올바른 것은?',
    choices: [
      '1\n2\n3\n4',
      '1\n2\n3',
      '2\n3\n4',
      '무한히 1이 반복 출력된다',
      '0\n1\n2\n3'
    ],
    correctIndex: 1,
    explanation: 'count가 1일 때 출력 후 2가 됨 → count가 2일 때 출력 후 3이 됨 → count가 3일 때 출력 후 4가 됨 → count가 4가 되면 `count < 4` 조건이 거짓(False)이 되어 루프를 종료합니다. 따라서 1, 2, 3이 차례로 출력됩니다.',
    conceptTip: 'while문은 조건식이 참(True)인 동안 계속 실행되며, 거짓이 되는 순간 종료됩니다.'
  },
  {
    id: 'py-loop-4',
    topic: 'for·while 반복문',
    difficulty: '심화',
    codeSnippet: '# 10부터 2씩 감소하면서 2까지 출력하고 싶다.\nfor i in range(10, 0, -2):\n    print(i, end=" ")',
    question: '위 코드를 실행했을 때 출력되는 결과로 알맞은 것은?',
    choices: [
      '10 8 6 4 2 0',
      '10 8 6 4 2',
      '10 9 8 7 6 5 4 3 2 1',
      '0 2 4 6 8 10',
      '10 8 6 4 2 0 -2'
    ],
    correctIndex: 1,
    explanation: '`range(10, 0, -2)`는 10부터 시작하여 -2씩 감소하며, 끝값 0은 포함하지 않으므로 2까지 진행됩니다. 따라서 10, 8, 6, 4, 2가 출력됩니다.',
    conceptTip: '`range(시작, 끝, 증감값)`에서 음수 증감값을 쓰면 숫자가 줄어드는 역순 반복이 됩니다.'
  },
  {
    id: 'py-loop-5',
    topic: 'for·while 반복문',
    difficulty: '심화',
    codeSnippet: 'i = 0\nwhile i < 5:\n    print("안녕")\n    # 주의: i의 값을 변화시키는 코드가 빠져있음!',
    question: '위 코드의 문제점에 대한 설명으로 가장 올바른 것은?',
    choices: [
      '문법 에러(SyntaxError)가 발생하여 실행되지 않는다.',
      'i가 항상 0이므로 조건식(i < 5)이 계속 참이 되어 "무한 루프(Infinite Loop)"에 빠진다.',
      '컴퓨터가 자동으로 i를 1씩 증가시켜 5번만 출력하고 끝난다.',
      '아무것도 출력되지 않고 바로 종료된다.',
      '안녕이 정확히 5번만 출력된다.'
    ],
    correctIndex: 1,
    explanation: 'while문 내부에서 i를 증가시키는 코드(`i = i + 1` 등)가 없으면 i는 영원히 0으로 남아 조건식 `0 < 5`가 계속 참(True)이 됩니다. 이를 "무한 루프"라고 하며 프로그램이 멈추지 않으므로 반드시 탈출 조건을 만들어야 합니다.',
    conceptTip: 'while문 작성 시에는 조건식이 언젠가 False가 되도록 변수 값을 업데이트해야 합니다.'
  }
];
