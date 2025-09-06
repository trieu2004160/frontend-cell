import { API_URL } from "../../constants/API_URL";
import type {
  ProductProps,
  ProductResponse,
  SingleProductResponse,
  ProductSelect,
} from "../../types/api/ProductResponse";
import axiosInstance from "../axios";

export const productApi = {
  getAll: async (params?: { all?: boolean; page?: number; limit?: number; search?: string; category_id?: string; brand_id?: string }) => {
    const response = await axiosInstance.get<ProductResponse<ProductProps>>(
      API_URL.PRODUCT,
      { params }
    );
    return response.data;
  },
  getById: async (id: string | number) => {
    const response = await axiosInstance.get<SingleProductResponse<ProductProps>>(
      `${API_URL.PRODUCT}/${id}`
    );
    return response.data;
  },
  create: async (payload: ProductProps) => {
    const response = await axiosInstance.post<ProductResponse<ProductProps>>(
      API_URL.PRODUCT,
      payload
    );
    return response.data;
  },
  getAllName: async () => {
    const repsonse = await axiosInstance.get<ProductResponse<ProductSelect>>(
      API_URL.OTHER_PRODUCT.GET_ALL_NAME
    );
    return repsonse.data;
  },
};
