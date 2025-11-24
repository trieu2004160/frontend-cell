import type { ProductProps } from "../../types/api/ProductResponse";
import { FaStar } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { calculateDisplayPrices } from "../../utils/priceHelpers";
import { useNavigate } from "react-router-dom";

interface ProductGridProps {
    products: ProductProps[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
    const navigate = useNavigate();

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((item, index) => (
                <div
                    key={index}
                    className="bg-white flex flex-col gap-y-4 rounded-lg p-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow relative"
                    onClick={() => navigate(`/dtdd/${item.slug}`)}
                >
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.name || "Product image"}
                            className="object-contain hover:scale-105 duration-500 h-[200px] w-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-lg">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                    <div className="h-[2.5rem] font-bold line-clamp-2">
                        <span>{item.name}</span>
                    </div>
                    <p className="flex items-center gap-x-1 flex-wrap">
                        {(() => {
                            const priceInfo = calculateDisplayPrices(
                                item.original_price || item.price || "0",
                                item.sale_price,
                                {
                                    discountPercent: 0.15,
                                    fakeOriginalMultiplier: 1.3,
                                }
                            );

                            return (
                                <>
                                    <span className="text-[#d70019] font-bold text-sm">
                                        {priceInfo.displayPrice.toLocaleString("vi-VN")}đ
                                    </span>
                                    {priceInfo.hasDiscount && (
                                        <span className="line-through font-medium opacity-65 text-xs">
                                            {priceInfo.originalPrice.toLocaleString("vi-VN")}đ
                                        </span>
                                    )}
                                </>
                            );
                        })()}
                    </p>
                    <div className="flex flex-col gap-y-1">
                        <div className="bg-[#dae8fe] flex items-center p-1 rounded-md">
                            <span className="text-[#20488b] text-[0.65rem] line-clamp-1">
                                Smember giảm đến 450.000đ
                            </span>
                        </div>
                        <div className="bg-[#EFE9FE] flex items-center p-1 rounded-md">
                            <span className="text-[#421d95] text-[0.65rem] line-clamp-1">
                                S-Student giảm thêm 300.000đ
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-auto pt-2">
                        <div className="flex items-center gap-x-1">
                            <FaStar className="text-[#ffd531]" />
                            <span className="text-xs">{item.rating_average || 0}</span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <FaRegHeart className="text-[#3c82f6]" />
                            <span className="text-[#3c82f6] text-xs">Yêu thích</span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="object-contain absolute top-[-0.5rem] left-0 px-2 bg-[url('/images/discount-badge-ui-2025.webp')] bg-contain bg-no-repeat">
                        <p className="text-white flex items-center gap-x-1">
                            <span className="text-[0.7rem]">Giảm</span>
                            <span className="text-[0.8rem]">14%</span>
                        </p>
                    </div>
                    <div className="object-cover absolute right-0 top-0 px-1 bg-[url('/images/zero-ins-badge-ui-2025.webp')] bg-contain bg-no-repeat">
                        <p className="text-[#3c82f6] flex items-center gap-x-1">
                            <span className="text-[0.7rem]">Trả góp</span>
                            <span className="text-[0.8rem]">0%</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
