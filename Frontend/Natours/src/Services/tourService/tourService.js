import axios from "axios";

export const getHomePageMarquee = async function () {
  const response = await axios({
    url: "http://localhost:3001/api/v1/tours/trending-and-discounts",
    method: "GET",
    withCredentials: true,
  });

  return response.data.data;
};

export const getTrendingTours = async function () {
  const response = await axios({
    url: "http://localhost:3001/api/v1/tours/top-trending",
    method: "GET",
    withCredentials: true,
  });

  return response.data.data.trendingTours;
};

export const getPartneredTours = async function () {
  const response = await axios({
    url: "http://localhost:3001/api/v1/tours/cities-theme",
    method: "GET",
    withCredentials: true,
  });

  return response.data.data.citiesTours;
};

export const getAdventureTours = async function () {
  const response = await axios({
    url: "http://localhost:3001/api/v1/tours/nature-themes",
    method: "GET",
    withCredentials: true,
  });

  return response.data.data.natureTours;
};

export const getCountryTopTours = async function () {
  const response = await axios({
    url: "http://localhost:3001/api/v1/tours/getCountryTopTours",
    method: "GET",
    withCredentials: true,
  });

  return response.data.data;
};

export const getTourDetails = async function (slug) {
  if (!slug || slug === "undefined") {
    throw new Error("Tour identifier or slug is missing");
  }

  const response = await axios({
    url: `http://localhost:3001/api/v1/tours/${encodeURIComponent(slug)}`,
    method: "GET",
    withCredentials: true,
  });

  return response.data.data;
};

export const getBookmarks = async function () {
  const responce = await axios({
    url: "http://localhost:3001/api/v1/user/getBookmarkTour",
    method: "GET",
    withCredentials: true,
  });

  return responce.data.data;
};

export const addBookmarkTour = async function (slug) {
  const response = await axios.post(
    "http://localhost:3001/api/v1/user/addBookmarkTour",
    { slug },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const removeBookmark = async (slug) => {
  const res = await axios.patch(
    "http://localhost:3001/api/v1/user/removeBookmark",
    { slug },
    {
      withCredentials: true,
    },
  );

  return res.data;
};




export const fetchTours = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.set("search", params.search);
  if (params.theme) queryParams.set("theme", params.theme);
  if (params.country) queryParams.set("country", params.country);

  if (params.minPrice !== undefined && params.minPrice > 0) {
    queryParams.set("minPrice", params.minPrice.toString());
  }

  if (params.maxPrice !== undefined && params.maxPrice < 50000) {
    queryParams.set("maxPrice", params.maxPrice.toString());
  }

  if (params.minDays !== undefined && params.minDays > 1) {
    queryParams.set("minDays", params.minDays.toString());
  }

  if (params.maxDays !== undefined && params.maxDays < 99) {
    queryParams.set("maxDays", params.maxDays.toString());
  }

  if (params.minRating !== undefined && params.minRating > 0) {
    queryParams.set("minRating", params.minRating.toString());
  }

  if (params.minDiscount !== undefined && params.minDiscount > 0) {
    queryParams.set("minDiscount", params.minDiscount.toString());
  }

  if (params.featured) queryParams.set("featured", "true");
  if (params.trending) queryParams.set("trending", "true");
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());

  const response = await axios.get(`http://localhost:3001/api/v1/tours?${queryParams.toString()}`);

  return response.data;
};

export const fetchSearchSuggestions = async (query) => {
  if (!query.trim()) {
    return {
      tours: [],
      countries: [],
      cities: [],
    };
  }

  const response = await axios.get(`http://localhost:3001/api/v1/tours/suggestions?q=${encodeURIComponent(query)}`);

  return response.data;
};

export const fetchTourDetails = async (idOrSlug) => {
  const response = await axios.get(`http://localhost:3001/api/v1/tours/${idOrSlug}`);

  return response.data.data.tour;
};