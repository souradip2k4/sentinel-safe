import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true
});

export const getLocationMatrices = async (token) => {
  const result = await apiClient.get("/metrics", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // console.log(result.data.data);
  return result;
}

export const getUserReviewsById = async (token, id) => {
  return await apiClient.get(`/reviews/g/${id}`, {
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
