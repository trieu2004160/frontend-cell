import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Upload,
  message,
  Space,
  Popconfirm,
  Card,
  Image,
  Tag,
  Input,
  Row,
  Col,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

interface ProductImage {
  id: number;
  productId: number;
  productName: string;
  imageType: "main" | "gallery" | "variant";
  imageUrl: string;
  variantInfo?: {
    capacity?: string;
    color?: string;
  };
  alt: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
}

const AdminProductImages: React.FC = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load products
      setProducts([
        { id: 1, name: "iPhone 15 Pro Max" },
        { id: 2, name: "iPhone 15 Pro" },
        { id: 3, name: "iPhone 15 Plus" },
        { id: 4, name: "iPhone 15" },
        { id: 5, name: "Samsung Galaxy S24" },
      ]);

      // Load sample images
      setImages([
        {
          id: 1,
          productId: 1,
          productName: "iPhone 15 Pro Max",
          imageType: "main",
          imageUrl:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
          alt: "iPhone 15 Pro Max - Ảnh chính",
          sortOrder: 1,
          isActive: true,
          createdAt: "2024-01-15",
        },
        {
          id: 2,
          productId: 1,
          productName: "iPhone 15 Pro Max",
          imageType: "variant",
          imageUrl:
            "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_4_16_638488768368578332_2.jpg",
          variantInfo: { capacity: "256GB", color: "Blue Titanium" },
          alt: "iPhone 15 Pro Max - Blue Titanium 256GB",
          sortOrder: 2,
          isActive: true,
          createdAt: "2024-01-15",
        },
      ]);
    } catch {
      message.error("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((img) => {
    if (selectedProduct && img.productId !== selectedProduct) return false;
    if (activeTab === "main" && img.imageType !== "main") return false;
    if (activeTab === "gallery" && img.imageType !== "gallery") return false;
    if (activeTab === "variant" && img.imageType !== "variant") return false;
    return true;
  });

  const columns: ColumnsType<ProductImage> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          alt="product"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: 150,
    },
    {
      title: "Loại ảnh",
      dataIndex: "imageType",
      key: "imageType",
      width: 100,
      render: (type: string) => {
        const colors = {
          main: "blue",
          gallery: "green",
          variant: "orange",
        };
        const labels = {
          main: "Ảnh chính",
          gallery: "Gallery",
          variant: "Variant",
        };
        return (
          <Tag color={colors[type as keyof typeof colors]}>
            {labels[type as keyof typeof labels]}
          </Tag>
        );
      },
    },
    {
      title: "Thông tin Variant",
      key: "variantInfo",
      width: 150,
      render: (_, record) => {
        if (record.imageType === "variant" && record.variantInfo) {
          return (
            <div>
              {record.variantInfo.capacity && (
                <Tag>{record.variantInfo.capacity}</Tag>
              )}
              {record.variantInfo.color && (
                <Tag color="blue">{record.variantInfo.color}</Tag>
              )}
            </div>
          );
        }
        return "-";
      },
    },
    {
      title: "Alt Text",
      dataIndex: "alt",
      key: "alt",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa ảnh này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingImage(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (image: ProductImage) => {
    setEditingImage(image);
    form.setFieldsValue({
      ...image,
      capacity: image.variantInfo?.capacity,
      color: image.variantInfo?.color,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setImages(images.filter((img) => img.id !== id));
      message.success("Xóa ảnh thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi xóa ảnh!");
    }
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const imageData = {
        ...values,
        variantInfo:
          values.imageType === "variant"
            ? {
                capacity: values.capacity,
                color: values.color,
              }
            : undefined,
        productName:
          products.find((p) => p.id === values.productId)?.name || "",
      };

      if (editingImage) {
        const updatedImage = { ...editingImage, ...imageData };
        setImages(
          images.map((img) => (img.id === editingImage.id ? updatedImage : img))
        );
        message.success("Cập nhật ảnh thành công!");
      } else {
        const newImage: ProductImage = {
          id: Date.now(),
          ...imageData,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setImages([...images, newImage]);
        message.success("Thêm ảnh thành công!");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch {
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const uploadProps = {
    name: "file",
    action: "http://localhost:3000/api/upload",
    onChange: (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status === "done") {
        message.success(`${info.file.name} upload thành công`);
        form.setFieldsValue({
          imageUrl: info.file.response.url,
        });
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload thất bại`);
      }
    },
  };

  const tabItems = [
    {
      key: "all",
      label: "Tất cả",
      icon: <FolderOpenOutlined />,
    },
    {
      key: "main",
      label: "Ảnh chính",
      icon: <PictureOutlined />,
    },
    {
      key: "gallery",
      label: "Gallery",
      icon: <EyeOutlined />,
    },
    {
      key: "variant",
      label: "Variant",
      icon: <PlusOutlined />,
    },
  ];

  return (
    <div>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2>Quản lý Hình ảnh Sản phẩm</h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Select
              placeholder="Lọc theo sản phẩm"
              style={{ width: 200, marginRight: 16 }}
              allowClear
              value={selectedProduct}
              onChange={setSelectedProduct}
            >
              {products.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm Ảnh
            </Button>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={filteredImages}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} ảnh`,
          }}
        />

        <Modal
          title={editingImage ? "Chỉnh sửa Ảnh" : "Thêm Ảnh mới"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          confirmLoading={loading}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              isActive: true,
              sortOrder: 1,
            }}
          >
            <Form.Item
              name="productId"
              label="Sản phẩm"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
            >
              <Select placeholder="Chọn sản phẩm">
                {products.map((product) => (
                  <Select.Option key={product.id} value={product.id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="imageType"
              label="Loại ảnh"
              rules={[{ required: true, message: "Vui lòng chọn loại ảnh!" }]}
            >
              <Select placeholder="Chọn loại ảnh">
                <Select.Option value="main">Ảnh chính</Select.Option>
                <Select.Option value="gallery">Gallery</Select.Option>
                <Select.Option value="variant">
                  Variant (theo màu/dung lượng)
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.imageType !== currentValues.imageType
              }
            >
              {({ getFieldValue }) => {
                const imageType = getFieldValue("imageType");
                if (imageType === "variant") {
                  return (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="capacity" label="Dung lượng">
                          <Select placeholder="Chọn dung lượng">
                            <Select.Option value="128GB">128GB</Select.Option>
                            <Select.Option value="256GB">256GB</Select.Option>
                            <Select.Option value="512GB">512GB</Select.Option>
                            <Select.Option value="1TB">1TB</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="color" label="Màu sắc">
                          <Input placeholder="Ví dụ: Natural Titanium" />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }
                return null;
              }}
            </Form.Item>

            <Form.Item
              name="imageUrl"
              label="URL hình ảnh"
              rules={[
                { required: true, message: "Vui lòng nhập URL hình ảnh!" },
              ]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item label="Hoặc upload hình ảnh">
              <Upload {...uploadProps}>
                <Button icon={<PlusOutlined />}>Upload ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="alt"
              label="Alt Text (SEO)"
              rules={[{ required: true, message: "Vui lòng nhập alt text!" }]}
            >
              <Input placeholder="Mô tả ngắn gọn về ảnh để SEO" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="sortOrder"
                  label="Thứ tự hiển thị"
                  rules={[{ required: true, message: "Vui lòng nhập thứ tự!" }]}
                >
                  <Input type="number" placeholder="1, 2, 3..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isActive" label="Trạng thái">
                  <Select>
                    <Select.Option value={true}>Hoạt động</Select.Option>
                    <Select.Option value={false}>Tạm dừng</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Card>

      <style>{`
        .admin-product-images .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .admin-product-images .actions {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default AdminProductImages;
