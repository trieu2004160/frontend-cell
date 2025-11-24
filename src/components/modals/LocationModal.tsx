import { Modal, Input } from "antd";
import { useState, useMemo } from "react";
import { IoMdSearch } from "react-icons/io";
import { provinces } from "../../constants/provinces";
import { IoCheckmarkCircle } from "react-icons/io5";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: string) => void;
    selectedLocation: string;
}

const LocationModal = ({
    isOpen,
    onClose,
    onSelectLocation,
    selectedLocation,
}: LocationModalProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProvinces = useMemo(() => {
        return provinces.filter((province) =>
            province.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            title={
                <div className="text-white text-lg font-bold">
                    Chọn tỉnh thành để xem giá chính xác
                </div>
            }
            closeIcon={<span className="text-white text-xl">✕</span>}
            className="location-modal"
            styles={{
                content: { padding: 0, borderRadius: "8px", overflow: "hidden" },
                header: {
                    backgroundColor: "#d70018",
                    padding: "12px 16px",
                    marginBottom: 0,
                },
                body: { padding: "16px" },
            }}
            width={400}
            centered
        >
            <div className="mb-4">
                <Input
                    placeholder="Nhập tên tỉnh thành"
                    prefix={<IoMdSearch className="text-gray-400 text-lg" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-lg py-2"
                    allowClear
                />
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {filteredProvinces.map((province) => (
                        <div
                            key={province}
                            onClick={() => {
                                onSelectLocation(province);
                                onClose();
                            }}
                            className={`
                cursor-pointer p-2 rounded-lg text-sm transition-all flex items-center justify-between
                ${selectedLocation === province
                                    ? "bg-red-50 text-[#d70018] font-medium border border-red-100"
                                    : "hover:bg-gray-50 text-gray-700"
                                }
              `}
                        >
                            <span>{province}</span>
                            {selectedLocation === province && (
                                <IoCheckmarkCircle className="text-[#d70018]" />
                            )}
                        </div>
                    ))}
                </div>
                {filteredProvinces.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        Không tìm thấy tỉnh thành nào
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default LocationModal;
