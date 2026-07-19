import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/hash";
import { registerSchema } from "@/lib/validations/auth";
import { formatError } from "@/lib/utils";
import { MESSAGES } from "@/constants/messages";

export async function POST(req: NextRequest) {
  try {
    // Read request body
    const body = await req.json();

    // Validate input
    const validation = registerSchema.safeParse(body);

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

    const { firstName, lastName, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: MESSAGES.AUTH.EMAIL_EXISTS,
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: MESSAGES.AUTH.USER_CREATED,
        user,
      },
      { status: 201 }
    );
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