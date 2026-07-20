import Image from "next/image";
import CategoryNav from "./category-nav";
import UserMenu from "./UserMenu";
import Link from "next/link";
import styles from "./Header.module.css";
import SearchBar from "./SearchBar";
import logo from "../../../public/pikai_logo.png";

export default async function Header() {
  return (
    <div>
      <div className={styles.userMenu}>
        <UserMenu />
      </div>
      <div className={styles.logo}>
        <Link href={`/`}>
          <Image
            src={logo}
            alt={`pikai_logo`}
            width={250}
            height={90}
            loading="eager"
          />
        </Link>
        <SearchBar />
      </div>
      <div className={styles.category}>
        <CategoryNav />
      </div>
    </div>
  );
}
