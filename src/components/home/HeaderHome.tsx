import { TbPointFilled } from "react-icons/tb";
import Marquee from "react-fast-marquee";
import { useState, type JSX } from "react";
import { GoArrowSwitch } from "react-icons/go";
import { AiFillAlert } from "react-icons/ai";
import SvgLogo from "../svg/SvgLogo";
import SvgDelivery from "../svg/SvgDelivery";
import { Badge, Input, Dropdown, Tabs } from "antd";
import type { TabsProps } from "antd";
import { IoMdSearch } from "react-icons/io";
import { GrMapLocation } from "react-icons/gr";
import ModalCellphoneS from "../../hooks/ModalCellphoneS";
import ButtonCellphoneS from "../ButtonCellphoneS";
import { GoBell } from "react-icons/go";
import SpaceCellphoneS from "../SpaceCellphoneS";
import { LuStore } from "react-icons/lu";
import { FiFileText } from "react-icons/fi";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { MdOutlinePhoneIphone } from "react-icons/md";
import SvgLogoDesktop from "../svg/SvgLogoDesktop";
import { BiCategory } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HeaderHome.css";
import Svgoto from "../svg/svgoto";

interface MarqueeProps {
  icon: JSX.Element;
  content: string;
}

const HeaderHome = () => {
  // Check localStorage directly for user authentication
  const userInfo = localStorage.getItem("user");
  const isAuthenticated = !!userInfo;
  const user = userInfo ? JSON.parse(userInfo) : null;

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Notification tabs items
  const notificationTabItems: TabsProps["items"] = [
    {
      key: "all",
      label: "Tất cả",
      children: (
        <div className="max-h-[400px] overflow-y-auto">
          <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                <Svgoto />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Đơn hàng{" "}
                  <span className="font-semibold">02430S2412000478</span> vừa
                  được giao thành công. Cảm ơn bạn đã đặt hàng tại CellphoneS.
                </p>
                <p className="text-xs text-gray-400 mt-1">11 tháng trước</p>
              </div>
            </div>
          </div>
          <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="text-2xl relative">
                <SvgDelivery />

                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Đơn hàng{" "}
                  <span className="font-semibold">02430S2412000478</span> đã
                  được cửa hàng xác nhận và sẽ giao tới bạn trong thời gian sớm
                  nhất.
                </p>
                <p className="text-xs text-gray-400 mt-1">11 tháng trước</p>
              </div>
            </div>
          </div>
          <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                <Svgoto />
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Đơn hàng{" "}
                  <span className="font-semibold">02430S2406000027</span> vừa
                  được giao thành công. Cảm ơn bạn đã đặt hàng tại CellphoneS.
                </p>
                <p className="text-xs text-gray-400 mt-1">1 năm trước</p>
              </div>
            </div>
          </div>
          <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="text-2xl relative">
                <SvgDelivery />

                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  Đơn hàng{" "}
                  <span className="font-semibold">02430S2406000027</span> đã
                  được cửa hàng xác nhận và sẽ giao tới bạn trong thời gian sớm
                  nhất.
                </p>
                <p className="text-xs text-gray-400 mt-1">1 năm trước</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "orders",
      label: "Đơn hàng",
      children: (
        <div className="max-h-[400px] overflow-y-auto">
          <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <Svgoto />
              <div className="text-2xl"></div>
              <div className="flex-1">
                <p className="text-sm">
                  Đơn hàng{" "}
                  <span className="font-semibold">02430S2412000478</span> vừa
                  được giao thành công.
                </p>
                <p className="text-xs text-gray-400 mt-1">11 tháng trước</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "comments",
      label: "Bình luận",
      children: (
        <div className="p-8 text-center text-gray-400">
          Chưa có bình luận nào
        </div>
      ),
    },
  ];

  // User dropdown menu with Smember access
  const userDropdownContent = (
    <div className="w-[380px] bg-white rounded-lg shadow-lg">
      {/* Smember Access Section */}
      <div
        className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer"
        onClick={() => navigate("/smember")}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <img
              src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/smember230625.png"
              alt="Smember"
            />
          </div>
          <span className="font-medium text-red-500">Truy cập Smember</span>
        </div>
        <IoIosArrowDown className="rotate-[-90deg] text-gray-400" />
      </div>

      {/* Notification Tabs */}
      <div className="border-b">
        <p className="px-4 pt-3 pb-2 font-medium text-sm">Thông báo</p>
        <Tabs
          defaultActiveKey="all"
          items={notificationTabItems}
          className="notification-tabs px-2"
        />
      </div>

      {/* Bottom Action Button */}
      <div className="p-3">
        <button
          className="w-full py-2 text-center text-blue-500 hover:bg-blue-50 rounded transition-colors"
          onClick={() => setDropdownOpen(false)}
        >
          Đóng
        </button>
      </div>
    </div>
  );

  const marquee: MarqueeProps[] = [
    {
      icon: <GoArrowSwitch />,
      content: "Giao nhanh - Miễn phí cho đơn 300k",
    },
    {
      icon: <GoArrowSwitch />,
      content: "Thu cũ giá ngon - Lên đời tiết kiệm",
    },
    {
      icon: <AiFillAlert />,
      content: "Sản phẩm Chính hãng - Xuất VAT đầy đủ",
    },
  ];

  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <>
      {/* Overlay mờ khi dropdown mở */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}

      <div className="bg-color md:w-full pb-4 sticky top-0 left-0 z-50">
        <div className="w-full px-64">
          <div className=" md:flex md:items-center md:px-[1rem]">
            <div className="md:w-[60%]">
              <Marquee speed={100} pauseOnHover={true}>
                <div className="flex mt-2">
                  {marquee.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-x-3 font-medium text-white text-[0.7rem] mr-4 hover:text-yellow-300 transition-colors cursor-pointer"
                    >
                      <div className="text-[1.3rem] animate-pulse">
                        {" "}
                        {item.icon}
                      </div>
                      <span className="font-semibold">{item.content}</span>
                      <TbPointFilled className="text-yellow-400" />
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
            <div className="md:flex md:items-center md:flex-1 md:mt-2 md:gap-x-4 hidden">
              <SpaceCellphoneS />
              <div className="flex md:items-center md:gap-x-2 md:text-white">
                <LuStore />
                <p className="whitespace-nowrap text-[0.7rem]">
                  Cửa hàng gần bạn
                </p>
              </div>
              <SpaceCellphoneS />
              <div className="md:flex md:items-center md:gap-x-2 md:text-white ">
                <FiFileText />
                <p className="whitespace-nowrap text-[0.7rem]">
                  Tra cứu đơn hàng
                </p>
              </div>
              <SpaceCellphoneS />
              <div className="md:flex md:items-center md:gap-x-2 md:text-white ">
                <MdOutlinePhoneInTalk />
                <p className="whitespace-nowrap text-[0.7rem]">1800 2097</p>
              </div>
              <SpaceCellphoneS />
              <div className="md:flex md:items-center md:gap-x-2 md:text-white ">
                <MdOutlinePhoneIphone />
                <p className="whitespace-nowrap text-[0.7rem]">Tải ứng dụng</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center md:gap-x-4 mt-4   ">
              <div
                className="md:hidden cursor-pointer"
                onClick={handleLogoClick}
              >
                <SvgLogo width="38" height="40" />
              </div>
              <div
                className="hidden md:block cursor-pointer"
                onClick={handleLogoClick}
              >
                <SvgLogoDesktop />
              </div>
              <ButtonCellphoneS
                className="bg-[#e45464] text-white rounded-[10px] w-[25%] hidden md:block"
                children={
                  <div className="flex items-center gap-x-2">
                    <BiCategory className="text-[1.5rem]" />
                    <p className="text-[0.8rem]">Danh mục</p>
                    <IoIosArrowDown className="text-[1.2rem]" />
                  </div>
                }
                onClick={() => setIsOpen(true)}
              />
              <ButtonCellphoneS
                className="bg-[#e45464] text-white rounded-[10px] hidden md:block w-[25%]"
                children={
                  <div className="flex items-center gap-x-2">
                    <GrMapLocation className="text-[1.5rem]" />
                    <p className="text-[0.8rem]">Bình Định</p>
                    <IoIosArrowDown className="text-[1.2rem]" />
                  </div>
                }
                onClick={() => setIsOpen(true)}
              />
              <Input
                placeholder="Bạn muốn mua gì hôm nay?"
                prefix={<IoMdSearch className="text-[1.5rem]" />}
                className="py-2"
              />
              <div className="hidden md:block">
                <div className="md:flex md:items-center md:gap-x-4">
                  <div className="md:flex md:items-center md:gap-x-2 md:text-white  ">
                    <p className="whitespace-nowrap md:text-[0.9rem]">
                      Giỏ hàng
                    </p>
                    <Badge size="small" count={5}>
                      <FiShoppingCart className="text-white text-[1.5rem]" />
                    </Badge>
                  </div>
                  {isAuthenticated ? (
                    <Dropdown
                      dropdownRender={() => userDropdownContent}
                      placement="bottomRight"
                      trigger={["click"]}
                      open={dropdownOpen}
                      onOpenChange={setDropdownOpen}
                    >
                      <ButtonCellphoneS
                        className="bg-[#e45464] text-white"
                        children={
                          <div className="flex items-center gap-x-2">
                            <span className="whitespace-nowrap text-[0.9rem]">
                              {user?.full_name || "User"}
                            </span>
                            <FaRegUserCircle className="text-white text-[1.5rem]" />
                          </div>
                        }
                      />
                    </Dropdown>
                  ) : (
                    <ButtonCellphoneS
                      className="bg-[#e45464]"
                      children={
                        <div className="md:flex md:items-center md:gap-x-2 text-white">
                          <p>Đăng nhập</p>
                          <FaRegUserCircle className="text-[1.5rem] text-white" />
                        </div>
                      }
                      onClick={() => setOpenLogin(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <ButtonCellphoneS
              className="bg-[#e45464] text-white rounded-[10px] w-[10rem] md:hidden"
              children={
                <div className="flex items-center gap-x-2">
                  <GrMapLocation className="text-[1.5rem]" />
                  <p className="text-[0.8rem]">
                    Xem giá tại
                    <br />
                    Bình Định
                  </p>
                </div>
              }
              onClick={() => setIsOpen(true)}
            />
            <ModalCellphoneS
              children={"Le Doan Hieu"}
              open={isOpen}
              onCancel={() => setIsOpen(false)}
            />
            <Badge size="small" count={5} className="md:hidden">
              <GoBell className="text-[1.4rem] text-white" />
            </Badge>
          </div>
        </div>
        <ModalCellphoneS
          children={
            <div className="bg-white rounded-lg p-4 flex flex-col items-center w-[20rem]">
              <span className="text-[#d70019] font-medium text-[2rem] text-center">
                Smember
              </span>
              <img
                src="/images/chibi2.webp"
                className="object-contain"
                alt="Chibi character"
              />
              <p className="font-bold opacity-80">
                Vui lòng đăng nhập tài khoản Smember để xem ưu đãi và thanh toán
                dễ dàng hơn.
              </p>
              <div className="flex gap-x-4 mt-4">
                <ButtonCellphoneS
                  children="Đăng ký"
                  className="bg-white w-[10rem]"
                  defaultHoverBg="white"
                  onClick={() => navigate("/register")}
                />
                <ButtonCellphoneS
                  children="Đăng nhập"
                  className="text-white w-[10rem]"
                  onClick={() => navigate("/login")}
                />
              </div>
            </div>
          }
          open={openLogin}
          onCancel={() => setOpenLogin(false)}
          className="flex justify-center top-1/4"
        />
      </div>
    </>
  );
};

export default HeaderHome;
