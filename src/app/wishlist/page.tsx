import Link from "next/link";
import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import ProductGrid from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { wishlistService } from "@/server/services/wishlist.service";

export default async function WishlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const wishlist = await wishlistService.getWishlist(user.id);

  if (wishlist.length === 0) {
    return (
      <Container className="py-10">
        <div className="rounded-xl border p-10 text-center">
          <h1 className="text-3xl font-bold">
            Your Wishlist is Empty
          </h1>

          <p className="mt-3 text-muted-foreground">
            Save products you love for later.
          </p>

          <Link href="/products">
            <Button className="mt-6">
              Browse Products
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const products = wishlist.map((item) => item.product);

  return (
    <Container className="py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          My Wishlist
        </h1>

        <p className="text-muted-foreground">
          {products.length} saved products
        </p>
      </div>

      <ProductGrid products={products} />
    </Container>
  );
}