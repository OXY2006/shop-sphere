import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border p-5"
          >
            <p>
              <strong>User:</strong>{" "}
              {order.user.firstName}{" "}
              {order.user.lastName}
            </p>

            <p>
              <strong>Total:</strong> ₹
              {Number(order.totalAmount)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {order.paymentStatus}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}