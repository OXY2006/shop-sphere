import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { comparePassword } from "@/lib/auth/hash";
import { generateToken } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations/auth";
import { formatError } from "@/lib/utils";
import { MESSAGES } from "@/constants/messages";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: MESSAGES.COMMON.VALIDATION_ERROR,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: MESSAGES.AUTH.INVALID_CREDENTIALS,
        },
        { status: 401 }
      );
    }

    const passwordMatches = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: MESSAGES.AUTH.INVALID_CREDENTIALS,
        },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: formatError(error),
      },
      { status: 500 }
    );
  }
}