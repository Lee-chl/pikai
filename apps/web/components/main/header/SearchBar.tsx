import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="상품명 또는 컬러명을 검색해보세요."
        className={styles.input}
      />

      <button type="button" className={styles.button} aria-label="검색">
        <Search />
      </button>
    </div>
  );
}
