import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { MockAiProvider } from './providers/mock-ai.provider';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mockAiProvider: MockAiProvider,
  ) {}

  async recommendColor(dto: RecommendationRequestDto, userId: number) {
    // 1. 선택한 색상과 사용자 정보를 동시에 조회

    const [detailColor, user] = await Promise.all([
      this.prisma.detailProduct.findUnique({
        where: {
          id: dto.detailColorId,
        },

        // DetailProduct와 연결된 Product를 가져오고,
        // Product와 연결된 Category도 함께 가져온다.
        include: {
          products: {
            include: {
              category: true,
            },
          },
        },
      }),

      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
    ]);

    // 선택한 색상이 존재하지 않는 경우
    if (!detailColor) {
      throw new NotFoundException(
        `상세 색상 ID ${dto.detailColorId}를 찾을 수 없습니다.`,
      );
    }

    // 사용자가 존재하지 않는 경우
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    // 2. 현재 선택한 색상의 HSL 값을 RGB로 변환

    const rgb = this.hslToRgb(detailColor.h, detailColor.s, detailColor.l);

    // 3. 사용자의 긍정 평점과 부정 평점 조회

    const [positiveRating, negativeRating] = await Promise.all([
      // 4~5점을 준 색상 중 점수가 가장 높은 색상 조회
      this.prisma.rating.findFirst({
        where: {
          user_id: userId,
          star_rating: {
            gte: 4,
            lte: 5,
          },
        },
        include: {
          detail_color: true,
        },
        orderBy: {
          star_rating: 'desc',
        },
      }),

      // 1~2점을 준 색상 중 점수가 가장 낮은 색상 조회
      this.prisma.rating.findFirst({
        where: {
          user_id: userId,
          star_rating: {
            gte: 1,
            lte: 2,
          },
        },
        include: {
          detail_color: true,
        },
        orderBy: {
          star_rating: 'asc',
        },
      }),
    ]);

    // 4. 긍정 평점 색상 정보 만들기

    const positiveColor = positiveRating
      ? {
          starRating: positiveRating.star_rating,
          colorName: positiveRating.detail_color.color_name,

          hsl: {
            h: positiveRating.detail_color.h,
            s: positiveRating.detail_color.s,
            l: positiveRating.detail_color.l,
          },

          rgb: this.hslToRgb(
            positiveRating.detail_color.h,
            positiveRating.detail_color.s,
            positiveRating.detail_color.l,
          ),
        }
      : null;

    // 5. 부정 평점 색상 정보 만들기

    const negativeColor = negativeRating
      ? {
          starRating: negativeRating.star_rating,
          colorName: negativeRating.detail_color.color_name,

          hsl: {
            h: negativeRating.detail_color.h,
            s: negativeRating.detail_color.s,
            l: negativeRating.detail_color.l,
          },

          rgb: this.hslToRgb(
            negativeRating.detail_color.h,
            negativeRating.detail_color.s,
            negativeRating.detail_color.l,
          ),
        }
      : null;

    // 6. AI에게 전달할 프롬프트 만들기

    // 먼저 사용자의 퍼스널 컬러를 알려준다.
    let prompt = `${user.personal_color} 톤 사용자입니다.`;

    // 사용자가 4~5점을 준 색상이 있는 경우
    if (positiveRating) {
      const positiveRgb = this.hslToRgb(
        positiveRating.detail_color.h,
        positiveRating.detail_color.s,
        positiveRating.detail_color.l,
      );

      prompt += `

rgb(${positiveRgb.r}, ${positiveRgb.g}, ${positiveRgb.b}) 색상은
사용자가 ${positiveRating.star_rating}점으로 평가했고
잘 어울렸던 색상입니다.`;
    }

    // 사용자가 1~2점을 준 색상이 있는 경우
    if (negativeRating) {
      const negativeRgb = this.hslToRgb(
        negativeRating.detail_color.h,
        negativeRating.detail_color.s,
        negativeRating.detail_color.l,
      );

      prompt += `

rgb(${negativeRgb.r}, ${negativeRgb.g}, ${negativeRgb.b}) 색상은
사용자가 ${negativeRating.star_rating}점으로 평가했고
잘 어울리지 않았던 색상입니다.`;
    }

    // 현재 선택한 상품 정보와 평가 규칙을 추가한다.
    prompt += `

현재 사용자가 선택한 상품은
${detailColor.products.category.name} 카테고리의
${detailColor.color_name} 색상입니다.

현재 선택한 색상의 HSL 값은
hsl(${detailColor.h}, ${detailColor.s}%, ${detailColor.l}%)입니다.

현재 선택한 색상의 RGB 값은
rgb(${rgb.r}, ${rgb.g}, ${rgb.b})입니다.

사용자의 퍼스널 컬러와 이전 평점 기록을 기준으로
현재 선택한 ${detailColor.products.category.name} 색상이
사용자에게 어울리는지 판단하세요.

평가 방법:

1부터 5까지 중 하나의 숫자로
어울림 정도를 평가하세요.

단, 현재 선택한 색상이
사용자가 잘 어울렸다고 평가한 기존 색상과
사람이 육안으로 보기에 거의 구분하기 어려울 정도로 비슷하다면
6을 반환하세요.

반드시 1, 2, 3, 4, 5, 6 중
숫자 하나만 반환하세요.

설명, 문장, 기호는 반환하지 마세요.`;

    // 7. Mock AI에게 전달할 데이터 만들기

    const aiInput = {
      // 실제 AI가 읽고 판단할 프롬프트
      prompt,

      // 사용자 퍼스널 컬러
      userPersonalColor: user.personal_color,

      // 현재 선택한 상품과 색상 정보
      selectedColor: {
        colorName: detailColor.color_name,
        category: detailColor.products.category.name,

        hsl: {
          h: detailColor.h,
          s: detailColor.s,
          l: detailColor.l,
        },

        rgb,
      },

      // 사용자가 4~5점을 준 색상
      positiveColor,

      // 사용자가 1~2점을 준 색상
      negativeColor,
    };

    // 8. Mock AI 호출
    // Azure OpenAI 연결 전까지 임시로 사용

    const aiResult = await this.mockAiProvider.generate(aiInput);

    // 9. 프런트엔드에 결과 반환

    return {
      // 테스트할 때 AI에 어떤 정보가 전달됐는지 확인하기 위한 값
      aiInput,

      detailColorId: detailColor.id,
      action: dto.action,

      user: {
        id: user.id,
        personalColor: user.personal_color,
      },

      color: {
        name: detailColor.color_name,
        image: detailColor.color_image,
        stock: detailColor.stock,

        hsl: {
          h: detailColor.h,
          s: detailColor.s,
          l: detailColor.l,
        },

        rgb,
      },

      product: {
        id: detailColor.products.id,
        name: detailColor.products.name,
        category: detailColor.products.category.name,
        price: detailColor.products.price,
      },

      // MockAiProvider에서 반환한 결과 사용
      aiResult,
    };
  }

  // HSL 색상 값을 RGB 색상 값으로 변환하는 함수

  private hslToRgb(h: number, s: number, l: number) {
    // 백분율 값을 0~1 사이 값으로 변환
    s /= 100;
    l /= 100;

    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const hueSection = h / 60;
    const x = chroma * (1 - Math.abs((hueSection % 2) - 1));

    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (hueSection >= 0 && hueSection < 1) {
      r1 = chroma;
      g1 = x;
    } else if (hueSection >= 1 && hueSection < 2) {
      r1 = x;
      g1 = chroma;
    } else if (hueSection >= 2 && hueSection < 3) {
      g1 = chroma;
      b1 = x;
    } else if (hueSection >= 3 && hueSection < 4) {
      g1 = x;
      b1 = chroma;
    } else if (hueSection >= 4 && hueSection < 5) {
      r1 = x;
      b1 = chroma;
    } else {
      r1 = chroma;
      b1 = x;
    }

    const m = l - chroma / 2;

    return {
      r: Math.round((r1 + m) * 255),
      g: Math.round((g1 + m) * 255),
      b: Math.round((b1 + m) * 255),
    };
  }
}
