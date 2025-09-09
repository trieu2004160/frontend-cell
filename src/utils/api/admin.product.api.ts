import axios from "axios";

interface Product {
  id: number;
  name: string;
  description?: string;
  brand_id: number;
  category_id: number;
  base_price: number;
  discount_price?: number;
  main_image?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface CreateProductRequest {
  name: string;
  description?: string;
  brand_id: number;
  category_id: number;
  base_price: number;
  discount_price?: number;
  main_image?: string;
  status: 'active' | 'inactive';
}

interface ProductImage {
  id: number;
  product_id: number;
  image_type: 'main' | 'gallery' | 'variant';
  image_url: string;
  alt_text: string;
  sort_order: number;
  variant_capacity?: string;
  variant_color?: string;
  is_active: boolean;
}

const API_URL = "http://localhost:3000/api";

export const adminProductApi = {
  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (data: CreateProductRequest) => {
    try {
      const response = await axios.post(`${API_URL}/products`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: number, data: Partial<Product>) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Lấy brands
  getBrands: async () => {
    try {
      const response = await axios.get(`${API_URL}/brand`);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // Lấy categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export const adminProductImageApi = {
  // Lấy tất cả ảnh sản phẩm
  getAllImages: async (productId?: number, imageType?: string) => {
    try {
      let url = `${API_URL}/admin/product-images`;
      const params = new URLSearchParams();
      
      if (productId) params.append('productId', productId.toString());
      if (imageType) params.append('imageType', imageType);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching product images:', error);
      throw error;
    }
  },

  // Tạo ảnh sản phẩm mới
  createImage: async (data: Omit<ProductImage, 'id'>) => {
    try {
      const response = await axios.post(`${API_URL}/admin/product-images`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating product image:', error);
      throw error;
    }
  },

  // Cập nhật ảnh sản phẩm
  updateImage: async (id: number, data: Partial<Omit<ProductImage, 'id'>>) => {
    try {
      const response = await axios.put(`${API_URL}/admin/product-images/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product image:', error);
      throw error;
    }
  },

  // Xóa ảnh sản phẩm
  deleteImage: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/product-images/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  },

  // Lấy ảnh theo variant
  getVariantImages: async (productId: number, capacity?: string, color?: string) => {
    try {
      let url = `${API_URL}/admin/product-images/product/${productId}/variant`;
      const params = new URLSearchParams();
      
      if (capacity) params.append('capacity', capacity);
      if (color) params.append('color', color);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching variant images:', error);
      throw error;
    }
  },

  // Cập nhật thứ tự ảnh
  reorderImages: async (imageOrders: Array<{id: number, sortOrder: number}>) => {
    try {
      const response = await axios.patch(`${API_URL}/admin/product-images/reorder`, {
        imageOrders
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error;
    }
  }
};
