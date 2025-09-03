// utils/priceHelpers.ts
export interface PriceConfig {
  discountPercent?: number;  // % giảm giá (0.1 = 10%)
  fakeOriginalMultiplier?: number;  // Nhân với giá hiện tại để tạo giá gốc giả (1.3 = +30%)
  minDiscount?: number;  // Giảm giá tối thiểu
  maxDiscount?: number;  // Giảm giá tối đa
}

export const calculateDisplayPrices = (
  currentPrice: number | string | null,
  salePrice: number | string | null,
  config: PriceConfig = {}
) => {
  const {
    discountPercent = 0.15,  // Mặc định giảm 15%
    fakeOriginalMultiplier = 1.25,  // Mặc định giá gốc giả = giá hiện tại * 1.25
    minDiscount = 100000,
    maxDiscount = 5000000
  } = config;

  const current = Number(currentPrice) || 0;
  const sale = Number(salePrice) || 0;

  // Trường hợp 1: Có cả giá gốc và giá khuyến mãi
  if (current > 0 && sale > 0 && current > sale) {
    return {
      displayPrice: sale,
      originalPrice: current,
      hasDiscount: true,
      discountAmount: current - sale,
      discountPercent: Math.round(((current - sale) / current) * 100)
    };
  }

  // Trường hợp 2: Chỉ có 1 giá - tạo scenario giảm giá
  const basePrice = current || sale || 0;
  if (basePrice > 0) {
    const fakeOriginal = Math.round(basePrice * fakeOriginalMultiplier);
    const discountAmount = Math.min(Math.max(basePrice * discountPercent, minDiscount), maxDiscount);
    
    return {
      displayPrice: basePrice,
      originalPrice: fakeOriginal,
      hasDiscount: true,
      discountAmount: discountAmount,
      discountPercent: Math.round((discountAmount / fakeOriginal) * 100)
    };
  }

  // Trường hợp 3: Không có giá - fallback
  return {
    displayPrice: 100000,
    originalPrice: 120000,
    hasDiscount: true,
    discountAmount: 20000,
    discountPercent: 17
  };
};
