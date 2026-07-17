import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <Link href="/">이용약관</Link>
            <Link href="/">개인정보처리방침</Link>
            <Link href="/customerCenter">고객센터</Link>
            <Link href="/">FAQ</Link>
          </div>

          <div className={styles.info}>
            <p className={styles.company}>(주)피카이</p>
            <p>서울특별시 금천구 독산로50길 23</p>
            <p>
              080-123-4567 (쇼핑문의) / 080-123-4567 (제품문의) /
              pik-ai@email.com (주문/배송/쇼핑 문의)
            </p>
            <p>통신판매업신고번호 : 2026-서울금천-1308</p>
            <p>호스팅제공자 : (주)피카이</p>
          </div>

          <p className={styles.copy}>© 2026 PIKAI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
