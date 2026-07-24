import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Users
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Verified</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b"
            >
              <td className="p-3">
                {user.firstName} {user.lastName}
              </td>

              <td className="p-3">
                {user.email}
              </td>

              <td className="p-3">
                {user.role}
              </td>

              <td className="p-3">
                {user.isVerified
                  ? "Yes"
                  : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}