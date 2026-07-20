import styles from "./page.module.css";
import { Constants } from "@/common/constants";
import { MirrorRound, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function Mypage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const response = await fetch(`${Constants.back_url}/user/${id}`);
  const userInfo = await response.json();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>마이페이지</h2>

      <div className={styles.profile}>
        <p className={styles.userName}>
          <strong>{userInfo.name}</strong> 님
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.button}>주소 수정</button>
          <button className={styles.button}>비밀번호 수정</button>
        </div>
      </div>

      <div className={styles.menuBox}>
        <Link href={`/order?userId=${id}`} className={styles.menu}>
          <ClipboardList size={65} />
          <span>주문내역</span>
        </Link>

        <Link href={`/rating?userId=${id}`} className={styles.menu}>
          <MirrorRound size={65} />
          <span>나만의 온라인 화장대</span>
        </Link>
      </div>

      <div className={styles.bottom}>
        <Link href={`/user/mypage/cancel-user/${id}`} className={styles.cancel}>
          회원 탈퇴
        </Link>
      </div>
    </div>
  );
}
