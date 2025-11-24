export interface ProductProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: number | string; // Accept both for flexibility
  brand_id: number | string; // Accept both for flexibility
  short_description: string;
  description: string;
  original_price: string | number;
  sale_price: string | number;
  price?: string | number;
  cost_price: string | number;
  weight: string | number;
  dimensions: string;
  warranty_period: number;
  stock_quantity?: number;
  is_featured: boolean;
  status: "active" | "inactive";
  rating_average: string | number;
  rating_count: number;
  meta_title: string;
  meta_description: string;
  image_url?: string;
  product_image?: string[] | null;
  images?: Array<{ id: number; image_url: string; alt_text?: string; is_primary: boolean }>;
  variants?: Array<{ id: number; storage?: string; color?: string; image_url?: string; price?: string; stock_quantity?: number; is_active?: boolean }>;
  createdAt: string;
  updatedAt: string;
  category_name: string;
  brand_name: string;
}

export interface ProductSelect {
  value: number;
  label: string;
}

export interface ProductResponse<T> {
  status: "success" | "error";
  message: string;
  data: T[];
  total?: number;
}

export interface SingleProductResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}
