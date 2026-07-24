import { prisma } from "@/lib/db/prisma";

class WishlistRepository {
  async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async exists(userId: string, productId: string) {
    return prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async add(userId: string, productId: string) {
    return prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async remove(userId: string, productId: string) {
    return prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}

export const wishlistRepository = new WishlistRepository();