import { Constants } from "@/common/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SideBar from "@/components/admin/side-bar";
import styles from "./layout.module.css";
import AdminToast from "@/components/admin/admin-toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let user = null;

  if (!token) {
    redirect("/user/login");
  }

  if (token) {
    try {
      const response = await fetch(`${Constants.back_url}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        redirect("/user/login");
      }

      if (response.ok) {
        user = await response.json();
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!user.is_admin) {
    return <AdminToast />;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <SideBar />
      </aside>

      <section className={styles.content}>{children}</section>
    </div>
  );
}
