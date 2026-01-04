import { useEffect, useState } from "react";
import ProductHome from "../products/ProductHome";
import { variantHomepageApi, type VariantForHomepage } from "../../utils/api/variant_homepage.api";
import { sliceArray } from "../../utils/sliceArray";

const SmartphoneList = () => {
  const [dataVariants, setDataVariants] = useState<VariantForHomepage[][]>([]);
  const [loading, setLoading] = useState(false);
  
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
    {
      name: "NOKIA",
    },
    {
      name: "VIVO",
    },
    {
      name: "realme",
    },
    {
      name: "TECHO",
    },
  ];
  
  const fetchVariants = async () => {
    try {
      setLoading(true);
      // Lấy variants từ category "Điện thoại" (id=1)
      // Mỗi variant sẽ hiển thị như 1 sản phẩm riêng
      const result = await variantHomepageApi.getForHomepage({ category_id: "1" });
      setDataVariants(sliceArray(result.data, 2));
    } catch (error) {
      console.log("Error fetching variants:", error);
      setDataVariants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);
  
  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <div>
        <ProductHome
          title="ĐIỆN THOẠI NỔI BẬT NHẤT"
          list={dataVariants}
          brand={brand}
        />
      </div>
    </>
  );
};

export default SmartphoneList;
