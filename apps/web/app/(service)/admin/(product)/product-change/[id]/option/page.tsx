import { Constants } from "@/common/constants";
import { cookies } from "next/headers";
import ProductOption from "@/components/admin/product-option";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let details;

  if (token) {
    try {
      const response = await fetch(
        `${Constants.back_url}/admin/${productId.id}/detail`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      details = await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <ProductOption details={details} productId={Number(productId.id)} />
    </div>
  );
}
