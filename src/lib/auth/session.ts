import { cookies } from "next/headers";

import { verifyToken } from "./jwt";

export interface SessionUser {
  userId: string;
  email: string;
  role: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token) as SessionUser;
  } catch {
    return null;
  }
}