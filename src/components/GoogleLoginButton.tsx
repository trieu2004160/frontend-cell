import { useGoogleLogin } from "@react-oauth/google";
import { authApi } from "../utils/api/auth.api";
import { useNavigate } from "react-router-dom";
import ButtonCellphoneS from "./ButtonCellphoneS";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { message } from "antd";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (credential) => {
      const token = credential.access_token;
      setLoading(true);
      try {
        const result = await authApi.loginByGoogle(token);
        if (result.status === "success") {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              id: parseInt(result.data.id),
              email: result.data.email,
              name: result.data.full_name,
              avatar_url: result.data.avatar_url || undefined,
              provider: result.data.provider || "google",
            })
          );
          localStorage.setItem("token", result.data.access_token);
          message.success(`Chào mừng ${result.data.full_name}!`);
          navigate("/");
        } else {
          message.error("Đăng nhập thất bại!");
        }
      } catch {
        message.error("Đăng nhập thất bại!");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      message.error("Google login thất bại!");
    },
    flow: "implicit",
  });

  return (
    <ButtonCellphoneS
      onClick={() => login()}
      loading={loading}
      className="bg-white border-gray-400 text-black w-full"
      defaultHoverBg="white"
    >
      <div className="flex items-center gap-x-2 justify-center">
        <FcGoogle className="text-[1.5rem]" />
        <span>Đăng nhập Google</span>
      </div>
    </ButtonCellphoneS>
  );
};

export default GoogleLoginButton;
