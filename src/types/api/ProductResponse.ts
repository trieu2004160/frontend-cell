export interface ProductProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  brand_id: string;
  short_description: string;
  description?: string; // Backend returns 'description' field
  full_description: string;
  price?: string; // For backward compatibility
  original_price: string; // Match API response
  sale_price: string;
  cost_price: string;
  weight: string;
  dimensions: string;
  warranty_period: number;
  stock_quantity?: number; // Add stock_quantity field
  is_featured: boolean;
  status: "active" | "inactive";
  rating_average: string;
  rating_count: number;
  meta_title: string;
  meta_description: string;
  image_url?: string; // Thêm field cho URL hình ảnh
  product_image?: string[] | null; // Add product_image field
  images?: Array<{ id: number; image_url: string; alt_text?: string; is_primary: boolean }>; // Add images field from API response
  variants?: Array<{ id: number; storage?: string; color?: string; image_url?: string; price?: string; stock_quantity?: number; is_active?: boolean }>; // Add variants field
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
}

export interface SingleProductResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}
