import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input, message, Modal, Radio, Spin } from "antd";
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";
import HeaderHome from "../../components/home/HeaderHome";
import { paymentApi } from "../../utils/api/payment.api";

// Assuming we receive this state from the previous step
interface PaymentState {
  items: any[];
  totalAmount: number;
  customerInfo: any;
  shippingInfo: any;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to hold data passed from previous step
  const [state, setState] = useState<PaymentState | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [mockDiscount, setMockDiscount] = useState(0); // Mock Smember discount

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  // QR Payment State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<number | null>(null);

  // List of payment methods for "store" pickup
  const storePaymentMethods = [
    {
      id: "store",
      name: "Thanh toán tại cửa hàng",
      description:
        "CellphoneS sẽ giữ sản phẩm và ưu đãi trong vòng 24 giờ kể từ thời điểm đặt hàng.",
      icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/payment-logo/COS.png",
      subtext: null,
    },
    {
      id: "qr",
      name: "Chuyển khoản ngân hàng qua mã QR",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/wysiwyg/QRCode.png",
      subtext: null,
    },
    {
      id: "vnpay",
      name: "VNPAY",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/vnpay.png",
      subtext: null,
    },
    {
      id: "momo",
      name: "MoMo",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/momo_vi.png",
      subtext: null,
    },
    {
      id: "onepay",
      name: "OnePay",
      description: "Qua thẻ Visa/Master/JCB/Napas",
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/onepay.png",
      subtext: null,
    },
    {
      id: "kredivo",
      name: "Kredivo",
      description: "Nhập ưu đãi tại cổng, giảm thêm 7% tối đa 1.000.000đ",
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/kredivo.png",
      isDetails: true,
    },
  ];

