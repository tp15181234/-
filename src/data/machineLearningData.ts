export type MLCategory = 
  | '지도학습 (분류)' 
  | '지도학습 (회귀)' 
  | '비지도학습 (군집화)' 
  | '비지도학습 (연관 규칙)' 
  | '강화학습';

export interface MLCategoryInfo {
  key: MLCategory;
  shortLabel: string;
  tag: string;
  badgeColor: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  summary: string;
  rule3Sec: string;
  representativeExample: string;
}

export const ML_CATEGORIES: MLCategoryInfo[] = [
  {
    key: '지도학습 (분류)',
    shortLabel: '분류 (Classification)',
    tag: '지도학습',
    badgeColor: 'bg-blue-600 text-white',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50/70',
    textColor: 'text-blue-900',
    summary: '정답(레이블)이 주어지며, 결과를 이산적인 "범주/종류(Class)"로 예측',
    rule3Sec: '정답 라벨 O + 결과가 "이름/종류(예: 스팸/정상, 양성/음성, 합격/불합격)"인가?',
    representativeExample: '스팸 메일 필터링, 사진 속 동물(개/고양이) 판별, 폐렴 양성/음성 진단',
  },
  {
    key: '지도학습 (회귀)',
    shortLabel: '회귀 (Regression)',
    tag: '지도학습',
    badgeColor: 'bg-indigo-600 text-white',
    borderColor: 'border-indigo-300',
    bgColor: 'bg-indigo-50/70',
    textColor: 'text-indigo-900',
    summary: '정답(레이블)이 주어지며, 결과를 연속적인 "수치(숫자/크기)"로 예측',
    rule3Sec: '정답 라벨 O + 결과가 "연속된 숫자(예: 기온 ℃, 시험 점수, 아파트 매매가)"인가?',
    representativeExample: '내일 낮 최고 기온(℃) 예측, 공부 시간에 따른 기말고사 점수 예측, 주택 가격 추정',
  },
  {
    key: '비지도학습 (군집화)',
    shortLabel: '군집화 (k-평균/kNN)',
    tag: '비지도학습',
    badgeColor: 'bg-emerald-600 text-white',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50/70',
    textColor: 'text-emerald-900',
    summary: '정답(레이블) 없이 데이터 자체의 유사도·거리를 계산하여 k개 그룹으로 묶음',
    rule3Sec: '정답 라벨 X + "유사한 특성끼리 몇 개의 무리(그룹)로 묶는 것"인가?',
    representativeExample: '쇼핑몰 고객 소비 성향별 그룹화, 유사 뉴스 기사 묶기, k-평균(K-Means), kNN 거리 계산',
  },
  {
    key: '비지도학습 (연관 규칙)',
    shortLabel: '연관 규칙 (장바구니)',
    tag: '비지도학습',
    badgeColor: 'bg-teal-600 text-white',
    borderColor: 'border-teal-300',
    bgColor: 'bg-teal-50/70',
    textColor: 'text-teal-900',
    summary: '정답(레이블) 없이 사건이나 항목 간의 "동시 발생 상관관계 및 규칙" 분석',
    rule3Sec: '정답 라벨 X + "A를 사면 B도 함께 산다(장바구니 패턴, 연관 추천)"인가?',
    representativeExample: '마트 장바구니 분석(기저귀와 맥주 동시 구매), 넷플릭스 함께 본 영상 추천',
  },
  {
    key: '강화학습',
    shortLabel: '강화학습 (보상/시행착오)',
    tag: '강화학습',
    badgeColor: 'bg-amber-600 text-white',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50/70',
    textColor: 'text-amber-900',
    summary: '에이전트가 환경과 상호작용하며 좋은 행동에 "보상(Reward)"을 받아 최적 정책 학습',
    rule3Sec: '정답 대신 "보상(Reward)과 벌점" + "수많은 시행착오(Trial & Error)"를 겪는가?',
    representativeExample: '바둑 AI 알파고(AlphaGo), 자율주행차 최적 경로 학습, 로봇 보행 균형 제어',
  },
];

