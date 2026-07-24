import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { categories } from "./seed-data/categories";
import { brands } from "./seed-data/brands";
import { products } from "./seed-data/products";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  // Delete existing data
  await prisma.productImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.notification.deleteMany();

  await prisma.product.deleteMany();

  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Brands
  for (const brand of brands) {
    await prisma.brand.create({
      data: brand,
    });
  }

  // Products
  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: {
        slug: product.category,
      },
    });

    const brand = await prisma.brand.findUnique({
      where: {
        slug: product.brand,
      },
    });

    if (!category || !brand) continue;

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: category.id,
        brandId: brand.id,
      },
    });

    await prisma.productImage.createMany({
      data: product.images.map((imageUrl) => ({
        imageUrl,
        productId: createdProduct.id,
      })),
    });
  }

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });