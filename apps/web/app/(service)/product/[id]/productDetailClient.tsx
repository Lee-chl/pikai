"use client";

import { useState } from "react";
import type {
  DetailColorType,
  ProductDetailType,
} from "@/types/productDetailType";

interface ProductDetailClientProps {
  product: ProductDetailType;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState<DetailColorType | null>(
    product.detail_color.length > 0 ? product.detail_color[0]! : null,
  );

  const [quantity, setQuantity] = useState(1);

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

  // 이미지 값이 전체 URL이면 그대로 사용하고,
  // 파일명이면 NEXT_PUBLIC_IMAGE_URL을 앞에 붙입니다.
  const getImageUrl = (image: string) => {
    if (!image) {
      return "/images/no-image.png";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${imageBaseUrl}/${image}`;
  };

  const increaseQuantity = () => {
    if (selectedColor && quantity >= selectedColor.stock) {
      alert("재고 수량을 초과할 수 없습니다.");
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddCart = () => {
    if (!selectedColor) {
      alert("색상 옵션을 선택해주세요.");
      return;
    }

    alert(`${selectedColor.color_name} ${quantity}개를 장바구니에 담았습니다.`);
  };

  const handleBuyNow = () => {
    if (!selectedColor) {
      alert("색상 옵션을 선택해주세요.");
      return;
    }

    alert(`${selectedColor.color_name} ${quantity}개를 구매합니다.`);
  };

  const totalPrice = product.price * quantity;

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "60px",
        }}
      >
        {/* 왼쪽: 상품 이미지 */}
        <div>
          <img
            src={getImageUrl(product.color_main_image)}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "600px",
              objectFit: "contain",
              border: "1px solid #eeeeee",
              borderRadius: "8px",
            }}
          />

          {/* 색상 이미지 목록 */}
          {product.detail_color.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {product.detail_color.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    setQuantity(1);
                  }}
                  style={{
                    padding: "4px",
                    border:
                      selectedColor?.id === color.id
                        ? "2px solid #111111"
                        : "1px solid #dddddd",
                    borderRadius: "6px",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={getImageUrl(color.color_image)}
                    alt={color.color_name}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 오른쪽: 상품 정보 */}
        <div>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#777777",
            }}
          >
            {product.brand.name}
          </p>

          <h1
            style={{
              margin: "0 0 20px",
              fontSize: "30px",
              lineHeight: 1.4,
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "25px",
            }}
          >
            {product.hash_tag.map((tag) => (
              <span
                key={tag}
                style={{
                  color: "#777777",
                  fontSize: "14px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            style={{
              margin: "0 0 30px",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {product.price.toLocaleString()}원
          </p>

          <hr
            style={{
              border: 0,
              borderTop: "1px solid #eeeeee",
              marginBottom: "30px",
            }}
          />

          {/* 색상 옵션 */}
          <div style={{ marginBottom: "25px" }}>
            <label
              htmlFor="color-option"
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: 600,
              }}
            >
              색상 선택
            </label>

            <select
              id="color-option"
              value={selectedColor?.id ?? ""}
              onChange={(event) => {
                const colorId = Number(event.target.value);

                const color =
                  product.detail_color.find((item) => item.id === colorId) ??
                  null;

                setSelectedColor(color);
                setQuantity(1);
              }}
              style={{
                width: "100%",
                height: "48px",
                padding: "0 12px",
                border: "1px solid #cccccc",
                borderRadius: "4px",
              }}
            >
              {product.detail_color.length === 0 && (
                <option value="">선택 가능한 색상이 없습니다</option>
              )}

              {product.detail_color.map((color) => (
                <option
                  key={color.id}
                  value={color.id}
                  disabled={color.stock === 0}
                >
                  {color.color_name}
                  {color.stock === 0 ? " - 품절" : ` - 재고 ${color.stock}개`}
                </option>
              ))}
            </select>
          </div>

          {/* 선택한 옵션 정보 */}
          {selectedColor && (
            <div
              style={{
                padding: "16px",
                marginBottom: "25px",
                backgroundColor: "#f8f8f8",
                borderRadius: "6px",
              }}
            >
              <strong>{selectedColor.color_name}</strong>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#666666",
                }}
              >
                남은 재고: {selectedColor.stock}개
              </p>
            </div>
          )}

          {/* 수량 선택 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "25px",
            }}
          >
            <span style={{ fontWeight: 600 }}>수량</span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #dddddd",
              }}
            >
              <button
                type="button"
                onClick={decreaseQuantity}
                style={{
                  width: "40px",
                  height: "40px",
                  border: 0,
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <span
                style={{
                  width: "50px",
                  textAlign: "center",
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                style={{
                  width: "40px",
                  height: "40px",
                  border: 0,
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* 총가격 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 0",
              borderTop: "1px solid #eeeeee",
              marginBottom: "20px",
            }}
          >
            <strong>총 상품 금액</strong>

            <strong
              style={{
                fontSize: "26px",
              }}
            >
              {totalPrice.toLocaleString()}원
            </strong>
          </div>

          {/* 구매 버튼 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={handleAddCart}
              disabled={!selectedColor || selectedColor.stock === 0}
              style={{
                height: "55px",
                border: "1px solid #222222",
                backgroundColor: "#ffffff",
                fontSize: "17px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              장바구니
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!selectedColor || selectedColor.stock === 0}
              style={{
                height: "55px",
                border: 0,
                backgroundColor: "#222222",
                color: "#ffffff",
                fontSize: "17px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              바로 구매
            </button>
          </div>
        </div>
      </section>

      {/* 상세 이미지 */}
      {product.color_detail_image && (
        <section
          style={{
            marginTop: "100px",
            paddingTop: "50px",
            borderTop: "1px solid #eeeeee",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "40px" }}>상품 상세 정보</h2>

          <img
            src={getImageUrl(product.color_detail_image)}
            alt={`${product.name} 상세 이미지`}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </section>
      )}
    </main>
  );
}
