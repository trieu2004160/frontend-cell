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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Tablet category doesn't exist yet (would be category 13 or similar)
        // Fetching from non-existent category will return empty array
        const result = await productApi.getAll({ category_id: "999" });
        setDataProducts(result.data);
      } catch (error) {
        console.error("Error fetching products from API:", error);
        setDataProducts([]); // Show empty list
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div>
        {loading && <div className="text-center py-4">Đang tải dữ liệu...</div>}
        {error && <div className="text-red-500 text-sm mb-2">❌ {error}</div>}

        <ProductNoSlice
          title="MÁY TÍNH BẢNG"
          list={dataProducts}
          brand={brand}
        />
      </div>
    </>
  );
};

export default TabletList;
