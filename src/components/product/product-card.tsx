"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@base-ui/react/button";

interface ProductCardProps {
  product: {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const image =
    product.images[0]?.imageUrl ||
    "https://placehold.co/600x600?text=No+Image";

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs text-gray-500">{product.brand.name}</p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="line-clamp-2 text-lg font-semibold hover:text-blue-600">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span
            className={`text-sm font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <Button
          className="w-full cursor-pointer rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}