import { useCallback, useMemo } from "react";
import {
  Actions,
  BorderNode,
  DockLocation,
  Layout,
  Model,
  TabNode,
  TabSetNode,
  type ITabSetRenderValues,
} from "flexlayout-react";
import "flexlayout-react/style/light.css";

type MinimizeMeta = {
  prevParentId: string;
  prevIndex: number;
};

const initialJson = {
  global: {
    // 마지막 탭이 빠져도 tabset을 지우지 않게 하는 편이 복원에 유리함
    tabSetEnableDeleteWhenEmpty: false,
  },
  borders: [
    {
      type: "border",
      location: "right",
      size: 280,
      selected: -1,
      children: [],
    },
  ],
  layout: {
    type: "row",
    children: [
      {
        type: "tabset",
        id: "main_tabset",
        enableDeleteWhenEmpty: false,
        children: [
          {
            type: "tab",
            id: "tab_1",
            name: "Grid",
            component: "grid",
          },
          {
            type: "tab",
            id: "tab_2",
            name: "Chart",
            component: "chart",
          },
        ],
      },
      {
        type: "tabset",
        id: "side_tabset",
        enableDeleteWhenEmpty: false,
        children: [
          {
            type: "tab",
            id: "tab_3",
            name: "Info",
            component: "info",
          },
        ],
      },
    ],
  },
};

function factory(node: TabNode) {
  const component = node.getComponent();

  if (component === "grid") {
    return <div style={{ padding: 16 }}>Grid 화면</div>;
  }

  if (component === "chart") {
    return <div style={{ padding: 16 }}>Chart 화면</div>;
  }

  if (component === "info") {
    return <div style={{ padding: 16 }}>Info 화면</div>;
  }

  return <div style={{ padding: 16 }}>Unknown</div>;
}

export default function FlexLayoutPage() {
  const model = useMemo(() => Model.fromJson(initialJson), []);

  const minimizeSelectedTab = useCallback(
    (containerNode: TabSetNode | BorderNode) => {
      const selectedTab = containerNode.getSelectedNode();

      if (!(selectedTab instanceof TabNode)) {
        return;
      }

      const parent = selectedTab.getParent();
      if (!parent) {
        return;
      }

      // 이미 right border에 있으면 다시 최소화 안 함
      if (parent instanceof BorderNode && parent.getLocation().getName() === "right") {
        return;
      }

      const extra = selectedTab.getExtraData() as {
        minimized?: MinimizeMeta;
      };

      extra.minimized = {
        prevParentId: parent.getId(),
        prevIndex: parent.getChildren().indexOf(selectedTab),
      };

      model.doAction(
        Actions.moveNode(
          selectedTab.getId(),
          "border_right",
          DockLocation.CENTER,
          -1,
          true
        )
      );
    },
    [model]
  );

  const restoreSelectedRightBorderTab = useCallback(() => {
    const rightBorder = model.getNodeById("border_right");

    if (!(rightBorder instanceof BorderNode)) {
      return;
    }

    const selectedTab = rightBorder.getSelectedNode();
    if (!(selectedTab instanceof TabNode)) {
      return;
    }

    const extra = selectedTab.getExtraData() as {
      minimized?: MinimizeMeta;
    };

    const info = extra.minimized;
    if (!info) {
      return;
    }

    const targetParent = model.getNodeById(info.prevParentId);

    if (!(targetParent instanceof TabSetNode || targetParent instanceof BorderNode)) {
      console.warn("원래 부모를 찾지 못해 복원할 수 없습니다.");
      return;
    }

    const safeIndex = Math.min(info.prevIndex, targetParent.getChildren().length);

    model.doAction(
      Actions.moveNode(
        selectedTab.getId(),
        targetParent.getId(),
        DockLocation.CENTER,
        safeIndex,
        true
      )
    );
  }, [model]);

  const onRenderTabSet = useCallback(
    (node: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
      // 우측 border에는 "복원" 버튼
      if (node instanceof BorderNode && node.getLocation().getName() === "right") {
        renderValues.buttons.push(
          <button
            key="restore"
            className="flexlayout__tab_toolbar_button"
            title="복원"
            onClick={restoreSelectedRightBorderTab}
          >
            ↩
          </button>
        );
        return;
      }

      // 일반 tabset에는 "최소화" 버튼
      if (node instanceof TabSetNode) {
        renderValues.buttons.push(
          <button
            key="minimize"
            className="flexlayout__tab_toolbar_button"
            title="선택 탭 최소화"
            onClick={() => minimizeSelectedTab(node)}
          >
            ─
          </button>
        );
      }
    },
    [minimizeSelectedTab, restoreSelectedRightBorderTab]
  );

  return (
    <div style={{ height: "100vh" }}>
      <Layout
        model={model}
        factory={factory}
        onRenderTabSet={onRenderTabSet}
      />
    </div>
  );
}