import { notFound, redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";
import { orderService } from "@/server/services/order.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  try {
    const order = await orderService.getOrder(
      id,
      user.id
    );

    return (
      <Container className="py-10 space-y-8">
        <h1 className="text-4xl font-bold">
          Order Details
        </h1>

        <div className="rounded-xl border p-6 space-y-2">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {order.paymentStatus}
          </p>

          <p>
            <strong>Total:</strong> ₹
            {Number(order.totalAmount).toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Items
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {item.product.name} ×{" "}
                  {item.quantity}
                </span>

                <span>
                  ₹
                  {(
                    Number(item.unitPrice) *
                    item.quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  } catch {
    notFound();
  }
}