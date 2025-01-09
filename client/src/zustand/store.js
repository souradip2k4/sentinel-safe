import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import {getLocationMatrices, getUserReviewsById} from "@/lib/axios";
import {AxiosError} from "axios";
import metrics from "@/components/Dashboard/metrics";

const locationMatrixSlice = (set) => ({
  metrics: [],
  /*update: ({latitude, longitude, campusName, id, areaRating, userRating}) =>
    set({latitude, longitude, campusName, id, areaRating, userRating}),*/

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

  locationMatricesId: ({longitude, latitude}) => {

    if (metrics && metrics.length > 0) {
      const locationMatrices = metrics.find(item => {
        if (item.latitude === latitude && item.latitude === longitude) {
          return item.id;
        }
        return null;
      });

      if (!locationMatrices) {
        return "Location does not exists";
      }
      return locationMatrices;
    }
  }
});

const userReviews = (set) => ({
  reviews: [],

  fetchUserReviews: async (token, id) => {
    try {
      console.log(id);
      const response = await getUserReviewsById(token, id);

      const reviews = response.data.data;
      // console.log(reviews)
      const reviewMetrics = reviews.map(item => ({
        review: item.review,
        rating: item.rating,
        userName: item.userName
      }))

      set({reviews: reviewMetrics});
      console.log(reviews)

    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

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
