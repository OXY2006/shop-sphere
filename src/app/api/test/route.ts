import { NextResponse } from "next/server";
import { registerSchema } from "@/src/lib/validations/auth";

export async function POST(req: Request) {
  const body = await req.json();

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(result.error.flatten(), {
      status: 400,
    });
  }

  return NextResponse.json({
    success: true,
    data: result.data,
  });
}