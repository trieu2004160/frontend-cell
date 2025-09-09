import axios from "axios";

interface ProductVariant {
  id: number;
  product_id: number;
  product_name?: string;
  capacity: string;
  color: string;
  price: number;
  discount_price?: number;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CreateVariantRequest {
  product_id: number;
  capacity: string;
  color: string;
  price: number;
  discount_price?: number;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
}

const API_URL = "http://localhost:3000/api";

export const adminVariantApi = {
  // Lấy tất cả variants
  getAllVariants: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/variants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all variants:', error);
      throw error;
    }
  },

  // Tạo variant mới
  createVariant: async (data: CreateVariantRequest) => {
    try {
      const response = await axios.post(`${API_URL}/admin/variants`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating variant:', error);
      throw error;
    }
  },

  // Cập nhật variant
  updateVariant: async (id: number, data: Partial<CreateVariantRequest>) => {
    try {
      const response = await axios.put(`${API_URL}/admin/variants/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating variant:', error);
      throw error;
    }
  },

  // Xóa variant
  deleteVariant: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/variants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting variant:', error);
      throw error;
    }
  },

  // Upload ảnh
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Xóa ảnh
  deleteImage: async (filename: string) => {
    try {
      const response = await axios.delete(`${API_URL}/upload/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

// Cập nhật API hiện tại để ưu tiên dữ liệu từ database
export const getProductVariantsFromDB = async (productId: number, capacity?: string) => {
  try {
    const url = `${API_URL}/admin/variants/product/${productId}`;
    if (capacity) {
      // Lọc theo capacity ở frontend vì API trả về tất cả
      const response = await axios.get(url);
      const filteredData = response.data.data.filter((variant: ProductVariant) => 
        variant.capacity === capacity
      );
      return {
        ...response.data,
        data: filteredData
      };
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching variants from DB:', error);
    throw error;
  }
};

export const getProductCapacitiesFromDB = async (productId: number) => {
  try {
    const response = await axios.get(`${API_URL}/admin/variants/product/${productId}/capacities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching capacities from DB:', error);
    throw error;
  }
};
