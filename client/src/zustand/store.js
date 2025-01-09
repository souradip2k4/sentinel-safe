import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import {getLocationMatrices} from "@/lib/axios";
import {AxiosError} from "axios";
import metrics from "@/components/Dashboard/metrics";

const locationMatrixSlice = (set) => ({
  metrics: [],
  /*update: ({latitude, longitude, campusName, id, areaRating, userRating}) =>
    set({latitude, longitude, campusName, id, areaRating, userRating}),*/

  fetchLocationMatrix: async (token) => {
    try {
      const response = await getLocationMatrices(token);
      const metricsResponse = response.data;
      const metricsArray = metricsResponse.map(item => ({
        id: item.id,
        areaRating: item.areaRating,
        userRating: item.userRating,
        GeoCode: {
          campusName: item.GeoCode.campusName,
          latitude: item.GeoCode.latitude,
          longitude: item.GeoCode.longitude,
        }
      }))

      set({metrics: metricsArray})
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Something went wrong. Refresh the page!");
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


const userReviews = (set) => {


};

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
