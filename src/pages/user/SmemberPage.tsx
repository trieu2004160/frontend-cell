import { useNavigate } from "react-router-dom";
import { Button, Card } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  GiftOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const SmemberPage = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem("user");
  const user = userInfo ? JSON.parse(userInfo) : null;

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Chuyển về trang đăng nhập và reload để AuthContext tự động cập nhật
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-5xl">💀</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">SMEMBER</h1>
              <p className="text-lg opacity-90">
                Chương trình thành viên ưu đãi
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserOutlined className="text-4xl text-gray-400" />
              <div>
                <h2 className="text-xl font-semibold">
                  {user?.full_name || "User"}
                </h2>
                <p className="text-gray-500">{user?.phone || user?.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Hạng thành viên</p>
              <p className="text-2xl font-bold text-red-500">MEMBER</p>
            </div>
          </div>
        </Card>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card hoverable>
            <div className="flex items-center gap-4">
              <GiftOutlined className="text-4xl text-red-500" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Ưu đãi đặc biệt</h3>
                <p className="text-gray-500">Giảm giá và quà tặng hấp dẫn</p>
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center gap-4">
              <TrophyOutlined className="text-4xl text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Điểm thưởng</h3>
                <p className="text-gray-500">Tích điểm đổi quà</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Program Details */}
        <Card title="Quyền lợi thành viên" className="mb-6">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✓</span>
              <span>Giảm giá đặc biệt cho các sản phẩm mới</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✓</span>
              <span>Ưu tiên nhận thông tin về chương trình khuyến mãi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✓</span>
              <span>Tích điểm thưởng khi mua hàng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✓</span>
              <span>Miễn phí giao hàng cho đơn từ 300k</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✓</span>
              <span>Hỗ trợ khách hàng 24/7</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button size="large" onClick={() => navigate("/")} className="flex-1">
            Quay về trang chủ
          </Button>
          <Button
            size="large"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="flex-1"
          >
            Đăng xuất tài khoản
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmemberPage;
