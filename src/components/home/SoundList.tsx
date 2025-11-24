import { useEffect, useState } from "react";
import type { ProductProps } from "../../types/api/ProductResponse";
import { productApi } from "../../utils/api/product.api";
import ProductNoSlice from "../products/ProductNoSlice";

const SoundList = () => {
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
      // Lấy sản phẩm từ category "Tai nghe" (id=8)
      // Hiện tại chưa có sản phẩm nào trong category này
      const result = await productApi.getAll({ category_id: "8" });
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
        <ProductNoSlice title="ÂM THANH" list={dataProducts} brand={brand} />
      </div>
    </>
  );
};

export default SoundList;
