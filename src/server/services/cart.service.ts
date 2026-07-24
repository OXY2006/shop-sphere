import { cartRepository } from "@/server/repositories/cart.repository";

class CartService {
  async getCart(userId: string) {
    let cart = await cartRepository.getCart(userId);

    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }

    return cartRepository.getCart(userId);
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity = 1
  ) {
    let cart = await cartRepository.getCart(userId);

    if (!cart) {
      cart = await cartRepository.createCart(userId);
    }

    await cartRepository.addItem(
      cart.id,
      productId,
      quantity
    );

    return this.getCart(userId);
  }
}

export const cartService = new CartService();