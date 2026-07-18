import ProductItem from "@/components/product-item";
import { ProductItemType } from "@/types/productItemType";

interface ProductListProps {
  products: ProductItemType[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p>상품이 없습니다.</p>;
  }

  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
