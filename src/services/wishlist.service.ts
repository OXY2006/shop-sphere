class WishlistService {
  async getWishlist() {
    const res = await fetch("/api/wishlist");

    return res.json();
  }

  async toggle(productId: string) {
    const res = await fetch(`/api/wishlist/${productId}`, {
      method: "POST",
    });

    return res.json();
  }
}

export const wishlistService = new WishlistService();