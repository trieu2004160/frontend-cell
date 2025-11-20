import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/auth/NotFoundPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
// import SimpleHomePage from "./pages/home/SimpleHomePage";
import TestPage from "./pages/TestPage";
import DetailProductPage from "./pages/product/DetailProductPage";
import AdminLayout from "./pages/admin/layouts/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ListCategory from "./pages/admin/category/ListCategory";
import ListBrand from "./pages/admin/brand/ListBrand";
import ListProduct from "./pages/admin/products/ListProduct";
import CreateBrand from "./pages/admin/brand/CreateBrand";
import CreateCategory from "./pages/admin/category/CreateCategory";
import EditCategory from "./pages/admin/category/EditCategory";
import EditBrand from "./pages/admin/brand/EditBrand";
import CreateProduct from "./pages/admin/products/CreateProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import ListProductImage from "./pages/admin/product-images/ListProductImage";
import AdminVariants from "./pages/admin/AdminVariants";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductImages from "./pages/admin/AdminProductImages";
import CreateProductImage from "./pages/admin/product-images/CreateProductImage";
import EditProductImage from "./pages/admin/product-images/EditProductImage";
import SmemberPage from "./pages/user/SmemberPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  // {
  //   path: "/simple",
  //   element: <SimpleHomePage />,
  // },
  {
    path: "/product/:id",
    element: <DetailProductPage />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/smember",
    element: <SmemberPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      },
      {
        path: "/admin/category",
        element: <ListCategory />,
      },
      {
        path: "/admin/category/create",
        element: <CreateCategory />,
      },
      {
        path: "/admin/category/:id/edit",
        element: <EditCategory />,
      },
      {
        path: "/admin/brand",
        element: <ListBrand />,
      },
      {
        path: "/admin/brand/create",
        element: <CreateBrand />,
      },
      {
        path: "/admin/brand/:id/edit",
        element: <EditBrand />,
      },
      {
        path: "/admin/products",
        element: <ListProduct />,
      },
      {
        path: "/admin/products/create",
        element: <CreateProduct />,
      },
      {
        path: "/admin/products/:id/edit",
        element: <EditProduct />,
      },
      {
        path: "/admin/product-images",
        element: <ListProductImage />,
      },
      {
        path: "/admin/product-images/create",
        element: <CreateProductImage />,
      },
      {
        path: "/admin/product-images/:id/edit",
        element: <EditProductImage />,
      },
      {
        path: "/admin/variants",
        element: <AdminVariants />,
      },
      {
        path: "/admin/products-manage",
        element: <AdminProducts />,
      },
      {
        path: "/admin/product-images-manage",
        element: <AdminProductImages />,
      },
    ],
  },
]);
