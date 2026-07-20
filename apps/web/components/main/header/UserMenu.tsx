import Link from "next/link";
import { personalColorEnum } from "@repo/common";
import styles from "./UserMenu.module.css";
import { UserInfoType } from "@/types/userType";

export default function UserMenu() {
  // 임시 데이터 사용 (로그인 기능 구현 후 수정)
  // 회원 계정
  const user: UserInfoType | null = {
    id: 1,
    name: "사용자",
    is_admin: false,
    personal_color: personalColorEnum.WARM,
  };

  // 관리자 계정
  // const user: User | null = {
  //   id: 1,
  //   name: "관리자",
  //   is_admin: true,
  // };

  // 로그인 하지 않은 상태
  // const user = null as User | null;

  if (!user) {
    return (
      <div className={styles.container}>
        <Link href={`/user/login`}>로그인</Link>
        <Link href={`/user/register`}>회원가입</Link>
      </div>
    );
  }
  if (user.is_admin) {
    return (
      <div className={styles.container}>
        <Link href={`/admin`}>관리자 페이지</Link>
        <button type="button">로그아웃</button>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <Link href={`/cart?userId=${user.id}`}>장바구니</Link>
      <Link href={`/order?userId=${user.id}`}>주문 내역</Link>
      <Link href={`/user/mypage/${user.id}`}>마이페이지</Link>
      <Link href={`/rating?userId=${user.id}`}>나만의 화장대</Link>
      <button type="button">로그아웃</button>
    </div>
  );
}
