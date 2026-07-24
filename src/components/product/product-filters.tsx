"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  brands: Brand[];
}

export default function ProductFilters({
  categories,
  brands,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  }

  return (
    <aside className="space-y-6 rounded-xl border p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Search
        </label>

        <input
          type="text"
          defaultValue={searchParams.get("search") ?? ""}
          placeholder="Search products..."
          onBlur={(e: ChangeEvent<HTMLInputElement>) =>
            updateQuery("search", e.target.value)
          }
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(e) =>
            updateQuery("category", e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.slug}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Brand
        </label>

        <select
          defaultValue={searchParams.get("brand") ?? ""}
          onChange={(e) =>
            updateQuery("brand", e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="">All Brands</option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.slug}
            >
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Sort
        </label>

        <select
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) =>
            updateQuery("sort", e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Minimum Price
        </label>

        <input
          type="number"
          defaultValue={searchParams.get("minPrice") ?? ""}
          onBlur={(e) =>
            updateQuery("minPrice", e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Maximum Price
        </label>

        <input
          type="number"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onBlur={(e) =>
            updateQuery("maxPrice", e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
    </aside>
  );
}