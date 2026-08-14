"use client";

import styles from "./product-delete.module.css";
import { Constants } from "@/common/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductDeleteProps {
  productId: number;
}

export default function ProductDelete({ productId }: ProductDeleteProps) {
  const router = useRouter();
  const handleDelete = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!token) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`${Constants.back_url}/admin/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("삭제 status:", response.status);

      const errorText = await response.text();
      console.log("삭제 response:", errorText);

      if (!response.ok) {
        toast.error("상품 삭제에 실패했습니다.");
        return;
      }

      toast.success("상품이 삭제되었습니다.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("상품 삭제 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={handleDelete}
      >
        상품 삭제
      </button>
    </div>
  );
}
