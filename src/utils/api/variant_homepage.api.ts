import axios from "axios";

const API_URL = "http://localhost:3000/api";

export interface VariantForHomepage {
  variant_id: number;
  product_id: number;
  product_name: string;
  slug: string;
  storage: string;
  color: string;
  display_name: string; // "iPhone 15 Pro 256GB"
  price: number;
  original_price: number;
  sale_price: number;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  rating_average?: number;
  rating_count?: number;
  brand_id?: number;
  category_id?: number;
}

export interface VariantDetail extends VariantForHomepage {
  description?: string;
  short_description?: string;
  all_variants: Array<{
    variant_id: number;
    storage: string;
    color: string;
    price: number;
    original_price: number;
    image_url: string;
    stock_quantity: number;
    is_active: boolean;
  }>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  total?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

/**
 * API service để lấy variants cho homepage
 */
export const variantHomepageApi = {
  /**
   * Lấy tất cả variants cho homepage
   * @param category_id - Filter theo category
   * @param brand_id - Filter theo brand  
   * @param limit - Số lượng items per page
   * @param page - Trang hiện tại
   */
  getForHomepage: async (params?: {
    category_id?: string | number;
    brand_id?: string | number;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<VariantForHomepage[]>> => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/homepage`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching variants for homepage:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết 1 variant kèm theo tất cả variants của cùng product
   * @param id - Variant ID
   */
  getDetailById: async (id: string | number): Promise<ApiResponse<VariantDetail>> => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching variant detail:", error);
      throw error;
    }
  },
};
