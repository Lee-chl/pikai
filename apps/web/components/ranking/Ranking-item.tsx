import Image from "next/image";
import styles from "./Ranking-item.module.css";
import { Medal } from "lucide-react";
import { Tone, RankingItemProps } from "@/types/rankingType";
import { Constants } from "@/common/constants";

export default function RankingItem({ tone, rank }: RankingItemProps) {
  const imageUrl = `${Constants.image_url}/${tone.detailColor.products.color_main_image}`;
  return (
    <div className={styles.card}>
      <div className={styles.rank}>
        {rank === 1 && <Medal color="#FFD700" size={30} />}
        {rank === 2 && <Medal color="#C0C0C0" size={30} />}
        {rank === 3 && <Medal color="#CD7F32" size={30} />}
        {rank > 3 && <span>{rank}</span>}
      </div>
      <Image
        className={styles.image}
        src={imageUrl}
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
