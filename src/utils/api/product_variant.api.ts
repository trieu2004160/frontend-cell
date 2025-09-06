import axios from "axios";
import type { 
  ProductVariantResponse, 
  ProductVariantCapacityResponse 
} from "../../types/api/ProductVariantResponse";

const API_URL = "http://localhost:3000/api";

export const productVariantApi = {
  // Lấy danh sách capacity cho một group_name
  getCapacity: async (group_name: string): Promise<ProductVariantCapacityResponse> => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/capacity/${group_name}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching capacity:", error);
      throw error;
    }
  },

  // Lấy danh sách variant theo capacity và group_name
  getVariantByCapacity: async (capacity: string, group_name: string): Promise<ProductVariantResponse> => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/capacity/${capacity}/group/${group_name}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching variants by capacity:", error);
      throw error;
    }
  },

  // Lấy variant theo ID
  getVariantById: async (id: number): Promise<ProductVariantResponse> => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching variant by ID:", error);
      throw error;
    }
  }
};
