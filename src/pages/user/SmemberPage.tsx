import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  UserOutlined,
  HistoryOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FaCrown, FaRegCreditCard } from "react-icons/fa";
import { MdOutlineBusinessCenter, MdOutlineSchool } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import HeaderSmember from "../../components/home/HeaderSmember";

const SmemberPage = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem("user");
  const user = userInfo ? JSON.parse(userInfo) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  const sidebarItems = [
    { icon: <HomeOutlined />, label: "Tổng quan", active: true },
    { icon: <HistoryOutlined />, label: "Lịch sử mua hàng" },
    { icon: <SafetyCertificateOutlined />, label: "Tra cứu bảo hành" },
    { icon: <FaCrown />, label: "Hạng thành viên và ưu đãi" },
    {
      icon: <MdOutlineBusinessCenter />,
      label: "Ưu đãi và đơn hàng S-Business",
    },
    { icon: <MdOutlineSchool />, label: "Ưu đãi S-Student và S-Teacher" },
    {
      icon: <IoShareSocialOutline />,
      label: "Giới thiệu bạn bè",
      badge: "Mới",
    },
    { icon: <UserOutlined />, label: "Thông tin tài khoản" },
    { icon: <SearchOutlined />, label: "Tìm kiếm cửa hàng" },
    { icon: <FileTextOutlined />, label: "Chính sách bảo hành" },
    { icon: <QuestionCircleOutlined />, label: "Góp ý - Phản hồi - Hỗ trợ" },
    { icon: <FileTextOutlined />, label: "Điều khoản sử dụng" },
  ];

  const quickActions = [
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/rank-icon.d0f44c06.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "Hạng thành viên",
    },
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/promotion-icon.99af272d.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "Mã giảm giá",
    },
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/history-icon.2ebe1813.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "Lịch sử mua hàng",
    },
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/address-icon.169a4d95.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "Số địa chi",
    },
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/edu-icon.76bd96ea.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "S-Student & S-Teacher",
    },
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/link-icon.1de266bc.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "Liên kết tài khoản",
    },
    {
      icon: (
        <img
          src="https://cdn-static.smember.com.vn/_next/static/media/referal-icon.97e93fb8.svg"
          alt="Hạng thành viên"
        />
      ),
      label: "Giới thiệu bạn bè",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-10">
      <HeaderSmember />
      {/* Header Info */}
      <div className="bg-white border-b mb-4">
        <div className="container mx-auto px-4 max-w-6xl py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center overflow-hidden border-2 border-red-500">
                <img
                  src="/images/chibi2.webp"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://cdn2.cellphones.com.vn/50x50,webp,q100/media/wysiwyg/Shipper_CPS3_1.png";
                  }}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  {user?.full_name || "Triều Võ"}
                  <span className="text-xs font-normal text-gray-500">
                    {user?.phone || "032*****04"}
                  </span>
                </h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold">
                    S-MEM
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold">
                    S-Student
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  © Cập nhật lại sau 01/01/2026
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 w-full md:w-auto justify-around md:justify-end">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
                  <HistoryOutlined />
                </div>
                <div>
                  <p className="text-lg font-bold">4</p>
                  <p className="text-xs text-gray-500">
                    Tổng số đơn hàng đã mua
                  </p>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
                  <FaRegCreditCard />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#d70018]">
                    46.749.000đ
                  </p>
                  <p className="text-xs text-gray-500">
                    Tổng tiền tích lũy Từ 01/01/2024
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Cần chi tiêu thêm <b className="text-black">3.251.000</b> để
                    lên hạng <b className="text-black">S-VIP</b>
                  </p>
                </div>
              </div>
            </div>

            {/* Channel Selector */}
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-500 mb-1">
                Bạn đang ở kênh thành viên
              </p>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-1 bg-white cursor-pointer">
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <span className="font-medium text-sm">CellphoneS</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center md:text-left">
            📝 Tổng tiền và số đơn hàng được tính chung từ CellphoneS và Điện
            Thoại Vui.
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between overflow-x-auto gap-4 scrollbar-hide">
          {quickActions.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-2 min-w-fit cursor-pointer hover:text-red-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl group-hover:bg-red-50 group-hover:text-red-600 transition-colors flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg p-2 h-fit">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${item.active
                    ? "bg-red-50 text-red-600 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
            <div className="my-2 border-t"></div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-700"
              onClick={handleLogout}
            >
              <LogoutOutlined className="text-lg" />
              <span className="text-sm">Đăng xuất</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 flex flex-col gap-4">
            {/* Notices */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between text-blue-800 text-sm">
              <div className="flex items-center gap-2">
                <QuestionCircleOutlined />
                <span>Đăng ký S-Business để nhận ưu đãi đặc quyền!</span>
              </div>
              <span className="font-medium cursor-pointer hover:underline">
                Đăng ký ngay
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between text-blue-800 text-sm">
              <div className="flex items-center gap-2">
                <QuestionCircleOutlined />
                <span>Thêm địa chỉ để đặt đơn hàng nhanh hơn.</span>
              </div>
              <span className="font-medium cursor-pointer hover:underline">
                Thêm địa chỉ
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Recent Orders */}
              <div className="w-full md:w-2/3 bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Đơn hàng gần đây</h3>
                  <span className="text-blue-600 text-sm cursor-pointer">
                    Xem tất cả &gt;
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Mock Order 1 */}
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Đơn hàng: #02430S2508000224</span>
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Đã nhận hàng
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <img
                        src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
                        alt="Product"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-2">
                          APPLE IPHONE 15 PRO MAX 256GB TITAN TỰ NHIÊN CŨ - ĐẸP
                        </h4>
                        <p className="text-red-600 font-bold mt-1">
                          25.490.000đ
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        Đã xuất VAT
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          Tổng thanh toán:
                        </span>{" "}
                        <span className="text-red-600 font-bold">
                          24.000.000đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Order 2 */}
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Đơn hàng: #02430S2507001185</span>
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Đã nhận hàng
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <img
                        src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/h/chuot-gaming-khong-day-e-dra-em624w-den_2_.png"
                        alt="Product"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-2">
                          CHUỘT GAMING KHÔNG DÂY E-DRA EM624W ĐEN
                        </h4>
                        <p className="text-red-600 font-bold mt-1">399.000đ</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        Đã xuất VAT
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          Tổng thanh toán:
                        </span>{" "}
                        <span className="text-red-600 font-bold">269.000đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers & Favorites */}
              <div className="w-72  flex flex-col gap-4">
                <div className="bg-white rounded-lg p-4 h-[420px] flex flex-col">
                  <h3 className="font-bold text-lg mb-4">Ưu đãi của bạn</h3>
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <img
                      src="/images/chibi2.webp"
                      alt="Empty"
                      className="w-24 h-24 object-contain opacity-50 mb-2"
                    />
                    <p className="text-sm text-gray-500">
                      Bạn chưa có ưu đãi nào.{" "}
                      <span className="text-red-600 cursor-pointer">
                        Xem sản phẩm
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorite Products */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4">Sản phẩm yêu thích</h3>
              <div className="flex flex-col items-center justify-center text-center py-8">
                <img
                  src="/images/chibi2.webp"
                  alt="Empty"
                  className="w-24 h-24 object-contain opacity-50 mb-2"
                />
                <p className="text-sm text-gray-500">
                  Bạn chưa có sản phẩm nào yêu thích? Hãy bắt đầu mua sắm ngay
                  nào!{" "}
                  <span className="text-red-600 cursor-pointer">
                    Mua sắm ngay
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmemberPage;
