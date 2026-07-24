import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { cartService } from "@/server/services/cart.service";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [cart, addresses] = await Promise.all([
    cartService.getCart(user.id),
    prisma.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        isDefault: "desc",
      },
    }),
  ]);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Checkout
      </h1>

      <form
        action="/api/orders"
        method="POST"
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Shipping Address
            </h2>

            {addresses.length === 0 ? (
              <p className="text-muted-foreground">
                Please add an address before placing an
                order.
              </p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex cursor-pointer gap-3 rounded-lg border p-4"
                  >
                    <input
                      type="radio"
                      name="addressId"
                      value={address.id}
                      defaultChecked={address.isDefault}
                      required
                    />

                    <div>
                      <p className="font-semibold">
                        {address.fullName}
                      </p>

                      <p>{address.phone}</p>

                      <p>
                        {address.addressLine1}
                        {address.addressLine2 &&
                          `, ${address.addressLine2}`}
                      </p>

                      <p>
                        {address.city}, {address.state}
                      </p>

                      <p>
                        {address.postalCode},{" "}
                        {address.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Items
            </h2>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {item.product.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹
                    {(
                      Number(item.product.price) *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-xl border p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Order Summary
          </h2>

          <div className="mb-3 flex justify-between">
            <span>Subtotal</span>

            <span>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mb-3 flex justify-between">
            <span>Shipping</span>

            <span>Free</span>
          </div>

          <hr className="my-4" />

          <div className="mb-6 flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Place Order
          </Button>
        </div>
      </form>
    </Container>
  );
}