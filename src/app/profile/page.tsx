import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Container className="py-12">
      <h1 className="mb-8 text-4xl font-bold">
        My Profile
      </h1>

      <div className="space-y-4 rounded-lg border p-6">
        <p>
          <strong>User ID:</strong> {user.userId}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </Container>
  );
}