import { useEffect, useState } from "react";
import type { ProductProps } from "../../types/api/ProductResponse";
import { productApi } from "../../utils/api/product.api";
import ProductNoSlice from "../products/ProductNoSlice";

const HouseHoldList = () => {
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
      // Household appliances category doesn't exist yet
      // Using non-existent category will return empty array
      const result = await productApi.getAll({ category_id: "997" });
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
        <ProductNoSlice title="ĐỒ GIA DỤNG" list={dataProducts} brand={brand} />
      </div>
    </>
  );
};

export default HouseHoldList;
