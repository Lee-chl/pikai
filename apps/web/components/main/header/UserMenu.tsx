import Link from "next/link";
import { personalColorEnum } from "@repo/common";
import styles from "./UserMenu.module.css";

interface User {
  id: number;
  name: string;
  is_admin: boolean;
  personal_color?: personalColorEnum;
}

export default function UserMenu() {
  // const user: User | null = {
  //   id: 2,
  //   name: "사용자",
  //   is_admin: false,
  //   personal_color: personalColorEnum.WARM,
  // };
  const user: User | null = {
    id: 1,
    name: "관리자",
    is_admin: true,
  };
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
      <Link href={`/cart`}>장바구니</Link>
      <Link href={`/order`}>주문 내역</Link>
      <Link href={`/user/mypage`}>마이페이지</Link>
      <Link href={`/rating`}>나만의 화장대</Link>
      <button type="button">로그아웃</button>
    </div>
  );
}
