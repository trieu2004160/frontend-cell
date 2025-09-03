import { useEffect, useState } from "react";
import ProductHome from "../products/ProductHome";
import { productApi } from "../../utils/api/product.api";
import { sliceArray } from "../../utils/sliceArray";
import type { ProductProps } from "../../types/api/ProductResponse";

const LaptopList = () => {
  const [dataProducts, setDataProducts] = useState<ProductProps[][]>([]);
  const [laptopCategoryId, setLaptopCategoryId] = useState<string>("");

  const brand: { name: string }[] = [
    {
      name: "Apple",
    },
    {
      name: "Dell",
    },
    {
      name: "HP",
    },
    {
      name: "ASUS",
    },
    {
      name: "Lenovo",
    },
  ];

  // Lấy category ID của Laptop
  const getLaptopCategoryId = async () => {
    try {
      // Giả sử có API để lấy categories hoặc hard-code ID
      // Từ database check ở trên, Laptop có ID = 11
      setLaptopCategoryId("11");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await productApi.getAll({
        all: true,
        category_id: laptopCategoryId, // Chỉ lấy sản phẩm laptop
      });
      setDataProducts(sliceArray(result.data, 2));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLaptopCategoryId();
  }, []);

  useEffect(() => {
    if (laptopCategoryId) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laptopCategoryId]);
  return (
    <>
      <div>
        <ProductHome title="LAPTOP" list={dataProducts} brand={brand} />
      </div>
    </>
  );
};
export default LaptopList;
