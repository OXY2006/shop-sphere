import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

interface RouteParams {
  params: Promise<{
    itemId: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { itemId } = await params;

  const { quantity } = await request.json();

  if (quantity < 1) {
    return NextResponse.json(
      { message: "Quantity must be at least 1" },
      { status: 400 }
    );
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: itemId,
    },
    include: {
      cart: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== user.id) {
    return NextResponse.json(
      { message: "Cart item not found" },
      { status: 404 }
    );
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { itemId } = await params;

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: itemId,
    },
    include: {
      cart: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== user.id) {
    return NextResponse.json(
      { message: "Cart item not found" },
      { status: 404 }
    );
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}