export interface MLProblemItem {
  id: string;
  title: string;
  description: string;
  contextData: string;
  correctCategory: MLCategory;
  whyCorrect: string;
  pitfallTip: string;
}

export interface MLPack {
  id: string;
  title: string;
  badge: string;
  description: string;
  items: MLProblemItem[];
}

export const ML_PROBLEM_PACKS: MLPack[] = [
  {
    id: 'pack-smart-life',
    title: '일상생활 & 스마트 라이프',
    badge: '실생활',
    description: '스마트워치, 가전제품, 날씨 예보 등 우리 주변 인공지능의 기계학습 유형을 판별해 보세요.',
    items: [
      {
        id: 'p1-1',
        title: '스마트워치 부정맥 심장 박동 감지',
        description: '스마트워치 센서가 착용자의 심전도 파형을 실시간으로 분석하여 심장이 [정상]인지 [부정맥 의심]인지 알림을 보낸다.',
        contextData: '입력: 1초당 심전도 신호 파형 / 출력: 정상(0) 또는 부정맥(1) 판정 알림',
        correctCategory: '지도학습 (분류)',
        whyCorrect: '사전에 의사의 판정(정답 라벨: 정상/부정맥)이 있는 데이터를 학습하여, 결과를 이산적인 범주(정상 vs 부정맥)로 나누기 때문입니다.',
        pitfallTip: '결과가 숫자가 아니라 [정상 / 부정맥]이라는 범주(종류)이므로 회귀가 아닌 [분류]입니다!',
      },
      {
        id: 'p1-2',
        title: '기상청 내일 서울 낮 최고 기온 예측',
        description: '지난 10년간의 습도, 기압, 일조량 데이터를 분석하여 내일 서울의 낮 최고 기온이 [몇 도(℃)]일지 예측한다.',
        contextData: '입력: 오늘의 기압, 습도, 풍속 / 출력: 내일 예상 최고 기온 27.8℃',
        correctCategory: '지도학습 (회귀)',
        whyCorrect: '기존 기상 관측 기록(정답 수치)을 학습하여, 결과로 27.8℃와 같은 연속적인 실수값(수치)을 예측하기 때문입니다.',
        pitfallTip: '기온은 27.5도, 28.1도처럼 연속적인 숫자이므로 범주를 나누는 분류가 아니라 [회귀]입니다!',
      },
      {
        id: 'p1-3',
        title: '편의점 영수증 기반 야식 세트 동시 구매 분석',
        description: '심야 시간대 결제 영수증 수만 건을 분석하여 "삼각김밥을 구매한 손님은 컵라면과 탄산음료도 함께 구매하는 경향이 78%에 달한다"는 규칙을 찾아냈다.',
        contextData: '입력: 편의점 영수증 결제 품목 목록 / 출력: {삼각김밥} → {컵라면, 음료} 동시 구매 규칙',
        correctCategory: '비지도학습 (연관 규칙)',
        whyCorrect: '사전에 정답 라벨 없이 영수증 데이터 속에서 항목들 간의 동시 발생 규칙(장바구니 패턴)을 발견하는 분석이기 때문입니다.',
        pitfallTip: '영수증 속 함께 구매되는 상품 관계를 찾는 것은 대표적인 [비지도학습 - 연관 규칙(장바구니 분석)]입니다!',
      },
      {
        id: 'p1-4',
        title: '로봇 청소기의 거실 장애물 회피 주행',
        description: '로봇 청소기가 거실을 돌아다니며 가구에 부딪히면 [-5점 벌점]을, 먼지를 흡입하면 [+10점 보상]을 받으며 스스로 벽에 부딪히지 않는 최적 주행 경로를 익힌다.',
        contextData: '에이전트: 청소기 / 환경: 거실 / 피드백: 충돌 시 벌점, 청소 성공 시 보상',
        correctCategory: '강화학습',
        whyCorrect: '누가 경로를 일일이 정답으로 알려주지 않고, 로봇(에이전트)이 시행착오를 겪으며 점수(보상)를 극대화하도록 학습하기 때문입니다.',
        pitfallTip: '잘하면 상(보상), 못하면 벌(벌점)을 주며 스스로 시행착오를 겪는 키워드는 무조건 [강화학습]입니다!',
      },
    ],
  },
  {
    id: 'pack-medical',
    title: '의료 & 바이오 헬스케어',
    badge: '의료 AI',
    description: '병원 진단, 신약 개발, 유전자 분석에 활용되는 기계학습의 세부 유형을 구별해 보세요.',
    items: [
      {
        id: 'p2-1',
        title: '흉부 X-ray 사진 폐렴 유무 진단',
        description: '환자의 가슴 X-ray 흑백 사진을 입력받아 AI가 폐렴인지 정상인지 [양성(Positive)] 또는 [음성(Negative)]으로 판별한다.',
        contextData: '입력: 흉부 X선 이미지 픽셀 / 출력: 음성(정상) 또는 양성(폐렴)',
        correctCategory: '지도학습 (분류)',
        whyCorrect: '전문의가 판독한 정답 라벨(정상/폐렴)을 기반으로 새로운 엑스레이가 어느 범주(Class)에 속하는지 판별하기 때문입니다.',
        pitfallTip: '결과가 [양성/음성]이라는 범주를 판별하므로 지도학습의 [분류]입니다!',
      },
      {
        id: 'p2-2',
        title: '신약 투여 농도에 따른 혈압 강하 수치 예측',
        description: '새로 개발 중인 혈압약의 투여량(mg)과 환자의 체중에 따라 복용 2시간 후 수축기 혈압이 [몇 mmHg] 떨어질지 수치를 예측한다.',
        contextData: '입력: 약물 투여량(mg), 환자 체중 / 출력: 혈압 강하 수치 -15.4 mmHg',
        correctCategory: '지도학습 (회귀)',
        whyCorrect: '임상 시험 결과(혈압 변화 수치)라는 정답 데이터를 바탕으로 연속적인 혈압 강하 수치(숫자)를 예측하기 때문입니다.',
        pitfallTip: '혈압 수치(mmHg)라는 연속적인 크기를 예측하므로 지도학습의 [회귀]입니다!',
      },
      {
        id: 'p2-3',
        title: '희귀 질환 환자의 유전자 서열 유사도 그룹화',
        description: '알려지지 않은 희귀 질환 환자 500명의 유전자 서열 데이터를 정답 라벨 없이 비교하여 염기 서열 거리가 가까운 환자끼리 [3개의 유사 유전체 군집]으로 묶었다.',
        contextData: '입력: 환자 500명의 DNA 서열 데이터 / 출력: 유사도 기반 3개 군집(k=3) 형성',
        correctCategory: '비지도학습 (군집화)',
        whyCorrect: '환자들의 병명이나 그룹 정답 라벨이 없는 상태에서 유전자 간의 유사도(거리)를 계산하여 k개의 그룹으로 묶었기 때문입니다.',
        pitfallTip: '사전 정답 없이 유사한 것끼리 k개 그룹으로 묶는 것은 k-평균이나 kNN과 같은 [비지도학습 - 군집화]입니다!',
      },
      {
        id: 'p2-4',
        title: '수술 로봇 팔의 미세 혈관 봉합 훈련',
        description: '미세 수술 로봇이 혈관을 꿰맬 때 실이 끊어지면 [-100점 감점], 혈관을 손상 없이 완벽히 묶으면 [+500점 보상]을 주어 수만 번 연습하며 봉합 기술을 익힌다.',
        contextData: '에이전트: 로봇 팔 / 환경: 인공 혈관 / 피드백: 성공 시 보상, 손상 시 벌점',
        correctCategory: '강화학습',
        whyCorrect: '에이전트가 주어진 수술 환경에서 수많은 시행착오를 반복하며 보상을 최대화하는 동작 궤적을 스스로 학습하기 때문입니다.',
        pitfallTip: '수만 번 반복 시도하며 보상과 감점을 통해 기술을 익히는 원리는 [강화학습]입니다!',
      },
    ],
  },
  {
    id: 'pack-commerce',
    title: 'e커머스 & 추천 알고리즘',
    badge: '쇼핑/추천',
    description: '쿠팡, 넷플릭스, 유튜브 등 온라인 서비스에서 매일 작동하는 기계학습 모델을 분석해 보세요.',
    items: [
      {
        id: 'p3-1',
        title: '쇼핑몰 허위 광고 & 스팸 리뷰 필터링',
        description: '소비자가 등록한 상품 리뷰 텍스트를 분석하여 정상 리뷰인지, 돈을 받고 쓴 [광고성 스팸 리뷰]인지 자동으로 걸러낸다.',
        contextData: '입력: 리뷰 본문 텍스트 / 출력: 정상 리뷰(0) or 스팸 리뷰(1)',
        correctCategory: '지도학습 (분류)',
        whyCorrect: '관리자가 분류해 둔 스팸/정상 리뷰 데이터를 학습하여 새 리뷰가 스팸 범주에 속하는지 판단하기 때문입니다.',
        pitfallTip: '스팸인지 정상인지 둘 중 하나로 가르는 것은 대표적인 이진 [분류] 문제입니다!',
      },
      {
        id: 'p3-2',
        title: '패션 쇼핑몰의 다음 분기 예상 매출액 예측',
        description: '지난 3년간의 계절별 할인율, 광고비 지출액, 회원 수 추이를 분석하여 올 가을 예상 총매출액이 [몇 억 원]에 달할지 예측한다.',
        contextData: '입력: 광고비, 과거 매출, 계절 변수 / 출력: 예상 매출 14억 5,200만 원',
        correctCategory: '지도학습 (회귀)',
        whyCorrect: '과거 실제 매출액(정답 데이터)을 바탕으로 연속적인 금액(수치값)을 추정하는 작업이기 때문입니다.',
        pitfallTip: '매출 금액(원)이라는 연속된 숫자값을 계산하므로 지도학습의 [회귀]입니다!',
      },
      {
        id: 'p3-3',
        title: '온라인 쇼핑몰 고객 소비 성향 클러스터링',
        description: '회원들의 월 방문 횟수, 평균 결제 금액 데이터를 라벨 없이 2차원 공간에 배치하고 거리가 가까운 고객끼리 [알뜰족, 트렌드세터, 충동구매족] 등 3개 집단으로 묶었다.',
        contextData: '입력: 고객 소비 데이터 / 출력: k=3 군집화(Clustering) 결과',
        correctCategory: '비지도학습 (군집화)',
        whyCorrect: '고객에게 사전에 지정된 정답 그룹 라벨이 없는 상태에서 유사도(거리)를 기반으로 k개의 그룹을 스스로 형성했기 때문입니다.',
        pitfallTip: '정답 라벨이 없는데 유사한 것끼리 묶는 것은 k-평균/kNN 기반의 [군집화]입니다!',
      },
      {
        id: 'p3-4',
        title: '동영상 플랫폼 "이 영상을 본 사용자가 함께 본 영상" 추천',
        description: '수억 건의 동영상 시청 로그를 분석하여 "A 축구 하이라이트를 본 시청자는 B 전술 분석 영상도 82% 확률로 함께 시청한다"는 규칙을 찾아 추천 목록에 띄운다.',
        contextData: '입력: 전체 시청자의 동영상 시청 목록 / 출력: {A 영상} → {B 영상} 연관 규칙',
        correctCategory: '비지도학습 (연관 규칙)',
        whyCorrect: '항목들(동영상) 간의 빈번한 동시 시청 패턴과 상관관계를 발견하여 연관 추천 규칙을 도출하기 때문입니다.',
        pitfallTip: '장바구니 분석처럼 "A를 볼 때 B도 함께 본다"는 동시 발생 규칙은 [연관 규칙 학습]입니다!',
      },
    ],
  },
  {
    id: 'pack-mobility',
    title: '모빌리티 & 자율주행',
    badge: '자율주행',
    description: '미래 핵심 산업인 자율주행 자동차와 스마트 모빌리티에 적용된 기계학습을 정복해 보세요.',
    items: [
      {
        id: 'p4-1',
        title: '자율주행 카메라의 전방 신호등 색상 식별',
        description: '차량 전방 카메라에 포착된 원형 신호등의 불빛이 [빨간불], [노란불], [초록불] 중 무엇인지 0.01초 만에 식별한다.',
        contextData: '입력: 전방 카메라 영상 프레임 / 출력: 빨강 / 노랑 / 초록 3개 클래스 중 하나',
        correctCategory: '지도학습 (분류)',
        whyCorrect: '정답 신호등 라벨이 부여된 사진 데이터를 학습하여, 현재 신호가 3가지 색상 범주 중 어느 것인지 판별하기 때문입니다.',
        pitfallTip: '신호등 색상은 3가지로 나뉘는 이산적 범주이므로 지도학습의 [분류]입니다!',
      },
      {
        id: 'p4-2',
        title: '빗길 주행 시 급제동 제동 거리 계산',
        description: '현재 차량의 주행 속도(km/h), 노면의 젖은 정도, 타이어 마모도를 센서로 읽어 브레이크를 밟았을 때 정지하기까지 필요한 [제동 거리(m)]를 계산한다.',
        contextData: '입력: 속도 80km/h, 노면 마찰계수 / 출력: 정지 거리 42.6m',
        correctCategory: '지도학습 (회귀)',
        whyCorrect: '과거 실제 제동 거리 실험 데이터를 기반으로 42.6m와 같은 연속된 숫자(거리 수치)를 계산하기 때문입니다.',
        pitfallTip: '제동 거리(미터)라는 연속적인 수치를 예측하므로 지도학습의 [회귀]입니다!',
      },
      {
        id: 'p4-3',
        title: '전국 고속도로 전기차 급속 충전소 권역별 배치 군집화',
        description: '전국 고속도로의 교통량과 위치 좌표(위도, 경도)를 바탕으로 정답 구역 지정 없이 k-평균 알고리즘을 사용해 [가장 효율적인 20개 충전 거점 구역]을 묶어냈다.',
        contextData: '입력: 차량 통행량 및 좌표 데이터 / 출력: 20개 권역(k=20) 군집 형성',
        correctCategory: '비지도학습 (군집화)',
        whyCorrect: '정답 라벨 없이 지리적 거리와 통행량의 유사도를 계산하여 데이터를 k개의 군집으로 묶는 작업이기 때문입니다.',
        pitfallTip: 'k-평균(K-Means) 알고리즘을 이용해 거점 그룹을 묶는 것은 대표적인 [군집화]입니다!',
      },
      {
        id: 'p4-4',
        title: '복잡한 교차로 비보호 좌회전 무사고 자율주행 학습',
        description: '가상 시뮬레이터에서 자율주행차가 좌회전할 때 충돌 없이 통과하면 [+100점 보상], 다른 차와 접촉하면 [-1,000점 감점]을 주며 100만 번 주행하여 운전 정책을 완성했다.',
        contextData: '에이전트: 자율주행 AI / 환경: 가상 교차로 / 피드백: 무사고 시 보상, 충돌 시 감점',
        correctCategory: '강화학습',
        whyCorrect: '에이전트가 가상 환경에서 수많은 주행 시행착오를 겪으며 누적 보상을 최대화하는 핸들 조작 정책을 스스로 터득하기 때문입니다.',
        pitfallTip: '무사고 시 보상, 충돌 시 감점이라는 피드백을 통해 시행착오로 운전을 배우는 것은 [강화학습]입니다!',
      },
    ],
  },
  {
    id: 'pack-game-ai',
    title: '게임 & 인공지능 에이전트',
    badge: '게임 AI',
    description: '알파고, 롤/배그 매칭, 전략 게임 AI에서 배우는 기계학습 구분 원리를 마스터해 보세요.',
    items: [
      {
        id: 'p5-1',
        title: '바둑 인공지능 알파고의 다음 착점 결정',
        description: '바둑판 형세를 보고 스스로 수만 번의 가상 대국(시행착오)을 두며 최종적으로 승리하면 [+1점 보상], 패배하면 [-1점 감점]을 받아 최적의 착수점을 찾아간다.',
        contextData: '에이전트: 알파고 / 환경: 19x19 바둑판 / 피드백: 승리 시 보상, 패배 시 벌점',
        correctCategory: '강화학습',
        whyCorrect: '알파고는 스스로 수많은 바둑 대국을 두는 자가 대진(시행착오)과 승리 보상을 통해 최적의 행동 정책을 학습하기 때문입니다.',
        pitfallTip: '알파고는 교과서에 나오는 [강화학습]의 가장 대표적인 간판 예시입니다!',
      },
      {
        id: 'p5-2',
        title: '게임 유저 스킬 콤보 적중 시 입힐 데미지 수치 계산',
        description: '공격자의 레벨, 장비 공격력, 방어자의 방어력 계수를 입력받아 공격이 적중했을 때 깎일 [체력 데미지 수치]가 얼마인지 산출한다.',
        contextData: '입력: 공격력 450, 방어력 120 / 출력: 예상 피해량 315.4 HP',
        correctCategory: '지도학습 (회귀)',
        whyCorrect: '과거 타격 데이터(정답 피해량)를 학습하여 315.4와 같은 연속적인 수치값(데미지)을 계산하기 때문입니다.',
        pitfallTip: '데미지 크기(숫자)를 계산하는 것은 연속 수치 예측이므로 [회귀]입니다!',
      },
      {
        id: 'p5-3',
        title: '온라인 게임 플레이어 실력 기반 매칭 클러스터링',
        description: '수십만 유저의 KDA, 승률, 분당 파밍량 데이터를 바탕으로 라벨 없이 거리를 계산하여 비슷한 실력을 가진 유저끼리 [5개의 매칭 티어 군집]으로 묶었다.',
        contextData: '입력: 유저 전적 다차원 벡터 / 출력: k-평균/kNN 기반 5개 실력 군집(k=5)',
        correctCategory: '비지도학습 (군집화)',
        whyCorrect: '정답 라벨이 주어지지 않은 상태에서 유저들의 게임 플레이 성향 데이터 간 거리를 계산해 k개 그룹으로 묶었기 때문입니다.',
        pitfallTip: '비슷한 특성끼리 k개 묶음으로 나누는 것은 k-평균, kNN 원리의 [군집화]입니다!',
      },
      {
        id: 'p5-4',
        title: '게임 상점 특정 캐릭터 스킨 구매자의 무기 장식 동시 구매',
        description: '상점 결제 내역을 분석하여 "신규 전설 스킨을 구매한 유저는 89% 확률로 어울리는 한정판 무기 이펙트도 함께 구매한다"는 장바구니 패턴을 도출했다.',
        contextData: '입력: 아이템 결제 로그 / 출력: {전설 스킨} → {한정판 무기 이펙트} 연관 규칙',
        correctCategory: '비지도학습 (연관 규칙)',
        whyCorrect: '사전에 정답 라벨 없이 아이템 간의 동시 구매 상관관계와 빈번 패턴 규칙을 찾았기 때문입니다.',
        pitfallTip: '아이템 간의 동시 구매 규칙을 찾는 것은 비지도학습의 [연관 규칙]입니다!',
      },
    ],
  },
  {
    id: 'pack-school',
    title: '학교 & 내신 기출 대비 핵심',
    badge: '시험 출제 1순위',
    description: '선생님이 시험 문제로 출제하기 가장 좋은 학교 교육 관련 기계학습 문제를 풀어보세요.',
    items: [
      {
        id: 'p6-1',
        title: '모의고사 성적 기반 과락/합격 여부 판별',
        description: '학생의 모의고사 영역별 성적을 분석하여 이번 시험 기준 [합격(Pass)]인지 [불합격(Fail)]인지 판별한다.',
        contextData: '입력: 국영수 성적 데이터 / 출력: 합격 or 불합격 범주',
        correctCategory: '지도학습 (분류)',
        whyCorrect: '합격 기준(정답 라벨)에 따라 학생의 결과를 합격/불합격이라는 2개 범주로 판별하기 때문입니다.',
        pitfallTip: '합격이냐 불합격이냐를 나누는 것은 이산적 범주 판정이므로 [분류]입니다!',
      },
      {
        id: 'p6-2',
        title: '주간 공부 시간과 기말고사 정보 점수 예측',
        description: '1학년 학생들의 일주일 평균 코딩 실습 시간과 복습 시간을 바탕으로 기말고사 정보 과목 [시험 점수(점)]를 예측한다.',
        contextData: '입력: 공부 시간 12.5시간 / 출력: 예상 정보 점수 94.5점',
        correctCategory: '지도학습 (회귀)',
        whyCorrect: '과거 학생들의 공부 시간과 실제 시험 점수(정답 수치)를 바탕으로 94.5점이라는 연속적인 숫자를 예측하기 때문입니다.',
        pitfallTip: '시험 점수(몇 점)라는 연속된 숫자를 예측하므로 지도학습의 [회귀]입니다!',
      },
      {
        id: 'p6-3',
        title: '학교 도서관 도서 동시 대출 패턴 분석',
        description: '학생들의 도서관 대출 기록 수천 건을 분석하여 "파이썬 프로그래밍 책을 빌린 학생은 알고리즘 순서도 책도 함께 대출한다"는 도서 간 대출 규칙을 도출했다.',
        contextData: '입력: 학생별 도서 대출 이력 / 출력: {파이썬 기초} → {알고리즘 순서도} 연관 대출 규칙',
        correctCategory: '비지도학습 (연관 규칙)',
        whyCorrect: '장바구니 분석과 마찬가지로 대출 데이터 속에서 도서 항목 간의 동시 대출 규칙을 찾아냈기 때문입니다.',
        pitfallTip: '함께 대출되는 도서 간의 규칙을 찾는 것은 비지도학습의 [연관 규칙]입니다!',
      },
      {
        id: 'p6-4',
        title: '학습 성향 설문 데이터 기반 소그룹 멘토링 조 편성',
        description: '학생들의 공부 스타일과 선호 과목 응답 데이터를 라벨 없이 비교하여 성향이 가장 잘 맞는 학생끼리 [4개의 스터디 그룹]으로 묶어주었다.',
        contextData: '입력: 학습 성향 다면 평가 응답 / 출력: 4개 그룹(k=4) 군집화',
        correctCategory: '비지도학습 (군집화)',
        whyCorrect: '사전에 정답 조 번호가 없는 상태에서 데이터 간의 유사도 거리를 계산해 k개 그룹으로 묶었기 때문입니다.',
        pitfallTip: '정답 라벨 없이 유사한 학생끼리 k개 그룹으로 묶는 것은 [군집화]입니다!',
      },
    ],
  },
];

