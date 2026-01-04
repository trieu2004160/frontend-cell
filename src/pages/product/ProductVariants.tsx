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
  original_price?: number;
  stock_quantity?: number;
  is_active?: boolean;
}

interface VariantChangeParams {
  id: number;
  variant_name: string;
  capacity: string;
  price: string;
  original_price?: string;
  image_url: string;
}

interface ProductVariantsProps {
  variants?: Variant[];
  onVariantChange?: (variant: VariantChangeParams) => void;
  selectedVariant?: Variant;
  productName?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  variants = [],
  onVariantChange,
  selectedVariant,
  productName = "",
  onAddToCart,
  onBuyNow,
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

  // Trích xuất dung lượng hiện tại từ tên sản phẩm
  const getCurrentStorage = (): string => {
    const match = productName.match(/\b(128GB|256GB|512GB|1TB|2TB)\b/i);
    return match ? match[1] : "";
  };

  // Process variants data
  const { storages, colors, availableStorages, currentStorage } =
    useMemo(() => {
      let finalStorages: string[] = [];
      let finalColors: string[] = [];
      const storageMap = new Map<string, Variant>();

      // Tính currentStorage BÊN TRONG useMemo để đảm bảo reactive
      const currentStorageValue =
        selectedVariant?.storage || getCurrentStorage();

      console.log("🔄 ProductVariants useMemo recalculating...");
      console.log("All variants:", variants);
      console.log("selectedVariant:", selectedVariant);
      console.log("productName:", productName);
      console.log("currentStorage from memo:", currentStorageValue);

      // CHỈ hiển thị khi có variants thực tế
      if (variants && variants.length > 0) {
        // Normalize và lấy unique storage values (case-insensitive)
        const storageSet = new Set<string>();
        variants.forEach((v) => {
          if (v.storage) {
            // Tìm storage đã có trong set với case-insensitive
            const existing = Array.from(storageSet).find(
              (s) => s.toLowerCase() === v.storage?.toLowerCase()
            );
            if (!existing) {
              storageSet.add(v.storage);
            }
          }
        });
        finalStorages = Array.from(storageSet);

        console.log("✅ Final storages:", finalStorages);

        // Lấy colors từ variants - CHỈ LẤY COLORS CÓ TRONG STORAGE HIỆN TẠI
        let uniqueColors: string[] = [];
        if (currentStorageValue) {
          // Filter variants theo storage hiện tại - CASE INSENSITIVE
          const variantsForCurrentStorage = variants.filter(
            (v) =>
              v.storage?.toLowerCase() === currentStorageValue.toLowerCase()
          );
          console.log(
            "🎨 Variants for current storage:",
            variantsForCurrentStorage
          );

          uniqueColors = [
            ...new Set(
              variantsForCurrentStorage.map((v) => v.color).filter(Boolean)
            ),
          ] as string[];
          console.log("✅ Colors for current storage:", uniqueColors);
        } else {
          // Nếu thực sự không có storage (edge case), hiển thị colors của storage đầu tiên
          console.warn("⚠️ No storage found, using first storage variants");
          if (finalStorages.length > 0) {
            const firstStorage = finalStorages[0];
            const variantsForFirstStorage = variants.filter(
              (v) => v.storage?.toLowerCase() === firstStorage.toLowerCase()
            );
            uniqueColors = [
              ...new Set(
                variantsForFirstStorage.map((v) => v.color).filter(Boolean)
              ),
            ] as string[];
          }
        }
        finalColors = uniqueColors;

        // Map variants theo storage
        variants.forEach((variant) => {
          if (variant.storage) {
            storageMap.set(variant.storage, variant);
          }
        });
      }
      // Nếu không có variants: không hiển thị gì (rỗng)

      console.log("🎯 Final result:", {
        storages: finalStorages,
        colors: finalColors,
        currentStorage: currentStorageValue,
      });

      return {
        storages: finalStorages,
        colors: finalColors,
        availableStorages: storageMap,
        currentStorage: currentStorageValue,
      };
    }, [variants, productName, selectedVariant?.storage]);

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
        original_price: (variant as any).original_price?.toString(),
        image_url: variant.image_url || "/images/placeholder.jpg",
      });
    } else if (onVariantChange) {
      // Không có variant thật - không làm gì
      console.warn(`No variant found for storage: ${storage}`);
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    // Get current storage để tìm đúng variant
    const currentSelectedStorage = currentStorage || "256GB";

    console.log("🎨 handleColorSelect called:", {
      color,
      currentSelectedStorage,
      allVariants: variants,
    });

    // Tìm variant có cả storage VÀ color khớp - CASE INSENSITIVE
    const variant = variants.find(
      (v) =>
        v.color?.toLowerCase() === color.toLowerCase() &&
        v.storage?.toLowerCase() === currentSelectedStorage.toLowerCase()
    );

    console.log("✅ Found variant:", variant);

    if (variant && onVariantChange) {
      onVariantChange({
        id: variant.id,
        variant_name: `${variant.storage || ""} ${color}`.trim(),
        capacity: variant.storage || "",
        price: variant.price?.toString() || "0",
        original_price: (variant as any).original_price?.toString(),
        image_url: variant.image_url || "/images/placeholder.jpg",
      });
    } else {
      // Không có variant - log chi tiết để debug
      console.warn(
        `❌ No variant found for storage: ${currentSelectedStorage}, color: ${color}`
      );
      console.warn(
        "Available variants:",
        variants.map((v) => ({
          storage: v.storage,
          color: v.color,
          image_url: v.image_url,
        }))
      );
    }
  };

  return (
    <>
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
              // Get current storage to find correct variant
              const currentSelectedStorage = currentStorage || "256GB";

              // Find variant with matching storage AND color - CASE INSENSITIVE
              const variant = variants.find(
                (v) =>
                  v.color?.toLowerCase() === color.toLowerCase() &&
                  v.storage?.toLowerCase() ===
                  currentSelectedStorage.toLowerCase()
              );

              const isSelected = selectedVariant?.color === color;

              // Tính giá hiển thị cho màu sắc dựa trên variant tìm được
              const displayPrice =
                variant?.price || estimatePrice(currentSelectedStorage);

              return (
                <Button
                  key={color}
                  type="default"
                  onClick={() => handleColorSelect(color)}
                  className="flex items-center gap-2 h-auto p-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "48px",
                    border: isSelected
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  }}
                >
                  {/* Color Image */}
                  <div className="w-8 h-8 rounded overflow-hidden ">
                    <img
                      src={variant?.image_url || "/images/placeholder.jpg"}
                      alt={color}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                  {/* Color Text and Price */}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{color}</span>
                    <span className="text-sm text-gray-600">
                      {displayPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </Button>
              );
            })}
          </Space>
        </div>
      )}

      {/* Promotional Gifts Section */}
      <div className="mt-6 mb-4">
        <div className="p-4 bg-red-50 rounded-lg">
          {/* Title Row */}
          <div className="flex items-start gap-3 mb-2">
            {/* Gift Icon */}
            <div className="flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-600"
              >
                <defs>
                  <linearGradient
                    id="paint0_linear_gift"
                    x1="15"
                    y1="5"
                    x2="15"
                    y2="25.8875"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF6B6B" />
                    <stop offset="1" stopColor="#DC143C" />
                  </linearGradient>
                  <clipPath id="clip0_gift">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
                <g clipPath="url(#clip0_gift)">
                  <path
                    d="M22.4999 5C22.6881 5 22.8738 5.0425 23.0433 5.12431C23.2128 5.20612 23.3616 5.32515 23.4786 5.4725L23.5711 5.6075L27.3211 11.8575C27.444 12.0624 27.5055 12.2983 27.4984 12.5371C27.4913 12.7759 27.4159 13.0077 27.2811 13.205L27.1811 13.3337L16.5186 25.25C16.3207 25.452 16.0843 25.6124 15.8236 25.7219C15.5628 25.8314 15.2827 25.8877 14.9999 25.8875C14.4999 25.8875 14.0186 25.7125 13.6124 25.3662L13.4436 25.2087L2.81865 13.3337C2.6588 13.1554 2.55356 12.9349 2.51544 12.6984C2.47733 12.462 2.50794 12.2196 2.60365 12L2.67865 11.8562L6.4449 5.57875L6.5249 5.46625C6.58212 5.39508 6.6471 5.33051 6.71865 5.27375L6.8299 5.19375L6.9399 5.13125L7.0024 5.1025L7.0774 5.07125L7.21365 5.03125L7.35365 5.00625L7.4999 5H22.4999ZM11.3924 9.92875C11.1082 9.75858 10.7681 9.70815 10.4468 9.78854C10.1255 9.86893 9.84921 10.0736 9.67865 10.3575L8.92865 11.6075L8.85365 11.7525C8.75798 11.9731 8.72796 12.2166 8.7672 12.4538C8.80645 12.6911 8.91328 12.912 9.0749 13.09L11.5749 15.84L11.6874 15.95C11.9188 16.148 12.2145 16.2547 12.519 16.2501C12.8235 16.2455 13.1159 16.1299 13.3411 15.925L13.4499 15.8125C13.6479 15.5811 13.7546 15.2854 13.75 14.9809C13.7454 14.6764 13.6298 14.384 13.4249 14.1587L11.5486 12.0963L11.8211 11.6425L11.8899 11.5138C12.0155 11.2345 12.0342 10.9188 11.9425 10.6266C11.8508 10.3345 11.6551 10.0861 11.3924 9.92875Z"
                    fill="url(#paint0_linear_gift)"
                  />
                  <path
                    d="M11.25 13.9941L15 17.7441L18.75 13.9941"
                    stroke="white"
                    strokeWidth="1.875"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>

            {/* Title Text */}
            <span className="font-semibold text-red-700 text-base">
              Quà tặng đặc quyền SMEM
            </span>
          </div>

          {/* Promotion Item */}
          <div className="flex items-start gap-3">
            {/* Number Icon */}
            <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-xs font-semibold text-blue-600 mt-0.5">
              1
            </span>

            {/* Promotion Text */}
            <span className="text-sm text-gray-700">
              Giảm thêm 5% (tối đa 300.000đ) khi thu cũ lên đời (áp dụng túy sản
              phẩm)
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <img
            src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:120/q:90/plain/https://dashboard.cellphones.com.vn/storage/iPhone-product-banner-v1.png"
            height="120"
            alt="Chọn trả góp 0%, trả trước 0đ, phụ phí 0đ"
            loading="lazy"
          ></img>
        </div>
      </div>

      {/* Promotional Offers Section */}
      <div className="mt-6 mb-4">
        <div className="border-2 border-blue-500 rounded-lg p-4">
          {/* Title Row */}
          <div className="flex items-start gap-3 mb-3">
            {/* Gift Icon */}
            <div className="flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="4" fill="#EF4444" />
                <path
                  d="M12 6L13.5 9H10.5L12 6Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <rect x="7" y="10" width="10" height="2" fill="white" />
                <path
                  d="M8 12V17C8 17.5523 8.44772 18 9 18H15C15.5523 18 16 17.5523 16 17V12H8Z"
                  fill="white"
                />
                <line
                  x1="12"
                  y1="12"
                  x2="12"
                  y2="18"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Title Text */}
            <span className="font-semibold text-gray-900 text-base">
              Khuyến mãi hấp dẫn
            </span>
          </div>

          {/* Promotion Item 1 */}
          <div className="flex items-start gap-3 mb-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white mt-0.5">
              1
            </span>
            <div className="flex-1">
              <span className="text-sm text-gray-700">
                Trả góp 0% lãi suất, tối đa 12 tháng, trả trước từ 10% qua CTTC
                hoặc 0đ qua thẻ tín dụng{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Xem chi tiết
                </a>
              </span>
            </div>
          </div>

          {/* Promotion Item 2 */}
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold text-white mt-0.5">
              2
            </span>
            <div className="flex-1">
              <span className="text-sm text-gray-700">
                Giảm thêm 10% cho Loa, Tai nghe, Máy tính bàn, TV (từ 10 triệu)
                khi mua Điện thoại/Laptop{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Xem chi tiết
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            type="default"
            size="large"
            className="flex-shrink-0 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Trả góp 0%
          </Button>
          <Button
            type="primary"
            size="large"
            className="flex-1 bg-red-600 hover:bg-red-700 border-red-600"
            onClick={() => {
              console.log("🔘 Buy Now button clicked in ProductVariants");
              if (onBuyNow) {
                onBuyNow();
              } else {
                console.error("❌ onBuyNow prop is undefined!");
              }
            }}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold">MUA NGAY</span>
              <span className="text-xs">
                Giao nhanh từ 2 giờ hoặc nhận tại cửa hàng
              </span>
            </div>
          </Button>
          <Button
            type="default"
            size="large"
            className="flex-shrink-0 border-red-600 text-red-600 hover:bg-red-50"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
              </svg>
            }
            onClick={onAddToCart}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>

      {/* Selected Variant Info */}
    </>
  );
};

export default ProductVariants;
