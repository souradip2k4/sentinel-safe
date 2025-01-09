import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true
});

export const getLocationMatrices = async (token) => {
  return await apiClient.get("/metrics", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getUserReviews = async (token) => {
  return await apiClient.get("/reviews", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const createReview = async (token, data) => {
  return await apiClient.post("/reviews", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}