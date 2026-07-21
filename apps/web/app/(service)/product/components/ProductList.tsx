import Link from "next/link";
import { ProductItemType } from "@/types/productItemType";
import Image from "next/image";
import { Constants } from "@/common/constants";

interface ProductListProps {
  products: ProductItemType[];
}

export default function ProductList({ products }: ProductListProps) {
  const imageUrl = ``;
  if (products.length === 0) {
    return <p>등록된 상품이 없습니다.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "20px",
      }}
    >
      {products.map((product) => (
        // <div key={product.id}>
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          style={{
            display: "block",
            color: "inherit",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <div>
            <Image
              src={`${Constants.image_url}/${product.color_main_image}`}
              alt={product.name}
              width={250}
              height={250}
              style={{
                display: "block",
                //width: "100%px",
                // height: "200px",
                objectFit: "cover",
              }}
            />

            <h4>{product.name}</h4>

            <p>{product.price.toLocaleString()}원</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
