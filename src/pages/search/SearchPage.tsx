import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import HeaderHome from "../../components/home/HeaderHome";
import FooterHome from "../../components/home/FooterHome";
import ProductGrid from "../../components/products/ProductGrid";
import { productApi } from "../../utils/api/product.api";
import type { ProductProps } from "../../types/api/ProductResponse";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search") || "";

    const [products, setProducts] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query) {
                setProducts([]);
                return;
            }

            try {
                setLoading(true);
                const response = await productApi.getAll({
                    search: query,
                    limit: 50,
                });

                if (response.status === "success") {
                    setProducts(response.data);
                    setTotal(response.total || response.data.length);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <HeaderHome />

            <div className="flex-grow container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg p-4 min-h-[500px]">
                    <div className="mb-6 border-b pb-4">
                        <h1 className="text-xl font-bold">
                            Kết quả tìm kiếm cho: <span className="text-red-600">"{query}"</span>
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Tìm thấy {total} sản phẩm
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <ProductGrid products={products} />
                    )}
                </div>
            </div>

            <FooterHome />
        </div>
    );
};

export default SearchPage;
