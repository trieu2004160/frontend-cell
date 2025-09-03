import { useEffect, useState } from "react";
import type { ProductProps } from "../../types/api/ProductResponse";
import { productApi } from "../../utils/api/product.api";
import ProductNoSlice from "../products/ProductNoSlice";

const TabletList = () => {
  const [dataProducts, setDataProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brand: { name: string }[] = [
    {
      name: "Apple",
    },
    {
      name: "Samsung",
    },
    {
      name: "Xiaomi",
    },
    {
      name: "OPPO",
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products from API...");
      const result = await productApi.getAll({ all: true });
      console.log("API Response:", result);
      setDataProducts(result.data);
    } catch (error) {
      console.error("Error fetching products from API:", error);
      console.log("Using mock data instead...");
      // Nếu API lỗi, sử dụng mock data

      setError("Không thể kết nối API, đang sử dụng dữ liệu mẫu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div>
        {loading && <div className="text-center py-4">Đang tải dữ liệu...</div>}
        {error && (
          <div className="text-orange-500 text-sm mb-2">⚠️ {error}</div>
        )}

        <ProductNoSlice
          title="MÁY TÍNH BẢNG"
          list={dataProducts}
          brand={brand}
        />

        <div className="mt-2 text-xs text-gray-600">
          Debug: Đã tải {dataProducts.length} sản phẩm
        </div>
      </div>
    </>
  );
};

export default TabletList;
