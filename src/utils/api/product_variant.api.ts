import axios from "axios";
import { getProductVariantsFromDB, getProductCapacitiesFromDB } from "./admin.variant.api";

interface ProductVariant {
  id: number;
  product_id: number;
  capacity: string;
  color: string;
  price: number;
  discount_price?: number;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
}

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  variant_capacity?: string;
  variant_color?: string;
  image_type: 'main' | 'variant';
  sort_order: number;
}

interface ProductVariantResponse {
  id: number;
  productId: number;
  capacity: string;
  color: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
}

interface ProductCapacityResponse {
  capacity: string;
}

const API_URL = "http://localhost:3000/api";



export const getProductCapacities = async (productId: number): Promise<ProductCapacityResponse[]> => {
  try {
    // Thử lấy từ database trước
    const dbResult = await getProductCapacitiesFromDB(productId);
    if (dbResult.status === 'success' && dbResult.data.length > 0) {
      return dbResult.data;
    }
  } catch {
    console.log('Database call failed, trying API...');
  }

  try {
    const response = await axios.get(`${API_URL}/product-variants/${productId}/capacities`);
    return response.data;
  } catch {
    console.log('All API calls failed, returning empty capacities');
    return [];
  }
};

export const getProductVariants = async (productId: number, capacity?: string): Promise<ProductVariantResponse[]> => {
  try {
    // Thử lấy từ database trước
    const dbResult = await getProductVariantsFromDB(productId, capacity);
    if (dbResult.status === 'success' && dbResult.data.length > 0) {
      // Convert database format to expected format
      return dbResult.data.map((variant: ProductVariant) => ({
        id: variant.id,
        productId: variant.product_id,
        capacity: variant.capacity,
        color: variant.color,
        price: variant.price,
        discountPrice: variant.discount_price,
        imageUrl: variant.image_url,
        stockQuantity: variant.stock_quantity,
        isActive: variant.is_active
      }));
    }
  } catch {
    console.log('Database call failed, trying API...');
  }

  try {
    const url = capacity 
      ? `${API_URL}/product-variants/${productId}?capacity=${capacity}`
      : `${API_URL}/product-variants/${productId}`;
    const response = await axios.get(url);
    return response.data;
  } catch {
    console.log('All API calls failed, returning empty variants');
    return [];
  }
};

// Export the productVariantApi object that OptionProduct expects
export const productVariantApi = {
  // Get capacities for a product group
  getCapacity: async (group_name: string) => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/capacities/${group_name}`);
      return response.data;
    } catch {
      console.log('API call failed for getCapacity, returning empty data');
      
      return {
        status: "error",
        message: "No capacities found",
        data: []
      };
    }
  },

  // Get variants by capacity and group name - Updated to use product_images
  getVariantByCapacity: async (capacity: string, group_name: string) => {
    try {
      // First try to get variants from database
      const response = await axios.get(`${API_URL}/product-variants/capacity/${capacity}/group/${group_name}`);
      
      // If successful, try to get corresponding images from product_images table
      if (response.data.status === 'success' && response.data.data.length > 0) {
        const variants = response.data.data;
        
        // Get product ID from first variant
        const productId = variants[0].product_id;
        
        // Try to get variant images
        try {
          const imageResponse = await axios.get(`${API_URL}/admin/product-images/product/${productId}/variant?capacity=${capacity}`);
          
          if (imageResponse.data.status === 'success') {
            // Match variants with their images
            const variantsWithImages = variants.map((variant: ProductVariant) => {
              const matchingImage = imageResponse.data.data.find((img: ProductImage) => 
                img.variant_capacity === capacity && 
                img.variant_color && variant.color &&
                img.variant_color.toLowerCase().includes(variant.color.toLowerCase())
              );
              
              return {
                ...variant,
                image_url: matchingImage ? matchingImage.image_url : variant.image_url
              };
            });
            
            return {
              ...response.data,
              data: variantsWithImages
            };
          }
        } catch {
          console.log('Could not fetch variant images, using original data');
        }
      }
      
      return response.data;
    } catch {
      console.log('API call failed for getVariantByCapacity, returning empty data');
      
      return {
        status: "error",
        message: "No variants found",
        data: []
      };
    }
  },

  // Get variant by ID
  getVariantById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/product-variants/${id}`);
      return response.data;
    } catch {
      console.log('API call failed for getVariantById, returning empty data');
      
      return {
        status: "error",
        message: "Variant not found",
        data: null
      };
    }
  }
};
