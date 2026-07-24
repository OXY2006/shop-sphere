import { prisma } from "@/lib/db/prisma";

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export class ProductRepository {
  async findMany({
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 12,
  }: ProductFilters) {
    const where = {
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

      ...(category && {
        category: {
          slug: category,
        },
      }),

      ...(brand && {
        brand: {
          slug: brand,
        },
      }),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const orderBy = (() => {
      switch (sort) {
        case "price-asc":
          return { price: "asc" as const };

        case "price-desc":
          return { price: "desc" as const };

        case "name-asc":
          return { name: "asc" as const };

        case "name-desc":
          return { name: "desc" as const };

        default:
          return { createdAt: "desc" as const };
      }
    })();

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          images: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        brand: true,
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getFeatured(limit = 8) {
    return prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  async getRelated(productId: string, categoryId: string) {
    return prisma.product.findMany({
      where: {
        categoryId,
        NOT: {
          id: productId,
        },
      },
      include: {
        images: true,
        brand: true,
      },
      take: 4,
    });
  }
}

export const productRepository = new ProductRepository();