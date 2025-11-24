import axiosInstance from "../axios";
import type { VariantData, VariantResponse } from "../../types/api/VariantTypes";

export const variantApi = {
    // Create variant for a product
    create: async (productId: string | number, data: Partial<VariantData>) => {
        const response = await axiosInstance.post<VariantResponse>(
            `/products/${productId}/variants`,
            data
        );
        return response.data;
    },

    // Get all variants for a product
    getByProduct: async (productId: string | number) => {
        const response = await axiosInstance.get<VariantResponse>(
            `/products/${productId}/variants`
        );
        return response.data;
    },

    // Get single variant
    getById: async (id: string | number) => {
        const response = await axiosInstance.get<VariantResponse>(`/variants/${id}`);
        return response.data;
    },

    // Update variant
    update: async (id: string | number, data: Partial<VariantData>) => {
        const response = await axiosInstance.patch<VariantResponse>(
            `/variants/${id}`,
            data
        );
        return response.data;
    },

    // Delete variant
    delete: async (id: string | number) => {
        const response = await axiosInstance.delete<VariantResponse>(`/variants/${id}`);
        return response.data;
    },

    // Set default variant
    setDefault: async (id: string | number, productId: string | number) => {
        const response = await axiosInstance.post<VariantResponse>(
            `/variants/${id}/set-default`,
            { productId }
        );
        return response.data;
    },
};
