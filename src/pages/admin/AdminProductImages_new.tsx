import React, { useState, useEffect, useCallback } from "react";
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
import { productImgaesApi } from "../../utils/api/product_images.api";

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
  updatedAt: string;
}

const AdminProductImages: React.FC = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productImgaesApi.getAll();
      console.log("Fetched images:", result);
      
      // Transform API data to match component interface
      const transformedData: ProductImage[] = (result.data || []).map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        productName: img.product_name || "Unknown",
        imageType: img.image_type,
        imageUrl: img.image_url,
        variantInfo: img.variant_capacity || img.variant_color ? {
          capacity: img.variant_capacity,
          color: img.variant_color,
        } : undefined,
        alt: img.alt_text || "",
        sortOrder: img.sort_order || 0,
        isActive: img.is_active !== false,
        createdAt: img.created_at,
        updatedAt: img.updated_at,
      }));

      const filteredData = selectedProduct
        ? transformedData.filter((img) => img.productId === selectedProduct)
        : transformedData;

      setImages(filteredData);
    } catch (error) {
      console.error("Error fetching images:", error);
      message.error("Có lỗi khi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const showModal = (image?: ProductImage) => {
    setEditingImage(image || null);
    setIsModalVisible(true);
    if (image) {
      form.setFieldsValue({
        ...image,
        variantCapacity: image.variantInfo?.capacity,
        variantColor: image.variantInfo?.color,
      });
    } else {
      form.resetFields();
    }
    setFileList([]);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Process uploaded file
      let imageUrl = values.imageUrl;
      if (fileList.length > 0 && fileList[0].response) {
        imageUrl = fileList[0].response.data.url;
      }

      if (!imageUrl) {
        message.error("Vui lòng nhập URL hoặc upload ảnh!");
        setLoading(false);
        return;
      }

      // Transform data to match backend API format
      const apiData = {
        product_id: values.productId,
        image_type: values.imageType,
        image_url: imageUrl,
        alt_text: values.alt,
        sort_order: values.sortOrder || 0,
        variant_capacity: values.variantCapacity || null,
        variant_color: values.variantColor || null,
        is_active: values.isActive !== false,
      };

      if (editingImage) {
        // TODO: Add update API call when backend supports it
        message.warning("Chức năng cập nhật đang phát triển");
      } else {
        // Create new image
        const result = await productImgaesApi.create(apiData as any);
        message.success(result.message || "Thêm ảnh thành công!");
        await fetchImages(); // Reload data
      }

      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      console.error("Error saving image:", error);
      message.error(error?.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: Add delete API call when backend supports it
      // await productImgaesApi.delete(id);
      setImages(images.filter((img) => img.id !== id));
      message.success("Xóa ảnh thành công!");
    } catch (error) {
      console.error("Error deleting image:", error);
      message.error("Có lỗi xảy ra khi xóa ảnh!");
    }
  };

  const columns: ColumnsType<ProductImage> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      render: (url: string) => (
        <Image
          width={80}
          height={80}
          src={url}
          style={{ objectFit: "cover", borderRadius: "8px" }}
          placeholder
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Loại ảnh",
      dataIndex: "imageType",
      key: "imageType",
      render: (type: string) => {
        const colors = {
          main: "blue",
          gallery: "green",
          variant: "orange",
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      },
    },
    {
      title: "Thông tin variant",
      key: "variantInfo",
      render: (_, record) => {
        if (record.imageType === "variant" && record.variantInfo) {
          return (
            <div>
              {record.variantInfo.capacity && (
                <Tag color="purple">{record.variantInfo.capacity}</Tag>
              )}
              {record.variantInfo.color && (
                <Tag color="cyan">{record.variantInfo.color}</Tag>
              )}
            </div>
          );
        }
        return "-";
      },
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              Modal.info({
                title: "Chi tiết ảnh",
                content: (
                  <div>
                    <Image width="100%" src={record.imageUrl} />
                    <p>
                      <strong>Alt text:</strong> {record.alt}
                    </p>
                    <p>
                      <strong>Loại:</strong> {record.imageType}
                    </p>
                    {record.variantInfo && (
                      <div>
                        <p>
                          <strong>Capacity:</strong>{" "}
                          {record.variantInfo.capacity}
                        </p>
                        <p>
                          <strong>Color:</strong> {record.variantInfo.color}
                        </p>
                      </div>
                    )}
                  </div>
                ),
                width: 600,
              });
            }}
          >
            Xem
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ảnh này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    action: "http://localhost:3000/api/upload",
    name: "file",
    onChange: (info: UploadChangeParam<UploadFile>) => {
      setFileList(info.fileList);
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại`);
      }
    },
    onRemove: (file: UploadFile) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
  };

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
              <Select.Option value={12}>iPhone 15 Pro Max</Select.Option>
              <Select.Option value={13}>iPhone 15 Pro</Select.Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Thêm ảnh
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={images}
          loading={loading}
          rowKey="id"
          pagination={{
            total: images.length,
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} ảnh`,
          }}
        />

        <Modal
          title={editingImage ? "Sửa ảnh sản phẩm" : "Thêm ảnh sản phẩm"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
          }}
          width={800}
          confirmLoading={loading}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ imageType: "main", sortOrder: 1, isActive: true }}
          >
            <Form.Item
              label="Sản phẩm"
              name="productId"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
            >
              <Select placeholder="Chọn sản phẩm">
                <Select.Option value={12}>iPhone 15 Pro Max</Select.Option>
                <Select.Option value={13}>iPhone 15 Pro</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Loại ảnh"
              name="imageType"
              rules={[{ required: true, message: "Vui lòng chọn loại ảnh!" }]}
            >
              <Select>
                <Select.Option value="main">Ảnh chính</Select.Option>
                <Select.Option value="gallery">Ảnh thư viện</Select.Option>
                <Select.Option value="variant">Ảnh variant</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.imageType !== currentValues.imageType
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("imageType") === "variant" ? (
                  <>
                    <Form.Item
                      label="Dung lượng"
                      name="variantCapacity"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập dung lượng!",
                        },
                      ]}
                    >
                      <Select>
                        <Select.Option value="256GB">256GB</Select.Option>
                        <Select.Option value="512GB">512GB</Select.Option>
                        <Select.Option value="1TB">1TB</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Màu sắc"
                      name="variantColor"
                      rules={[
                        { required: true, message: "Vui lòng nhập màu sắc!" },
                      ]}
                    >
                      <Select>
                        <Select.Option value="Natural Titanium">
                          Natural Titanium
                        </Select.Option>
                        <Select.Option value="Blue Titanium">
                          Blue Titanium
                        </Select.Option>
                        <Select.Option value="White Titanium">
                          White Titanium
                        </Select.Option>
                        <Select.Option value="Black Titanium">
                          Black Titanium
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>

            <Form.Item
              label="URL ảnh"
              name="imageUrl"
              rules={[
                {
                  required: !fileList.length,
                  message: "Vui lòng nhập URL ảnh hoặc upload file!",
                },
              ]}
            >
              <Input placeholder="Nhập URL ảnh" />
            </Form.Item>

            <Form.Item label="Hoặc upload ảnh">
              <Upload
                {...uploadProps}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Alt text"
              name="alt"
              rules={[{ required: true, message: "Vui lòng nhập alt text!" }]}
            >
              <Input placeholder="Mô tả ảnh" />
            </Form.Item>

            <Form.Item label="Thứ tự" name="sortOrder">
              <Input type="number" placeholder="Thứ tự hiển thị" />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="isActive"
              valuePropName="checked"
            >
              <Select>
                <Select.Option value={true}>Hoạt động</Select.Option>
                <Select.Option value={false}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default AdminProductImages;
