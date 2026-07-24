import { productRepository } from "@/server/repositories/product.repository";

export interface GetProductsParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

class ProductService {
  async getProducts(params: GetProductsParams) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.max(Number(params.limit) || 12, 1);

    return productRepository.findMany({
      search: params.search,
      category: params.category,
      brand: params.brand,
      minPrice: params.minPrice
        ? Number(params.minPrice)
        : undefined,
      maxPrice: params.maxPrice
        ? Number(params.maxPrice)
        : undefined,
      sort: params.sort,
      page,
      limit,
    });
  }

  async getFeaturedProducts(limit = 8) {
    return productRepository.getFeatured(limit);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new Error("Product not found");
    }

    const relatedProducts = await productRepository.getRelated(
      product.id,
      product.categoryId
    );

    return {
      product,
      relatedProducts,
    };
  }
}

export const productService = new ProductService();
