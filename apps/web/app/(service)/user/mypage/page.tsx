import styles from "./page.module.css";
import { Constants } from "@/common/constants";
import { MirrorRound, ClipboardList, UserRoundCog } from "lucide-react";
import Link from "next/link";
import DeleteButton from "../../../../components/mypage/deleteButton";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const response = await fetch(`${Constants.back_url}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const userInfo = await response.json();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>마이페이지</h2>

      <div className={styles.myPageBox}>
        <div className={styles.profile}>
          <p className={styles.userName}>
            <strong>{userInfo.name}</strong> 님
          </p>
          <DeleteButton id={userInfo.id} />
        </div>

        <div className={styles.divider}></div>

        <div className={styles.menuBox}>
          <Link href={`/order?userId=${userInfo.id}`} className={styles.menu}>
            <ClipboardList size={60} strokeWidth={1.8} />
            <span>주문내역</span>
          </Link>

          <Link href={`/rating?userId=${userInfo.id}`} className={styles.menu}>
            <MirrorRound size={60} strokeWidth={1.8} />
            <span>나만의 온라인 화장대</span>
          </Link>

          <Link
            href={`/user/mypage/${userInfo.id}/change-address`}
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
