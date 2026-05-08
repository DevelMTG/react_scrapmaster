/**
 * 최상단 메뉴 탭 Store
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TopMenuStore {
  activeId: string; // 현재 활성화된 메뉴 ID
  setActiveId: (id: string) => void; // 활성화된 메뉴 ID 설정 함수
  _hasHydrated: boolean; // 복구 완료 여부, 새로고침 시 storage에 저장된 데이터를 불러왔는지 여부
  setHasHydrated: (state: boolean) => void;
}

export const useTopMenuStore = create<TopMenuStore>(
  persist(
    (set) => ({
      activeId: "news",
      _hasHydrated: false, // 초기값 false
      setActiveId: (id) => set({ activeId: id }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "top-menu-storage", // 세션 스토리지 키
      storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
      // 원하는 데이터만 새로고침시 별도 storage에 저장하거나 복구할 수 있도록 partialize 옵션 활용
      partialize: (state) => ({
        activeId: state.activeId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // 복구 완료 시 true로 설정
      },
    },
  ),
);
