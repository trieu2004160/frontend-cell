import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Card,
  List,
  Image,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { VariantData } from "../../../types/api/VariantTypes";
import { variantApi } from "../../../utils/api/variant.api";

interface VariantManagerProps {
  productId: string | number;
  productName?: string;
}

const VariantManager: React.FC<VariantManagerProps> = ({ productId }) => {
  const [variants, setVariants] = useState<VariantData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<VariantData | null>(
    null
  );
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Pre-fill storage when adding a color to an existing storage group
  const [prefillStorage, setPrefillStorage] = useState<string>("");

  // Fetch variants
  const fetchVariants = async () => {
    try {
      const result = await variantApi.getByProduct(productId);
      setVariants(Array.isArray(result.data) ? result.data : [result.data]);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  // Load variants on mount
  useEffect(() => {
    if (productId) {
      fetchVariants();
    }
  }, [productId]);

  // Group variants by storage
  const groupedVariants = useMemo(() => {
    const groups: { [key: string]: VariantData[] } = {};
    variants.forEach((variant) => {
      const storage = variant.storage?.toUpperCase() || "OTHER";
      if (!groups[storage]) {
        groups[storage] = [];
      }
      groups[storage].push(variant);
    });
    return groups;
  }, [variants]);

  // Open modal for add/edit
  const showModal = (variant?: VariantData, storage?: string) => {
    if (variant) {
      setEditingVariant(variant);
      form.setFieldsValue(variant);
      setPrefillStorage("");
    } else {
      setEditingVariant(null);
      form.resetFields();
      if (storage) {
        form.setFieldsValue({ storage });
        setPrefillStorage(storage);
      } else {
        setPrefillStorage("");
      }
    }
    setIsModalOpen(true);
  };

  // Handle save
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      if (editingVariant) {
        await variantApi.update(editingVariant.id!, values);
        message.success("Variant updated successfully!");
      } else {
        await variantApi.create(productId, values);
        message.success("Variant created successfully!");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchVariants();
    } catch (error: any) {
      message.error(error.message || "Failed to save variant");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Delete Variant",
      content: "Are you sure you want to delete this variant?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await variantApi.delete(id);
          message.success("Variant deleted successfully!");
          fetchVariants();
        } catch (error: any) {
          message.error(error.message || "Failed to delete variant");
        }
      },
    });
  };

  // Handle set default
  const handleSetDefault = async (id: number) => {
    try {
      await variantApi.setDefault(id, productId);
      message.success("Default variant set successfully!");
      fetchVariants();
    } catch (error: any) {
      message.error(error.message || "Failed to set default variant");
    }
  };

  return (
    <div className="variant-manager">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Product Variants</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add New Variant Group
        </Button>
      </div>

      {Object.keys(groupedVariants).length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No variants yet. Click "Add New Variant Group" to start.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedVariants).map(([storage, groupVariants]) => (
            <Card
              key={storage}
              title={<span className="text-lg font-bold">{storage}</span>}
              className="shadow-sm"
              extra={
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => showModal(undefined, storage)}
                >
                  Add Color to {storage}
                </Button>
              }
            >
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                dataSource={groupVariants}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      size="small"
                      cover={
                        <div className="h-32 overflow-hidden flex items-center justify-center bg-gray-50 relative group">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.color}
                              className="object-contain h-full w-full"
                              preview={{ src: item.image_url }}
                            />
                          ) : (
                            <div className="text-gray-400">No Image</div>
                          )}
                          {item.is_default && (
                            <div className="absolute top-1 right-1">
                              <StarFilled
                                style={{ color: "#faad14", fontSize: "16px" }}
                              />
                            </div>
                          )}
                        </div>
                      }
                      actions={[
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => showModal(item)}
                        />,
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(item.id!)}
                        />,
                        !item.is_default && (
                          <Button
                            type="text"
                            icon={<StarOutlined />}
                            title="Set as Default"
                            onClick={() => handleSetDefault(item.id!)}
                          />
                        ),
                      ].filter(Boolean)}
                    >
                      <Card.Meta
                        title={
                          <div className="flex justify-between items-center">
                            <span>{item.color}</span>
                            <Tag
                              color={
                                item.stock_quantity && item.stock_quantity > 0
                                  ? "green"
                                  : "red"
                              }
                            >
                              {item.stock_quantity}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div className="font-semibold text-red-600">
                              {Number(item.sale_price || 0).toLocaleString(
                                "vi-VN"
                              )}
                              đ
                              {item.original_price &&
                                Number(item.sale_price) !==
                                  Number(item.original_price) && (
                                  <span className="ml-2 text-xs text-gray-400 line-through">
                                    {Number(
                                      item.original_price || 0
                                    ).toLocaleString("vi-VN")}
                                    đ
                                  </span>
                                )}
                            </div>
                            <div
                              className="text-xs text-gray-400 truncate"
                              title={item.sku}
                            >
                              SKU: {item.sku || "N/A"}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={
          editingVariant
            ? "Edit Variant"
            : prefillStorage
            ? `Add Color to ${prefillStorage}`
            : "Add New Variant"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Storage"
            name="storage"
            rules={[{ required: true, message: "Storage is required" }]}
          >
            <Input placeholder="e.g., 128GB, 256GB, 512GB" />
          </Form.Item>

          <Form.Item
            label="Color"
            name="color"
            rules={[{ required: true, message: "Color is required" }]}
          >
            <Input placeholder="e.g., Black, White, Blue" />
          </Form.Item>

          <Form.Item label="Image URL" name="image_url">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="original_price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <InputNumber<number>
              className="w-full"
              min={0}
              controls={false}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => value?.replace(/\./g, "") as unknown as number}
            />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stock_quantity"
            initialValue={0}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item label="SKU" name="sku">
            <Input placeholder="Auto-generated if left empty" />
          </Form.Item>

          <Form.Item
            label="Set as Default"
            name="is_default"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Active"
            name="is_active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VariantManager;
