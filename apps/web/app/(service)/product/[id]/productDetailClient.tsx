"use client";

import { useState } from "react";
import type {
  DetailColorType,
  ProductDetailType,
} from "@/types/productDetailType";
import styles from "./product-detail.module.css";

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
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType[]>(
    [],
  );

  const [mainImage, setMainImage] = useState(product.color_main_image);

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

  const totalQuantity = selectedOptions.reduce(
    (total, option) => total + option.quantity,
    0,
  );

  const totalPrice = selectedOptions.reduce(
    (total, option) => total + product.price * option.quantity,
    0,
  );

  const handleAddCart = () => {
    if (selectedOptions.length === 0) {
      alert("옵션을 하나 이상 선택해 주세요.");
      return;
    }

    const hasInvalidStock = selectedOptions.some(
      (option) =>
        option.color.stock === 0 || option.quantity > option.color.stock,
    );

    if (hasInvalidStock) {
      alert("선택한 옵션의 재고를 다시 확인해 주세요.");
      return;
    }

    const cartData = selectedOptions.map((option) => ({
      productId: product.id,
      detailColorId: option.color.id,
      quantity: option.quantity,
    }));

    console.log("장바구니 데이터:", cartData);

    alert("선택한 상품을 장바구니에 담았습니다.");
  };

  const handleBuyNow = () => {
    if (selectedOptions.length === 0) {
      alert("옵션을 하나 이상 선택해 주세요.");
      return;
    }

    const orderData = selectedOptions.map((option) => ({
      productId: product.id,
      detailColorId: option.color.id,
      quantity: option.quantity,
    }));

    console.log("바로 구매 데이터:", orderData);

    alert("바로 구매 기능을 연결해 주세요.");
  };

  return (
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
                      isSoldOut ? `${color.color_name} 품절` : color.color_name
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

          <div className={styles.priceSection}>
            {product.is_sale && (
              <strong className={styles.saleText}>10% 할인가격</strong>
            )}

            <strong className={styles.productPrice}>
              {product.price.toLocaleString()}원
            </strong>
          </div>

          <div className={styles.optionTitle}>
            <strong>옵션 선택(필수)</strong>
            <span aria-hidden="true">*</span>
          </div>

          {/* 색상 옵션 드롭다운 */}
          <div className={styles.optionDropdown}>
            <button
              type="button"
              onClick={() => setIsOptionOpen((previousState) => !previousState)}
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
                          {product.is_sale && (
                            <strong className={styles.optionSale}>10%</strong>
                          )}

                          <strong className={styles.optionPrice}>
                            {product.price.toLocaleString()}원
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

                        {!isSoldOut && (
                          <p className={styles.optionStock}>
                            남은 재고 {color.stock}개
                          </p>
                        )}
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
                        10% 할인가격
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
                      {(product.price * option.quantity).toLocaleString()}원
                    </strong>
                  </div>

                  <p className={styles.selectedOptionStock}>
                    남은 재고 {option.color.stock}개
                  </p>
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
                선택 옵션 전체 삭제
              </button>
            </div>
          )}

          {/* 장바구니 및 구매 버튼 */}
          <div className={styles.purchaseButtonArea}>
            <button
              type="button"
              onClick={handleAddCart}
              disabled={selectedOptions.length === 0}
              className={styles.cartButton}
            >
              장바구니
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
