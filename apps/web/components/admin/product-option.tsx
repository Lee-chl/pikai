"use client";

import { Constants } from "@/common/constants";
import { DetailProductType, ProductAdminType } from "@/types/productItemType";
import Image from "next/image";
import styles from "./product-option.module.css";
import { useState } from "react";
import { toast } from "sonner";
import OptionAdd from "./option-add";
import { useRouter } from "next/navigation";

interface ProductOptionProps {
  productId: number;
  details: DetailProductType[];
}

export default function ProductOption({
  productId,
  details,
}: ProductOptionProps) {
  const router = useRouter();
  const imageUrl = `${Constants.image_url}/`;

  const [editId, setEditId] = useState<number | null>(null);
  const [isAdd, setIsAdd] = useState(false);

  const [colorImage, setColorImage] = useState("");
  const [colorName, setColorName] = useState("");
  const [h, setH] = useState("");
  const [s, setS] = useState("");
  const [l, setL] = useState("");
  const [stock, setStock] = useState("");

  const handleEdit = (item: ProductAdminType["detail_color"][number]) => {
    setEditId(item.id);
    setColorImage(item.color_image);
    setColorName(item.color_name);
    setH(String(item.h));
    setS(String(item.s));
    setL(String(item.l));
    setStock(String(item.stock));
  };

  const handleSave = async (id: number) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`${Constants.back_url}/admin/detail/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          color_image: colorImage,
          color_name: colorName,
          h: Number(h),
          s: Number(s),
          l: Number(l),
          stock: Number(stock),
        }),
      });

      if (!response.ok) {
        toast.error("옵션 수정에 실패했습니다.");
        return;
      }

      toast.success("옵션이 수정되었습니다.");
      router.refresh();
      setEditId(null);
    } catch (error) {
      console.error(error);
      toast.error("옵션 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`${Constants.back_url}/admin/detail/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("옵션 삭제에 실패했습니다.");
        return;
      }

      toast.success("옵션이 삭제되었습니다.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("옵션 삭제 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>상품 옵션</h2>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsAdd(true)}
        >
          + 옵션 추가
        </button>
      </div>

      {isAdd && (
        <OptionAdd productId={productId} isAdd={isAdd} setIsAdd={setIsAdd} />
      )}

      {!details || details.length === 0 ? (
        <p className={styles.empty}>등록된 옵션이 없습니다.</p>
      ) : (
        details.map((item) => {
          const isEdit = editId === item.id;

          return (
            <div className={styles.productCard} key={item.id}>
              <div className={styles.productImage}>
                {isEdit ? (
                  <div className={styles.imageEdit}>
                    <div className={styles.imagePreview}>
                      {colorImage ? (
                        <Image
                          src={`${imageUrl}${colorImage}`}
                          alt="컬러 이미지 미리보기"
                          width={110}
                          height={110}
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
                ) : (
                  <Image
                    src={`${imageUrl}${item.color_image}`}
                    alt={item.color_name}
                    width={110}
                    height={110}
                    loading="eager"
                  />
                )}
              </div>

              <div className={styles.productInfo}>
                {isEdit ? (
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
                        value={h}
                        onChange={(e) => setH(e.target.value)}
                        placeholder="H"
                      />

                      <label>s</label>
                      <input
                        type="number"
                        value={s}
                        onChange={(e) => setS(e.target.value)}
                        placeholder="S"
                      />

                      <label>l</label>
                      <input
                        type="number"
                        value={l}
                        onChange={(e) => setL(e.target.value)}
                        placeholder="L"
                      />
                    </div>

                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="재고"
                    />
                  </div>
                ) : (
                  <div>
                    <h2>{item.color_name}</h2>

                    <div className={styles.detail}>
                      <span>h: {item.h}</span>
                      <span>s: {item.s}</span>
                      <span>l: {item.l}</span>
                    </div>

                    <p className={styles.stock}>재고 {item.stock}</p>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                {isEdit ? (
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => handleSave(item.id)}
                  >
                    저장
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => handleEdit(item)}
                  >
                    옵션 수정
                  </button>
                )}

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(item.id)}
                >
                  옵션 삭제
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
