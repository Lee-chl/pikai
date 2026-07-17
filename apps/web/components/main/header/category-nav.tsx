import Link from "next/link";
import styles from "./category-nav.module.css";

interface Category {
  id: number;
  name: string;
}

export default async function CategoryNav() {
  const res = await fetch(`${process.env.URL}/category`);
  const categories: Category[] = await res.json();
  return (
    <div>
      <nav className={styles.nav}>
        <Link className={styles.link} href={`/product`}>
          전체 상품{" "}
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/product/${category.id}`}
            className={styles.link}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
