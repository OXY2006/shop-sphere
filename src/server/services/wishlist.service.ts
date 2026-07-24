import { wishlistRepository } from "@/server/repositories/wishlist.repository";

class WishlistService {
  getWishlist(userId: string) {
    return wishlistRepository.getWishlist(userId);
  }

  async toggle(userId: string, productId: string) {
    const exists = await wishlistRepository.exists(
      userId,
      productId
    );

    if (exists) {
      await wishlistRepository.remove(userId, productId);

      return {
        wishlisted: false,
      };
    }

    await wishlistRepository.add(userId, productId);

    return {
      wishlisted: true,
    };
  }
}

export const wishlistService = new WishlistService();