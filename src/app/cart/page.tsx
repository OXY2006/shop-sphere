import Link from "next/link";
import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { cartService } from "@/server/services/cart.service";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const cart = await cartService.getCart(user.id);

  const subtotal =
    cart?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) ?? 0;

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Shopping Cart
      </h1>

      {!cart || cart.items.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Your cart is empty
          </h2>

          <p className="mt-2 text-muted-foreground">
            Browse products and add items to your cart.
          </p>

          <Link href="/products">
            <Button className="mt-6">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border p-4"
              >
                <img
                  src={
                    item.product.images[0]?.imageUrl ??
                    "https://placehold.co/120x120"
                  }
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.product.name}
                  </h2>

                  <p className="text-muted-foreground">
                    ₹
                    {item.product.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-bold">
                  ₹
                  {(
                    item.product.price * item.quantity
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
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

            <div className="mb-6 flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Button className="w-full">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}