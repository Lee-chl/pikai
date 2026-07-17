import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Ranking from "../../components/ranking/Ranking";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.image}
          src={`/pikai_mainbanner.png`}
          alt="광고 배너 이미지"
          width={1000}
          height={450}
          loading="eager"
        />
        <Ranking />
        <Link href="/product" className={styles.button}>
          전체 상품 보러가기
          <KeyboardDoubleArrowRightIcon />
        </Link>
      </main>
    </div>
  );
}
