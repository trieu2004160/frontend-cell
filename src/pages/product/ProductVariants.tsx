import React, { useMemo } from "react";
import { Button, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface Variant {
  id: number;
  storage?: string;
  color?: string;
  image_url?: string;
  price?: number;
  stock_quantity?: number;
  is_active?: boolean;
}

interface VariantChangeParams {
  id: number;
  variant_name: string;
  capacity: string;
  price: string;
  image_url: string;
}

interface ProductVariantsProps {
  variants?: Variant[];
  onVariantChange?: (variant: VariantChangeParams) => void;
  selectedVariant?: Variant;
  productName?: string;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  variants = [],
  onVariantChange,
  selectedVariant,
  productName = "",
}) => {
  const navigate = useNavigate();

  // Map sản phẩm theo dung lượng để redirect
  const getProductByStorage = (
    currentProductName: string,
    targetStorage: string
  ): string | null => {
    // Tạo slug cho sản phẩm mới dựa trên base name + storage
    const baseName = currentProductName
      .replace(/\s+(128GB|256GB|512GB|1TB|2TB)/gi, "")
      .trim();

    // Map cụ thể cho iPhone 15 Pro Max
    if (baseName.includes("iPhone 15 Pro Max")) {
      switch (targetStorage) {
        case "256GB":
          return "/product/12"; // iPhone 15 Pro Max 256GB
        case "512GB":
          return "/product/180";
        case "1TB":
          return "/product/181";
        default:
          return null;
      }
    }

    // Có thể thêm mapping cho các dòng khác
    return null;
  };

  // Helper function to estimate price based on storage
  const estimatePrice = (storage: string): number => {
    const basePrice = 32990000; // iPhone 15 Pro Max 256GB base price
    switch (storage) {
      case "128GB":
        return basePrice - 2000000;
      case "256GB":
        return basePrice;
      case "512GB":
        return basePrice + 4000000;
      case "1TB":
        return basePrice + 10000000;
      case "2TB":
        return basePrice + 20000000;
      default:
        return basePrice;
    }
  };

  // Process variants data
  const { storages, colors, availableStorages } = useMemo(() => {
    let finalStorages: string[] = [];
    let finalColors: string[] = [];
    const storageMap = new Map<string, Variant>();

    // Màu sắc chuẩn cho tất cả sản phẩm
    const getStandardColors = (): string[] => {
      const baseName = productName
        .replace(/\s+(128GB|256GB|512GB|1TB|2TB)/gi, "")
        .trim();

      // iPhone 15 Pro Max sử dụng màu đơn giản
      if (baseName.includes("iPhone 15 Pro Max")) {
        return ["Natural", "Blue", "White", "Black"];
      }

      // Các sản phẩm khác sử dụng màu sắc chuẩn
      return ["White", "Black", "Blue", "Pink", "Yellow"];
    };

    // Luôn hiển thị tất cả dung lượng cho iPhone 15 Pro Max
    const baseName = productName
      .replace(/\s+(128GB|256GB|512GB|1TB|2TB)/gi, "")
      .trim();
    if (baseName.includes("iPhone 15 Pro Max")) {
      finalStorages = ["256GB", "512GB", "1TB"]; // Luôn hiển thị tất cả
    } else if (variants && variants.length > 0) {
      // Các sản phẩm khác - lấy từ variants
      const uniqueStorages = [
        ...new Set(variants.map((v) => v.storage).filter(Boolean)),
      ] as string[];
      finalStorages = uniqueStorages;
    } else {
      // Fallback - chỉ hiển thị dung lượng hiện tại
      const match = productName.match(/\b(128GB|256GB|512GB|1TB|2TB)\b/i);
      finalStorages = match ? [match[1]] : ["128GB"];
    }

    if (variants && variants.length > 0) {
      const uniqueColors = [
        ...new Set(variants.map((v) => v.color).filter(Boolean)),
      ] as string[];
      finalColors = uniqueColors;

      variants.forEach((variant) => {
        if (variant.storage) {
          storageMap.set(variant.storage, variant);
        }
      });
    } else {
      finalColors = getStandardColors();
    }

    return {
      storages: finalStorages,
      colors: finalColors,
      availableStorages: storageMap,
    };
  }, [variants, productName]);

  // Handle storage selection
  const handleStorageSelect = (storage: string) => {
    // Thử redirect đến trang sản phẩm tương ứng
    const targetUrl = getProductByStorage(productName, storage);
    if (targetUrl) {
      navigate(targetUrl);
      return;
    }

    // Nếu không có trang riêng, xử lý như variant thường
    const variant = availableStorages.get(storage);

    if (variant && onVariantChange) {
      // Có variant thật trong database
      onVariantChange({
        id: variant.id,
        variant_name: `${storage} ${variant.color || ""}`.trim(),
        capacity: storage,
        price: variant.price?.toString() || "0",
        image_url: variant.image_url || "",
      });
    } else if (onVariantChange) {
      // Không có variant thật - tạo virtual variant với giá ước tính
      onVariantChange({
        id: -1, // Virtual variant
        variant_name: storage,
        capacity: storage,
        price: estimatePrice(storage).toString(),
        image_url: "",
      });
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    const variant = variants.find((v) => v.color === color);
    if (variant && onVariantChange) {
      onVariantChange({
        id: variant.id,
        variant_name: `${variant.storage || ""} ${color}`.trim(),
        capacity: variant.storage || "",
        price: variant.price?.toString() || "0",
        image_url: variant.image_url || "",
      });
    } else if (onVariantChange) {
      // Virtual color variant
      const currentStorage = selectedVariant?.storage || storages[0] || "256GB";
      onVariantChange({
        id: -2, // Virtual color variant
        variant_name: `${currentStorage} ${color}`.trim(),
        capacity: currentStorage,
        price: estimatePrice(currentStorage).toString(),
        image_url: "",
      });
    }
  };

  // Trích xuất dung lượng hiện tại từ tên sản phẩm
  const getCurrentStorage = (): string => {
    const match = productName.match(/\b(128GB|256GB|512GB|1TB|2TB)\b/i);
    return match ? match[1] : "";
  };

  const currentStorage = getCurrentStorage();

  return (
    <div className="product-variants">
      <div className="mb-6">
        {/* Storage/Capacity Options */}
        {storages.length > 0 && (
          <div className="variant-section mb-4">
            <Text strong className="block mb-2">
              Dung lượng:
            </Text>
            <Space wrap>
              {storages.map((storage) => {
                // const variant = availableStorages.get(storage);
                const isSelected =
                  selectedVariant?.storage === storage ||
                  (!selectedVariant && currentStorage === storage);

                // Tính giá hiển thị
                // const displayPrice = variant?.price || estimatePrice(storage);

                return (
                  <Button
                    key={storage}
                    type={isSelected ? "primary" : "default"}
                    onClick={() => handleStorageSelect(storage)}
                  >
                    {storage}
                    {/* <span className="ml-1">
                      ({displayPrice.toLocaleString("vi-VN")}đ)
                    </span> */}
                  </Button>
                );
              })}
            </Space>
          </div>
        )}

        {/* Color Options */}
        {colors.length > 0 && (
          <div className="variant-section mb-4">
            <Text strong className="block mb-2">
              Màu sắc:
            </Text>
            <Space wrap>
              {colors.map((color) => {
                const variant = variants.find((v) => v.color === color);
                const isSelected = selectedVariant?.color === color;

                // Tính giá hiển thị cho màu sắc dựa trên storage đã chọn
                const currentSelectedStorage =
                  selectedVariant?.storage || currentStorage || "256GB";
                const storageVariant = availableStorages.get(
                  currentSelectedStorage
                );
                const displayPrice =
                  variant?.price ||
                  storageVariant?.price ||
                  estimatePrice(currentSelectedStorage);

                return (
                  <Button
                    key={color}
                    type={isSelected ? "primary" : "default"}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                    <span className="ml-1">
                      ({displayPrice.toLocaleString("vi-VN")}đ)
                    </span>
                  </Button>
                );
              })}
            </Space>
          </div>
        )}

        {/* Selected Variant Info */}
        {selectedVariant && (
          <div className="selected-variant-info mt-2">
            <Text type="secondary">
              Đã chọn:{" "}
              {selectedVariant.storage && `${selectedVariant.storage} `}
              {selectedVariant.color && `- ${selectedVariant.color}`}
              {selectedVariant.id > 0 ? (
                selectedVariant.stock_quantity !== undefined ? (
                  <span
                    className={`ml-2 ${
                      selectedVariant.stock_quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    (
                    {selectedVariant.stock_quantity > 0
                      ? `Còn ${selectedVariant.stock_quantity} sản phẩm`
                      : "Hết hàng"}
                    )
                  </span>
                ) : null
              ) : (
                <span className="ml-2 text-orange-600">
                  (Giá ước tính - Chưa có trong kho)
                </span>
              )}
            </Text>

            {/* Hiển thị giá của variant được chọn */}
            <div className="mt-2">
              <Text strong className="text-lg text-red-600">
                Giá:{" "}
                {Number(selectedVariant.price || "0").toLocaleString("vi-VN")}đ
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariants;
