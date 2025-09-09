import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Popconfirm,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

interface ProductVariant {
  id: number;
  productId: number;
  productName: string;
  capacity: string;
  color: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
}

const AdminVariants: React.FC = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Mock data để demo - thay thế bằng API call thực tế
  useEffect(() => {
    // Load danh sách sản phẩm
    setProducts([
      { id: 1, name: "iPhone 15" },
      { id: 2, name: "iPhone 15 Plus" },
      { id: 3, name: "iPhone 15 Pro" },
      { id: 4, name: "iPhone 15 Pro Max" },
      { id: 5, name: "Samsung Galaxy S24" },
      { id: 6, name: "Xiaomi 14" },
    ]);

    // Load variants hiện có
    setVariants([]);
  }, []);

  const columns: ColumnsType<ProductVariant> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Dung lượng",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "discountPrice",
      key: "discountPrice",
      width: 120,
      render: (price?: number) => (price ? `${price.toLocaleString()}đ` : "-"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (url: string) => (
        <img
          src={url}
          alt="variant"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Kho",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? "Hoạt động" : "Tạm dừng"}
        </span>
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
            title="Bạn có chắc muốn xóa variant này?"
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
    setEditingVariant(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    form.setFieldsValue({
      ...variant,
      productId: variant.productId,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // API call để xóa variant
      // await deleteVariant(id);
      setVariants(variants.filter((v) => v.id !== id));
      message.success("Xóa variant thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi xóa variant!");
    }
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (editingVariant) {
        // Cập nhật variant
        const updatedVariant = { ...editingVariant, ...values };
        setVariants(
          variants.map((v) => (v.id === editingVariant.id ? updatedVariant : v))
        );
        message.success("Cập nhật variant thành công!");
      } else {
        // Thêm variant mới
        const newVariant: ProductVariant = {
          id: Date.now(), // Tạm thời dùng timestamp, thực tế sẽ từ API
          ...values,
          productName:
            products.find((p) => p.id === values.productId)?.name || "",
        };
        setVariants([...variants, newVariant]);
        message.success("Thêm variant thành công!");
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
    action: "/api/upload", // API endpoint để upload ảnh
    headers: {
      authorization: "authorization-text",
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} upload thành công`);
        form.setFieldsValue({
          imageUrl: info.file.response.url, // Giả sử API trả về URL ảnh
        });
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload thất bại`);
      }
    },
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Quản lý Product Variants</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm Variant
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={variants}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} variants`,
          }}
        />

        <Modal
          title={editingVariant ? "Chỉnh sửa Variant" : "Thêm Variant mới"}
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
              stockQuantity: 0,
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
              name="capacity"
              label="Dung lượng"
              rules={[{ required: true, message: "Vui lòng nhập dung lượng!" }]}
            >
              <Select placeholder="Chọn dung lượng">
                <Select.Option value="128GB">128GB</Select.Option>
                <Select.Option value="256GB">256GB</Select.Option>
                <Select.Option value="512GB">512GB</Select.Option>
                <Select.Option value="1TB">1TB</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="color"
              label="Màu sắc"
              rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
            >
              <Input placeholder="Ví dụ: Natural Titanium, Pink, Black..." />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <Input type="number" placeholder="Ví dụ: 32990000" />
            </Form.Item>

            <Form.Item name="discountPrice" label="Giá khuyến mãi (VNĐ)">
              <Input
                type="number"
                placeholder="Để trống nếu không có khuyến mãi"
              />
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
                <Button icon={<UploadOutlined />}>Upload ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="stockQuantity"
              label="Số lượng trong kho"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <Input type="number" placeholder="Ví dụ: 100" />
            </Form.Item>

            <Form.Item name="isActive" label="Trạng thái">
              <Select>
                <Select.Option value={true}>Hoạt động</Select.Option>
                <Select.Option value={false}>Tạm dừng</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AdminVariants;
