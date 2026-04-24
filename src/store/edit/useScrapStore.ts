/**
 * 뉴스, 검색, 편집 등에서 오른편 사이드 메뉴 스크랩 목록 저장을 위해 
 */

import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface ScrapStore {
  scraps: any[]; // 스크랩 데이터 배열
  addScrap: (scrap: any) => void; // 스크랩 추가 함수
  removeScrap: (id: string) => void; // 스크랩 제거 함수
  _hasHydrated: boolean; // 복구 완료 여부, 새로고침 시 storage에 저장된 데이터를 불러왔는지 여부
  setHasHydrated: (state: boolean) => void;
}

export const useScrapStore = create<ScrapStore>(
  persist((set) => ({
    scraps: [],
    addScrap: (scrap) =>
      set((state) => ({
        scraps: [...state.scraps, scrap],
      })),
    removeScrap: (id) =>
      set((state) => ({
        scraps: state.scraps.filter((scrap) => scrap.id !== id),
      })),
    _hasHydrated: false, // 초기값 false
    setHasHydrated: (state) => set({ _hasHydrated: state }),
  }),
  {
    name: "scrap-storage", // 세션 스토리지 키
    storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
    // 원하는 데이터만 새로고침시 별도 storage에 저장하거나 복구할 수 있도록 partialize 옵션 활용
    partialize: (state) => ({ 
        scraps: state.scraps, 
      }),
    onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // 복구 완료 시 true로 설정
    },
  })
);

