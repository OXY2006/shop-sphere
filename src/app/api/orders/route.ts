import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { orderService } from "@/server/services/order.service";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await orderService.getOrders(
    user.id
  );

  return NextResponse.json({
    success: true,
    data: orders,
  });
}

export async function POST(
  request: NextRequest
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { addressId } = await request.json();

  const order = await orderService.placeOrder(
    user.id,
    addressId
  );

  return NextResponse.json(
    {
      success: true,
      data: order,
    },
    {
      status: 201,
    }
  );
}