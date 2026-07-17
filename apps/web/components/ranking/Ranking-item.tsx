import Ranking from "./Ranking";
import Image from "next/image";
import styles from "./Ranking-item.module.css";
import { Medal } from "lucide-react";

interface Tone {
  detail_color_id: number;
  sale_count: number;
  detailColor: {
    id: number;
    color_name: string;
    color_image: string;
    products: {
      id: number;
      name: string;
      price: number;
    };
  };
}

interface RankingItemProps {
  tone: Tone;
  rank: number;
}

export default function RankingItem({ tone, rank }: RankingItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.rank}>
        {rank === 1 && <Medal color="#FFD700" />}
        {rank === 2 && <Medal color="#C0C0C0" />}
        {rank === 3 && <Medal color="#CD7F32" />}
        {rank > 3 && <span>{rank}</span>}
      </div>
      {/* 이미지 경로 임시 설정 추후 변경 필요 */}
      <Image
        className={styles.image}
        src={`/globe.svg`}
        alt={tone.detailColor.color_name}
        width={70}
        height={70}
      />

      <div className={styles.info}>
        <p className={styles.productName}>{tone.detailColor.products.name}</p>

        <p className={styles.colorName}>{tone.detailColor.color_name}</p>
      </div>
    </div>
  );
}
