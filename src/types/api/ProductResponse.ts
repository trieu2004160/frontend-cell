export interface ProductProps {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  brand_id: string;
  short_description: string;
  full_description: string;
  price?: string; // For backward compatibility
  original_price: string; // Match API response
  sale_price: string;
  cost_price: string;
  weight: string;
  dimensions: string;
  warranty_period: number;
  is_featured: boolean;
  status: "active" | "inactive";
  rating_average: string;
  rating_count: number;
  meta_title: string;
  meta_description: string;
  image_url?: string; // Thêm field cho URL hình ảnh
  createdAt: string;
  updatedAt: string;
  category_name: string;
  brand_name: string;
  product_image: string[] | null;
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
