import { NextRequest, NextResponse } from "next/server";

import { productService } from "@/server/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const data = await productService.getProducts({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
