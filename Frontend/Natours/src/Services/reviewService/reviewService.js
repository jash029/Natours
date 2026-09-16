import axios from "axios";

const API_URL = "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const createReview = async (reviewPayload) => {
  const res = await api.post("/user/createReview", reviewPayload);
  return res.data?.data?.review || res.data;
};

export const getTourReviews = async () => {
  const res = await api.get("/user/getAllReviews");

  return Array.isArray(res.data?.data?.reviews)
    ? res.data.data.reviews
    : res.data?.reviews || [];
};
