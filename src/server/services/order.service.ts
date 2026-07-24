import { orderRepository } from "@/server/repositories/order.repository";

class OrderService {
  async placeOrder(
    userId: string,
    addressId: string
  ) {
    return orderRepository.createOrder(
      userId,
      addressId
    );
  }

  async getOrders(userId: string) {
    return orderRepository.getOrders(userId);
  }

  async getOrder(
    orderId: string,
    userId: string
  ) {
    const order = await orderRepository.getOrderById(
      orderId,
      userId
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }
}

export const orderService = new OrderService();