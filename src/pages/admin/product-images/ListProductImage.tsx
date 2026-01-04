import { Input, Modal, Tag, Tooltip, message, type TableProps } from "antd";
import BreadcrumbAmin from "../../../components/admin/BreadcrumbAmin";
import { IoIosSearch } from "react-icons/io";
import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import DisplaStatistic, {
  type ListInforProps,
} from "../../../components/admin/DisplaStatistic";
import {
  AiOutlineDesktop,
  AiOutlineException,
  AiOutlineHistory,
  AiOutlinePieChart,
} from "react-icons/ai";
import ButtonCellphoneS from "../../../components/ButtonCellphoneS";
import { IoAddCircleOutline } from "react-icons/io5";
import TableAdmin from "../../../components/admin/templates/TableAdmin";
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { productImgaesApi } from "../../../utils/api/product_images.api";
import { useEffect, useState } from "react";
import type {
  ProductImageResponse,
  ProductImagesProp,
} from "../../../types/api/ProductImageResponse";

const ListProductImage = () => {
  const navigate = useNavigate();
  const [allProductImage, setAllProductImage] =
    useState<ProductImageResponse<ProductImagesProp>["data"]>();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

  const item: BreadcrumbItemType[] = [
    {
      title: <Link to="/admin">Dashboard</Link>,
    },
    {
      title: "product-images",
    },
  ];
  const listInfor: ListInforProps[] = [
    {
      title: "Active",
      numbers: 34,
      icon: <AiOutlineDesktop />,
    },
    {
      title: "Inactive",
      numbers: 23,
      icon: <AiOutlineException />,
    },
    {
      title: "Most Products",
      numbers: 62,
      icon: <AiOutlineHistory />,
    },
    {
      title: "Top Rated",
      numbers: 82,
      icon: <AiOutlinePieChart />,
    },
  ];
  const columns: TableProps<ProductImagesProp>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image_url",
      render: (url: string) =>
        url ? (
          <img src={url} alt="Image" className="w-12 h-12 object-contain" />
        ) : (
          <Tag color="default">No image</Tag>
        ),
    },
    {
      title: "Alt Text",
      dataIndex: "alt_text",
      render: (text: string) =>
        text ? (
          <Tooltip title={text}>
            <span className="line-clamp-1 max-w-[200px]">{text}</span>
          </Tooltip>
        ) : (
          <Tag color="default">None</Tag>
        ),
    },
    {
      title: "Sort Order",
      dataIndex: "sort_order",
      render: (order: number) => <Tag color="purple">{order ?? "N/A"}</Tag>,
    },
    {
      title: "Primary",
      dataIndex: "is_primary",
      render: (is_primary: boolean) => (
        <Tag color={is_primary ? "green" : "red"}>
          {is_primary ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date: string) => (
        <span>{date ? new Date(date).toLocaleString("vi-VN") : "N/A"}</span>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (date: string) => (
        <span>{date ? new Date(date).toLocaleString("vi-VN") : "N/A"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ProductImagesProp) => (
        <div className="flex items-center gap-x-2">
          <Tooltip title="Edit">
            <div
              className="rounded-full border border-[#0fb981] p-2 cursor-pointer hover:bg-[#e6f9f3] transition"
              onClick={() => {
                console.log("Edit clicked for ID:", record.id);
                handleEdit(record.id);
              }}
            >
              <MdOutlineModeEdit className="text-[#0fb981] text-base" />
            </div>
          </Tooltip>
          <Tooltip title="Delete">
            <div
              className="rounded-full border border-[#d70119] p-2 cursor-pointer hover:bg-[#faeaea] transition"
              onClick={() => {
                console.log("Delete clicked for record:", record);
                handleDelete(record.id);
              }}
            >
              <MdDeleteOutline className="text-[#d70119] text-base" />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined || id === null) {
      message.error("Invalid image ID");
      return;
    }
    setDeleteImageId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteImageId === null) return;

    try {
      console.log("Deleting image with ID:", deleteImageId);
      await productImgaesApi.delete(deleteImageId);
      message.success("Image deleted successfully");
      setDeleteModalVisible(false);
      setDeleteImageId(null);
      fetchProductImage(); // Refresh the list
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete image";
      message.error(errorMessage);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteImageId(null);
  };

  const handleEdit = (id: number | undefined) => {
    if (!id) return;
    navigate(`/admin/product-images/${id}/edit`);
  };

  const fetchProductImage = async () => {
    try {
      const result = await productImgaesApi.getAll();
      setAllProductImage(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductImage();
  }, []);

  return (
    <>
      <div className="p-4">
        <div className="md:flex items-center justify-between hidden">
          <div>
            <h1 className="md:font-medium md:text-[1.7rem] hidden md:block">
              Product images
            </h1>
            <BreadcrumbAmin items={item} />
          </div>
          <div>
            <Input
              placeholder="Search anything"
              prefix={<IoIosSearch className="text-[1.2rem]" />}
              className="text-[0.8rem] w-[15rem] h-[2.5rem]"
            />
          </div>
        </div>
        <DisplaStatistic type="category" listInfor={listInfor} />
        <div className="bg-white rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[1.2rem] font-medium hidden md:block">
              Product images
            </span>
            <div className="flex items-center gap-x-4 md:w-auto w-full">
              <div>
                <Input
                  placeholder="Search images"
                  prefix={<IoIosSearch className="text-[1.2rem]" />}
                  className="text-[0.8rem] md:w-[20rem] w-[15rem] bg-[#f5f5f5] h-[3rem]"
                />
              </div>
              <ButtonCellphoneS
                children={
                  <div className="flex items-center gap-x-1">
                    <IoAddCircleOutline className="text-white text-[1.5rem]" />
                    <span className="hidden md:block">New image</span>
                  </div>
                }
                defaultActiveBg="#292929"
                defaultHoverBg="#292929"
                defaultHoverBorderColor="#292929"
                className="text-white h-[2rem] bg-black border-none text-[0.8rem]"
                onClick={() => navigate("/admin/product-images/create")}
              />
            </div>
          </div>
          <div className="mt-4">
            <TableAdmin
              columns={columns}
              dataSource={allProductImage}
              scroll={{ x: "max-content" }}
              pagination={{ pageSize: 10, position: ["bottomRight"] }}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Product Image"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this image?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default ListProductImage;
