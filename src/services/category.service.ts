class CategoryService {
  async getCategories() {
    const response = await fetch("/api/categories");

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch categories");
    }

    return result.data;
  }

  async getCategory(slug: string) {
    const categories = await this.getCategories();

    return categories.find(
      (category: { slug: string }) => category.slug === slug
    );
  }
}

export const categoryService = new CategoryService();