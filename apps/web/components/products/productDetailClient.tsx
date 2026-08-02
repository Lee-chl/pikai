"use client";
import AIRecommendPopup from "./aiRecommendpopup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  DetailColorType,
  ProductDetailType,
} from "@/types/productDetailType";
import styles from "./product-detail.module.css";
import { RecommendationResponseType } from "@/types/recommendationType";
// 로그인할 때 저장된 JWT 토큰을 쿠키에서 읽기 위해 사용합니다.
import Cookies from "js-cookie";

interface ProductDetailClientProps {
  product: ProductDetailType;
}

interface SelectedOptionType {
  color: DetailColorType;
  quantity: number;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  // 페이지 이동에 사용하는 Next.js 라우터
  const router = useRouter();

  // 현재 로그인 기능이 꺼져 있으므로 임시 회원 ID 1을 사용합니다.
  // 나중에 JWT 로그인을 연결하면 로그인한 사용자의 ID로 변경해야 합니다.
  const userId = 1;

  // AI 추천 결과 저장
  const [recommendation, setRecommendation] =
    useState<RecommendationResponseType | null>(null);

  // AI 추천 팝업 열림 여부

  const [isOpen, setIsOpen] = useState(false);
  //  false: AI 분석 중이 아님, true: AI 분석 중임
  const [isAiLoading, setIsAiLoading] = useState(false);
  //오류 메시지를 저장할 state를 추가
  const [aiError, setAiError] = useState<string | null>(null);

  // 장바구니 API 요청 중인지 저장
  // true이면 장바구니 버튼을 잠시 비활성화합니다.
  const [isCartLoading, setIsCartLoading] = useState(false);

  // 기존 useEffect
  // 기존 함수들

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType[]>(
    [],
  );

  const [mainImage, setMainImage] = useState(product.color_main_image);

