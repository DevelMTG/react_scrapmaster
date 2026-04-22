import { Navigate, createBrowserRouter } from "react-router-dom";
import ResizablePanelsPage from "../features/test/ResizablePanelsPage";
import KonvaPage from "../features/test/KonvaPage";
import KonvaPageTest from "../features/test/KonvaPageTest";
import MainPage from "../pages/MainPage";
import ReactHTML from "../features/test/ReactHTML";
import NewsComponents from "../features/test/components/NewsComponent";

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
    path: "/panels",
    element: <ResizablePanelsPage />,
    children: [
      {
        index: true,    // /panels 경로로 접근 시 기본적으로 보여줄 컴포넌트
        element: <NewsComponents />,
      },
      {
        path: "news",
        element: <NewsComponents />,
      },
      {
        path: "search",
        element: <NewsComponents />,
      },
      {
        path: "premium",
        element: <NewsComponents />,
      },
      {
        path: "analysis",
        element: <NewsComponents />,
      },
      {
        path: "notifications",
        element: <NewsComponents />,
      },
      {
        path: "settings",
        element: <NewsComponents />,
      },
      {
        path: "account",
        element: <NewsComponents />,
      },
    ],
  },
  {
    path: "/konva",
    element: <KonvaPage />,
  },
  {
    path: "/konvaTest",
    element: <KonvaPageTest />,
  },
  {
    path: "/react-html",
    element: <ReactHTML />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default routers;


