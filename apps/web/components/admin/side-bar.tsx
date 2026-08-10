"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import styles from "./side-bar.module.css";

export default function SideBar() {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.sidebar}>
      <div className={styles.folder} onClick={() => setOpen(!open)}>
        <span>상품 관리</span>

        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>

      {open && (
        <div className={styles.menu}>
          <Link href={`/admin/add-product`} className={styles.link}>
            상품 등록
          </Link>

          <Link href={`/admin/change-product`} className={styles.link}>
            상품 관리/수정
          </Link>
        </div>
      )}
    </div>
  );
}
