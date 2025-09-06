/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { productVariantApi } from "../../utils/api/product_variant.api";
import type {
  ProductVariantCapacity,
  ProductVatiantProp,
} from "../../types/api/ProductVariantResponse";
import { MdDone } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const OptionProduct = ({ group_name }: { group_name: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState<ProductVariantCapacity[]>([]);
  const [variant, setVariant] = useState<ProductVatiantProp[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [currentVariant, setCurrentVariant] = useState<number>(0);

  const getVariant = async () => {
    try {
      const result = await productVariantApi.getCapacity(group_name);
      if (Array.isArray(result.data)) {
        setCapacity(result.data);

        // Kiểm tra nếu có id_variant trong URL
        const searchParams = new URLSearchParams(location.search);
        const id_variant = searchParams.get("id_variant");

        if (id_variant) {
          // Lấy thông tin variant từ id_variant để tìm capacity tương ứng
          try {
            const variantResult = await productVariantApi.getVariantById(
              Number(id_variant)
            );
            if (!Array.isArray(variantResult.data)) {
              const selectedVariant = variantResult.data;
              const capacityIndex = result.data.findIndex(
                (c: ProductVariantCapacity) =>
                  c.capacity === selectedVariant.capacity
              );
              if (capacityIndex !== -1) {
                // Set capacity đúng và load variants cho capacity đó (không clear variant)
                await handleCapacity(
                  result.data[capacityIndex].capacity,
                  capacityIndex,
                  false
                );
                return;
              }
            }
          } catch (error) {
            console.log("Error getting variant by id:", error);
          }
        }

        // Nếu không có id_variant hoặc không tìm thấy, load capacity đầu tiên
        if (result.data.length > 0) {
          handleCapacity(result.data[0].capacity, 0, false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCapacity = async (
    capacity: string,
    index: number,
    clearVariant = true
  ) => {
    try {
      setCurrent(index);
      const result = await productVariantApi.getVariantByCapacity(
        capacity,
        group_name
      );
      if (Array.isArray(result.data)) {
        setVariant(result.data);
        // Chỉ reset currentVariant và clear URL khi user chủ động đổi capacity
        if (clearVariant) {
          setCurrentVariant(0);
          // Clear id_variant khỏi URL khi đổi capacity
          const searchParams = new URLSearchParams(location.search);
          searchParams.delete("id_variant");
          navigate(`${location.pathname}?${searchParams.toString()}`, {
            replace: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVariant = (index: number, id_variant: number) => {
    // dispatch(addToCart(cart.));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("id_variant", id_variant.toString());
    setCurrentVariant(index);

    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  // Đồng bộ state với URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id_variant = searchParams.get("id_variant");

    if (id_variant && variant.length > 0) {
      // Tìm index của variant được chọn trong URL
      const variantIndex = variant.findIndex(
        (v) => v.id === Number(id_variant)
      );
      if (variantIndex !== -1) {
        setCurrentVariant(variantIndex);
      }
    }
  }, [location.search, variant]);

  useEffect(() => {
    getVariant();
  }, []);

  return (
    <>
      <div>
        <h3 className="font-bold mb-3">Phiên bản</h3>
        <div className="flex items-center gap-x-4">
          {capacity.map((item, index) => (
            <div
              className={`px-6 py-4 border-[1px] flex items-center justify-center rounded-lg cursor-pointer relative overflow-hidden ${
                current === index && `border-[2px] border-[#d70019]`
              }`}
              key={index}
              onClick={() => handleCapacity(item.capacity, index)}
            >
              <span className="font-medium">{item.capacity}</span>
              {current === index && (
                <div className="flex items-center justify-center bg-[#d70019] absolute top-[-0.2rem] right-[-0.2rem] rounded-md w-5 h-5 p-1 ">
                  <MdDone className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        <h3 className="font-bold mb-3 mt-5">Màu sắc</h3>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {variant.map((item, index) => (
            <div
              className={`border-[1px] rounded-lg p-2 flex items-center gap-x-2 cursor-pointer relative overflow-hidden ${
                currentVariant === index && `border-[2px] border-[#d70019]`
              }`}
              key={index}
              onClick={() => handleVariant(index, item.id)}
            >
              <div className="w-[2.5rem] h-[2.5rem]">
                <img
                  src={item.image_url}
                  alt={`${item.variant_name} color option`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold whitespace-nowrap">
                  {item.variant_name}
                </span>
                <span className="font-light text-[0.8rem]">
                  {Number(item.price).toLocaleString("vi-VN")}đ
                </span>
              </div>
              {currentVariant === index && (
                <div className="flex items-center justify-center bg-[#d70019] absolute top-[-0.2rem] right-[-0.2rem] rounded-md w-5 h-5 p-1 ">
                  <MdDone className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OptionProduct;
