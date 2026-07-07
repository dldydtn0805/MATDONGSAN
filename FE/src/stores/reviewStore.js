import { create } from 'zustand';

const reviewStore = create((set) => ({
  value: 0,
  setValue: (value) => set({ value }),
  registration: false,
  setRegistration: (value) => set({ registration: value }),
  update: false,
  setUpdate: (value) => set({ update: value }),
  remove: false,
  setRemove: (value) => set({ remove: value }),
  restaurantStore: [],
  refresh: false,
  setRefresh: (value) => set({ refresh: value }),
  setRestaurantStore: (value) => set({ restaurantStore: value }),
  sortByVisitCount: () => {
    set((state) => ({
      // 방문횟수로 정렬
      restaurantStore: [...state.restaurantStore].sort((a, b) => {
        const visitCountA = parseInt(a.visitCount, 10);
        const visitCountB = parseInt(b.visitCount, 10);
        return visitCountB - visitCountA;
      }),
    }));
  },
  sortByRecentVisitDate: () => {
    set((state) => ({
      // 최근방문날짜로 정렬
      restaurantStore: [...state.restaurantStore].sort((a, b) => {
        const dateA = new Date(a.recentVisitDate);
        const dateB = new Date(b.recentVisitDate);
        return dateB - dateA;
      }),
    }));
  },
  sortByAverageTasteAndKindness: () => {
    set((state) => ({
      restaurantStore: [...state.restaurantStore].sort((a, b) => {
        // 맛과 친절도의 평균을 계산
        const avgA =
          (parseInt(a.tasteRating, 10) +
            parseInt(a.kindnessRating, 10)) /
          2;
        const avgB =
          (parseInt(b.tasteRating, 10) +
            parseInt(b.kindnessRating, 10)) /
          2;
        // 평균을 기준으로 정렬
        return avgB - avgA;
      }),
    }));
  },
  myReviewStore: [],
  setMyReviewStore: (value) => set({ myReviewStore: value }),
}));

export default reviewStore;
