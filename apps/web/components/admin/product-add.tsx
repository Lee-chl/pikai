"use client";

import { useState } from "react";
import styles from "./product-add.module.css";
import Image from "next/image";
import { Constants } from "@/common/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [detailImage, setDetailImage] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [hashTag, setHashTag] = useState("");

  const imageUrl = `${Constants.image_url}/`;

  const router = useRouter();

  const handleAdd = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (
      !brandName ||
      !categoryName ||
      !mainImage ||
      !detailImage ||
      !productName ||
      !price
    ) {
      toast.error("모든 정보를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${Constants.back_url}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand_name: brandName,
          category_name: categoryName,
          color_main_image: mainImage,
          color_detail_image: detailImage,
          name: productName,
          price: Number(price),
          hash_tag: hashTag
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
        }),
      });

      if (!response.ok) {
        toast.error("상품 등록이 실패하였습니다.");
        return;
      }

      toast.success("상품이 등록되었습니다.");
      router.push("/admin/product-change");
    } catch (error) {
      console.log(error);
      toast.error("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>상품 등록</h1>
        <p>새로운 상품을 등록할 수 있습니다.</p>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label>
            브랜드 이름 <span className={styles.requiredStar}>*</span>
          </label>

          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="브랜드 이름을 입력하세요."
          />
        </div>

        <div className={styles.field}>
          <label>
            카테고리 <span className={styles.requiredStar}>*</span>
          </label>

          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          >
            <option value="">카테고리 선택</option>
            <option value="립">립</option>
            <option value="치크">치크</option>
          </select>
        </div>

        <div className={styles.imageField}>
          <label>
            상품 대표 이미지 <span className={styles.requiredStar}>*</span>
          </label>

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
              type="text"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              placeholder="이미지 URL을 입력하세요."
            />
          </div>
        </div>

        <div className={styles.imageField}>
          <label>
            상품 상세 이미지 <span className={styles.requiredStar}>*</span>
          </label>

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
              type="text"
              value={detailImage}
              onChange={(e) => setDetailImage(e.target.value)}
              placeholder="이미지 URL을 입력하세요."
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>
            상품 이름 <span className={styles.requiredStar}>*</span>
          </label>

          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="상품 이름을 입력하세요."
          />
        </div>

        <div className={styles.field}>
          <label>
            가격 <span className={styles.requiredStar}>*</span>
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="가격을 입력하세요."
          />
        </div>

        <div className={styles.field}>
          <label>해시태그</label>

          <input
            type="text"
            value={hashTag}
            onChange={(e) => setHashTag(e.target.value)}
            placeholder="해시태그를 쉼표로 구분해주세요."
          />
        </div>

        <button type="button" className={styles.button} onClick={handleAdd}>
          상품 등록
        </button>
      </div>
    </div>
  );
}
