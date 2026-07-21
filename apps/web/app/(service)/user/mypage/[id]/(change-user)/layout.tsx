import SideBar from "@/components/mypage/side-bar";
import styles from "./layout.module.css";

export default async function ChangeUserLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: number }>;
}>) {
  const { id } = await params;
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <SideBar id={id} />
      </aside>

      <section className={styles.content}>{children}</section>
    </div>
  );
}
