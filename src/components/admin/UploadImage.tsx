import {
  Image,
  Upload,
  type GetProp,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useEffect, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadResponse {
  message: string;
  status: string;
  data: { public_id: string; url: string };
}

const UploadImage = ({
  setImageApi,
  initialImage,
}: {
  setImageApi: (image_url: string | undefined) => void;
  initialImage?: string;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (initialImage) {
      setFileList([
        {
          uid: "-1",
          name: "current-image",
          status: "done",
          url: initialImage,
        },
      ]);
    }
  }, [initialImage]);

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onChange: UploadProps<UploadResponse>["onChange"] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    // Only update imageApi when upload is complete and successful
    if (newFileList.length > 0) {
      const file = newFileList[0];
      if (file.status === "done" && file.response?.data?.url) {
        setImageApi(file.response.data.url);
      } else if (file.status === "error") {
        setImageApi(undefined);
      }
    } else {
      setImageApi(undefined);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  return (
    <>
      <Upload
        method="POST"
        action={`${
          import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        }/upload`}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={handlePreview}
        name="file"
      >
        {fileList.length < 1 && "+ Upload"}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible: boolean) => setPreviewOpen(visible),
            afterOpenChange: (visible: boolean) =>
              !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImage;
