"use client";

import { Constants } from "@/common/constants";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./option-add.module.css";
import { useRouter } from "next/navigation";

interface OptionAddProps {
  productId: number;
  isAdd: boolean;
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OptionAdd({
  productId,
  isAdd,
  setIsAdd,
}: OptionAddProps) {
  const imageUrl = `${Constants.image_url}/`;

  const [colorImage, setColorImage] = useState("");
  const [colorName, setColorName] = useState("");
  const [h, setH] = useState("");
  const [s, setS] = useState("");
  const [l, setL] = useState("");
  const [stock, setStock] = useState("");

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

    if (!colorImage || !colorName || !h || !s || !l || !stock) {
      toast.error("모든 정보를 입력해주세요.");
      return;
    }

    try {
      console.log("productId:", productId);
      console.log(
        "POST URL:",
        `${Constants.back_url}/admin/${productId}/detail`,
      );
      const response = await fetch(
        `${Constants.back_url}/admin/${productId}/detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            color_image: colorImage,
            color_name: colorName,
            h: Number(h),
            s: Number(s),
            l: Number(l),
            stock: Number(stock),
          }),
        },
      );

      if (!response.ok) {
        toast.error("옵션 등록에 실패했습니다.");
        return;
      }

      toast.success("옵션이 등록되었습니다.");
      setIsAdd(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("옵션 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      {/* <button
        type="button"
        className={styles.addButton}
        onClick={() => setIsAdding(true)}
      >
        + 옵션 추가
      </button> */}

      {isAdd && (
        <div className={styles.productCard}>
          <div className={styles.productImage}>
            <div className={styles.imageEdit}>
              <div className={styles.imagePreview}>
                {colorImage ? (
                  <Image
                    src={`${imageUrl}${colorImage}`}
                    alt="컬러 이미지 미리보기"
                    width={110}
                    height={110}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>이미지 미리보기</span>
                )}
              </div>

              <input
                type="text"
                value={colorImage}
                onChange={(e) => setColorImage(e.target.value)}
                placeholder="이미지 URL을 입력하세요."
              />
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.editInfo}>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="컬러명"
              />

              <div className={styles.detail}>
                <label>h</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={h}
                  onChange={(e) => setH(e.target.value)}
                  placeholder="H"
                />

                <label>s</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={s}
                  onChange={(e) => setS(e.target.value)}
                  placeholder="S"
                />

                <label>l</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={l}
                  onChange={(e) => setL(e.target.value)}
                  placeholder="L"
                />
              </div>

              {h !== "" && s !== "" && l !== "" && (
                <div className={styles.colorPreviewWrapper}>
                  <span>색상 미리보기</span>

                  <div
                    className={styles.colorPreview}
                    style={{
                      backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
                    }}
                  />
                </div>
              )}

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="재고"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.editButton}
              onClick={handleAdd}
            >
              저장
            </button>

            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => setIsAdd(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
