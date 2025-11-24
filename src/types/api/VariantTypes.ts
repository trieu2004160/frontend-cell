export interface VariantData {
    id?: number;
    product_id: number;
    sku?: string;
    storage?: string;
    color?: string;
    original_price: number;
    sale_price?: number;
    cost_price?: number;
    stock_quantity: number;
    is_default?: boolean;
    is_active?: boolean;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface VariantResponse {
    status: string;
    message: string;
    data: VariantData | VariantData[];
}
