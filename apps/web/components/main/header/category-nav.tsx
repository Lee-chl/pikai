import Link from "next/link";
import styles from "./category-nav.module.css";
import { Constants } from "../../../common/constants";

interface Category {
  id: number;
  name: string;
}

export default async function CategoryNav() {
  const res = await fetch(`${Constants.back_url}/category`);
  const categories: Category[] = await res.json();
  return (
    <div>
      <nav className={styles.nav}>
        <Link className={styles.link} href={`/product`}>
          전체 상품
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/product/category/${category.id}`}
            className={styles.link}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