  // AI 추천 API 호출
  const fetchRecommendation = async (
    detailColorId: number,
  ): Promise<RecommendationResponseType> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/recommendations/color`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detailColorId,
        }),
      },
    );

    if (!response.ok) {
      const errorMessage = await response.text();

      console.error("AI 추천 API 오류:", errorMessage);

      throw new Error("AI 추천 API 호출에 실패했습니다.");
    }

    const data = await response.json();

    console.log("AI 추천 API 원본 응답:", data);

    // 백엔드 응답이 data 안에 들어오는 경우도 처리
    // 백엔드 응답 처리
    const recommendationData =
      data.aiResult ?? data.data ?? data.recommendation ?? data;

    // 점수가 문자열로 오거나 다른 이름으로 오는 경우를 함께 처리
    const score = Number(
      recommendationData.answer ??
        recommendationData.score ??
        recommendationData.recommendationScore ??
        recommendationData.recommendation_score ??
        0,
    );

    const getScoreMessage = (scoreValue: number): string => {
      switch (scoreValue) {
        case 6:
          return `이 제품은 고객님이 가지고 있는 색과 육안으로는 거의 구분하기 힘들 정도로 비슷한 제품으로 보입니다!

기존템이 인생템이셨으면 찰떡이실 것 같습니다!

만약 새로운 변화를 주시고 싶으시다면 다른 색을 추천드립니다 ☺️`;

        case 5:
          return `기존에 쓰시던 색과 매우 흡사해서 현재 사용하시는 컬러가 만족스러우셨다면 아주 실패 없는 선택이 될 거예요!`;

        case 4:
          return `기존 컬러와 비슷한 무드이긴 하지만 미세한 차이가 있어서

평소 즐겨 쓰시던 느낌에서 약간의 변화를 주고 싶으실 때 적합할 것 같아요.`;

        case 3:
          return `기존 컬러와 비슷한 무드이긴 하지만 미세한 차이가 있어서

평소 즐겨 쓰시던 느낌에서 약간의 변화를 주고 싶으실 때 적합할 것 같아요.`;

        case 2:
        case 1:
          return `고객님, 이 컬러는 기존 사용하시던 색상과 차이가 커서 완전히 새로운 분위기를 원하실 때 선택하시는 걸 추천드려요!`;

        default:
          return "추천 결과를 확인해 주세요.";
      }
    };

    const safeScore = Number.isNaN(score) ? 0 : score;

    const result: RecommendationResponseType = {
      score: safeScore,
      messageType: recommendationData.messageType ?? "",
      title: recommendationData.title ?? "추천 결과",
      message: getScoreMessage(safeScore),
      recommend: recommendationData.recommend ?? false,
      isMock: recommendationData.isMock ?? false,
    };

    console.log("팝업 메시지 확인:", result.message);
    console.log("팝업에 저장할 추천 결과:", result);

    return result;
  };

  //=====

  const getImageUrl = (image: string) => {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`;
  };

  const handleSelectOption = (color: DetailColorType) => {
    if (color.stock === 0) {
      alert("품절된 옵션입니다.");
      return;
    }

    setMainImage(color.color_image);

    setSelectedOptions((previousOptions) => {
      const alreadySelected = previousOptions.some(
        (option) => option.color.id === color.id,
      );

      if (alreadySelected) {
        return previousOptions;
      }

      return [
        ...previousOptions,
        {
          color,
          quantity: 1,
        },
      ];
    });

    setIsOptionOpen(false);
  };

  const handleDecreaseOption = (colorId: number) => {
    setSelectedOptions((previousOptions) =>
      previousOptions.map((option) =>
        option.color.id === colorId
          ? {
              ...option,
              quantity: Math.max(1, option.quantity - 1),
            }
          : option,
      ),
    );
  };

  const handleIncreaseOption = (colorId: number) => {
    setSelectedOptions((previousOptions) =>
      previousOptions.map((option) => {
        if (option.color.id !== colorId) {
          return option;
        }

        return {
          ...option,
          quantity: Math.min(option.color.stock, option.quantity + 1),
        };
      }),
    );
  };

  const handleRemoveOption = (colorId: number) => {
    setSelectedOptions((previousOptions) =>
      previousOptions.filter((option) => option.color.id !== colorId),
    );
  };

  const handleRemoveAllOptions = () => {
    setSelectedOptions([]);
    setMainImage(product.color_main_image);
  };

  // 정가
  const originalPrice = product.price;

  // 정가에서 10% 할인한 가격
  const salePrice = Math.floor(originalPrice * 0.9);

  // 선택한 상품의 전체 수량
  const totalQuantity = selectedOptions.reduce(
    (total, option) => total + option.quantity,
    0,
  );

  // 선택한 상품의 총 할인 가격
  const totalPrice = selectedOptions.reduce(
    (total, option) => total + salePrice * option.quantity,
    0,
  );

  //===========================================================

  //==================================================
  // 회원 ID를 이용해서 해당 회원의 장바구니 ID를 가져오는 함수
  const getCartId = async (userId: number): Promise<number> => {
    // 로그인할 때 쿠키에 저장한 JWT 토큰을 가져옵니다.
    const token = Cookies.get("accessToken");
    // 회원 ID로 장바구니 조회 API를 호출합니다.
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/cart`, {
      method: "GET",
      cache: "no-store",

      // JWT 인증이 필요한 API이므로 토큰을 함께 보냅니다.
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 백엔드에서 404, 500 등의 오류가 발생한 경우
    if (!response.ok) {
      // 백엔드 오류 메시지를 읽습니다.
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message ?? "회원의 장바구니를 불러오지 못했습니다.",
      );
    }

    // 백엔드가 반환한 장바구니 데이터를 JSON으로 변환합니다.
    const cart = await response.json();

    console.log("조회한 장바구니 데이터:", cart);

    // 응답에 장바구니 ID가 없는 경우
    if (!cart.id) {
      throw new Error("장바구니 ID를 확인할 수 없습니다.");
    }

    // 장바구니 ID만 반환합니다.
    return cart.id;
  };
  //==================================================
  // 장바구니 버튼을 눌렀을 때 실행되는 함수
  const handleAddCart = async () => {
    // 이미 API 요청 중이면 다시 실행하지 않습니다.
    if (isCartLoading) {
      return;
    }

    // 옵션을 선택하지 않은 경우
    if (selectedOptions.length === 0) {
      alert("옵션을 하나 이상 선택해 주세요.");
      return;
    }

    // 현재 AI 추천은 옵션 1개만 선택했을 때 실행합니다.
    if (selectedOptions.length > 1) {
      alert(
        "1개의 상품을 담았을 때만 AI 색상 추천을 합니다. 선택한 상품들은 장바구니에 담습니다.",
      );
    }

    // 선택한 옵션 중 재고가 없거나
    // 선택 수량이 재고보다 많은 옵션이 있는지 확인합니다.
    const hasInvalidStock = selectedOptions.some(
      (option) =>
        option.color.stock === 0 || option.quantity > option.color.stock,
    );

    if (hasInvalidStock) {
      alert("선택한 옵션의 재고를 다시 확인해 주세요.");
      return;
    }

    // 선택한 옵션이 하나도 없으면 함수를 종료합니다.
    if (selectedOptions.length === 0) {
      alert("선택된 색상 옵션을 찾을 수 없습니다.");
      return;
    }
    // 현재는 옵션을 1개만 선택할 수 있으므로
    // selectedOptions 배열의 첫 번째 값을 가져옵니다.
    const selectedOption = selectedOptions[0];

    if (!selectedOption) {
      alert("선택된 색상 옵션을 찾을 수 없습니다.");
      return;
    }
    // 선택한 옵션이 하나도 없는지 다시 확인합니다.
    //if (selectedOptions.length === 0) {
    // alert("선택된 색상 옵션을 찾을 수 없습니다.");
    // return;
    // }

    try {
      // 로그인할 때 쿠키에 저장한 JWT 토큰을 가져옵니다.
      const token = Cookies.get("accessToken");
      // 장바구니 API 요청 시작
      setIsCartLoading(true);

      // 옵션을 1개 선택한 경우에만
      // AI 추천 팝업을 열고 추천 API를 실행합니다.
      if (selectedOptions.length === 1) {
        setIsAiLoading(true);
        setAiError(null);
        setIsOpen(true);

        const recommendationResult = await fetchRecommendation(
          selectedOption.color.id,
        );

        // AI 추천 결과를 팝업에 저장합니다.
        setRecommendation(recommendationResult);
      }

      // 회원의 장바구니를 조회하여 cart.id를 가져옵니다.
      const cartId = await getCartId(userId);

      console.log("가져온 장바구니 ID:", cartId);

      // 선택한 모든 옵션을 하나씩 장바구니에 추가합니다.
      for (const option of selectedOptions) {
        // 백엔드 CreateCartitemDto 형식에 맞춘 요청 데이터입니다.
        const cartItemData = {
          cart_id: cartId,
          detail_color_id: option.color.id,
          quantity: option.quantity,
        };

        console.log("장바구니에 보낼 데이터:", cartItemData);

        // 현재 옵션 하나를 장바구니에 추가합니다.
        const cartResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",

              // CartController에 JWT 인증이 적용되어 있으므로 토큰을 보냅니다.
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cartItemData),
          },
        );

        // 옵션 하나라도 추가에 실패하면 장바구니 이동을 중단합니다.
        if (!cartResponse.ok) {
          const errorData = await cartResponse.json().catch(() => null);

          throw new Error(
            errorData?.message ??
              `${option.color.color_name} 상품을 장바구니에 담지 못했습니다.`,
          );
        }

        // 응답 본문은 한 번만 읽습니다.
        const addedCartItem = await cartResponse.json();

        console.log("장바구니 추가 결과:", addedCartItem);
      }

      alert("상품을 장바구니에 담았습니다.");
      // 장바구니 상품 추가 API가 반환한 실제 데이터를 확인합니다.

      // 장바구니 페이지로 이동합니다.
      router.push("/cart");
    } catch (error) {
      console.error("장바구니 추가 오류:", error);

      // error가 Error 객체인지 확인한 뒤 메시지를 보여줍니다.
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("장바구니 처리 중 오류가 발생했습니다.");
      }

      setAiError("AI 추천 또는 장바구니 처리에 실패했습니다.");
    } finally {
      // 성공하거나 실패해도 로딩 상태를 종료합니다.
      setIsAiLoading(false);
      setIsCartLoading(false);
    }
  };

  //================================
  //바로구매 함수

  const handleBuyNow = async () => {
    if (selectedOptions.length === 0) {
      alert("옵션을 하나 이상 선택해 주세요.");
      return;
    }
    if (selectedOptions.length > 1) {
      alert(
        "1개의 상품을 담았을 때만 AI 색상 추천을 합니다. 선택한 상품들을 바로 구매합니다.",
      );
    }

    const hasInvalidStock = selectedOptions.some(
      (option) =>
        option.color.stock === 0 || option.quantity > option.color.stock,
    );

    if (hasInvalidStock) {
      alert("선택한 옵션의 재고를 다시 확인해 주세요.");
      return;
    }

    try {
      // 로그인할 때 쿠키에 저장한 JWT 토큰을 가져옵니다.
      const token = Cookies.get("accessToken");
      // 로그인 회원의 장바구니 ID를 가져옵니다.
      // 바로구매 상품도 CartItem에 is_now=true로 임시 저장하기 위해 필요합니다.
      const cartId = await getCartId(userId);

      console.log("바로구매용 장바구니 ID:", cartId);

      //=======================================
      // 이전 바로구매에서 남아 있는 is_now=true 상품을 먼저 삭제합니다.
      // 일반 장바구니 상품인 is_now=false 상품은 삭제되지 않습니다.
      const deleteBuyNowResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items/now`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!deleteBuyNowResponse.ok) {
        const errorData = await deleteBuyNowResponse.json().catch(() => null);

        throw new Error(
          errorData?.message ?? "기존 바로구매 상품을 정리하지 못했습니다.",
        );
      }

      const deleteResult = await deleteBuyNowResponse.json();

      console.log("기존 바로구매 상품 삭제 결과:", deleteResult);
      //=======================================
      // 첫 번째로 선택한 색상으로 AI 추천 결과를 요청
      const selectedColor = selectedOptions[0];

      if (!selectedColor) {
        alert("선택된 색상 옵션을 찾을 수 없습니다.");
        return;
      }
      // 옵션을 1개 선택한 경우에만
      // AI 추천 팝업을 열고 추천 API를 실행합니다.
      if (selectedOptions.length === 1) {
        setIsAiLoading(true);
        setAiError(null);
        setIsOpen(true);

        const result = await fetchRecommendation(selectedColor.color.id);

        // AI 추천 결과를 팝업에 저장합니다.
        setRecommendation(result);
      }
      //==========================================
      // 선택한 모든 옵션을 바로구매용 CartItem으로 저장합니다.
      for (const option of selectedOptions) {
        const buyNowCartItemData = {
          cart_id: cartId,
          detail_color_id: option.color.id,
          quantity: option.quantity,

          // 바로구매 상품이므로 true로 저장합니다.
          is_now: true,
        };

        console.log("바로구매용 장바구니 데이터:", buyNowCartItemData);

        const cartResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACK_URL}/cart/items`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(buyNowCartItemData),
          },
        );

        if (!cartResponse.ok) {
          const errorData = await cartResponse.json().catch(() => null);

          throw new Error(
            errorData?.message ?? "바로구매 상품을 저장하지 못했습니다.",
          );
        }

        const savedCartItem = await cartResponse.json();

        console.log("바로구매 상품 저장 결과:", savedCartItem);
      }

      // 바로 구매 데이터
      const orderData = selectedOptions.map((option) => ({
        productId: product.id,
        detailColorId: option.color.id,
        quantity: option.quantity,
      }));

      console.log("바로 구매 데이터:", orderData);

      // 바로구매 상품 배열을 JSON 문자열로 변환합니다.
      const buyItems = encodeURIComponent(JSON.stringify(orderData));

      // 장바구니 주문이 아닌 바로구매 주문으로 결제 페이지에 이동합니다.
      router.push(`/pay?isCartOrder=false&selectedOnly=true`);
    } catch (error) {
      console.error("AI 추천 오류:", error);
      setAiError("AI 추천 결과를 불러오지 못했습니다.");
    } finally {
      // AI 분석 종료
      setIsAiLoading(false);
    }
  };

  return (
    <>
      <AIRecommendPopup
        open={isOpen}
        title={recommendation?.title ?? "추천 결과"}
        message={recommendation?.message ?? ""}
        score={recommendation?.score ?? 0}
        isAiLoading={isAiLoading}
        aiError={aiError}
        onClose={() => {
          setIsOpen(false);
          setAiError(null);
        }}
      />

      <main className={styles.page}>
        {/* 현재 상품 위치 */}
        <nav aria-label="상품 경로" className={styles.breadcrumb}>
          <span>전체 상품</span>

          <span className={styles.breadcrumbArrow}>&gt;</span>

          <span>{product.category.name}</span>

          <span className={styles.breadcrumbArrow}>&gt;</span>

          <strong className={styles.breadcrumbCurrent}>{product.name}</strong>
        </nav>

        {/* 상품 이미지와 상품 정보 */}
        <section className={styles.productSection}>
          {/* 왼쪽: 상품 이미지 */}
          <div>
            <img
              src={getImageUrl(mainImage)}
              alt={product.name}
              className={styles.mainImage}
            />

            {product.detail_color.length > 0 && (
              <div className={styles.thumbnailList}>
                {product.detail_color.map((color) => {
                  const isSoldOut = color.stock === 0;

                  const isSelected = selectedOptions.some(
                    (option) => option.color.id === color.id,
                  );

                  return (
                    <button
                      key={color.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => {
                        if (!isSoldOut) {
                          setMainImage(color.color_image);
                        }
                      }}
                      title={
                        isSoldOut
                          ? `${color.color_name} 품절`
                          : color.color_name
                      }
                      className={`${styles.thumbnailButton} ${
                        isSelected ? styles.thumbnailSelected : ""
                      } ${isSoldOut ? styles.thumbnailSoldOut : ""}`}
                    >
                      <img
                        src={getImageUrl(color.color_image)}
                        alt={color.color_name}
                        className={styles.thumbnailImage}
                      />

                      {isSoldOut && (
                        <span className={styles.soldOutOverlay}>품절</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 오른쪽: 상품 정보 */}
          <div>
            <p className={styles.brandName}>{product.brand?.name}</p>

            <h1 className={styles.productName}>{product.name}</h1>

            {product.hash_tag?.length > 0 && (
              <div className={styles.hashTagList}>
                {product.hash_tag.map((tag) => (
                  <span key={tag} className={styles.hashTag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 정가와 할인 가격 */}
            <div className={styles.priceSection}>
              <div className={styles.originalPriceRow}>
                <span className={styles.originalLabel}>정가</span>

                <span className={styles.originalPrice}>
                  {originalPrice.toLocaleString()}원
                </span>
              </div>

              <div className={styles.salePriceRow}>
                <span className={styles.saleText}>10% 할인가</span>

                <strong className={styles.productPrice}>
                  {salePrice.toLocaleString()}원
                </strong>
              </div>
            </div>

            <div className={styles.optionTitle}>
              <strong>옵션 선택(필수)</strong>
              <span aria-hidden="true">*</span>
            </div>

            {/* 색상 옵션 드롭다운 */}
            <div className={styles.optionDropdown}>
              <button
                type="button"
                onClick={() =>
                  setIsOptionOpen((previousState) => !previousState)
                }
                aria-expanded={isOptionOpen}
                className={`${styles.optionDropdownButton} ${
                  isOptionOpen ? styles.optionDropdownButtonOpen : ""
                }`}
              >
                <span>옵션을 선택해 주세요</span>

                <span
                  className={`${styles.dropdownArrow} ${
                    isOptionOpen ? styles.dropdownArrowOpen : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              {isOptionOpen && (
                <div className={styles.optionDropdownList}>
                  {product.detail_color.map((color) => {
                    const isSoldOut = color.stock === 0;

                    const alreadySelected = selectedOptions.some(
                      (option) => option.color.id === color.id,
                    );

                    return (
                      <button
                        key={color.id}
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => handleSelectOption(color)}
                        className={`${styles.optionItem} ${
                          alreadySelected ? styles.optionItemSelected : ""
                        } ${isSoldOut ? styles.optionItemSoldOut : ""}`}
                      >
                        <img
                          src={getImageUrl(color.color_image)}
                          alt={color.color_name}
                          className={styles.optionImage}
                        />

                        <div className={styles.optionInfo}>
                          <p className={styles.optionColorName}>
                            {color.color_name}
                          </p>

                          <div className={styles.optionPriceRow}>
                            <strong className={styles.optionSale}>10%</strong>

                            <strong className={styles.optionPrice}>
                              {salePrice.toLocaleString()}원
                            </strong>

                            {isSoldOut && (
                              <span className={styles.optionSoldOutText}>
                                품절
                              </span>
                            )}

                            {alreadySelected && (
                              <span className={styles.optionSelectedText}>
                                선택됨
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedOptions.length === 0 && (
              <p className={styles.emptyOptionText}>
                구매할 색상 옵션을 선택해 주세요.
              </p>
            )}

            {/* 선택된 옵션 목록 */}
            {selectedOptions.length > 0 && (
              <div className={styles.selectedOptionList}>
                {selectedOptions.map((option) => (
                  <div
                    key={option.color.id}
                    className={styles.selectedOptionCard}
                  >
                    <div className={styles.selectedOptionHeader}>
                      <div className={styles.selectedOptionNameRow}>
                        <strong className={styles.selectedOptionName}>
                          {option.color.color_name}
                        </strong>

                        <span className={styles.selectedOptionDiscount}>
                          10% 할인가
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option.color.id)}
                        aria-label={`${option.color.color_name} 삭제`}
                        className={styles.removeOptionButton}
                      >
                        ×
                      </button>
                    </div>

                    <div className={styles.quantityPriceRow}>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          disabled={option.quantity <= 1}
                          onClick={() => handleDecreaseOption(option.color.id)}
                          className={`${styles.quantityButton} ${styles.quantityButtonLeft}`}
                        >
                          −
                        </button>

                        <div className={styles.quantityNumber}>
                          {option.quantity}
                        </div>

                        <button
                          type="button"
                          disabled={option.quantity >= option.color.stock}
                          onClick={() => handleIncreaseOption(option.color.id)}
                          className={`${styles.quantityButton} ${styles.quantityButtonRight}`}
                        >
                          ＋
                        </button>
                      </div>

                      <strong className={styles.optionTotalPrice}>
                        {(salePrice * option.quantity).toLocaleString()}원
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 총 구매 수량 및 총금액 */}
            {selectedOptions.length > 0 && (
              <div className={styles.totalSection}>
                <span>
                  구매수량 <strong>{totalQuantity}개</strong>
                </span>

                <strong className={styles.totalPrice}>
                  총 {totalPrice.toLocaleString()}원
                </strong>
              </div>
            )}

            {selectedOptions.length > 1 && (
              <div className={styles.removeAllArea}>
                <button
                  type="button"
                  onClick={handleRemoveAllOptions}
                  className={styles.removeAllButton}
                >
                  상품 전체 삭제
                </button>
              </div>
            )}

            {/* 장바구니 및 구매 버튼 */}

            <p className={styles.aiNotice}>
              ※ 1개의 상품을 담았을 때만 AI 색상 추천을 합니다.
            </p>
            <div className={styles.purchaseButtonArea}>
              <button
                type="button"
                onClick={handleAddCart}
                // 옵션이 없거나 장바구니 요청 중이면 버튼을 누를 수 없습니다.
                disabled={selectedOptions.length === 0 || isCartLoading}
                className={styles.cartButton}
              >
                {/* 장바구니 요청 중에는 처리 상태를 표시합니다. */}
                {isCartLoading ? "담는 중..." : "장바구니"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={selectedOptions.length === 0}
                className={styles.buyButton}
              >
                바로 구매
              </button>
            </div>
          </div>
        </section>

        {/* 하단 상세정보 영역 */}
        <section className={styles.bottomSection}>
          <div className={styles.bottomLeftArea}>
            {/* 상품 상세정보 */}
            <section>
              <h2 className={styles.sectionTitle}>상품 상세정보</h2>

              {product.color_detail_image && (
                <img
                  src={getImageUrl(product.color_detail_image)}
                  alt={`${product.name} 상세 이미지`}
                  className={styles.detailImage}
                />
              )}
            </section>

            {/* 리뷰 */}
            <section className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>리뷰</h2>

              <div className={styles.reviewList}>
                {fixedReviews.map((review) => (
                  <article key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewScore}>
                      {"★".repeat(review.score)}

                      <span className={styles.emptyStar}>
                        {"★".repeat(5 - review.score)}
                      </span>
                    </div>

                    <p className={styles.reviewOption}>
                      선택 옵션: {review.option}
                    </p>

                    <p className={styles.reviewContent}>{review.content}</p>

                    <p className={styles.reviewMeta}>
                      {review.writer}
                      <span className={styles.metaDivider}>|</span>
                      {review.date}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Q&A */}
            <section className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>Q&amp;A</h2>

              <div className={styles.inquiryButtonArea}>
                <button
                  type="button"
                  onClick={() => {
                    alert("상품 문의 기능은 추후 연결할 예정입니다.");
                  }}
                  className={styles.inquiryButton}
                >
                  상품 문의
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert("배송·반품·교환 문의 기능은 추후 연결할 예정입니다.");
                  }}
                  className={styles.inquiryButton}
                >
                  배송·반품·교환 문의
                </button>
              </div>

              <p className={styles.inquiryDescription}>
                배송·반품·교환 문의와 답변은 1:1 문의에서 확인해 보세요.
              </p>

              <div className={styles.qnaList}>
                {fixedQnaList.map((qna) => (
                  <article key={qna.id} className={styles.qnaItem}>
                    <strong className={styles.qnaStatus}>{qna.status}</strong>

                    <p className={styles.qnaQuestion}>{qna.question}</p>

                    <p className={styles.qnaMeta}>
                      {qna.writer}
                      <span className={styles.metaDivider}>|</span>
                      {qna.date}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

const fixedReviews = [
  {
    id: 1,
    score: 5,
    writer: "young****",
    date: "2026.07.19",
    option: "29 다운타운",
    content: "색상이 자연스럽고 촉촉해서 데일리로 사용하기 좋아요.",
  },
  {
    id: 2,
    score: 4,
    writer: "pink****",
    date: "2026.07.18",
    option: "04 아몬드 누드",
    content: "차분한 색감이라 부담 없이 사용하기 좋습니다.",
  },
  {
    id: 3,
    score: 5,
    writer: "beauty****",
    date: "2026.07.17",
    option: "19 쉘 피치",
    content: "발색도 예쁘고 피부톤과 잘 어울려서 만족합니다.",
  },
];

const fixedQnaList = [
  {
    id: 1,
    status: "답변대기",
    question: "핑크뮤쇼킹 컬러는 언제 다시 입고되나요?",
    writer: "byy****",
    date: "2026.07.19",
  },
  {
    id: 2,
    status: "답변대기",
    question: "하트럼 컬러 재출시 가능성이 있을까요?",
    writer: "treasure****",
    date: "2026.07.19",
  },
  {
    id: 3,
    status: "답변완료",
    question: "웜톤에게 가장 잘 어울리는 컬러가 무엇인가요?",
    writer: "andrea75****",
    date: "2026.07.18",
  },
  {
    id: 4,
    status: "답변대기",
    question: "코코밤과 가장 비슷한 컬러가 궁금합니다.",
    writer: "diatcps****",
    date: "2026.07.17",
  },
];
