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
    tabSetEnableDeleteWhenEmpty: true,
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
        enableDeleteWhenEmpty: true,
        weight: 75,
        minWidth: 250,
        children: [
          {
            type: "tab",
            id: "tab_1",
            name: "Grid",
            component: "grid",
            enableRename: false,
            minWidth: 250,
          },
          {
            type: "tab",
            id: "tab_2",
            name: "Chart",
            component: "chart",
            enableRename: false,
            minWidth: 250,
          },
        ],
      },
      {
        type: "tabset",
        id: "side_tabset",
        enableDeleteWhenEmpty: true,
        weight: 25,
        minWidth: 250,
        children: [
          {
            type: "tab",
            id: "tab_3",
            name: "Info",
            component: "info",
            enableRename: false,
            minWidth: 250,
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

  const handleAction = useCallback(
    (action: any) => {

      console.log("Action detected:", action.type, action.data);

      // FlexLayout_SelectTab: right border의 탭 클릭 => side_tabset으로 복원
      if (action.type === "FlexLayout_SelectTab") {
        const tabNodeId = action.data?.tabNode;
        console.log("FlexLayout_SelectTab detected - tabNodeId:", tabNodeId);
        
        const tabNode = model.getNodeById(tabNodeId);
        console.log("TabNode found:", tabNode?.getId?.());
        
        if (tabNode instanceof TabNode) {
          const parent = tabNode.getParent();
          console.log("Parent location:", parent instanceof BorderNode ? parent.getLocation().getName() : "not a border");
          
          if (parent instanceof BorderNode && parent.getLocation().getName() === "right") {
            console.log("BorderNode right tab detected - attempting move to side_tabset");
            
            // right border의 탭을 클릭하면 side_tabset으로 이동
            setTimeout(() => {
              const sideTabset = model.getNodeById("side_tabset");
              console.log("sideTabset found:", !!sideTabset);
              
              if (sideTabset instanceof TabSetNode) {
                console.log("Moving node to side_tabset...");
                model.doAction(
                  Actions.moveNode(
                    tabNode.getId(),
                    sideTabset.getId(),
                    DockLocation.CENTER,
                    -1,
                    true
                  )
                );
              }
            }, 0);
          }
        }
      }

      return action;
    },
    [model]
  );

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
        onAction={handleAction}
      />
    </div>
  );
}