"use client";

import { Constants } from "@/common/constants";
import { ProductAdminType } from "@/types/productItemType";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./product-edit.module.css";

interface EditProductProps {
  product: ProductAdminType;
}

export default function ProductEdit({ product }: EditProductProps) {
  const [brandName, setBrandName] = useState(product.brand.name);
  const [categoryName, setCategoryName] = useState(product.category.name);
  const [mainImage, setMainImage] = useState(product.color_main_image);
  const [detailImage, setDetailImage] = useState(product.color_detail_image);
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(String(product.price));
  const [hashTag, setHashTag] = useState(product.hash_tag.join(", "));

  const imageUrl = `${Constants.image_url}/`;

  const handleSubmit = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (token) {
      try {
        try {
          const response = await fetch(
            `${Constants.back_url}/admin/${product.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: productName,
                price: Number(productPrice),
                color_main_image: mainImage,
                color_detail_image: detailImage,
                hash_tag: hashTag
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== ""),
              }),
            },
          );

          if (!response.ok) {
            toast.error("상품 수정에 실패했습니다.");
            return;
          }

          toast.success("상품이 수정되었습니다.");
        } catch (error) {
          toast.error("상품 수정 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>상품 수정</h1>
        <p>등록된 상품의 정보를 수정할 수 있습니다.</p>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label>브랜드 이름</label>
          <input
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>카테고리</label>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        <div className={styles.imageField}>
          <label>상품 대표 이미지</label>

          <div className={styles.imageBox}>
            <div className={styles.preview}>
              {mainImage ? (
                <Image
                  src={`${imageUrl}${mainImage}`}
                  alt="상품 대표 이미지 미리보기"
                  width={150}
                  height={150}
                />
              ) : (
                <span>이미지 미리보기</span>
              )}
            </div>

            <input
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              placeholder="이미지 파일명을 입력하세요."
            />
          </div>
        </div>

        <div className={styles.imageField}>
          <label>상품 상세 이미지</label>

          <div className={styles.imageBox}>
            <div className={styles.preview}>
              {detailImage ? (
                <Image
                  src={`${imageUrl}${detailImage}`}
                  alt="상품 상세 이미지 미리보기"
                  width={150}
                  height={150}
                />
              ) : (
                <span>이미지 미리보기</span>
              )}
            </div>

            <input
              value={detailImage}
              onChange={(e) => setDetailImage(e.target.value)}
              placeholder="이미지 파일명을 입력하세요."
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>상품 이름</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>가격</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>해시태그</label>
          <p>해시태그를 쉼표로 구분해주세요.</p>

          <input
            value={hashTag}
            onChange={(e) => setHashTag(e.target.value)}
            placeholder="해시태그를 쉼표로 구분해주세요."
          />
        </div>

        <button type="button" className={styles.button} onClick={handleSubmit}>
          상품 수정
        </button>
      </div>
    </div>
  );
}
