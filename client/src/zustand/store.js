import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import {getLocationMatrices, getUserReviewsById} from "@/lib/axios";
import {AxiosError} from "axios";
import metrics from "@/components/Dashboard/metrics";
import reviews from "@/components/Dashboard/Reviews";

const locationMatrixSlice = (set) => ({
  metrics: [],

  fetchLocationMatrix: async (token) => {
    try {
      const response = await getLocationMatrices(token);
      const metricsResponse = response.data.data;
      const metricsArray = metricsResponse.map(item => ({
        id: item.id,
        areaRating: item.areaRating,
        userRating: item.userRating,
        GeoCode: {
          geoCodeId: item.GeoCode.id,
          campusName: item.GeoCode.campusName,
          latitude: item.GeoCode.latitude,
          longitude: item.GeoCode.longitude,
        }
      }))

      set({metrics: metricsArray})
    } catch (error) {
      // console.log(error);
      if (error instanceof AxiosError) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
});

const userReviews = (set) => ({
  reviews: [],
  geoCodeId: null,
  setGeoCodeId: (id) => set({ geoCodeId: id }),
  fetchUserReviews: async (token, id, campusName) => {
    try {
      const response = await getUserReviewsById(token, id);
      const reviews = response.data.data;
      const reviewMetrics = reviews.map((item) => ({
        review: item.review,
        rating: item.rating,
        userName: item.userName,
        campusName,
      }));

      set({ reviews: reviewMetrics });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },

  setUserReview: (inputData) => {
    set((state) => {
      // console.log("Previous length: ", state.reviews.length);
      const updatedReviews = [...state.reviews, inputData];
      // console.log("After length: ", updatedReviews.length);
      return { reviews: updatedReviews };
    });
  },
});



// Create the combined store
export const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...locationMatrixSlice(set, get),
        ...userReviews(set, get),
      }),
      {name: "combined-store"}
    )
  )
);

export default useStore;
