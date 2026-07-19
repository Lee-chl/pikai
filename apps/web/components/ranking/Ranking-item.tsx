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
      color_main_image: string;
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
        {rank === 1 && <Medal color="#FFD700" size={30} />}
        {rank === 2 && <Medal color="#C0C0C0" size={30} />}
        {rank === 3 && <Medal color="#CD7F32" size={30} />}
        {rank > 3 && <span>{rank}</span>}
      </div>
      <img
        className={styles.image}
        src={tone.detailColor.products.color_main_image}
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
