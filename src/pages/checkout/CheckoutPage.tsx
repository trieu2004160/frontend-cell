import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Form,
    Input,
    Select,
    Radio,
    Checkbox,
    Button,
    message,
    Divider,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import HeaderHome from "../../components/home/HeaderHome";
import FooterHome from "../../components/home/FooterHome";

const { Option } = Select;

interface CartItem {
    product_id: number;
    product_name: string;
    variant_id: number;
    variant_name: string;
    price: number;
    quantity: number;
    image_url: string;
    original_price?: number;
}

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // State from navigation (Buy Now or Cart)
    const [items, setItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // Form states
    const [shippingMethod, setShippingMethod] = useState("store"); // 'store' or 'home'
    const [invoiceRequired, setInvoiceRequired] = useState(false);

    useEffect(() => {
        if (location.state?.items) {
            setItems(location.state.items);
            const total = location.state.items.reduce(
                (sum: number, item: CartItem) => sum + item.price * item.quantity,
                0
            );
            setTotalAmount(total);
        } else {
            // Fallback or redirect if no items
            // message.error("Không có sản phẩm để thanh toán");
            // navigate("/");

            // MOCK DATA FOR THE USER REQUEST (If accessed directly)
            const mockItems = [
                {
                    product_id: 1,
                    product_name: "iPhone 17 Pro 256GB | Chính hãng VN/A",
                    variant_id: 101,
                    variant_name: "Titan Tự Nhiên",
                    price: 34815000,
                    original_price: 34990000,
                    quantity: 1,
                    image_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
                }
            ];
            setItems(mockItems);
            setTotalAmount(34815000);
        }
    }, [location.state, navigate]);

    const onFinish = (values: any) => {
        console.log("Success:", values);

        // Construct detailed shipping info based on method
        let shippingInfo = {
            method: shippingMethod,
            fee: 0,
            address: ""
        };

        if (shippingMethod === "home") {
            shippingInfo.address = `${values.address}, ${values.district}, ${values.city}`;
        } else {
            // Mock store address logic
            shippingInfo.address = "123 Nguyễn Huệ, TP Quy Nhơn";
        }

        const paymentState = {
            items,
            totalAmount,
            customerInfo: {
                fullname: values.fullname,
                phone: values.phone,
                email: values.email
            },
            shippingInfo
        };

        navigate('/payment', { state: paymentState });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price) + "đ";
    };

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
                        Thông tin
                    </h2>
                </div>

                {/* Steps/Tabs */}
                <div className="flex mb-6 border-b">
                    <div className="flex-1 text-center py-2 border-b-2 border-red-600 font-bold text-red-600 cursor-pointer">
                        1. THÔNG TIN
                    </div>
                    <div className="flex-1 text-center py-2 border-b-2 border-transparent text-gray-400 font-medium cursor-not-allowed">
                        2. THANH TOÁN
                    </div>
                </div>

                {/* Product List */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start py-2 border-b last:border-0">
                            <div className="w-20 h-20 flex-shrink-0 border rounded p-1">
                                <img
                                    src={item.image_url}
                                    alt={item.product_name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-medium line-clamp-2 pr-2">
                                        {item.product_name} - {item.variant_name}
                                    </h3>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div>
                                        <div className="text-red-600 font-bold">
                                            {formatPrice(item.price)}
                                        </div>
                                        {item.original_price && item.original_price > item.price && (
                                            <div className="text-gray-400 text-xs line-through">
                                                {formatPrice(item.original_price)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Số lượng: <span className="font-medium text-black">{item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        shipping_method: "store",
                        invoice: false,
                        // Mock initial values for easier testing
                        fullname: "Triều Võ",
                        phone: "0329653804",
                        email: "vo2004123@gmail.com",
                        city: "BinhDinh"
                    }}
                >
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
                            Thông tin khách hàng
                        </h3>

                        <Form.Item
                            name="fullname"
                            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            className="mb-3"
                        >
                            <Input placeholder="Họ và tên (bắt buộc)" className="h-10 rounded" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                            className="mb-3"
                        >
                            <Input placeholder="Số điện thoại (bắt buộc)" className="h-10 rounded" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" }
                            ]}
                            className="mb-1"
                        >
                            <Input placeholder="Email (Vui lòng điền email để nhận hóa đơn VAT)" className="h-10 rounded" />
                        </Form.Item>
                        <div className="text-xs text-gray-500 italic mb-3">
                            (*) Hóa đơn VAT sẽ được gửi qua email này
                        </div>

                        <Form.Item name="subscribe" valuePropName="checked" className="mb-0">
                            <Checkbox>Nhận email thông báo và ưu đãi từ CellphoneS</Checkbox>
                        </Form.Item>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
                            Thông tin nhận hàng
                        </h3>

                        <Form.Item name="shipping_method" className="mb-4">
                            <Radio.Group
                                className="w-full grid grid-cols-2 gap-2"
                                onChange={(e) => setShippingMethod(e.target.value)}
                            >
                                <Radio.Button
                                    value="store"
                                    className={`text-center h-10 flex items-center justify-center rounded ${shippingMethod === 'store' ? 'border-red-600 text-red-600 bg-red-50' : 'bg-gray-100 border-transparent'}`}
                                    style={{ border: shippingMethod === 'store' ? '1px solid #dc2626' : '1px solid #f3f4f6' }}
                                >
                                    <span className={shippingMethod === 'store' ? 'text-red-600 font-medium' : 'text-gray-600'}>Nhận tại cửa hàng</span>
                                </Radio.Button>
                                <Radio.Button
                                    value="home"
                                    className={`text-center h-10 flex items-center justify-center rounded ${shippingMethod === 'home' ? 'border-red-600 text-red-600 bg-red-50' : 'bg-gray-100 border-transparent'}`}
                                    style={{ border: shippingMethod === 'home' ? '1px solid #dc2626' : '1px solid #f3f4f6' }}
                                >
                                    <span className={shippingMethod === 'home' ? 'text-red-600 font-medium' : 'text-gray-600'}>Giao hàng tận nơi</span>
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        {shippingMethod === "store" && (
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <Form.Item name="city" className="mb-0">
                                    <Select placeholder="Tỉnh / Thành phố" className="h-10">
                                        <Option value="HCM">Hồ Chí Minh</Option>
                                        <Option value="HN">Hà Nội</Option>
                                        <Option value="BinhDinh">Bình Định</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="district" className="mb-0">
                                    <Select placeholder="Quận / Huyện" className="h-10">
                                        <Option value="Q1">Quận 1</Option>
                                        <Option value="TPQN">TP Quy Nhơn</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        )}
                        {shippingMethod === "store" && (
                            <Form.Item name="store_address" className="mb-3">
                                <Select placeholder="Chọn địa chỉ cửa hàng" className="h-10">
                                    <Option value="store1">123 Nguyễn Huệ, TP Quy Nhơn</Option>
                                </Select>
                            </Form.Item>
                        )}

                        {shippingMethod === "home" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Form.Item name="city" className="mb-0" rules={[{ required: true, message: "Chọn Tỉnh/Thành phố" }]}>
                                        <Select placeholder="Tỉnh / Thành phố" className="h-10">
                                            <Option value="HCM">Hồ Chí Minh</Option>
                                            <Option value="HN">Hà Nội</Option>
                                            <Option value="BinhDinh">Bình Định</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="district" className="mb-0" rules={[{ required: true, message: "Chọn Quận/Huyện" }]}>
                                        <Select placeholder="Quận / Huyện" className="h-10">
                                            <Option value="Q1">Quận 1</Option>
                                            <Option value="TPQN">TP Quy Nhơn</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <Form.Item name="address" className="mb-0" rules={[{ required: true, message: "Nhập địa chỉ" }]}>
                                    <Input placeholder="Số nhà, tên đường" className="h-10 rounded" />
                                </Form.Item>
                            </div>
                        )}

                        <Form.Item name="note" className="mb-0 mt-3">
                            <Input placeholder="Ghi chú khác (nếu có)" className="h-10 rounded" />
                        </Form.Item>
                    </div>

                    {/* Invoice Option */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
                        <span className="font-medium text-sm">Quý khách có muốn xuất hóa đơn công ty không?</span>
                        <Form.Item name="invoice" className="mb-0">
                            <Radio.Group onChange={(e) => setInvoiceRequired(e.target.value)}>
                                <Radio value={true}>Có</Radio>
                                <Radio value={false}>Không</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {invoiceRequired && (
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <Form.Item name="company_name" rules={[{ required: true, message: "Nhập tên công ty" }]} className="mb-3">
                                <Input placeholder="Tên công ty" className="h-10 rounded" />
                            </Form.Item>
                            <Form.Item name="tax_code" rules={[{ required: true, message: "Nhập mã số thuế" }]} className="mb-3">
                                <Input placeholder="Mã số thuế" className="h-10 rounded" />
                            </Form.Item>
                            <Form.Item name="company_address" rules={[{ required: true, message: "Nhập địa chỉ công ty" }]} className="mb-0">
                                <Input placeholder="Địa chỉ công ty" className="h-10 rounded" />
                            </Form.Item>
                        </div>
                    )}

                    {/* Footer Total */}
                    <div className="bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-4 fixed bottom-0 left-0 right-0 z-50">
                        <div className="container mx-auto max-w-3xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-gray-700">Tổng tiền tạm tính:</span>
                                <span className="font-bold text-red-600 text-lg">{formatPrice(totalAmount)}</span>
                            </div>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full h-12 bg-red-600 hover:bg-red-700 font-bold text-lg rounded uppercase border-none"
                                block
                            >
                                Tiếp tục
                            </Button>
                        </div>
                    </div>
                    {/* Spacer for fixed footer */}
                    <div className="h-24"></div>

                </Form>
            </div>

            {/* Hide default footer on checkout to avoid clutter, or keep it if design requires. 
          The screenshot doesn't show footer, but usually checkout pages are minimal. 
          However, I'll allow FooterHome if it's below. But the fixed footer might overlap.
      */}
            {/* <FooterHome /> */}
        </div>
    );
};

export default CheckoutPage;
