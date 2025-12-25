export interface ProductImagesProp {
  id?: number;
  product_id: number;
  image_type: 'main' | 'gallery' | 'variant';
  image_url: string | undefined;
  alt_text: string;
  sort_order: number;
  variant_capacity?: string | null;
  variant_color?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImageResponse<T> {
  status: "success" | "error";
  message: string;
  data: T[];
}
