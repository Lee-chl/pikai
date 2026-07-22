import { Injectable } from '@nestjs/common';

interface ColorData {
  h: number;
  s: number;
  l: number;
}

interface AiInput {
  selectedColor?: {
    hsl?: ColorData;
  };
  positiveColor?: {
    hsl?: ColorData;
  } | null;
}

@Injectable()
export class MockAiProvider {
  async generate(input: AiInput) {
    console.log('AI 입력값:', input);

    const selectedHsl = input.selectedColor?.hsl;
    const positiveHsl = input.positiveColor?.hsl;

    let score = 3;

    if (selectedHsl && positiveHsl) {
      const hueDifference = Math.abs(selectedHsl.h - positiveHsl.h);
      const saturationDifference = Math.abs(selectedHsl.s - positiveHsl.s);
      const lightnessDifference = Math.abs(selectedHsl.l - positiveHsl.l);

      const totalDifference =
        hueDifference + saturationDifference + lightnessDifference;

      if (totalDifference <= 10) {
        score = 6;
      } else if (totalDifference <= 25) {
        score = 5;
      } else if (totalDifference <= 50) {
        score = 4;
      } else if (totalDifference <= 80) {
        score = 3;
      } else if (totalDifference <= 120) {
        score = 2;
      } else {
        score = 1;
      }
    }

    return {
      score,
      messageType: score >= 4 ? 'RECOMMEND' : 'CAUTION',
      title: 'AI 컬러 추천',
      message: '회원님의 퍼스널 컬러와 평가 기록을 기준으로 추천한 결과입니다.',
      recommend: score >= 4,
      isMock: true,
    };
  }
}
