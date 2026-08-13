import { Constants } from "@/common/constants";
import { cookies } from "next/headers";
import ProductEdit from "@/components/admin/product-edit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let product;

  if (token) {
    try {
      const response = await fetch(
        `${Constants.back_url}/admin/${productId.id}`,
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

      product = await response.json();
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <ProductEdit product={product} />
    </div>
  );
}
