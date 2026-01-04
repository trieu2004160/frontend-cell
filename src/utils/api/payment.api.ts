import axiosInstance from "../axios";
import { API_URL } from "../../constants/API_URL";

export interface PaymentRequest {
  amount: number;
  description: string;
  orderCode: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  cancelUrl?: string;
  returnUrl?: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
  data: {
    checkoutUrl: string;
    qrCode: string;
    paymentLinkId: string;
    orderCode: number;
  };
}

export const paymentApi = {
  // Tạo payment link
  createPayment: async (data: PaymentRequest) => {
    const response = await axiosInstance.post<PaymentResponse>(
      `/payments/create`,
      data
    );
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  getPaymentStatus: async (orderCode: string | number) => {
    const response = await axiosInstance.get(
      `/payments/${orderCode}`
    );
    return response.data;
  },

  // Hủy thanh toán
  cancelPayment: async (orderCode: string | number, reason?: string) => {
    const response = await axiosInstance.post(
      `/payments/${orderCode}/cancel`,
      { cancellationReason: reason }
    );
    return response.data;
  },
};
