/**
 * Multi-Source Intelligent Travel Image Search Service
 * Searches Wikimedia Commons, Unsplash API / Direct Collections, Pexels, and Openverse for high-res landscape travel images.
 */
const axios = require("axios");

// Curated Unsplash High-Resolution Landscape Travel Photography Fallback Pool
const CURATED_UNSPLASH_LANDSCAPES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1476514525535-ce74f452623d?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=2560&q=85",
];

/**
 * Extracts intelligent search keywords from tour document
 * @param {Object} tour - Mongoose Tour document
 * @returns {Array<String>} Array of unique search query strings
 */
const buildSearchKeywords = (tour) => {
  const keywords = new Set();

  const country = tour.destinations?.[0]?.country || tour.country || "";
  const theme = tour.theme || "";

  if (tour.name) keywords.add(`${tour.name}`);
  if (country && theme) keywords.add(`${country} ${theme}`);

  if (Array.isArray(tour.destinations)) {
    tour.destinations.forEach((dest) => {
      if (dest.city) keywords.add(`${dest.city} ${country}`);
      if (dest.state) keywords.add(`${dest.state} ${country}`);
    });
  }

  if (Array.isArray(tour.itinerary)) {
    tour.itinerary.forEach((item) => {
      if (item.title) keywords.add(`${item.title}`);
      if (item.location?.city) keywords.add(`${item.location.city}`);
    });
  }

  if (country) keywords.add(`${country} nature`);

  return Array.from(keywords);
};

/**
 * Search Wikimedia Commons API for high-resolution landscape images
 */
const searchWikimedia = async (keyword) => {
  try {
    const url = `https://commons.wikimedia.org/w/api.php`;
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "NatoursTravelApp/1.0 (https://natours.com; contact: admin@natours.com)",
      },
      params: {
        action: "query",
        generator: "search",
        gsrsearch: `${keyword} landscape filetype:bitmap`,
        gsrnamespace: 6,
        gsrlimit: 15,
        prop: "imageinfo",
        iiprop: "url|size|mime",
        format: "json",
        origin: "*",
      },
      timeout: 8000,
    });

    const pages = res.data?.query?.pages || {};
    const results = [];

    for (const pageId in pages) {
      const info = pages[pageId]?.imageinfo?.[0];
      if (info && info.url && info.mime?.startsWith("image/")) {
        // Exclude svg/tif
        if (info.url.includes("geograph") || info.url.endsWith(".tif") || info.url.endsWith(".svg")) continue;

        const width = info.width || 0;
        const height = info.height || 0;
        if (width >= 1000 && width >= height) {
          results.push({
            url: info.url,
            width,
            height,
            source: "wikimedia",
          });
        }
      }
    }

    return results;
  } catch (err) {
    return [];
  }
};

/**
 * Search Unsplash API if UNSPLASH_ACCESS_KEY is set
 */
const searchUnsplash = async (keyword) => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      headers: { Authorization: `Client-ID ${accessKey}` },
      params: {
        query: keyword,
        orientation: "landscape",
        per_page: 20,
      },
      timeout: 8000,
    });

    return (res.data?.results || []).map((img) => ({
      url: img.urls?.full || img.urls?.regular,
      width: img.width,
      height: img.height,
      source: "unsplash",
    }));
  } catch (err) {
    return [];
  }
};

/**
 * Search Pexels API if PEXELS_API_KEY is set
 */
const searchPexels = async (keyword) => {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      headers: { Authorization: apiKey },
      params: {
        query: keyword,
        orientation: "landscape",
        per_page: 20,
      },
      timeout: 8000,
    });

    return (res.data?.photos || []).map((img) => ({
      url: img.src?.large2x || img.src?.original,
      width: img.width,
      height: img.height,
      source: "pexels",
    }));
  } catch (err) {
    return [];
  }
};

/**
 * Search Openverse API
 */
const searchOpenverse = async (keyword) => {
  try {
    const res = await axios.get("https://api.openverse.org/v1/images/", {
      params: {
        q: keyword,
        page_size: 15,
        aspect_ratio: "wide",
      },
      timeout: 8000,
    });

    return (res.data?.results || []).map((img) => ({
      url: img.url,
      width: img.width || 1920,
      height: img.height || 1080,
      source: "openverse",
    }));
  } catch (err) {
    return [];
  }
};

/**
 * Aggregates multi-source image candidates for a given tour
 * @param {Object} tour 
 * @returns {Promise<Array<Object>>} List of candidate image objects
 */
const searchImagesForTour = async (tour) => {
  const keywords = buildSearchKeywords(tour);
  const candidates = [];
  const seenUrls = new Set();

  for (const keyword of keywords) {
    if (candidates.length >= 25) break;

    const [unsplashResults, pexelsResults, wikiResults, openverseResults] =
      await Promise.all([
        searchUnsplash(keyword),
        searchPexels(keyword),
        searchWikimedia(keyword),
        searchOpenverse(keyword),
      ]);

    const combined = [
      ...unsplashResults,
      ...pexelsResults,
      ...wikiResults,
      ...openverseResults,
    ];

    for (const item of combined) {
      if (item?.url && !seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        candidates.push(item);
      }
    }
  }

  // If candidate count is less than 12, supplement with curated Unsplash landscape pool
  if (candidates.length < 12) {
    for (const fallbackUrl of CURATED_UNSPLASH_LANDSCAPES) {
      if (!seenUrls.has(fallbackUrl)) {
        seenUrls.add(fallbackUrl);
        candidates.push({
          url: fallbackUrl,
          width: 2560,
          height: 1440,
          source: "unsplash_curated",
        });
      }
    }
  }

  return candidates;
};

module.exports = {
  buildSearchKeywords,
  searchImagesForTour,
};
