import { prisma } from "@/lib/db/prisma";

class OrderRepository {
  async createOrder(
    userId: string,
    addressId: string
  ) {
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.product.price) * item.quantity,
      0
    );

    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
    });
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getOrderById(
    orderId: string,
    userId: string
  ) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        address: true,
        payment: true,
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
}

export const orderRepository = new OrderRepository();