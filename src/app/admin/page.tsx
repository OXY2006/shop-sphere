import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <a
          href="/admin/products"
          className="rounded-xl border p-6 hover:bg-muted"
        >
          <h2 className="text-2xl font-semibold">
            Products
          </h2>

          <p className="mt-2 text-muted-foreground">
            Manage products
          </p>
        </a>

        <a
          href="/admin/orders"
          className="rounded-xl border p-6 hover:bg-muted"
        >
          <h2 className="text-2xl font-semibold">
            Orders
          </h2>

          <p className="mt-2 text-muted-foreground">
            Manage customer orders
          </p>
        </a>

        <a
          href="/admin/users"
          className="rounded-xl border p-6 hover:bg-muted"
        >
          <h2 className="text-2xl font-semibold">
            Users
          </h2>

          <p className="mt-2 text-muted-foreground">
            Manage users
          </p>
        </a>
      </div>
    </Container>
  );
}