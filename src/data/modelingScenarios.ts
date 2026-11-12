import { ModelingScenario } from '../types/quiz';

export const MODELING_SCENARIOS: ModelingScenario[] = [
  {
    id: 'scenario-cinema',
    title: '영화관 티켓 청소년 할인 예매기',
    icon: 'film',
    description: '관람객의 나이와 예매 매수를 받아 청소년 할인 적용 여부를 결정하고 최종 금액을 화면에 표시합니다.',
    context: '극장 무인 발권기에서 사용자가 나이(age)와 인원수(count)를 입력하면, 19세 미만인 경우 티켓 1장당 9,000원, 성인은 14,000원으로 계산하여 총 결제 요금(total_price)을 화면에 출력합니다.',
    items: [
      { id: 'item-1', text: '관람객 나이 입력값', category: '입력 (Input)', hint: '키보드나 터치스크린으로 받는 데이터' },
      { id: 'item-2', text: '예매 티켓 매수 입력값', category: '입력 (Input)', hint: '사용자가 선택한 인원수' },
      { id: 'item-3', text: '화면에 안내되는 총 결제 금액', category: '출력 (Output)', hint: '계산 완료 후 고객에게 보여줄 결과' },
      { id: 'item-4', text: '나이가 19세 미만인가? (age < 19)', category: '조건 (Condition)', hint: '청소년 할인을 적용할지 결정하는 참/거짓 기준' },
      { id: 'item-5', text: '관람객 나이를 담는 기억 공간 (age)', category: '변수 (Variable)', hint: '입력받은 값을 저장하는 식별자' },
      { id: 'item-6', text: '계산된 합계를 보관하는 기억 공간 (total_price)', category: '변수 (Variable)', hint: '연산 결과를 담아두는 이름' }
    ],
    pythonCodePreview: `age = int(input("나이를 입력하세요: "))
count = int(input("인원수를 입력하세요: "))

if age < 19:
    price_per_ticket = 9000
else:
    price_per_ticket = 14000

total_price = price_per_ticket * count
print("총 결제 금액은", total_price, "원입니다.")`
  },
  {
    id: 'scenario-aircon',
    title: '스마트 온실 / 에어컨 자동 온도 조절기',
    icon: 'thermometer',
    description: '현재 온도와 사용자가 설정한 희망 온도를 비교하여 냉방기를 가동할지 결정합니다.',
    context: '온도 센서에서 현재 온도(current_temp)를 측정하고, 리모컨으로 설정한 희망 온도(target_temp)를 읽어옵니다. 현재 온도가 희망 온도보다 높으면 "에어컨 가동", 그렇지 않으면 "절전 대기"를 화면에 표시합니다.',
    items: [
      { id: 'ac-1', text: '온도 센서가 감지한 실내 온도값', category: '입력 (Input)', hint: '외부 센서로부터 들어오는 데이터' },
      { id: 'ac-2', text: '리모컨으로 누른 희망 설정 온도', category: '입력 (Input)', hint: '사용자가 지정한 기준 입력값' },
      { id: 'ac-3', text: '"에어컨 가동 중" 화면 표시 문구', category: '출력 (Output)', hint: '사용자에게 보여주는 상태 결과' },
      { id: 'ac-4', text: '현재 온도가 희망 온도보다 높은가? (current_temp > target_temp)', category: '조건 (Condition)', hint: '동작 여부를 가르는 판단 기준' },
      { id: 'ac-5', text: '현재 측정 온도를 저장하는 공간 (current_temp)', category: '변수 (Variable)', hint: '온도 수치를 저장하는 변수' },
      { id: 'ac-6', text: '희망 온도를 저장하는 공간 (target_temp)', category: '변수 (Variable)', hint: '목표값을 담는 변수' }
    ],
    pythonCodePreview: `current_temp = float(input("현재 온도(℃): "))
target_temp = float(input("희망 온도(℃): "))

if current_temp > target_temp:
    print("냉방기를 가동합니다! (실내 쾌적 모드)")
else:
    print("설정 온도 도달 - 절전 대기 모드입니다.")`
  },
  {
    id: 'scenario-vending',
    title: '학교 매점 음료수 자판기',
    icon: 'coffee',
    description: '투입한 금액과 선택한 음료 가격을 비교하여 음료 배출 여부와 잔돈을 계산합니다.',
    context: '학생이 동전/지폐(money)를 넣고 음료 버튼(choice)을 누릅니다. 투입 금액이 음료 가격(drink_price) 이상이면 음료수를 배출하고 잔돈(change)을 거슬러주며, 부족하면 "금액 부족" 메시지를 띄웁니다.',
    items: [
      { id: 'vm-1', text: '동전 투입기에 넣은 지폐/동전 금액', category: '입력 (Input)', hint: '사용자가 기계에 넣은 돈' },
      { id: 'vm-2', text: '학생이 누른 음료수 번호', category: '입력 (Input)', hint: '원하는 상품 선택' },
      { id: 'vm-3', text: '배출구로 나오는 음료수 및 반환 동전', category: '출력 (Output)', hint: '기계가 내보내는 최종 결과물' },
      { id: 'vm-4', text: '투입 금액이 음료 가격보다 크거나 같은가? (money >= drink_price)', category: '조건 (Condition)', hint: '음료를 줄 수 있는지 판단하는 식' },
      { id: 'vm-5', text: '투입된 돈을 세어두는 저장 공간 (money)', category: '변수 (Variable)', hint: '금액 수치를 담는 변수' },
      { id: 'vm-6', text: '반환할 거스름돈을 계산해 둔 공간 (change)', category: '변수 (Variable)', hint: '잔액을 보관하는 변수' }
    ],
    pythonCodePreview: `money = int(input("투입 금액: "))
drink_price = 1000

if money >= drink_price:
    change = money - drink_price
    print("음료수가 나왔습니다! 거스름돈:", change, "원")
else:
    print("금액이 부족합니다! 추가 투입이 필요합니다.")`
  },
  {
    id: 'scenario-bus',
    title: '대중교통 교통카드 잔액 결제기',
    icon: 'bus',
    description: '교통카드를 태그했을 때 잔액이 기본 요금 이상인지 확인하고 결제 및 남은 잔액을 음성/화면으로 출력합니다.',
    context: '단말기에 카드를 접촉하면 카드 잔액(balance)과 승객 유형(user_type)을 읽습니다. 잔액이 요금(fare) 이상인지 검사하여 정상 처리 시 잔액을 차감하고 새 잔액을 화면에 띄웁니다.',
    items: [
      { id: 'bus-1', text: '카드 칩에서 읽어온 기존 잔액 데이터', category: '입력 (Input)', hint: '카드 접촉 시 읽어들이는 정보' },
      { id: 'bus-2', text: '"환승입니다 / 잔액 1,200원" 음성 및 화면 안내', category: '출력 (Output)', hint: '승객에게 알리는 결과' },
      { id: 'bus-3', text: '카드 잔액이 요금보다 많은가? (balance >= fare)', category: '조건 (Condition)', hint: '탑승 승인 여부를 가르는 판별' },
      { id: 'bus-4', text: '결제 후 새로 계산된 잔액을 담는 공간 (balance)', category: '변수 (Variable)', hint: '남은 돈을 보관하는 변수' }
    ],
    pythonCodePreview: `balance = int(input("현재 카드 잔액: "))
fare = 1500

if balance >= fare:
    balance = balance - fare
    print("탑승 승인! 남은 잔액:", balance, "원")
else:
    print("잔액이 부족합니다! 충전 후 이용해 주세요.")`
  }
];
