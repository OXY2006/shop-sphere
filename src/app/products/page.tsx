import Container from "@/components/layout/container";
import ProductFilters from "@/components/product/product-filters";
import ProductGrid from "@/components/product/product-grid";
import { categoryService } from "@/server/services/category.service";
import { productService } from "@/server/services/product.service";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const [{ products, total, totalPages, page }, categories, brands] =
    await Promise.all([
      productService.getProducts(params),
      categoryService.getCategories(),
      prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          All Products
        </h1>

        <p className="mt-2 text-muted-foreground">
          {total} products found
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProductFilters
          categories={categories}
          brands={brands}
        />

        <div className="space-y-8">
          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({
                length: totalPages,
              }).map((_, index) => {
                const pageNumber = index + 1;

                const query = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                  if (value) {
                    query.set(key, value);
                  }
                });

                query.set("page", String(pageNumber));

                return (
                  <Link
                    key={pageNumber}
                    href={`/products?${query.toString()}`}
                    className={`rounded-md border px-4 py-2 transition ${
                      page === pageNumber
                        ? "bg-black text-white"
                        : "hover:bg-muted"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}