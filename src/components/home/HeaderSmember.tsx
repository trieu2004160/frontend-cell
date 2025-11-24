import { Input } from "antd";
import { IoMdSearch } from "react-icons/io";
import { LuStore } from "react-icons/lu";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import SvgLogoDesktop from "../svg/SvgLogoDesktop";
import { useNavigate } from "react-router-dom";

const HeaderSmember = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#d70018] h-[64px] w-full sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-6xl h-full flex items-center justify-between gap-8">
                {/* Logo */}
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                    <SvgLogoDesktop />
                </div>

                {/* Search */}
                <div className="flex-1 max-w-2xl">
                    <Input
                        placeholder="Bạn muốn mua gì hôm nay?"
                        prefix={<IoMdSearch className="text-[1.2rem] text-gray-500" />}
                        className="rounded-lg py-1.5"
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6 text-white text-xs font-medium">
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
                        <LuStore className="text-xl" />
                        <span className="hidden md:inline">
                            Cửa hàng
                            <br />
                            gần bạn
                        </span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
                        <MdOutlinePhoneInTalk className="text-xl" />
                        <span className="hidden md:inline">
                            Tổng đài
                            <br />
                            1800 2097
                        </span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
                        <FiShoppingCart className="text-xl" />
                        <span className="hidden md:inline">Giỏ hàng</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderSmember;
