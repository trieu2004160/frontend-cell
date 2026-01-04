import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Rate, Divider, Spin, message, Tag, Space } from "antd";
import { FiShoppingCart } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import HeaderHome from "../../components/home/HeaderHome";
import FooterHome from "../../components/home/FooterHome";
import {
  variantHomepageApi,
  type VariantDetail,
} from "../../utils/api/variant_homepage.api";

const VariantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [variant, setVariant] = useState<VariantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch variant detail
  useEffect(() => {
    const fetchVariant = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const result = await variantHomepageApi.getDetailById(id);
        setVariant(result.data);
      } catch (error) {
        console.error("Error fetching variant:", error);
        message.error("Không thể tải thông tin sản phẩm!");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchVariant();
  }, [id, navigate]);

  // Handle variant change (storage/color)
  const handleVariantChange = (variantId: number) => {
    navigate(`/product-variant/${variantId}`);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!variant) return;
    console.log("Add to cart:", variant);
    message.success("Đã thêm vào giỏ hàng!");
  };

  const formatPrice = (price?: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return numPrice ? numPrice.toLocaleString("vi-VN") + "đ" : "0đ";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  // Group variants by storage
  const variantsByStorage: { [key: string]: typeof variant.all_variants } = {};
  variant.all_variants?.forEach((v) => {
    const storage = v.storage || "Other";
    if (!variantsByStorage[storage]) {
      variantsByStorage[storage] = [];
    }
    variantsByStorage[storage].push(v);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderHome />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div>
              <div className="mb-4">
                <img
                  src={variant.image_url || "/images/placeholder.jpg"}
                  alt={variant.display_name}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">{variant.display_name}</h1>

              <div className="flex items-center gap-4">
                <Rate disabled defaultValue={variant.rating_average || 0} />
                <span className="text-gray-600">
                  {variant.rating_count || 0} đánh giá
                </span>
              </div>

              <Divider />

              {/* Price */}
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(variant.sale_price || variant.price)}
                  </span>
                  {variant.original_price &&
                    variant.original_price > (variant.sale_price || 0) && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(variant.original_price)}
                      </span>
                    )}
                </div>

                <div className="mt-2">
                  <Tag
                    color={
                      variant.stock_quantity && variant.stock_quantity > 0
                        ? "green"
                        : "red"
                    }
                  >
                    {variant.stock_quantity && variant.stock_quantity > 0
                      ? `Còn ${variant.stock_quantity} sản phẩm`
                      : "Hết hàng"}
                  </Tag>
                </div>
              </div>

              <Divider />

              {/* Storage Options */}
              <div>
                <h3 className="font-semibold mb-3">Chọn dung lượng:</h3>
                <Space wrap>
                  {Object.keys(variantsByStorage).map((storage) => {
                    const isSelected = variant.storage === storage;
                    return (
                      <Button
                        key={storage}
                        type={isSelected ? "primary" : "default"}
                        size="large"
                        onClick={() => {
                          const targetVariant = variantsByStorage[storage][0];
                          handleVariantChange(targetVariant.variant_id);
                        }}
                      >
                        {storage}
                      </Button>
                    );
                  })}
                </Space>
              </div>

              {/* Color Options (for selected storage) */}
              {variant.storage &&
                variantsByStorage[variant.storage]?.length > 1 && (
                  <div>
                    <h3 className="font-semibold mb-3">Chọn màu sắc:</h3>
                    <Space wrap>
                      {variantsByStorage[variant.storage].map((v) => {
                        const isSelected = v.variant_id === variant.id;
                        return (
                          <Button
                            key={v.variant_id}
                            type={isSelected ? "primary" : "default"}
                            onClick={() => handleVariantChange(v.variant_id)}
                          >
                            {v.color}
                          </Button>
                        );
                      })}
                    </Space>
                  </div>
                )}

              <Divider />

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<FiShoppingCart />}
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={
                    !variant.stock_quantity || variant.stock_quantity === 0
                  }
                >
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  size="large"
                  icon={
                    isFavorite ? (
                      <AiFillHeart className="text-red-500" />
                    ) : (
                      <AiOutlineHeart />
                    )
                  }
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  Yêu thích
                </Button>
              </div>

              {/* Description */}
              {variant.short_description && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Mô tả ngắn:</h3>
                  <p className="text-gray-600">{variant.short_description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          {variant.description && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Mô tả chi tiết</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: variant.description }}
              />
            </div>
          )}
        </div>
      </div>

      <FooterHome />
    </div>
  );
};

export default VariantDetailPage;
