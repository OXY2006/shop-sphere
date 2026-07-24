import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { wishlistService } from "@/server/services/wishlist.service";

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: Props
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { productId } = await params;

  const result = await wishlistService.toggle(
    user.id,
    productId
  );

  return NextResponse.json(result);
}