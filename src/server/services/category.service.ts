import { prisma } from "@/lib/db/prisma";

class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        products: {
          include: {
            brand: true,
            images: true,
          },
        },
      },
    });
  }
}

export const categoryRepository = new CategoryRepository();