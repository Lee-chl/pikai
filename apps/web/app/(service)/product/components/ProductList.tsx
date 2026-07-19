import { ProductItemType } from "@/types/productItemType";

interface ProductListProps {
  products: ProductItemType[];
}

export default function ProductList({ products }: ProductListProps) {
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
        <div key={product.id}>
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.color_main_image}`}
            alt={product.name}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />

          <h4>{product.name}</h4>

          <p>{product.price.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  );
}
