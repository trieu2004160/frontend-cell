import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, message, Spin, Typography, Empty } from "antd";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import HeaderHome from "../../components/home/HeaderHome";
import FooterHome from "../../components/home/FooterHome";
import { useAppDispatch, useAppSelector } from "../../redux/app/hook";
import {
  fetchCartById,
  updateCartItemQuantity,
  deleteCartItem,
  updateCheckedCartItem,
} from "../../redux/features/cart/cartSlice";
import { useAuthContext } from "../../contexts/AuthContext";

const { Title } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cartItem } = useAppSelector((state) => state.cart);
  const [loading, setLoading] = React.useState(false);

  const { user } = useAuthContext() || {};

  // Fetch cart data on mount
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        await dispatch(fetchCartById(user.id)).unwrap();
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [dispatch, user]);

  // Calculate total price of SELECTED items
  const totalPrice = useMemo(() => {
    return cartItem.reduce((total, item) => {
      if (item.checked) {
        return total + (item.price || 0) * (item.quantity || 1);
      }
      return total;
    }, 0);
  }, [cartItem]);

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItemQuantity({ id, quantity })).unwrap();
    } catch (error) {
      message.error("Không thể cập nhật số lượng");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await dispatch(deleteCartItem(id)).unwrap();
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  const handleCheckItem = (id: string) => {
    dispatch(updateCheckedCartItem(id));
  };

  const handleCheckAll = () => {
    dispatch(updateCheckedCartItem("all"));
  };

  const handleCheckout = () => {
    const selectedItems = cartItem.filter((item) => item.checked);
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    // Map cart items to the structure expected by CheckoutPage
    const checkoutItems = selectedItems.map(item => ({
      product_id: Number(item.product_id),
      product_name: item.product_name || "",
      variant_id: Number(item.variant_id),
      variant_name: item.variant_name || "",
      price: Number(item.price),
      original_price: Number(item.original_price),
      quantity: Number(item.quantity),
      image_url: item.image_url || "",
    }));

    navigate("/checkout", { state: { items: checkoutItems } });
  };

  const isAllChecked =
    cartItem.length > 0 && cartItem.every((item) => item.checked);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderHome />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header with Back Button */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            Trở về
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            Giỏ hàng của bạn
          </Title>
        </div>

        {cartItem.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <Empty description="Giỏ hàng của bạn đang trống" />
            <Button
              type="primary"
              danger
              className="mt-4"
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              {/* Header Row */}
              <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                <Checkbox checked={isAllChecked} onChange={handleCheckAll}>
                  Chọn tất cả ({cartItem.length} sản phẩm)
                </Checkbox>
                {/* <Button type="text" danger icon={<DeleteOutlined />}>
                  Xóa tất cả
                </Button> */}
              </div>

              <div className="divide-y">
                {cartItem.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="pt-2">
                      <Checkbox
                        checked={item.checked}
                        onChange={() =>
                          handleCheckItem(String(item.cart_item_id))
                        }
                      />
                    </div>

                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 border rounded p-1">
                      <img
                        src={item.image_url || "/images/placeholder.jpg"}
                        alt={item.variant_name || item.product_name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="text-gray-800 font-medium hover:text-red-600 line-clamp-2"
                        >
                          {item.product_name} {item.variant_name}
                        </Link>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            handleDeleteItem(String(item.cart_item_id))
                          }
                          className="text-gray-400 hover:text-red-600"
                        />
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <div className="text-red-600 font-bold text-lg">
                            {new Intl.NumberFormat("vi-VN").format(
                              item.price || 0
                            )}
                            đ
                          </div>
                          {item.original_price &&
                            item.original_price > (item.price || 0) && (
                              <div className="text-gray-400 text-sm line-through">
                                {new Intl.NumberFormat("vi-VN").format(
                                  item.original_price
                                )}
                                đ
                              </div>
                            )}
                        </div>

                        <div className="flex items-center border rounded">
                          <button
                            className="px-3 py-1 hover:bg-gray-100 border-r disabled:opacity-50"
                            onClick={() =>
                              handleQuantityChange(
                                String(item.cart_item_id),
                                (item.quantity || 1) - 1
                              )
                            }
                            disabled={(item.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-10 text-center text-sm focus:outline-none"
                          />
                          <button
                            className="px-3 py-1 hover:bg-gray-100 border-l"
                            onClick={() =>
                              handleQuantityChange(
                                String(item.cart_item_id),
                                (item.quantity || 1) + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Footer for Total and Checkout */}
            <div className="bg-white p-4 rounded-lg shadow-sm sticky bottom-0 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-red-600 font-bold text-xl">
                  {new Intl.NumberFormat("vi-VN").format(totalPrice)}đ
                </span>
              </div>
              <Button
                type="primary"
                danger
                block
                size="large"
                onClick={handleCheckout}
                disabled={totalPrice === 0}
                className="h-12 text-lg font-bold uppercase"
              >
                Mua ngay ({cartItem.filter((i) => i.checked).length})
              </Button>
            </div>
          </>
        )}
      </div>

      <FooterHome />
    </div>
  );
};

export default CartPage;
