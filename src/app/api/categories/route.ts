import { NextResponse } from "next/server";

import { categoryService } from "@/server/services/category.service";

export async function GET() {
  try {
    const categories = await categoryService.getCategories();

    return NextResponse.json(
      {
        success: true,
        message: "Categories fetched successfully",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/categories:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}