  // List of payment methods for "home" delivery
  const homePaymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/payment-logo/COD.png",
      subtext: null,
    },
    {
      id: "qr",
      name: "Chuyển khoản ngân hàng qua mã QR",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x400,webp,q100/media/wysiwyg/QRCode.png",
      subtext: null,
    },
    {
      id: "vnpay",
      name: "VNPAY",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/vnpay.png",
      subtext: null,
    },
    {
      id: "momo",
      name: "MoMo",
      description: null,
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/momo_vi.png",
      subtext: null,
    },
    {
      id: "onepay",
      name: "OnePay",
      description: "Qua thẻ Visa/Master/JCB/Napas",
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/onepay.png",
      subtext: null,
    },
    {
      id: "kredivo",
      name: "Kredivo",
      description: "Nhập ưu đãi tại cổng, giảm thêm 7% tối đa 1.000.000đ",
      icon: "https://cdn2.cellphones.com.vn/x/media/logo/gw2/kredivo.png",
      isDetails: true,
    },
  ];

  const paymentMethods =
    state?.shippingInfo?.method === "home"
      ? homePaymentMethods
      : storePaymentMethods;

  useEffect(() => {
    if (location.state) {
      setState(location.state as PaymentState);
      // Auto apply some mock discount if user is Smember (simulated)
      setMockDiscount(175000);
    } else {
      // Fallback/Mock data for direct access testing
      setState({
        items: [{ quantity: 1 }],
        totalAmount: 34990000,
        customerInfo: {
          fullname: "Triều Võ",
          phone: "0329653804",
          email: "vo2004123@gmail.com",
        },
        shippingInfo: {
          address:
            "669 Trần Hưng Đạo, P. Lê Hồng Phong, TP. Quy Nhơn, Bình Định",
          method: "home",
        },
      });
      setMockDiscount(175000);
    }
  }, [location.state]);

  const handleApplyCoupon = () => {
    if (!discountCode.trim()) return;
    message.success("Áp dụng mã giảm giá thành công!");
  };

  // Hàm tạo payment QR
  const handleQRPayment = async () => {
    if (!state) return;
    const finalAmount = Math.round(totalToPay);
    try {
      setPaymentLoading(true);
      const newOrderCode = Number(Date.now()); // Sử dụng timestamp để đảm bảo unique
      setOrderCode(newOrderCode);

      const paymentData = {
        orderCode: newOrderCode,
        amount: finalAmount,
        description: `PAY${newOrderCode}`,
        items: [
          {
            name: `Don hang ${newOrderCode}`,
            quantity: 1,
            price: finalAmount,
          },
        ],
        cancelUrl: `${window.location.origin}/payment/cancel`,
        returnUrl: `${window.location.origin}/payment/success`,
      };

      const response = await paymentApi.createPayment(paymentData);

      if (response.status === "success") {
        if (response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          message.error("Không tìm thấy đường dẫn thanh toán");
        }
      } else {
        message.error("Không thể tạo mã QR thanh toán");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error(error.message || "Có lỗi xảy ra khi tạo thanh toán");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatus = async (code: number) => {
    const maxAttempts = 60; // Check trong 5 phút (mỗi 5s)
    let attempts = 0;

    const intervalId = setInterval(async () => {
      attempts++;

      try {
        const response = await paymentApi.getPaymentStatus(code);

        if (response.data.status === "PAID") {
          clearInterval(intervalId);
          setQrModalOpen(false);
          message.success("Thanh toán thành công!");
          navigate("/payment/success");
        } else if (response.data.status === "CANCELLED") {
          clearInterval(intervalId);
          setQrModalOpen(false);
          message.error("Thanh toán đã bị hủy");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, 5000);
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      message.warning("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    // Nếu chọn QR payment
    if (selectedPaymentMethod === "qr") {
      handleQRPayment();
      return;
    }

    message.success("Đặt hàng thành công!");
    navigate("/");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  if (!state) return <div>Loading...</div>;

  const totalToPay =
    (state.totalAmount || 0) + (state.shippingInfo?.fee || 0) - mockDiscount;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <HeaderHome />

      <div className="container mx-auto px-4 py-4 max-w-3xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-4 relative">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="absolute left-0"
          >
            Trở về
          </Button>
          <h2 className="text-lg font-bold w-full text-center m-0">
            Thanh toán
          </h2>
        </div>

        {/* Steps/Tabs */}
        <div className="flex mb-6 border-b">
          <div
            className="flex-1 text-center py-2 border-b-2 border-transparent text-gray-400 font-medium cursor-pointer"
            onClick={() => navigate(-1)}
          >
            1. THÔNG TIN
          </div>
          <div className="flex-1 text-center py-2 border-b-2 border-red-600 font-bold text-red-600">
            2. THANH TOÁN
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nhập mã giảm giá (chỉ áp dụng 1 lần)"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleApplyCoupon}
              type="default"
              className="bg-gray-100 text-gray-500 font-medium border-none hover:bg-gray-200"
            >
              Áp dụng
            </Button>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Số lượng sản phẩm</span>
              <span className="font-bold">
                {state.items?.length || 0 < 10
                  ? `0${state.items?.length || 0}`
                  : state.items?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tổng tiền hàng</span>
              <span className="font-bold">
                {formatPrice(state.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="font-bold">Miễn phí</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span className="flex items-center gap-1">
                Chiết khấu Smember{" "}
                <span className="text-[10px] border border-green-500 text-green-500 px-1 rounded">
                  S-MEM
                </span>
              </span>
              <span className="font-bold">- {formatPrice(mockDiscount)}</span>
            </div>
          </div>

          <div className="border-t mt-3 pt-3 flex justify-between items-end">
            <div>
              <div className="font-bold text-base">Tổng tiền</div>
              <div className="text-xs text-gray-400">
                Đã gồm VAT và được làm tròn
              </div>
            </div>
            <div className="font-bold text-lg text-black">
              {formatPrice(totalToPay)}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-2 uppercase text-xs font-bold text-gray-500">
          THÔNG TIN THANH TOÁN
        </div>
        <div
          className="bg-white rounded-lg shadow-sm p-4 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setIsPaymentModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-blue-100 rounded flex items-center justify-center">
                {/* Simple card icon representation */}
                <div className="w-6 h-4 bg-blue-400 rounded-sm relative">
                  <div className="h-1 bg-blue-600 mt-1 w-full"></div>
                  <div className="w-1 h-1 bg-white absolute bottom-1 left-1 rounded-full"></div>
                </div>
              </div>
              <div>
                {selectedPaymentMethod ? (
                  <div className="text-gray-900 font-bold text-sm">
                    {
                      paymentMethods.find((m) => m.id === selectedPaymentMethod)
                        ?.name
                    }
                  </div>
                ) : (
                  <>
                    <div className="text-red-600 font-bold text-sm">
                      Chọn phương thức thanh toán
                    </div>
                    <div className="text-xs text-gray-500">
                      Giảm thêm tới 1.000.000đ
                    </div>
                  </>
                )}
              </div>
            </div>
            <RightOutlined className="text-gray-400 text-xs" />
          </div>
        </div>

        {/* Shipping Info Review */}
        <div className="mb-2 uppercase text-xs font-bold text-gray-500">
          THÔNG TIN NHẬN HÀNG
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Khách hàng</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] border border-green-500 text-green-500 px-1 rounded">
                S-MEM
              </span>
              <span className="font-bold text-gray-800">
                {state.customerInfo?.fullname}
              </span>
            </div>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Số điện thoại</span>
            <span className="font-bold text-gray-800">
              {state.customerInfo?.phone}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Email</span>
            <span className="font-bold text-gray-800">
              {state.customerInfo?.email}
            </span>
          </div>
          {/* Address Display Logic */}
          <div className="flex justify-between items-start">
            <span className="text-gray-500 whitespace-nowrap mr-4">
              Nhận hàng tại
            </span>
            <span className="font-bold text-gray-800 text-right">
              {state.shippingInfo?.method === "store"
                ? "Cửa hàng: 123 Nguyễn Huệ, TP Quy Nhơn" // Mock store address if simple
                : state.shippingInfo?.address || "Đia chỉ chưa cập nhật"}
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-24">
          <Checkbox defaultChecked className="text-sm items-start">
            <span className="text-gray-600">
              Bằng việc Đặt hàng, bạn đồng ý với{" "}
              <a href="#" className="text-blue-600">
                Điều khoản sử dụng
              </a>{" "}
              của CellphoneS.
            </span>
          </Checkbox>
          <div className="text-xs text-gray-500 mt-1 ml-6">
            Với các giao dịch{" "}
            <span className="font-bold">từ 10 triệu trở lên</span>, CellphoneS
            xin phép kiểm tra <span className="font-bold">thẻ cứng</span> và
            CCCD của đúng chủ thẻ trước khi tiến hành giao hàng nhằm hạn chế các
            trường hợp gian lận.
          </div>
        </div>

        {/* Footer Total */}
        <div className="bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-4 fixed bottom-0 left-0 right-0 z-50">
          <div className="container mx-auto max-w-3xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">
                Tổng tiền tạm tính:
              </span>
              <span className="font-bold text-red-600 text-lg">
                {formatPrice(totalToPay)}
              </span>
            </div>
            <Button
              type="primary"
              onClick={handlePayment}
              className="w-full h-12 bg-red-600 hover:bg-red-700 font-bold text-lg rounded uppercase border-none"
              block
            >
              Thanh toán
            </Button>
            <div className="text-center mt-2">
              <a href="#" className="text-blue-600 text-sm">
                Kiểm tra danh sách sản phẩm ({state.items?.length || 0})
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      <Modal
        title={
          <div className="font-bold text-base">Chọn phương thức thanh toán</div>
        }
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            className="w-full h-10 bg-red-600 hover:bg-red-700 border-none font-bold"
            onClick={() => setIsPaymentModalOpen(false)}
            disabled={!selectedPaymentMethod}
          >
            Xác nhận
          </Button>,
        ]}
        className="payment-modal"
        width={500}
        centered
      >
        <div>
          <div className="text-xs text-gray-500 font-bold mb-3 mt-4">
            KHẢ DỤNG
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`
                                    border rounded-xl p-3 cursor-pointer flex gap-3 transition-all
                                    ${selectedPaymentMethod === method.id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                  }
                                `}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                {/* Icon Placeholder */}
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white rounded border border-gray-100 p-1">
                  {method.icon.startsWith("http") ? (
                    <img
                      src={method.icon}
                      alt={method.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-gray-400">ICON</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 text-sm">
                      {method.name}
                    </span>
                    {method.isDetails && (
                      <RightOutlined className="text-gray-400 text-xs mt-1" />
                    )}
                  </div>
                  {method.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {method.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* QR Payment Modal */}
      <Modal
        open={qrModalOpen}
        onCancel={() => {
          setQrModalOpen(false);
          if (orderCode) {
            paymentApi.cancelPayment(orderCode, "Người dùng hủy thanh toán");
          }
        }}
        footer={null}
        title="Quét mã QR để thanh toán"
        centered
        width={400}
      >
        <div className="flex flex-col items-center py-6">
          {paymentLoading ? (
            <Spin size="large" />
          ) : (
            <>
              {qrCodeUrl ? (
                <>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-64 h-64 object-contain mb-4"
                  />
                  <div className="text-center">
                    <p className="text-lg font-bold mb-2">
                      Tổng tiền: {formatPrice(totalToPay)}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                    </p>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>✓ Nhanh chóng</span>
                      <span>✓ Bảo mật</span>
                      <span>✓ An toàn</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-red-500">Không thể tạo mã QR</p>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
