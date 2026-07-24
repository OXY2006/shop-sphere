import Link from "next/link";
import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { orderService } from "@/server/services/order.service";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await orderService.getOrders(user.id);

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No orders found
          </h2>

          <Link href="/products">
            <Button className="mt-6">
              Shop Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-xl border p-6 hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Order #{order.id.slice(0, 8)}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ₹
                    {Number(
                      order.totalAmount
                    ).toLocaleString("en-IN")}
                  </p>

                  <p className="text-sm">
                    {order.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}