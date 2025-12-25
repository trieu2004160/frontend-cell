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

  // State để track storage đã chọn
  const [selectedStorage, setSelectedStorage] = React.useState<string>("");

  // Initialize selectedStorage khi component mount hoặc variants thay đổi
  React.useEffect(() => {
    if (!selectedStorage && variants && variants.length > 0) {
      // Lấy storage từ tên sản phẩm hoặc storage đầu tiên
      const match = productName.match(/\b(128GB|256GB|512GB|1TB|2TB)\b/i);
      const initialStorage = match ? match[1] : variants[0]?.storage || "";
      setSelectedStorage(initialStorage);
    }
  }, [variants, productName, selectedStorage]);

  // ============ DEBUG LOGGING ============
  console.log("========================================");
  console.log("🔍 ProductVariants Component Loaded");
  console.log("Total variants:", variants?.length);
  console.log("Selected Storage:", selectedStorage);
  console.log("Variant details:");
  variants?.forEach((v, index) => {
    console.log(`  Variant ${index + 1}:`, {
      id: v.id,
      storage: v.storage,
      color: v.color,
      price: v.price,
      image_url: v.image_url,
      stock: v.stock_quantity,
    });
  });
  console.log("========================================");
  // =======================================

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

  // Helper function to estimate price based on storage (for virtual variants only)
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
      // Lấy từ variants và normalize (case-insensitive unique)
      const storageSet = new Set<string>();
      variants.forEach((v) => {
        if (v.storage) {
          // Normalize: chuyển thành "128GB" format chuẩn
          const normalized = v.storage.toUpperCase().replace(/\s+/g, "");
          storageSet.add(normalized);
        }
      });
      finalStorages = Array.from(storageSet).sort();
    } else {
      // Fallback - chỉ hiển thị dung lượng hiện tại
      const match = productName.match(/\b(128GB|256GB|512GB|1TB|2TB)\b/i);
      finalStorages = match ? [match[1].toUpperCase()] : ["128GB"];
    }

    if (variants && variants.length > 0) {
      // Nếu đã chọn storage, chỉ lấy màu của storage đó
      // Nếu chưa chọn, lấy màu của storage đầu tiên
      const storageToFilter = selectedStorage || finalStorages[0] || "";

      if (storageToFilter) {
        const normalizeStr = (s: string) => s.toLowerCase().replace(/\s+/g, "");
        const filteredVariants = variants.filter(
          (v) => normalizeStr(v.storage || "") === normalizeStr(storageToFilter)
        );

        const uniqueColors = [
          ...new Set(filteredVariants.map((v) => v.color).filter(Boolean)),
        ] as string[];
        finalColors = uniqueColors;
      } else {
        // Fallback: lấy tất cả màu nếu không có storage
        const uniqueColors = [
          ...new Set(variants.map((v) => v.color).filter(Boolean)),
        ] as string[];
        finalColors = uniqueColors;
      }

      variants.forEach((variant) => {
        if (variant.storage) {
          // Normalize storage key để map đúng
          const normalizedStorage = variant.storage
            .toUpperCase()
            .replace(/\s+/g, "");
          storageMap.set(normalizedStorage, variant);
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
  }, [variants, productName, selectedStorage]); // Thêm selectedStorage vào dependencies

  // Handle storage selection
  const handleStorageSelect = (storage: string) => {
    // Set selected storage để filter màu
    setSelectedStorage(storage);

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
        image_url: "", // No image for virtual variants
      });
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    // Normalize function
    const normalizeStr = (s: string) => s.toLowerCase().replace(/\s+/g, "");

    // Lấy storage hiện tại
    const currentStorage =
      selectedStorage || selectedVariant?.storage || storages[0] || "";

    // Tìm variant theo storage + color
    const variant = variants.find(
      (v) =>
        normalizeStr(v.storage || "") === normalizeStr(currentStorage) &&
        normalizeStr(v.color || "") === normalizeStr(color)
    );

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
        image_url: "", // No image for virtual variants
      });
    }
  };

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
                // Normalize để so sánh
                const normalizeStr = (s: string) =>
                  s.toLowerCase().replace(/\s+/g, "");

                // Highlight button nếu storage này đang được chọn
                const isSelected =
                  normalizeStr(selectedStorage) === normalizeStr(storage);

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {colors.map((color) => {
                // Normalize để so sánh (lowercase, remove spaces)
                const normalizeStr = (s: string) =>
                  s.toLowerCase().replace(/\s+/g, "");

                // Lấy storage hiện tại: ưu tiên selectedStorage, sau đó selectedVariant.storage, cuối cùng storage đầu tiên
                const currentStorage =
                  selectedStorage ||
                  selectedVariant?.storage ||
                  storages[0] ||
                  "";

                // Tìm variant chính xác theo storage đã chọn + color
                const variant = variants.find(
                  (v) =>
                    normalizeStr(v.storage || "") ===
                      normalizeStr(currentStorage) &&
                    normalizeStr(v.color || "") === normalizeStr(color)
                );

                const isSelected = selectedVariant?.color === color;

                // SỬ DỤNG DỮ LIỆU THẬT TỪ VARIANT
                const displayPrice = variant?.price || 0;
                const imageUrl = variant?.image_url || "/images/placeholder.jpg";

                console.log(`🎨 Render Color "${color}":`, {
                  currentStorage,
                  selectedStorage,
                  variantFound: !!variant,
                  variantId: variant?.id,
                  variantStorage: variant?.storage,
                  variantColor: variant?.color,
                  displayPrice,
                  rawPrice: variant?.price,
                });

                return (
                  <div
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`cursor-pointer border-2 rounded-lg p-3 transition-all hover:shadow-md ${
                      isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Color Image */}
                    <div className="w-full aspect-square rounded overflow-hidden bg-white mb-2 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={color}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error(
                            `Failed to load image for ${color}:`,
                            imageUrl
                          );
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                    {/* Color Name */}
                    <div className="text-center">
                      <div className="font-medium text-sm mb-1">{color}</div>
                      <div className="text-red-600 font-semibold text-xs">
                        {displayPrice > 0
                          ? displayPrice.toLocaleString("vi-VN") + "đ"
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
