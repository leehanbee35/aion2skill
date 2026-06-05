export const CLASS_SKILLS = {
  호법성: [
    "암격쇄", "격파쇄", "쾌유의주문", "백열격", "회전격",
    "타격쇄", "돌진격파", "파동격", "진동쇄", "열파격",
    "충격해제", "질풍난무", "공격준비", "충격적중", "고취의주문",
    "대지의약속", "생명의축복", "바람의약속", "생존의지", "보호진",
    "격노의주문", "십자방어"
  ]
};

export const TARGET_OPTIONS = [0, 16, 20];

// 데바니온 수치 옵션 (0~4)
export const DAEVANIAN_VALUES = [0, 1, 2, 3, 4];
export const DAEVANIAN_DEFAULT = 4;

// 장비 수치 옵션 (0~10)
export const EQUIPMENT_VALUES = Array.from({ length: 11 }, (_, i) => i);

// 아르카나 카드 1개당 수치 옵션 (0~4)
export const ARCANA_CARD_VALUES = [0, 1, 2, 3, 4];

export const ARCANA_CARD_COUNT = 6;
export const ARCANA_CARD_NAMES = ["성배", "양피지", "나침반", "종", "거울", "천칭"];

// 각 아르카나 카드에서 선택 가능한 스킬 (null = 모든 스킬 가능)
export const ARCANA_CARD_SKILLS = {
  성배: null,
  양피지: ["격파쇄", "돌진격파", "파동격", "열파격", "암격쇄", "회전격"],
  나침반: ["백열격", "타격쇄", "진동쇄", "쾌유의주문", "질풍난무", "충격해제"],
  종: ["생명의축복", "보호진", "공격준비", "격노의주문", "생존의지"],
  거울: ["십자방어", "고취의주문", "충격적중", "대지의약속", "바람의약속"],
  천칭: null,
};
