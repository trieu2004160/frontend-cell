import { useEffect, useState } from "react";
import ProductNoSlice from "../products/ProductNoSlice";
import StarIcon from "../svg/StarIcon";
import { variantHomepageApi } from "../../utils/api/variant_homepage.api";

const ProductWatched = () => {
  const [dataProducts, setDataProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const result = await variantHomepageApi.getForHomepage({ limit: 20 });
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
      <div
        className="bg-cover bg-no-repeat rounded-[1rem] p-1"
        style={{
          backgroundImage: "url('/images/GoRec.webp')",
        }}
      >
        <div className="flex items-center gap-x-2">
          <StarIcon />
          <h2 className="text-[1.5rem] text-[#04297a] font-bold">
            SẢN PHẨM BẠN ĐÃ XEM
          </h2>
        </div>
        <ProductNoSlice list={dataProducts} suggest={true} />
      </div>
    </>
  );
};

export default ProductWatched;
