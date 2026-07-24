import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { wishlistService } from "@/server/services/wishlist.service";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const wishlist = await wishlistService.getWishlist(user.id);

  return NextResponse.json(wishlist);
}