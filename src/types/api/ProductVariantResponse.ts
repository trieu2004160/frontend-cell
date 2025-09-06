export interface ProductVariantCapacity {
  capacity: string;
}

export interface ProductVatiantProp {
  id: number;
  variant_name: string;
  capacity: string;
  price: string;
  image_url: string;
}

export interface ProductVariantResponse {
  status: string;
  message: string;
  data: ProductVatiantProp[] | ProductVatiantProp;
}

export interface ProductVariantCapacityResponse {
  status: string;
  message: string;
  data: ProductVariantCapacity[];
}
