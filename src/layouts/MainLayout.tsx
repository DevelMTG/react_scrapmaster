import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Group } from "react-resizable-panels";
import LeftRail from "../features/common/LeftRail";

import { useTopMenuStore } from "../store/common/useTopMenuStore";

const styles = {
  app: {
    height: "100vh",
    background: "#f5f6f8",
    boxSizing: "border-box",
  },
};

export default function MainLayout() {
  const navigate = useNavigate();
  const { setActiveId } = useTopMenuStore();

  const handleRailItemClick = (item, event) => {
    console.log("clicked:", item.id);
    console.log("button element:", event.currentTarget);

    switch (item.id) {
      case "news":
        setActiveId("news");
        navigate("/panels/news");
        break;

      case "search":
        setActiveId("search");
        navigate("/panels/search");
        break;

      case "premium":
        setActiveId("premium");
        navigate("/panels/premium");
        break;

      case "analysis":
        setActiveId("analysis");
        navigate("/panels/analysis");
        break;

      case "notifications":
        setActiveId("notifications");
        navigate("/panels/notifications");
        break;

      case "settings":
        setActiveId("settings");
        navigate("/panels/settings");
        break;

      case "account":
        setActiveId("account");
        navigate("/panels/account");
        break;

      default:
        break;
    }
  };

  return (
    <div style={styles.app}>
      <Group orientation="horizontal" style={{ height: "100%" }}>
        <LeftRail onItemClick={handleRailItemClick} />
        <Outlet />
      </Group>
    </div>
  );
}
