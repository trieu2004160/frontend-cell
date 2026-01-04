import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Rate, Divider, Tabs, Image, Spin, message } from "antd";
import { FiShoppingCart } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdCompare } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import HeaderHome from "../../components/home/HeaderHome";
import FooterHome from "../../components/home/FooterHome";
import { productApi } from "../../utils/api/product.api";
import ProductVariants from "./ProductVariants";
import { calculateDisplayPrices } from "../../utils/priceHelpers";
import { useAppDispatch } from "../../redux/app/hook";
import {
  addCartItem,
  fetchCartById,
} from "../../redux/features/cart/cartSlice";
import { useAuthContext } from "../../contexts/AuthContext";

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
  variants?: Array<{
    id: number;
    storage: string;
    color: string;
    image_url: string;
    price: number;
    original_price?: number;
    stock_quantity: number;
    is_active: boolean;
  }>;
}

const DetailProductPage = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const authContext = useAuthContext();
  const user = authContext?.user;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);

  // State for variants
  const [selectedVariant, setSelectedVariant] = useState<{
    id: number;
    variant_name: string;
    capacity: string;
    price: string;
    original_price?: string;
    image_url: string;
  } | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState<number>(0);

  // Load product data from API
  useEffect(() => {
    const loadProduct = async () => {
      const identifier = slug || id;
      if (!identifier) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const response = await productApi.getById(identifier);
        console.log("API Response:", response);
        console.log("API Response Data:", response.data);
        console.log("API Response Variants:", response.data.variants);

        if (response.status === "success" && response.data) {
          const apiProduct = response.data;
          const productData: ProductDetail = {
            id: apiProduct.id,
            name: apiProduct.name,
            description: apiProduct.description || apiProduct.short_description,
            short_description: apiProduct.short_description,
            price: parseFloat(
              String(apiProduct.sale_price || apiProduct.original_price)
            ),
            original_price: parseFloat(String(apiProduct.original_price)),
            image_url: apiProduct.image_url,
            category_name: apiProduct.category_name,
            brand_name: apiProduct.brand_name,
            specifications: {},
            images: apiProduct.images || [],
            stock_quantity: apiProduct.stock_quantity || 10,
            warranty_period: apiProduct.warranty_period,
            rating: 4.5,
            reviewCount: 25,
            variants: (apiProduct.variants || []).map(
              (v: {
                id: number;
                storage?: string;
                color?: string;
                image_url?: string;
                price?: string | number;
                original_price?: string | number;
                stock_quantity?: number;
                is_active?: boolean;
              }) => ({
                id: v.id,
                storage: v.storage || "",
                color: v.color || "",
                image_url: v.image_url || "",
                price: parseFloat(String(v.price || "0")),
                original_price: parseFloat(String(v.original_price || "0")),
                stock_quantity: v.stock_quantity || 0,
                is_active: v.is_active || false,
              })
            ),
          };

          setProduct(productData);
          console.log("Product Data:", productData);
          console.log("Product Variants:", productData.variants);
          console.log("Product Images:", productData.images);

          setCurrentPrice(productData.price);
          setCurrentOriginalPrice(productData.original_price || 0);
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
  }, [id, slug, navigate]);

  // Handle variant selection from URL
  useEffect(() => {
    if (product && product.variants) {
      const searchParams = new URLSearchParams(location.search);
      const variantId = searchParams.get("variantId");

      if (variantId) {
        const variant = product.variants.find(
          (v) => v.id === Number(variantId)
        );
        if (variant) {
          const variantData = {
            id: variant.id,
            variant_name: `${variant.storage} ${variant.color}`.trim(),
            capacity: variant.storage || "",
            price: variant.price.toString(),
            original_price: variant.original_price?.toString(),
            image_url: variant.image_url || "",
          };
          setSelectedVariant(variantData);
          setCurrentPrice(variant.price);
          setCurrentOriginalPrice(variant.original_price || 0);
        }
      } else {
        // Auto-select first variant matching storage from product name
        const storageMatch = product.name.match(
          /\b(128GB|256GB|512GB|1TB|2TB)\b/i
        );
        if (storageMatch && product.variants.length > 0) {
          const targetStorage = storageMatch[1];
          const matchingVariant = product.variants.find(
            (v) => v.storage?.toLowerCase() === targetStorage.toLowerCase()
          );

          if (matchingVariant) {
            console.log(
              "🎯 Auto-selecting variant based on product name:",
              matchingVariant
            );
            const variantData = {
              id: matchingVariant.id,
              variant_name:
                `${matchingVariant.storage} ${matchingVariant.color}`.trim(),
              capacity: matchingVariant.storage || "",
              price: matchingVariant.price.toString(),
              original_price: matchingVariant.original_price?.toString(),
              image_url: matchingVariant.image_url || "",
            };
            setSelectedVariant(variantData);
            setCurrentPrice(matchingVariant.price);
            setCurrentOriginalPrice(matchingVariant.original_price || 0);
          }
        }
      }
    }
  }, [product, location.search]);

  // Update productImages when selectedVariant or product changes
  useEffect(() => {
    if (product) {
      setProductImages(getValidImages());
    }
  }, [selectedVariant, product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getValidImages = () => {
    const validImages: string[] = [];

    // Debug log
    console.log("🖼️ getValidImages called");
    console.log("selectedVariant:", selectedVariant);
    console.log("selectedVariant.image_url:", selectedVariant?.image_url);
    console.log("product.variants:", product?.variants);

    // Ưu tiên hình ảnh từ variant được chọn lên đầu
    if (
      selectedVariant?.image_url &&
      selectedVariant.image_url !== "/images/placeholder.jpg"
    ) {
      console.log("✅ Adding variant image:", selectedVariant.image_url);
      validImages.push(selectedVariant.image_url);
    }

    // Thêm hình ảnh chính của sản phẩm (nếu chưa có)
    if (product?.image_url && !validImages.includes(product.image_url)) {
      console.log("✅ Adding product main image:", product.image_url);
      validImages.push(product.image_url);
    }

    // Thêm hình ảnh từ variants (lọc theo dung lượng đang chọn)
    if (product?.variants?.length) {
      let relevantVariants = product.variants;

      // Nếu đã chọn variant (có dung lượng), chỉ lấy ảnh của các variant cùng dung lượng
      if (selectedVariant?.capacity) {
        const normalize = (s: string) =>
          s?.replace(/\s+/g, "").toUpperCase() || "";
        const activeStorage = normalize(selectedVariant.capacity);
        console.log("🔍 Filtering variants by storage:", activeStorage);
        relevantVariants = product.variants.filter(
          (v) => normalize(v.storage || "") === activeStorage
        );
        console.log("✅ Relevant variants:", relevantVariants);
      }

      const uniqueImages = [
        ...new Set(relevantVariants.map((v) => v.image_url).filter(Boolean)),
      ];
      uniqueImages.forEach((img) => {
        if (img && !validImages.includes(img)) {
          console.log("✅ Adding variant group image:", img);
          validImages.push(img);
        }
      });
    }

    // Thêm các hình ảnh phụ từ database (nếu có)
    if (product?.images?.length) {
      product.images.forEach((img) => {
        if (img.image_url && !validImages.includes(img.image_url)) {
          console.log("✅ Adding additional image:", img.image_url);
          validImages.push(img.image_url);
        }
      });
    }

    console.log("🎯 Final valid images:", validImages);
    return validImages.length > 0 ? validImages : ["/images/placeholder.jpg"];
  };

  const handleVariantChange = (variant: {
    id: number;
    variant_name: string;
    capacity: string;
    price: string;
    original_price?: string;
    image_url: string;
  }) => {
    console.log("DetailProductPage received variant:", variant);
    setSelectedVariant(variant);
    setSelectedImage(0); // Reset về ảnh đầu tiên (ảnh variant)

    if (variant.id === -1) {
      message.warning(`Dung lượng ${variant.capacity} hiện đang hết hàng!`);
      setCurrentPrice(product?.price || 0);
      setCurrentOriginalPrice(product?.original_price || 0);
      return;
    }

    setCurrentPrice(parseFloat(variant.price));
    if (variant.original_price) {
      setCurrentOriginalPrice(parseFloat(variant.original_price));
    } else {
      setCurrentOriginalPrice(0);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    if (!selectedVariant) {
      message.warning("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    if (!product) return;

    try {
      await dispatch(
        addCartItem({
          product_id: Number(product.id),
          variant_id: selectedVariant.id,
          quantity: 1,
          user_id: user.id,
        })
      ).unwrap();

      // Reload cart after adding
      if (user?.id) {
        await dispatch(fetchCartById(user.id)).unwrap();
      }

      message.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) { }

    if (!product) return;

    try {
      await dispatch(
        addCartItem({
          product_id: Number(product.id),
          variant_id: selectedVariant.id,
          quantity: 1,
          user_id: user.id,
        })
      ).unwrap();

      // Reload cart after adding
      if (user?.id) {
        await dispatch(fetchCartById(user.id)).unwrap();
      }
      navigate("/cart");
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = () => {
    console.log("👉 handleBuyNow clicked");
    if (!selectedVariant) {
      console.warn("❌ No variant selected");
      message.warning("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    if (!product) {
      console.warn("❌ No product data");
      return;
    }

    const item = {
      product_id: Number(product.id),
      product_name: product.name,
      variant_id: selectedVariant.id,
      variant_name: selectedVariant.variant_name,
      price: currentPrice,
      original_price: currentOriginalPrice,
      quantity: 1,
      image_url: selectedVariant.image_url || product.image_url || "",
    };

    console.log("✅ Navigating to checkout with item:", item);
    navigate("/checkout", { state: { items: [item] } });
  };

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
        <div className="rounded-lg px-60">
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
              {/* Image Gallery Thumbnails */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Hình ảnh sản phẩm
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden cursor-pointer p-2 bg-white transition-all ${selectedImage === index
                        ? "border-red-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedImage(index)}
                      title={`Hình ảnh ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error(
                            `❌ Failed to load image ${index + 1}:`,
                            image
                          );
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder.jpg";
                        }}
                        onLoad={() => {
                          console.log(
                            `✅ Successfully loaded image ${index + 1}:`,
                            image
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {productImages.length} hình ảnh có sẵn - Click để xem chi tiết
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Price */}
              {/* Price Section Redesign */}
              <div className="border border-blue-200 rounded-xl p-4 mb-6 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 relative">
                  {/* Left Column: SMEM Price */}
                  <div className="flex-1">
                    <div className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-2">
                      Giá dành riêng cho SMEM
                    </div>
                    {(() => {
                      const priceInfo = calculateDisplayPrices(
                        currentOriginalPrice || 0,
                        currentPrice,
                        {
                          fakeOriginalMultiplier: 1.1,
                        }
                      );

                      return (
                        <>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatPrice(priceInfo.displayPrice)}
                          </div>
                          {priceInfo.hasDiscount && (
                            <div className="text-lg text-gray-400 line-through font-medium">
                              {formatPrice(priceInfo.originalPrice)}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Separator "hoặc" */}
                  <div className="hidden md:flex flex-col items-center justify-center px-2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full">
                    <div className="h-full w-px bg-gray-200"></div>
                    <span className="text-xs text-gray-500 absolute bg-white px-1">
                      hoặc
                    </span>
                  </div>

                  {/* Right Column: Trade-in Price */}
                  <div className="flex-1 md:pl-8">
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mb-2">
                      Thu cũ lên đời chỉ từ
                    </div>
                    {(() => {
                      const priceInfo = calculateDisplayPrices(
                        currentOriginalPrice || 0,
                        currentPrice,
                        {
                          fakeOriginalMultiplier: 1.1,
                        }
                      );
                      const tradeInPrice = priceInfo.displayPrice - 2000000;

                      return (
                        <>
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatPrice(tradeInPrice > 0 ? tradeInPrice : 0)}
                          </div>
                          <div className="text-sm text-red-600 font-medium mb-1">
                            Trợ giá đến 2.000.000đ
                          </div>
                          <a
                            href="#"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            Định giá ngay <span className="text-xs">▼</span>
                          </a>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="mb-1">
                {product.name && (
                  <div className="mt-4">
                    <ProductVariants
                      variants={(product.variants || []).map((v) => ({
                        ...v,
                        original_price: v.original_price
                          ? Number(v.original_price)
                          : undefined,
                      }))}
                      onVariantChange={handleVariantChange}
                      selectedVariant={product.variants?.find(
                        (v) => v.id === selectedVariant?.id
                      )}
                      productName={product.name}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                )}
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
