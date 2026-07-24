import ProductCard from "./product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: {
    id: string;
    imageUrl: string;
  }[];
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border">
        <p className="text-lg text-gray-500">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <section
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}