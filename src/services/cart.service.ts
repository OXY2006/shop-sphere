class CartService {
  async getCart() {
    const response = await fetch("/api/cart", {
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch cart");
    }

    return data;
  }

  async addToCart(
    productId: string,
    quantity = 1
  ) {
    const response = await fetch("/api/cart", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item");
    }

    return data;
  }

  async updateQuantity(
    itemId: string,
    quantity: number
  ) {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update cart");
    }

    return data;
  }

  async removeItem(itemId: string) {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove item");
    }

    return data;
  }
}

export const cartService = new CartService();