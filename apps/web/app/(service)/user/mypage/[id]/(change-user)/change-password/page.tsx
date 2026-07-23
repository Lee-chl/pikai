import { Constants } from "@/common/constants";
import PasswordForm from "../../../../../../../components/mypage/passwordForm";
import styles from "./page.module.css";

export default async function ChangePassword({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>비밀번호 변경</h2>

      <p className={styles.description}>
        현재 비밀번호를 입력한 후 새 비밀번호로 변경해주세요.
      </p>

      <PasswordForm id={id} />
    </div>
  );
}
