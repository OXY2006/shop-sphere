import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { orderService } from "@/server/services/order.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
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

  const { id } = await params;

  try {
    const order = await orderService.getOrder(
      id,
      user.id
    );

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Order not found",
      },
      {
        status: 404,
      }
    );
  }
}