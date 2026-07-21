import Link from "next/link";

export default function SideBar({ id }: { id: number }) {
  return (
    <div>
      <span>회원 정보 수정</span>
      <p>
        <Link href={`/user/mypage/${id}/change-address`}>주소 변경</Link>
        <Link href={`/user/mypage/${id}/change-password`}>비밀번호 변경</Link>
      </p>
    </div>
  );
}
