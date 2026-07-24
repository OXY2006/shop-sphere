import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { cartService } from "@/server/services/cart.service";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const cart = await cartService.getCart(user.id);

  return NextResponse.json(cart);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { productId, quantity } =
    await request.json();

  const cart = await cartService.addToCart(
    user.id,
    productId,
    quantity
  );

  return NextResponse.json(cart);
}