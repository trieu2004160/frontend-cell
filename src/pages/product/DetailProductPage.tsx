import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Rate, Divider, Tabs, Image, Spin, message } from "antd";
import { FiShoppingCart } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdCompare } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import HeaderHome from "../../components/home/HeaderHome";
import FooterHome from "../../components/home/FooterHome";
import { productApi } from "../../utils/api/product.api";

interface ProductDetail {
  id: number | string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category_name?: string;
  brand_name?: string;
  specifications?: string | object;
  images?: Array<{ image_url: string }>;
  stock_quantity?: number;
  warranty_period?: number;
  rating?: number;
  reviewCount?: number;
}

const DetailProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Load product data from API
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const response = await productApi.getById(id);
        console.log("API Response:", response); // Debug log
        console.log("API Response Data:", response.data); // Debug log
        console.log("API Response Variants:", response.data.variants); // Debug variants

        if (response.status === "success" && response.data) {
          // Transform backend data to frontend format
          const apiProduct = response.data; // response.data is single object, not array
          const productData: ProductDetail = {
            id: apiProduct.id,
            name: apiProduct.name,
            description: apiProduct.description || apiProduct.short_description,
            short_description: apiProduct.short_description,
            price: parseFloat(
              apiProduct.sale_price || apiProduct.original_price
            ),
            original_price: parseFloat(apiProduct.original_price),
            image_url: apiProduct.image_url,
            category_name: apiProduct.category_name,
            brand_name: apiProduct.brand_name,
            specifications: {}, // Default empty specifications
            images: apiProduct.images || [],
            stock_quantity: apiProduct.stock_quantity || 10, // Use real stock quantity
            warranty_period: apiProduct.warranty_period,
            rating: 4.5, // Default rating
            reviewCount: 25, // Default review count
          };

          setProduct(productData);
          console.log("Product Data:", productData); // Debug log
          console.log("Product Images:", productData.images); // Debug images
        } else {
          message.error("Không thể tải thông tin sản phẩm");
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        message.error("Có lỗi xảy ra khi tải sản phẩm");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId: product?.id,
      quantity,
    });
    message.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // Parse specifications from JSON string
  const getSpecifications = () => {
    if (!product?.specifications) return {};

    try {
      return typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications;
    } catch {
      return {
        "Thông số": "Đang cập nhật",
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
          <Button type="primary" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const specifications = getSpecifications();

  // Create images array from product images
  const validImages: string[] = [];

  // Add the main product image if it exists
  if (product.image_url) {
    validImages.push(product.image_url);
  }

  // Add additional images from database if they exist and not already included
  if (product.images?.length) {
    product.images.forEach((img) => {
      if (img.image_url && !validImages.includes(img.image_url)) {
        validImages.push(img.image_url);
      }
    });
  }

  // Fallback to placeholder if no valid images
  const productImages =
    validImages.length > 0 ? validImages : ["/images/placeholder.jpg"];

  const tabItems = [
    {
      key: "1",
      label: "Mô tả sản phẩm",
      children: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">MÔ TẢ SẢN PHẨM</h3>
          <div className="prose max-w-none">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p>
                {product.short_description ||
                  "Mô tả sản phẩm đang được cập nhật."}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Thông số kỹ thuật",
      children: (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Đánh giá",
      children: (
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold">{product.rating}</div>
            <div>
              <Rate disabled defaultValue={product.rating} />
              <div className="text-gray-600">
                ({product.reviewCount} đánh giá)
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            Chức năng đánh giá sẽ được cập nhật sau.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderHome />

      <div className="container mx-auto px-4 py-6">
        <div className=" rounded-lg  px-60">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-600 mb-4">
            <span
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </span>
            <span className="mx-2">/</span>
            <span className="cursor-pointer hover:text-red-600">
              Điện thoại
            </span>
            <span className="mx-2">/</span>
            <span className="cursor-pointer hover:text-red-600">
              {product.brand_name}
            </span>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <h1 className="text-base font-bold mb-2">
                {product.name} | chính hãng VN/A{" "}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <Rate disabled defaultValue={product.rating} />
                <span className="text-yellow-500 font-semibold">
                  {product.rating}
                </span>
                <span className="text-gray-600">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
              <div className="mb-4">
                <div className="w-full aspect-[5/4] bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer p-8">
                  <Image.PreviewGroup>
                    {productImages.map((image, index) => (
                      <Image
                        key={`image-${index}`}
                        src={image}
                        alt={`${product.name} - Ảnh ${index + 1}`}
                        className={
                          index === selectedImage
                            ? "w-full h-full object-contain"
                            : ""
                        }
                        style={
                          index === selectedImage ? {} : { display: "none" }
                        }
                        fallback="/images/placeholder.jpg"
                        onError={() => {
                          console.error(
                            `Image ${index} failed to load:`,
                            image
                          );
                        }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden cursor-pointer p-4 bg-white ${
                      selectedImage === index
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Price */}
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-red-600 font-medium mb-1">
                  Giá dành riêng cho SMEM
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Số lượng</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      className="px-3 py-2 hover:bg-gray-100"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      className="px-3 py-2 hover:bg-gray-100"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-green-600 font-medium">
                    {(product.stock_quantity || 0) > 0
                      ? `Còn ${product.stock_quantity} sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <Button
                  type="primary"
                  size="large"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  icon={<FiShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={(product.stock_quantity || 0) <= 0}
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
                />
                <Button size="large" icon={<MdCompare />} />
              </div>

              {/* Contact */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <IoCall className="text-red-600" />
                  <span className="font-semibold">Gọi đặt mua: 1800 2097</span>
                </div>
                <div className="text-sm text-gray-600">
                  • Bảo hành:{" "}
                  {product.warranty_period
                    ? `${product.warranty_period} tháng`
                    : "12 tháng"}
                  <br />
                  • Miễn phí giao hàng toàn quốc
                  <br />• Thu cũ lên đời giá cao
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Divider />
          <Tabs items={tabItems} />
        </div>
      </div>

      <FooterHome />
    </div>
  );
};

export default DetailProductPage;
