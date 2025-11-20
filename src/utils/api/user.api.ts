import axiosInstance from "../axios";
import { API_URL } from "../../constants/API_URL";
import type { UserProps } from "../../types/api/UserResponse";

interface UserResponse {
  status: string;
  message: string;
  data: UserProps;
}

export const userApi = {
  // Lấy thông tin user hiện tại (từ token)
  getById: async (): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>(`${API_URL.USER}/me`);
    return response.data;
  },
  
  // Cập nhật thông tin user
  update: async (id: number, payload: Partial<UserProps>): Promise<UserResponse> => {
    const response = await axiosInstance.put<UserResponse>(`${API_URL.USER}/${id}`, payload);
    return response.data;
  },
};