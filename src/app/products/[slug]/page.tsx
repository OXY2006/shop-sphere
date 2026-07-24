import { notFound } from "next/navigation";

import Container from "@/components/layout/container";
import ProductGrid from "@/components/product/product-grid";
import { productService } from "@/server/services/product.service";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  try {
    const { product, relatedProducts } =
      await productService.getProductBySlug(slug);

    return (
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <img
              src={
                product.images[0]?.imageUrl ??
                "https://placehold.co/600x600?text=No+Image"
              }
              alt={product.name}
              className="aspect-square w-full rounded-xl border object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">
                {product.brand.name}
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                {product.name}
              </h1>
            </div>

            <p className="text-3xl font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="text-gray-600">
              {product.description}
            </p>

            <p
              className={
                product.stock > 0
                  ? "font-medium text-green-600"
                  : "font-medium text-red-600"
              }
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>

            <button className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">
              Related Products
            </h2>

            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </Container>
    );
  } catch {
    notFound();
  }
}