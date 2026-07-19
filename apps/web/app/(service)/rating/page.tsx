import PersonalColor from "../../../components/rating/PersonalColor";
import { UserInfoType } from "../../../types/userType";
import { Constants } from "../../../common/constants";
import { redirect } from "next/navigation";
import styles from "./rating.module.css";
import { RatingItemType } from "../../../types/ratingType";
import RatingList from "../../../components/rating/RatingList";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ userId: string; page: string }>;
}) {
  let userInfo: UserInfoType | null = null;
  let compRating: RatingItemType[] = [];
  let ratings: RatingItemType[] = [];
  let totalPage = 1;

  const { userId } = await searchParams;
  if (!userId) {
    redirect("user/login");
  }

  const page = (await searchParams.page) || 1;

  // 유저 정보 가져오기
  try {
    const response = await fetch(
      `${Constants.back_url}/user/${Number(userId)}`,
    );
    if (!response.ok) throw new Error(response.statusText);
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
        <h3 className={styles.titleMain}>나만의 온라인 화장대</h3>
        <p>유저 정보를 불러올 수 없습니다. 다시 시도해주세요</p>
      </div>
    );
  }

  // 비교 상품 과 전체 상품 가져오기
  try {
    const response = await fetch(`${Constants.back_url}/rating/comp`);
    const compData = await response.json();
    // 비교 상품 가져오기
    if (compData) {
      compRating = compData;
    }
  } catch (error) {
    console.error(error);
  }
  // 전체 별 점 매긴 화장품 가져오기
  try {
    const response = await fetch(
      `${Constants.back_url}/rating?page=${Number(page)}`,
    );
    if (!response.ok) throw new Error(response.statusText);
    const ratingJson = await response.json();
    const ratingData = ratingJson?.rating;
    totalPage = ratingJson?.totalPage;
    if (ratingData) {
      ratings = ratingData;
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      <h3 className={styles.titleMain}>나만의 온라인 화장대</h3>
      <PersonalColor userInfo={userInfo} />
      <hr className={styles.line} />
      <h3 className={styles.titleMain}>비교 상품</h3>
      <div className={styles.helpTextContainer}>
        <p className={styles.helpText}>
          비교 상품에 마우스를 올리면 비교 상품의 컬러를 확인하실 수 있습니다.
        </p>
        <p className={styles.helpText}>
          비교 상품 삭제를 원하시면 두번 클릭 해주세요
        </p>
        <p className={styles.helpText}>
          ※ 비교 상품에서만 삭제 되고 밑의 전체 상품에서는 삭제가 안됩니다.
        </p>
        <p className={styles.helpText}>
          비교 상품 별점 수정은 밑의 전체 상품 별점에서 가능합니다.
        </p>
      </div>
      {compRating ? (
        <RatingList ratingItem={compRating} is_com={true} />
      ) : (
        <p>비교 상품을 추가해주세요.</p>
      )}

      <hr className={styles.line} />
      <h3 className={styles.titleMain}>전체 상품</h3>
      <div className={styles.helpTextContainer}>
        <p className={styles.helpText}>
          상품에 마우스를 올리면 비교 상품의 컬러를 확인하실 수 있습니다.
        </p>
        <p className={styles.helpText}>
          상품의 별점 수정을 원하시면 두번 클릭 해주세요
        </p>
        <p className={styles.helpText}>
          상품 별점 삭제를 원하시면 한번 클릭 후 삭제 버튼을 눌러주세요 (여러
          상품 가능)
        </p>
      </div>
      {ratings ? (
        <RatingList
          ratingItem={ratings}
          is_com={false}
          totalPageNum={totalPage}
          currentPageNum={page}
        />
      ) : (
        <p>상품의 별점을 매겨주세요.</p>
      )}
    </div>
  );
}
