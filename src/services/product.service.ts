export interface ProductQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

class ProductService {
  async getProducts(query: ProductQuery = {}) {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await fetch(`/api/products?${params.toString()}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch products");
    }

    return result.data;
  }

  async getFeaturedProducts(limit = 8) {
    const response = await fetch(
      `/api/products?sort=newest&limit=${limit}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch featured products");
    }

    return result.data.products;
  }

  async getProduct(slug: string) {
    const response = await fetch(`/api/products/${slug}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch product");
    }

    return result.data;
  }
}

export const productService = new ProductService();