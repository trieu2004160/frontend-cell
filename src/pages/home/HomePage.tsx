import FooterHome from "../../components/home/FooterHome";
import HeaderHome from "../../components/home/HeaderHome";
import ButtonCellphoneS from "../../components/ButtonCellphoneS";
import { SlEarphonesAlt } from "react-icons/sl";
import { Popover } from "antd";
// import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";
import CategoryHome from "../../components/home/category/CategoryHome";
import SmartphoneList from "../../components/home/SmartphoneList";
import LaptopList from "../../components/home/LaptopList";
import ScreenList from "../../components/home/ScreenList";
import TabletList from "../../components/home/TabletList";
import SoundList from "../../components/home/SoundList";
import ClockSmartList from "../../components/home/ClockSmartList";
import HouseHoldList from "../../components/home/HouseHoldList";
import TiviList from "../../components/home/TiviList";
import SpecialStudent from "../../components/home/SpecialStudent";
import SpecialPayment from "../../components/home/SpecialPayment";
import SpecialBrand from "../../components/home/SpecialBrand";
import SuggestForYou from "../../components/home/SuggestForYou";
import ProductWatched from "../../components/home/ProductWatched";
import NavbarMobile from "../../components/home/NavbarMobile";

const HomePage = () => {
  return (
    <>
      <div className="z-30">
        <div className="fixed top-[40rem] right-[10rem] hidden md:block z-30">
          <Popover
            content={
              <div className=" bg-white p-4 rounded-lg">
                <div className="flex items-center gap-x-1 mb-4 cursor-pointer">
                  <img
                    src="/images/icon-cskh-2025.webp"
                    className="w-[2rem]"
                    alt="Icon chat với nhân viên"
                  />
                  <span>Chat với nhân viên</span>
                </div>
                <div className="flex items-center gap-x-1 cursor-pointer">
                  <img
                    src="/images/icon-zalo-2025.webp"
                    className="w-[2rem]"
                    alt="Icon Zalo"
                  />
                  <span>Liên hệ Zalo</span>
                </div>
              </div>
            }
            trigger="click"
            placement="topRight"
          >
            <ButtonCellphoneS
              className="text-white md:h-[2.5rem]"
              children={
                <div className="md:flex md:items-center md:gap-x-2">
                  <span>Liên hệ</span>
                  <SlEarphonesAlt />
                </div>
              }
            />
          </Popover>
        </div>
        <HeaderHome />
        <div className="md:px-[15.5rem] px-4 bg-[#ffffff] flex flex-col gap-y-4">
          <CategoryHome />
          <img
            src="/images/special-b2s-dday2-desk.gif"
            className="rounded-lg w-full h-full object-cover hidden md:block"
            alt="Banner khuyến mãi đặc biệt desktop"
          />
          <img
            src="/images/special-b2s-dday2-mb.gif"
            className="rounded-lg w-full h-full object-cover md:hidden"
            alt="Banner khuyến mãi đặc biệt mobile"
          />
          {/* <FlashSale /> */}
          <SuggestForYou />
          <SmartphoneList />
          <LaptopList />
          <ScreenList />
          <TabletList />
          <SoundList />
          <ClockSmartList />
          <HouseHoldList />
          <TiviList />
          <ProductWatched />
          <SpecialStudent />
          <SpecialPayment />
          <SpecialBrand />
        </div>
        <NavbarMobile />
        <FooterHome />
      </div>
    </>
  );
};

export default HomePage;
