import { Navigate, createBrowserRouter } from "react-router-dom";
import KonvaPage from "../features/test/KonvaPage";
import KonvaPageLine from "../features/test/KonvaPageLine";
import MainPage from "../pages/MainPage";

import PrivateRoute from "../routes/auth/PrivateRoute";
import MainLayout from "../layouts/MainLayout";
import EditPage from "../pages/edit/EditPage";
import NewsMain from "../features/edit/main/NewsMain";
import SearchMain from "../features/edit/main/SearchMain";
import KonvaPageMerge from "../features/test/KonvaPageMerge";


function NotFoundPage() {
  return <div>404 - 페이지를 찾을 수 없습니다.</div>;
}

const routers = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/panels" replace />,
  },
  {
    path: "/app",
    element: <MainPage />,
  },
  {
    path: "/konva",
    element: <KonvaPage />,
  },
  {
    path: "/konvaLine",
    element: <KonvaPageLine />,
  },
  {
    path: "/konvaMerge",
    element: <KonvaPageMerge />,
  },
  {
    path: "/login",
    // element: <LoginPage />,
  },
  {
    path: "/panels",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,    // /panels 경로로 접근 시 기본적으로 보여줄 컴포넌트
        element: <Navigate to="news" replace />,
      },
      // 뉴스, 검색, 편집
      {
        element: <EditPage />,
        children: [
          {
            path: "news",
            element: <NewsMain />,
          },
          {
            path: "search",
            element: <SearchMain />,
          },
        ],
      },
      {
        path: "premium",
        //element: <NewsComponents />,
      },
      {
        path: "analysis",
      //  element: <NewsComponents />,
      },
      {
        path: "notifications",
        // element: <NewsComponents />,
      },
      {
        path: "settings",
        // element: <NewsComponents />,
      },
      {
        path: "account",
        // element: <NewsComponents />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default routers;


