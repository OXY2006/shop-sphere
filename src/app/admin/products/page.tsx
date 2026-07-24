import { redirect } from "next/navigation";

import Container from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container className="py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Products
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b"
            >
              <td className="p-3">
                {product.name}
              </td>

              <td className="p-3">
                {product.category.name}
              </td>

              <td className="p-3">
                {product.brand?.name ?? "-"}
              </td>

              <td className="p-3">
                ₹{Number(product.price)}
              </td>

              <td className="p-3">
                {product.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}