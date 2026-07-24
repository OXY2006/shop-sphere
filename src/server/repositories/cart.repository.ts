import { prisma } from "@/lib/db/prisma";

class CartRepository {
  async getCart(userId: string) {
    return prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                brand: true,
              },
            },
          },
        },
      },
    });
  }

  async createCart(userId: string) {
    return prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  async addItem(
    cartId: string,
    productId: string,
    quantity: number
  ) {
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }
}

export const cartRepository = new CartRepository();