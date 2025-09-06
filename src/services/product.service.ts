// Response types
interface BaseResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

interface GetAllResponse<T> {
  status: "success" | "error";
  message: string;
  data: T[];
  total?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number; // sale_price từ backend
  original_price?: number;
  short_description?: string;
  description?: string;
  features?: string;
  specifications?: string;
  technical_specs?: string;
  package_contents?: string;
  stock_quantity: number;
  weight?: number;
  warranty_period?: number;
  warranty_type?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  category_id: number;
  brand_id: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
  brand_name?: string;
  image_url?: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  all?: boolean;
}

export const productApi = {
  // Lấy danh sách sản phẩm
  getProducts: async (params?: ProductListParams): Promise<GetAllResponse<Product>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category_id) searchParams.append('category_id', params.category_id.toString());
    if (params?.brand_id) searchParams.append('brand_id', params.brand_id.toString());
    if (params?.all) searchParams.append('all', params.all.toString());

    const response = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Lấy chi tiết sản phẩm theo ID  
  getProductById: async (id: number | string): Promise<BaseResponse<Product>> => {
    // Tạm thời sử dụng getAllProducts và filter theo ID
    const response = await fetch(`${API_BASE_URL}/products?all=true`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Sản phẩm không tồn tại');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allProductsResponse: GetAllResponse<Product> = await response.json();
    
    if (allProductsResponse.status === 'success') {
      const product = allProductsResponse.data.find((p: Product) => p.id.toString() === id.toString());
      
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }
      
      return {
        status: 'success',
        message: 'Get product successfully!',
        data: product
      };
    } else {
      throw new Error('Không thể tải danh sách sản phẩm');
    }
  },

  // Lấy danh sách tên sản phẩm (cho dropdown, autocomplete)
  getProductNames: async (): Promise<BaseResponse<Array<{ value: number; label: string }>>> => {
    const response = await fetch(`${API_BASE_URL}/products/name`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};
