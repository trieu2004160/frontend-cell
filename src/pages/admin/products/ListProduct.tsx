import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import BreadcrumbAmin from "../../../components/admin/BreadcrumbAmin";
import { Input, Tag, type TableProps, Modal } from "antd";
import { IoIosSearch } from "react-icons/io";
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
import { productApi } from "../../../utils/api/product.api";
import { useEffect, useState, useMemo } from "react";
import type { ProductProps } from "../../../types/api/ProductResponse";
import { useMessage } from "../../../hooks/useMessage";

const ListProduct = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, contextHolder } = useMessage();
  const [dataProducts, setDataProducts] = useState<ProductProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const item: BreadcrumbItemType[] = [
    {
      title: <Link to="/admin">Dashboard</Link>,
    },
    {
      title: "products",
    },
  ];

  const fetchProducts = async () => {
    try {
      const result = await productApi.getAll({ all: true });
      setDataProducts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await productApi.delete(deleteId);
      showSuccess("Delete product successfully!");
      fetchProducts();
      setIsModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.log(error);
      showError((error as any).message || "Failed to delete product");
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const listInfor: ListInforProps[] = useMemo(() => {
    const totalProducts = dataProducts.length;
    const activeProducts = dataProducts.filter(
      (p) => p.status === "active"
    ).length;
    const outOfStock = dataProducts.filter(
      (p) => !p.stock_quantity || p.stock_quantity === 0
    ).length;
    const topRated = dataProducts.filter(
      (p) => Number(p.rating_average) >= 4.5
    ).length;

    return [
      {
        title: "Total Products",
        numbers: totalProducts,
        icon: <AiOutlineDesktop />,
      },
      {
        title: " Active Products",
        numbers: activeProducts,
        icon: <AiOutlineException />,
      },
      {
        title: "Out-of-stock",
        numbers: outOfStock,
        icon: <AiOutlineHistory />,
      },
      {
        title: "Top Rated",
        numbers: topRated,
        icon: <AiOutlinePieChart />,
      },
    ];
  }, [dataProducts]);

  const columns: TableProps["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "product_image",
      render: (product_image: string[]) => {
        return product_image?.length > 0 ? (
          <div className="flex gap-x-4 justify-between">
            {product_image.map(
              (item: string, index: number) =>
                item && (
                  <div key={index} className="flex w-[3rem] h-[3rem]">
                    <img
                      src={item}
                      alt={`Product image ${index + 1}`}
                      className="object-contain"
                    />
                  </div>
                )
            )}
          </div>
        ) : (
          <Tag>No image</Tag>
        );
      },
    },
    {
      title: "Sku",
      dataIndex: "sku",
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price: string) => (
        <span>{Number(price).toLocaleString("vi-VN")}₫</span>
      ),
    },
    {
      title: "Sale Price",
      dataIndex: "sale_price",
      render: (price: string) => (
        <span className="text-red-500">
          {Number(price).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Cost Price",
      dataIndex: "cost_price",
      render: (price: string) => (
        <span className="text-gray-500">
          {Number(price).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      render: (category_name: string) => {
        if (!category_name) {
          return <Tag color="default">Null</Tag>;
        }
        return <Tag color="geekblue">{category_name}</Tag>;
      },
    },
    {
      title: "Brand",
      dataIndex: "brand_name",
      render: (brand_name: string) => {
        if (brand_name === null) {
          return <Tag color="default">Null</Tag>;
        }
        return <Tag color="geekblue">{brand_name}</Tag>;
      },
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
    },
    {
      title: "Dimensions",
      dataIndex: "dimensions",
    },
    {
      title: "Warranty (months)",
      dataIndex: "warranty_period",
    },
    {
      title: "Featured",
      dataIndex: "is_featured",
      render: (featured: boolean) =>
        featured ? <Tag color="green">Yes</Tag> : <Tag color="default">No</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const color = status === "active" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating_average",
      render: (rating: string, { rating_count }) => (
        <span>
          {rating} ⭐ ({rating_count})
        </span>
      ),
    },
    {
      title: "Short Description",
      dataIndex: "short_description",
    },
    {
      title: "Full Description",
      dataIndex: "full_description",
    },
    {
      title: "Meta Title",
      dataIndex: "meta_title",
    },
    {
      title: "Meta Description",
      dataIndex: "meta_description",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (value: string) => value ? new Date(value).toLocaleString("vi-VN") : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (value: string) => value ? new Date(value).toLocaleString("vi-VN") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (record: ProductProps) => (
        <div className="flex items-center gap-x-3">
          <div
            className="rounded-full flex items-center justify-center border-[1px] border-[#0fb981] p-1 cursor-pointer"
            onClick={() => navigate(`/admin/products/${record.id}/edit`)}
          >
            <MdOutlineModeEdit className="text-[#0fb981] text-[0.9rem]" />
          </div>
          <button
            className="rounded-full flex items-center justify-center border-[1px] border-[#d70119] p-1 cursor-pointer bg-transparent hover:bg-red-50 transition-colors"
            onClick={() => showDeleteConfirm(record.id)}
            type="button"
          >
            <MdDeleteOutline className="text-[#d70119] text-[0.9rem]" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="p-4">
        <div className="md:flex items-center justify-between hidden">
          <div>
            <h1 className="md:font-medium md:text-[1.7rem] hidden md:block">
              Products
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
              Products
            </span>
            <div className="flex items-center gap-x-4 md:w-auto w-full">
              <div>
                <Input
                  placeholder="Search products"
                  prefix={<IoIosSearch className="text-[1.2rem]" />}
                  className="text-[0.8rem] md:w-[20rem] w-[15rem] bg-[#f5f5f5] h-[3rem]"
                />
              </div>
              <ButtonCellphoneS
                children={
                  <div className="flex items-center gap-x-1">
                    <IoAddCircleOutline className="text-white text-[1.5rem]" />
                    <span className="hidden md:block">New products</span>
                  </div>
                }
                defaultActiveBg="#292929"
                defaultHoverBg="#292929"
                defaultHoverBorderColor="#292929"
                className="text-white h-[2rem] bg-black border-none text-[0.8rem]"
                onClick={() => navigate("/admin/products/create")}
              />
            </div>
          </div>
          <div className="mt-4">
            <TableAdmin
              columns={columns}
              dataSource={dataProducts}
              scroll={{ x: "max-content" }}
              pagination={{ pageSize: 10, position: ["bottomRight"] }}
            />
          </div>
        </div>
      </div>
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </>
  );
};

export default ListProduct;
