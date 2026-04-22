import { useRef, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Group
} from "react-resizable-panels";

import LeftRail from "./components/LeftRail";

const styles = {
  app: {
    height: "100vh",
    background: "#f5f6f8",
    boxSizing: "border-box",
  },
};

export default function IdeLikeLayout() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("news");

  const handleRailItemClick = (item, event) => {
    console.log("clicked:", item.id);
    console.log("button element:", event.currentTarget);

    switch (item.id) {
      case "news":
        setActiveMenu("news");
        navigate("/panels/news");
        break;

      case "search":
        setActiveMenu("search");
        navigate("/panels/search");
        break;

      case "premium":
        setActiveMenu("premium");
        navigate("/panels/premium");
        break;

      case "analysis":
        setActiveMenu("analysis");
        navigate("/panels/analysis");
        break;

      case "notifications":
        setActiveMenu("notifications");
        navigate("/panels/notifications");
        break;

      case "settings":
        setActiveMenu("settings");
        navigate("/panels/settings");
        break;

      case "account":
        setActiveMenu("account");
        navigate("/panels/account");
        break;

      default:
        break;
    }
  };

  return (
    <div style={styles.app}>
      <Group orientation="horizontal" style={{ height: "100%" }}>
        <LeftRail activeId={activeMenu} onItemClick={handleRailItemClick} />
        <Outlet />
      </Group>
    </div>
  );
}