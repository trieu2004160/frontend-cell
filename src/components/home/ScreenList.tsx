import { useEffect, useState } from "react";
import type { ProductProps } from "../../types/api/ProductResponse";
import { productApi } from "../../utils/api/product.api";
import ProductNoSlice from "../products/ProductNoSlice";
// import ProductHome from "../products/ProductHome";

const ScreenList = () => {
  const [dataProducts, setDataProducts] = useState<ProductProps[]>([]);
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
      // Lấy sản phẩm từ category "Màn hình" (id=12)
      const result = await productApi.getAll({ category_id: "12" });
      setDataProducts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div>
        <ProductNoSlice
          title="MÀN HÌNH, MÁY TÍNH ĐỂ BÀN"
          list={dataProducts}
          brand={brand}
        />
      </div>
    </>
  );
};

export default ScreenList;
