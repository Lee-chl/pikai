import Link from "next/link";
import RankingItem from "./Ranking-item";
import styles from "./Ranking.module.css";
import { Constants } from "../../common/constants";

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
      is_sale: boolean;
    };
  };
}

export default async function Ranking() {
  const res = await fetch(`${Constants.back_url}/tone`);
  const tones: Tone[] = await res.json();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>베스트 상품</h2>
      <div className={styles.list}>
        {tones.map((tone, index) => (
          <Link
            key={tone.detail_color_id}
            href={`/product/${tone.detailColor.products.id}`}
          >
            <RankingItem
              key={tone.detail_color_id}
              tone={tone}
              rank={index + 1}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
