import PersonalColor from "../../../components/rating/PersonalColor";
import { UserInfoType } from "../../../types/userType";
import { Constants } from "../../../common/constants";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ userId: string }>;
}) {
  let userInfo: UserInfoType | null = null;
  const { userId } = await searchParams;
  if (!userId) {
    redirect("user/login");
  }

  try {
    const response = await fetch(
      `${Constants.front_url}/user/${Number(userId)}`,
    );
    const userData = await response.json();
    if (!userData.id) {
      throw new Error("유저 데이터 가져오다가 오류 발생");
    }

    userInfo = {
      id: userData.id,
      personal_color: userData.personal_color,
    };
  } catch (error) {
    console.log(error);
  }

  if (!userInfo) {
    return (
      <div>
        <h3>나만의 화장대</h3>
        <p>유저 정보를 불러올 수 없습니다. 다시 시도해주세요</p>
      </div>
    );
  }

  return (
    <div>
      <h3>나만의 화장대</h3>
      <PersonalColor userInfo={userInfo} />
    </div>
  );
}
