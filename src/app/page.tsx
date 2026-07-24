import { productService } from "@/server/services/product.service";

import Container from "@/components/layout/container";
import ProductGrid from "@/components/product/product-grid";

export default async function HomePage() {
  const { products } = await productService.getProducts({
    page: "1",
    limit: "8",
    sort: "newest",
  });

  return (
    <Container className="space-y-12 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-20 text-white">
        <h1 className="mb-4 text-5xl font-bold">
          Welcome to Shop Sphere
        </h1>

        <p className="max-w-2xl text-lg text-slate-200">
          Discover premium electronics, fashion, home essentials,
          books, sports equipment and beauty products.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">
          Featured Products
        </h2>

        <ProductGrid products={products} />
      </section>
    </Container>
  );
}