export interface MLSpeedQuizItem {
  id: string;
  question: string;
  context: string;
  choices: MLCategory[];
  correctAnswer: MLCategory;
  explanation: string;
}

export const ML_SPEED_QUIZ_LIST: MLSpeedQuizItem[] = [
  {
    id: 'sq-1',
    question: '다음 중 "지도학습(Supervised Learning)"에 대한 설명으로 가장 옳은 것은?',
    context: '기계학습의 3대 유형 기본 개념',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '지도학습 (분류)',
    explanation: '지도학습은 문제와 함께 정답(레이블/Label)이 주어지는 학습 방식입니다. 결과가 범주이면 분류, 수치이면 회귀입니다.',
  },
  {
    id: 'sq-2',
    question: '스팸 메일 여부(스팸/정상)처럼 결과를 "이산적인 범주(Class)"로 나누어 예측하는 기계학습 유형은?',
    context: '스팸 필터링, 질병 양성/음성 판정',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '지도학습 (분류)',
    explanation: '정답 라벨이 주어지고 결과가 스팸/정상, 합격/불합격 등 몇 개의 범주로 나뉘는 것은 [지도학습 - 분류]입니다.',
  },
  {
    id: 'sq-3',
    question: '내일의 낮 최고 기온(℃)이나 시험 점수처럼 결과를 "연속적인 수치(숫자)"로 예측하는 기계학습 유형은?',
    context: '기온 예측, 아파트 매매가 추정',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '지도학습 (회귀)',
    explanation: '정답 라벨이 주어지고 결과가 연속적인 숫자(실수값)로 나타나는 것은 [지도학습 - 회귀]입니다.',
  },
  {
    id: 'sq-4',
    question: '정답(레이블)이 없는 데이터에서 유사한 특성을 가진 것끼리 k개의 무리로 묶는 "k-평균(K-Means)"이나 "kNN"은 어디에 속하는가?',
    context: '쇼핑몰 고객 성향 그룹화, 뉴스 기사 묶기',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '비지도학습 (군집화)',
    explanation: '정답 라벨 없이 데이터 사이의 거리나 유사도를 계산하여 k개의 그룹으로 묶는 것은 [비지도학습 - 군집화]입니다.',
  },
  {
    id: 'sq-5',
    question: '대형 마트에서 "기저귀를 산 고객이 맥주도 함께 구매한다"는 장바구니 속 동시 발생 패턴을 분석하는 기계학습 기법은?',
    context: '장바구니 분석(Market Basket Analysis), 연관 상품 추천',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '비지도학습 (연관 규칙)',
    explanation: '데이터 속에서 항목 간의 동시 발생 패턴과 상관관계를 분석하는 것은 [비지도학습 - 연관 규칙]입니다.',
  },
  {
    id: 'sq-6',
    question: '바둑 AI 알파고처럼 에이전트가 환경 속에서 수많은 시행착오를 겪으며 "보상(Reward)"을 최대화하도록 학습하는 기법은?',
    context: '알파고, 자율주행, 게임 AI, 로봇 제어',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '강화학습',
    explanation: '정답 대신 행동에 따른 보상과 벌점을 피드백으로 받아 시행착오(Trial and Error)를 통해 행동 전략을 터득하는 것은 [강화학습]입니다.',
  },
  {
    id: 'sq-7',
    question: '"군집화"와 "분류"를 구별하는 가장 결정적인 차이점은 무엇인가?',
    context: '시험 단골 함정 1순위',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '비지도학습 (군집화)',
    explanation: '둘 다 그룹으로 묶는 것처럼 보이지만, [분류]는 사전에 정답 라벨이 주어지는 지도학습이고, [군집화]는 사전에 정답 라벨이 전혀 없는 비지도학습입니다!',
  },
  {
    id: 'sq-8',
    question: '병원에서 흉부 X-ray 사진을 보고 폐렴인지 정상인지 판독하는 AI 의사 프로그램의 학습 유형은?',
    context: '의료 영상 진단 AI',
    choices: ['지도학습 (분류)', '지도학습 (회귀)', '비지도학습 (군집화)', '비지도학습 (연관 규칙)', '강화학습'],
    correctAnswer: '지도학습 (분류)',
    explanation: '의사가 진단한 정답 라벨(정상/폐렴)을 기반으로 새로운 환자의 사진이 어느 범주에 속하는지 판별하므로 [지도학습 - 분류]입니다.',
  },
];
