import styles from "./page.module.css";
import { Constants } from "@/common/constants";
import { MirrorRound, ClipboardList, UserRoundCog } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./deleteButton";

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

      <div className={styles.myPageBox}>
        <div className={styles.profile}>
          <p className={styles.userName}>
            <strong>{userInfo.name}</strong> 님
          </p>
          <DeleteButton id={id} />
        </div>

        <div className={styles.divider}></div>

        <div className={styles.menuBox}>
          <Link href={`/order?userId=${id}`} className={styles.menu}>
            <ClipboardList size={60} strokeWidth={1.8} />
            <span>주문내역</span>
          </Link>

          <Link href={`/rating?userId=${id}`} className={styles.menu}>
            <MirrorRound size={60} strokeWidth={1.8} />
            <span>나만의 온라인 화장대</span>
          </Link>

          <Link
            href={`/user/mypage/${id}/change-address`}
            className={styles.menu}
          >
            <UserRoundCog size={60} strokeWidth={1.8} />
            <span>회원 정보 수정</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
