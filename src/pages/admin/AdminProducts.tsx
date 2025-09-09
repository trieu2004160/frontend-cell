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
  Image,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

interface Product {
  id: number;
  name: string;
  description?: string;
  brand: string;
  category: string;
  basePrice: number;
  discountPrice?: number;
  mainImage: string;
  images: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  // Mock data - thay thế bằng API calls thực tế
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories
      setCategories([
        { id: 1, name: "Điện thoại" },
        { id: 2, name: "Laptop" },
        { id: 3, name: "Tablet" },
        { id: 4, name: "Phụ kiện" },
      ]);

      // Load brands
      setBrands([
        { id: 1, name: "Apple" },
        { id: 2, name: "Samsung" },
        { id: 3, name: "Xiaomi" },
        { id: 4, name: "OPPO" },
        { id: 5, name: "Realme" },
      ]);

      // Load products
      setProducts([
        {
          id: 1,
          name: "iPhone 15 Pro Max",
          description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ",
          brand: "Apple",
          category: "Điện thoại",
          basePrice: 32990000,
          discountPrice: 31990000,
          mainImage:
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
          images: [
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
            "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_4_16_638488768368578332_2.jpg",
          ],
          status: "active",
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
        },
      ]);
    } catch {
      message.error("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Hình ảnh",
      dataIndex: "mainImage",
      key: "mainImage",
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      width: 100,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 100,
    },
    {
      title: "Giá gốc",
      dataIndex: "basePrice",
      key: "basePrice",
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Hình ảnh",
      key: "images",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showImageModal(record)}
        >
          Xem ({record.images.length})
        </Button>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showImageModal = (product: Product) => {
    Modal.info({
      title: `Hình ảnh sản phẩm: ${product.name}`,
      width: 800,
      content: (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {product.images.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Product ${index + 1}`}
              width="100%"
              height={150}
              style={{ objectFit: "cover", borderRadius: "4px" }}
            />
          ))}
        </div>
      ),
    });
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setImageList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      categoryId: categories.find((c) => c.name === product.category)?.id,
      brandId: brands.find((b) => b.name === product.brand)?.id,
    });

    // Set image list for display
    setImageList(
      product.images.map((url, index) => ({
        uid: index.toString(),
        name: `image-${index}`,
        status: "done" as const,
        url: url,
      }))
    );

    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // API call để xóa sản phẩm
      setProducts(products.filter((p) => p.id !== id));
      message.success("Xóa sản phẩm thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Process uploaded images
      const imageUrls = imageList
        .filter((file) => file.status === "done")
        .map((file) => file.url || file.response?.url);

      const productData = {
        ...values,
        mainImage: imageUrls[0] || "",
        images: imageUrls,
        brand: brands.find((b) => b.id === values.brandId)?.name || "",
        category:
          categories.find((c) => c.id === values.categoryId)?.name || "",
      };

      if (editingProduct) {
        // Cập nhật sản phẩm
        const updatedProduct = {
          ...editingProduct,
          ...productData,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        // Thêm sản phẩm mới
        const newProduct: Product = {
          id: Date.now(),
          ...productData,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        setProducts([...products, newProduct]);
        message.success("Thêm sản phẩm thành công!");
      }

      setIsModalVisible(false);
      form.resetFields();
      setImageList([]);
    } catch {
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageList([]);
  };

  const uploadProps = {
    name: "file",
    action: "http://localhost:3000/api/upload",
    listType: "picture-card" as const,
    fileList: imageList,
    multiple: true,
    onChange: (info: UploadChangeParam<UploadFile>) => {
      setImageList(info.fileList);

      if (info.file.status === "done") {
        message.success(`${info.file.name} upload thành công`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload thất bại`);
      }
    },
    onRemove: (file: UploadFile) => {
      setImageList(imageList.filter((item) => item.uid !== file.uid));
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
          <h2>Quản lý Sản phẩm</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm Sản phẩm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
        />

        <Modal
          title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          confirmLoading={loading}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: "active",
            }}
          >
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input placeholder="Ví dụ: iPhone 15 Pro Max" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <Input.TextArea
                rows={3}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </Form.Item>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Form.Item
                name="brandId"
                label="Thương hiệu"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu!" },
                ]}
              >
                <Select placeholder="Chọn thương hiệu">
                  {brands.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Form.Item
                name="basePrice"
                label="Giá gốc (VNĐ)"
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
            </div>

            <Form.Item name="status" label="Trạng thái">
              <Select>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Tạm dừng</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Hình ảnh sản phẩm">
              <Upload {...uploadProps}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
              <p style={{ marginTop: "8px", color: "#666", fontSize: "12px" }}>
                * Hình đầu tiên sẽ làm ảnh đại diện. Có thể upload nhiều ảnh
                cùng lúc.
              </p>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AdminProducts;
