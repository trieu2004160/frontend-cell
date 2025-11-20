/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// import { userApi } from "../utils/api/user.api"; // TODO: Sẽ dùng sau khi có API /users/me
import type { UserProps } from "../types/api/UserResponse";

export interface AuthContextType {
  user: UserProps | null;
  setUser: (payload: UserProps) => void;
  login: boolean;
  loading: boolean;
  logout: () => void;
  refreshUser: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [login, setLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setLogin(false);
    window.location.href = "/login";
  };

  const refreshUser = () => {
    getUser();
  };

  const value: AuthContextType = {
    user,
    setUser,
    login,
    loading,
    logout,
    refreshUser,
  };

  const getUser = async () => {
    try {
      setLoading(true);

      // Kiểm tra localStorage
      const token = localStorage.getItem("access_token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        // Không có token hoặc user, chưa đăng nhập
        setLogin(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Parse user từ localStorage
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
      setLogin(true);
      setLoading(false);

      // TODO: Sau này có thể gọi API để verify token và lấy thông tin mới nhất
      // const result = await userApi.getById();
      // setUser(result.data);
    } catch (error) {
      console.log("Lỗi lấy thông tin user:", error);
      setLogin(false);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType | undefined =>
  useContext<AuthContextType | undefined>(AuthContext);
