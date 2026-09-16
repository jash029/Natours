import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTours, fetchSearchSuggestions } from "../../../Services/tourService/tourService";

const DEFAULT_FILTERS = {
  search: "",
  themes: [],
  countries: [],
  priceRange: [2000, 50000],
  duration: null,
  minRating: null,
  minDiscount: null,
  featured: false,
  trending: false,
  sort: "Recommended",
  page: 1,
};

export function parseUrlQueryParams() {
  if (typeof window === "undefined") return DEFAULT_FILTERS;

  const params = new URLSearchParams(window.location.search);

  const search = params.get("search") || "";
  const themes = params.get("theme") ? params.get("theme").split(",") : [];
  const countries = params.get("country")
    ? params.get("country").split(",")
    : [];

  const minPrice = params.get("minPrice")
    ? Number(params.get("minPrice"))
    : 2000;

  const maxPrice = params.get("maxPrice")
    ? Number(params.get("maxPrice"))
    : 50000;

  const minRating = params.get("minRating")
    ? Number(params.get("minRating"))
    : null;

  const minDiscount = params.get("minDiscount")
    ? Number(params.get("minDiscount"))
    : null;

  const featured = params.get("featured") === "true";
  const trending = params.get("trending") === "true";
  const sort = params.get("sort") || "Recommended";
  const page = params.get("page") ? Number(params.get("page")) : 1;

  const minDays = params.get("minDays") ? Number(params.get("minDays")) : null;

  let duration = null;

  if (minDays === 1) duration = "1–3 Days";
  else if (minDays === 4) duration = "4–6 Days";
  else if (minDays === 7) duration = "7–9 Days";
  else if (minDays === 10) duration = "10+ Days";

  return {
    search,
    themes,
    countries,
    priceRange: [minPrice, maxPrice],
    duration,
    minRating,
    minDiscount,
    featured,
    trending,
    sort,
    page,
  };
}

export function syncFiltersToUrl(filters) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);

  if (filters.themes.length) params.set("theme", filters.themes.join(","));

  if (filters.countries.length)
    params.set("country", filters.countries.join(","));

  if (filters.priceRange[0] > 2000)
    params.set("minPrice", filters.priceRange[0]);

  if (filters.priceRange[1] < 50000)
    params.set("maxPrice", filters.priceRange[1]);

  if (filters.duration) {
    if (filters.duration === "1–3 Days") {
      params.set("minDays", "1");
      params.set("maxDays", "3");
    } else if (filters.duration === "4–6 Days") {
      params.set("minDays", "4");
      params.set("maxDays", "6");
    } else if (filters.duration === "7–9 Days") {
      params.set("minDays", "7");
      params.set("maxDays", "9");
    } else if (filters.duration === "10+ Days") {
      params.set("minDays", "10");
    }
  }

  if (filters.minRating) params.set("minRating", filters.minRating);

  if (filters.minDiscount) params.set("minDiscount", filters.minDiscount);

  if (filters.featured) params.set("featured", "true");

  if (filters.trending) params.set("trending", "true");

  if (filters.sort !== "Recommended") params.set("sort", filters.sort);

  if (filters.page > 1) params.set("page", filters.page);

  const query = params.toString();

  window.history.replaceState(
    {},
    "",
    query ? `${window.location.pathname}?${query}` : window.location.pathname,
  );
}

export function useTours() {
  const [filters, setFilters] = useState(() => parseUrlQueryParams());

  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters]);

  const apiParams = useMemo(() => {
    let minDays;
    let maxDays;

    if (filters.duration === "1–3 Days") {
      minDays = 1;
      maxDays = 3;
    } else if (filters.duration === "4–6 Days") {
      minDays = 4;
      maxDays = 6;
    } else if (filters.duration === "7–9 Days") {
      minDays = 7;
      maxDays = 9;
    } else if (filters.duration === "10+ Days") {
      minDays = 10;
      maxDays = 99;
    }

    return {
      search: filters.search,
      theme: filters.themes.join(","),
      country: filters.countries.join(","),
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      minDays,
      maxDays,
      minRating: filters.minRating || undefined,
      minDiscount: filters.minDiscount || undefined,
      featured: filters.featured,
      trending: filters.trending,
      sort: filters.sort,
      page: filters.page,
      limit: 6,
    };
  }, [filters]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tours", apiParams],
    queryFn: () => fetchTours(apiParams),
    staleTime: 1000 * 60 * 5,
  });

  const [searchQueryForSuggestions, setSearchQueryForSuggestions] =
    useState("");

  const { data: suggestionsData } = useQuery({
    queryKey: ["searchSuggestions", searchQueryForSuggestions],
    queryFn: () => fetchSearchSuggestions(searchQueryForSuggestions),
    enabled: searchQueryForSuggestions.trim().length >= 2,
    staleTime: 1000 * 60,
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  }, []);

  const toggleTheme = useCallback((themeName) => {
    setFilters((prev) => {
      const exists = prev.themes.includes(themeName);

      return {
        ...prev,
        themes: exists
          ? prev.themes.filter((t) => t !== themeName)
          : [...prev.themes, themeName],
        page: 1,
      };
    });
  }, []);

  const toggleCountry = useCallback((countryName) => {
    setFilters((prev) => {
      const exists = prev.countries.includes(countryName);

      return {
        ...prev,
        countries: exists
          ? prev.countries.filter((c) => c !== countryName)
          : [...prev.countries, countryName],
        page: 1,
      };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      search: filters.search,
    });
  }, [filters.search]);

  const clearEntireState = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    toggleTheme,
    toggleCountry,
    clearAllFilters,
    clearEntireState,
    toursResponse: data,
    isLoading,
    isError,
    refetch,
    searchQueryForSuggestions,
    setSearchQueryForSuggestions,
    suggestions: suggestionsData || {
      tours: [],
      countries: [],
      cities: [],
    },
  };
}
