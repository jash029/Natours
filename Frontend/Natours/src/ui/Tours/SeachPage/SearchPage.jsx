import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  MapPin,
  Compass,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { useTours } from "../../../features/hooks/TourHooks/useTours";
import { AuroraText } from "../../Grid/GridComponent.styles";
import {
  PageWrapper,
  HeroContainer,
  HeroTitle,
  HeroSubtitle,
  SearchBarContainer,
  SearchInputWrapper,
  SearchIconWrapper,
  SearchInput,
  ClearSearchButton,
  SuggestionsDropdown,
  SuggestionCategory,
  SuggestionHeader,
  SuggestionItem,
  MainLayout,
  SidebarOverlay,
  SidebarContainer,
  SidebarHeader,
  FilterSection,
  FilterTitle,
  FilterOptionList,
  CheckboxLabel,
  PriceSliderContainer,
  PriceDisplay,
  RangeSlider,
  ClearAllButton,
  ResultsContainer,
  Toolbar,

  ToolbarRightGroup,
  TotalCountText,
  FilterToggleButton,
  FilterBadge,
  SortSelectWrapper,
  ActiveChipsContainer,
  Chip,
  ClearChipsLink,
  TourCardList,
  TourCardWrapper,
  CardImageContainer,
  BadgeContainer,
  Badge,
  CardContent,
  CardHeader,
  TourName,
  RatingBadge,
  MetaRow,
  MetaItem,
  TourSummary,
  CardFooter,
  PriceBlock,
  CurrentPrice,
  OriginalPrice,
  DiscountTag,
  ViewDetailsButton,
  PaginationContainer,
  PageButton,
  EmptyStateContainer,
  SkeletonCard,
} from "./SearchPage.styles";
import { useNavigate } from "react-router-dom";
import useCurrencyDetector from "../../../Services/useCurrencyDetector";

const THEME_OPTIONS = ["Mountains", "Cities", "Oceans", "Forest", "Culture"];
const COUNTRY_OPTIONS = [
  "Australia",
  "Canada",
  "France",
  "Greenland",
  "Iceland",
  "Italy",
  "Japan",
  "Norway",
  "Switzerland",
  "USA",
];
const DURATION_OPTIONS = ["1–3 Days", "4–6 Days", "7–9 Days", "10+ Days"];
const RATING_OPTIONS = [
  { label: "★★★★★ (5.0)", value: 5 },
  { label: "★★★★☆ & Above (4.0+)", value: 4 },
  { label: "★★★☆☆ & Above (3.0+)", value: 3 },
];
const DISCOUNT_OPTIONS = [
  { label: "Any Discount", value: 0 },
  { label: "5% or More", value: 5 },
  { label: "10% or More", value: 10 },
  { label: "15% or More", value: 15 },
  { label: "20% or More", value: 20 },
  { label: "25% or More", value: 25 },
];
const SORT_OPTIONS = [
  "Recommended",
  "Popularity",
  "Highest Rated",
  "Newest",
  "Price Low → High",
  "Price High → Low",
  "Shortest Duration",
  "Longest Duration",
];

export default function SearchPage() {
  const { formatCurrency } = useCurrencyDetector();
  const {
    filters,
    updateFilter,
    toggleTheme,
    toggleCountry,
    clearAllFilters,
    clearEntireState,
    toursResponse,
    isLoading,
    setSearchQueryForSuggestions,
    suggestions,
  } = useTours();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState(filters.search);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Section collapse states
  const [openSections, setOpenSections] = useState({
    theme: true,
    country: true,
    price: true,
    duration: true,
    rating: true,
    discount: true,
    collections: true,
  });

  const searchContainerRef = useRef(null);

  // Sync internal search input with URL search filter
  useEffect(() => {
    setSearchInputVal(filters.search);
  }, [filters.search]);

  // Handle outside click to hide suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInputVal(val);
    setSearchQueryForSuggestions(val);
    updateFilter("search", val);
  };

  const handleClearSearch = () => {
    setSearchInputVal("");
    setSearchQueryForSuggestions("");
    updateFilter("search", "");
  };

  const handleSuggestionClick = (value) => {
    setSearchInputVal(value);
    updateFilter("search", value);
    setSearchFocused(false);
  };

  // Construct active filter chips array
  const activeChips = [];
  if (filters.search) {
    activeChips.push({
      id: "search",
      label: `"${filters.search}"`,
      onRemove: () => handleClearSearch(),
    });
  }
  filters.themes.forEach((theme) => {
    activeChips.push({
      id: `theme-${theme}`,
      label: theme,
      onRemove: () => toggleTheme(theme),
    });
  });
  filters.countries.forEach((country) => {
    activeChips.push({
      id: `country-${country}`,
      label: country,
      onRemove: () => toggleCountry(country),
    });
  });
  if (filters.priceRange[0] > 2000 || filters.priceRange[1] < 50000) {
    activeChips.push({
      id: "price",
      label: `₹${filters.priceRange[0].toLocaleString()}–₹${filters.priceRange[1].toLocaleString()}`,
      onRemove: () => updateFilter("priceRange", [2000, 50000]),
    });
  }
  if (filters.duration) {
    activeChips.push({
      id: "duration",
      label: filters.duration,
      onRemove: () => updateFilter("duration", null),
    });
  }
  if (filters.minRating) {
    activeChips.push({
      id: "rating",
      label: `${filters.minRating}★ & Above`,
      onRemove: () => updateFilter("minRating", null),
    });
  }
  if (filters.minDiscount) {
    activeChips.push({
      id: "discount",
      label: `${filters.minDiscount}%+ Discount`,
      onRemove: () => updateFilter("minDiscount", null),
    });
  }
  if (filters.featured) {
    activeChips.push({
      id: "featured",
      label: "Featured Tours",
      onRemove: () => updateFilter("featured", false),
    });
  }
  if (filters.trending) {
    activeChips.push({
      id: "trending",
      label: "Trending Tours",
      onRemove: () => updateFilter("trending", false),
    });
  }

  const hasSuggestions =
    suggestions.tours.length > 0 ||
    suggestions.countries.length > 0 ||
    suggestions.cities.length > 0;

  const toursList = toursResponse?.data?.tours || [];
  const totalTours = toursResponse?.total || 0;
  const totalPages = toursResponse?.totalPages || 1;
  const navigate = useNavigate();

  const isAnyFilterActive = isFilterOpen || isMobileSidebarOpen;

  const handleToggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
    setIsMobileSidebarOpen(false);
  };

  return (
    <PageWrapper>
      {/* Search Hero Header */}
      <HeroContainer>
        <HeroTitle>
          Find Your Next
          <br />
          <AuroraText>Extraordinary Expedition</AuroraText>
        </HeroTitle>
        <HeroSubtitle>
          Curated luxury journeys across the world's most captivating mountains,
          oceans, forests, and cultural capitals.
        </HeroSubtitle>

        <SearchBarContainer ref={searchContainerRef}>
          <SearchInputWrapper $isFocused={searchFocused}>
            <SearchIconWrapper $isFocused={searchFocused}>
              <Search size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Search destinations, countries, cities or tours..."
              value={searchInputVal}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
            />
            {searchInputVal && (
              <ClearSearchButton
                onClick={handleClearSearch}
                title="Clear Search"
              >
                <X size={14} />
              </ClearSearchButton>
            )}
          </SearchInputWrapper>

          {/* Auto Suggestions Dropdown */}
          {searchFocused && hasSuggestions && (
            <SuggestionsDropdown>
              {suggestions.tours.length > 0 && (
                <SuggestionCategory>
                  <SuggestionHeader>Matching Tours</SuggestionHeader>
                  {suggestions.tours.map((tName, i) => (
                    <SuggestionItem
                      key={i}
                      onClick={() => handleSuggestionClick(tName)}
                    >
                      <Compass size={14} style={{ color: "#ffffff" }} />
                      <span>{tName}</span>
                    </SuggestionItem>
                  ))}
                </SuggestionCategory>
              )}

              {suggestions.countries.length > 0 && (
                <SuggestionCategory>
                  <SuggestionHeader>Countries</SuggestionHeader>
                  {suggestions.countries.map((cName, i) => (
                    <SuggestionItem
                      key={i}
                      onClick={() => handleSuggestionClick(cName)}
                    >
                      <MapPin size={14} style={{ color: "#ffffff" }} />
                      <span>{cName}</span>
                    </SuggestionItem>
                  ))}
                </SuggestionCategory>
              )}

              {suggestions.cities.length > 0 && (
                <SuggestionCategory>
                  <SuggestionHeader>Cities & States</SuggestionHeader>
                  {suggestions.cities.map((cityName, i) => (
                    <SuggestionItem
                      key={i}
                      onClick={() => handleSuggestionClick(cityName)}
                    >
                      <MapPin size={14} style={{ color: "#ffffff" }} />
                      <span>{cityName}</span>
                    </SuggestionItem>
                  ))}
                </SuggestionCategory>
              )}
            </SuggestionsDropdown>
          )}
        </SearchBarContainer>
      </HeroContainer>

      {/* Main Container Layout */}
      <MainLayout id="tours">
        {/* Mobile/Tablet Backdrop Overlay */}
        <SidebarOverlay $isOpen={isAnyFilterActive} onClick={handleCloseFilter} />

        {/* Collapsible Animated Filter Sidebar */}
        <SidebarContainer $isOpen={isFilterOpen} $isMobileOpen={isMobileSidebarOpen}>
          <SidebarHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <SlidersHorizontal size={20} style={{ color: "#ffffff" }} />
              <h2>Filters</h2>
            </div>
            <button
              onClick={handleCloseFilter}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#8c8c8c", padding: "0.25rem" }}
            >
              <X size={20} />
            </button>
          </SidebarHeader>

          {/* Theme Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.theme}
              onClick={() => toggleSection("theme")}
            >
              <span>Theme</span>
              {openSections.theme ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.theme && (
              <FilterOptionList>
                {THEME_OPTIONS.map((theme) => (
                  <CheckboxLabel key={theme}>
                    <input
                      type="checkbox"
                      checked={filters.themes.includes(theme)}
                      onChange={() => toggleTheme(theme)}
                    />
                    <span>{theme}</span>
                  </CheckboxLabel>
                ))}
              </FilterOptionList>
            )}
          </FilterSection>

          {/* Country Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.country}
              onClick={() => toggleSection("country")}
            >
              <span>Country</span>
              {openSections.country ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.country && (
              <FilterOptionList>
                {COUNTRY_OPTIONS.map((country) => (
                  <CheckboxLabel key={country}>
                    <input
                      type="checkbox"
                      checked={filters.countries.includes(country)}
                      onChange={() => toggleCountry(country)}
                    />
                    <span>{country}</span>
                  </CheckboxLabel>
                ))}
              </FilterOptionList>
            )}
          </FilterSection>

          {/* Price Range Slider Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.price}
              onClick={() => toggleSection("price")}
            >
              <span>Price Range</span>
              {openSections.price ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.price && (
              <PriceSliderContainer>
                <PriceDisplay>
                  <span>Min: {formatCurrency(filters.priceRange[0])}</span>
                  <span>Max: {formatCurrency(filters.priceRange[1])}</span>
                </PriceDisplay>
                <div>
                  <RangeSlider
                    type="range"
                    min={2000}
                    max={50000}
                    step={1000}
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      updateFilter("priceRange", [
                        filters.priceRange[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", color: "#6b7280", marginTop: "0.25rem" }}>
                    <span>₹1,70,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>
              </PriceSliderContainer>
            )}
          </FilterSection>

          {/* Duration Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.duration}
              onClick={() => toggleSection("duration")}
            >
              <span>Duration</span>
              {openSections.duration ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.duration && (
              <FilterOptionList>
                {DURATION_OPTIONS.map((dur) => (
                  <CheckboxLabel key={dur}>
                    <input
                      type="checkbox"
                      checked={filters.duration === dur}
                      onChange={() =>
                        updateFilter(
                          "duration",
                          filters.duration === dur ? null : dur,
                        )
                      }
                    />
                    <span>{dur}</span>
                  </CheckboxLabel>
                ))}
              </FilterOptionList>
            )}
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.rating}
              onClick={() => toggleSection("rating")}
            >
              <span>Rating</span>
              {openSections.rating ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.rating && (
              <FilterOptionList>
                {RATING_OPTIONS.map((r) => (
                  <CheckboxLabel key={r.value}>
                    <input
                      type="checkbox"
                      checked={filters.minRating === r.value}
                      onChange={() =>
                        updateFilter(
                          "minRating",
                          filters.minRating === r.value ? null : r.value,
                        )
                      }
                    />
                    <span>{r.label}</span>
                  </CheckboxLabel>
                ))}
              </FilterOptionList>
            )}
          </FilterSection>

          {/* Discount Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.discount}
              onClick={() => toggleSection("discount")}
            >
              <span>Discount</span>
              {openSections.discount ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.discount && (
              <FilterOptionList>
                {DISCOUNT_OPTIONS.map((d) => (
                  <CheckboxLabel key={d.value}>
                    <input
                      type="checkbox"
                      checked={filters.minDiscount === d.value}
                      onChange={() =>
                        updateFilter(
                          "minDiscount",
                          filters.minDiscount === d.value ? null : d.value,
                        )
                      }
                    />
                    <span>{d.label}</span>
                  </CheckboxLabel>
                ))}
              </FilterOptionList>
            )}
          </FilterSection>

          {/* Collections Filter */}
          <FilterSection>
            <FilterTitle
              $isOpen={openSections.collections}
              onClick={() => toggleSection("collections")}
            >
              <span>Collections</span>
              {openSections.collections ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </FilterTitle>
            {openSections.collections && (
              <FilterOptionList>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={() => updateFilter("featured", !filters.featured)}
                  />
                  <span>Featured Tours</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={filters.trending}
                    onChange={() => updateFilter("trending", !filters.trending)}
                  />
                  <span>Trending Tours</span>
                </CheckboxLabel>
              </FilterOptionList>
            )}
          </FilterSection>

          {/* Clear All Filters Button */}
          <ClearAllButton onClick={clearAllFilters}>
            Clear All Filters
          </ClearAllButton>
        </SidebarContainer>

        {/* Results Section */}
        <ResultsContainer>
          {/* Result Toolbar */}
          <Toolbar>
            <TotalCountText>
              {totalTours} {totalTours === 1 ? "Tour" : "Tours"} Found
              <span>matching search criteria</span>
            </TotalCountText>

            <ToolbarRightGroup>
              {/* Filter Toggle Button next to Sort By Recommended */}
              <FilterToggleButton
                $isOpen={isAnyFilterActive}
                onClick={handleToggleFilter}
              >
                {isAnyFilterActive ? (
                  <X size={18} />
                ) : (
                  <SlidersHorizontal size={18} />
                )}
                <span>{isAnyFilterActive ? "Hide Filters" : "Filters"}</span>
                {activeChips.length > 0 && (
                  <FilterBadge>{activeChips.length}</FilterBadge>
                )}
              </FilterToggleButton>

              <SortSelectWrapper>
                <span>Sort By:</span>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </SortSelectWrapper>
            </ToolbarRightGroup>
          </Toolbar>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <ActiveChipsContainer>
              {activeChips.map((chip) => (
                <Chip key={chip.id}>
                  <span>{chip.label}</span>
                  <button onClick={chip.onRemove} title="Remove filter">
                    <X size={12} />
                  </button>
                </Chip>
              ))}
              <ClearChipsLink onClick={clearEntireState}>
                Clear All
              </ClearChipsLink>
            </ActiveChipsContainer>
          )}

          {/* Tour Card Results List */}
          {isLoading ? (
            <TourCardList>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </TourCardList>
          ) : toursList.length === 0 ? (
            /* Empty State */
            <EmptyStateContainer>
              <Compass size={56} strokeWidth={1.5} />
              <h3>No Tours Found</h3>
              <p>
                Try adjusting your filters or search with different keywords.
              </p>
              <ClearAllButton
                onClick={clearEntireState}
                style={{ maxWidth: "200px" }}
              >
                Clear Filters
              </ClearAllButton>
            </EmptyStateContainer>
          ) : (
            <TourCardList>
              <AnimatePresence>
                {toursList.map((tour) => {
                  const netPrice = tour.startingPrice - (tour.discount || 0);
                  const discountPct =
                    tour.startingPrice > 0
                      ? Math.round((tour.discount / tour.startingPrice) * 100)
                      : 0;

                  return (
                    <motion.div
                      key={tour._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TourCardWrapper>
                        {/* Cover Image */}
                        <CardImageContainer>
                          <img
                            src={
                              tour.imageCover?.secureUrl ||
                              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            }
                            alt={tour.name}
                          />
                          <BadgeContainer>
                            {tour.featured && <Badge>Featured</Badge>}
                            {tour.trending && <Badge>Trending</Badge>}
                          
                          </BadgeContainer>
                        </CardImageContainer>

                        {/* Content */}
                        <CardContent>
                          <div>
                            <CardHeader>
                              <TourName>{tour.name}</TourName>
                              <RatingBadge>
                                <Star size={14} fill="#ffffff" />
                                {tour.ratingsAverage}{" "}
                                <span>({tour.ratingsQuantity})</span>
                              </RatingBadge>
                            </CardHeader>

                            <MetaRow>
                              <MetaItem>
                                <Clock size={14} />
                                <span>
                                  {tour.duration.days} Days /{" "}
                                  {tour.duration.nights} Nights
                                </span>
                              </MetaItem>

                              <MetaItem>
                                <Layers size={14} />
                                <span>{tour.theme}</span>
                              </MetaItem>

                              <MetaItem>
                                <MapPin size={14} />
                                <span>
                                  {tour.destinations
                                    .map((d) => `${d.city}, ${d.country}`)
                                    .slice(0, 2)
                                    .join(" • ")}
                                </span>
                              </MetaItem>

                              {tour.startLocation && (
                                <MetaItem>
                                  <Navigation size={14} />
                                  <span>Starts: {tour.startLocation}</span>
                                </MetaItem>
                              )}

                              {tour.itinerary?.length > 0 && (
                                <MetaItem>
                                  <Compass size={14} />
                                  <span>{tour.itinerary.length} Stops Itinerary</span>
                                </MetaItem>
                              )}
                            </MetaRow>

                                      <TourSummary>{tour.summary}</TourSummary>
                                     <TourSummary>
                                         {tour.destinations?.map((dest)=>{
                                            return(
                                                <MetaItem key={dest._id}>
                                                    <MapPin size={14} />
                                                    <span>{`${dest.city}, ${dest.country}`}</span>
                                                </MetaItem>
                                            )
                                         })}
                                     </TourSummary>

                                      {/* Package Tier Options Badges */}
                                      {tour.packages && tour.packages.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem", marginBottom: "0.85rem" }}>
                                          {tour.packages.map((pkg, idx) => (
                                            <span
                                              key={idx}
                                              style={{
                                                background: "rgba(255, 255, 255, 0.07)",
                                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                                color: "#e2e8f0",
                                                fontSize: "1.1rem",
                                                fontWeight: "500",
                                                padding: "0.3rem 0.75rem",
                                                borderRadius: "8px",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "0.4rem"
                                              }}
                                            >
                                              <CheckCircle2 size={13} style={{ color: "#3b82f6" }} />
                                              {pkg.name} Tier ({formatCurrency(pkg.price)})
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      
                          </div>

                          <CardFooter>
                            <PriceBlock>
                              <CurrentPrice>
                                {formatCurrency(netPrice)}
                              </CurrentPrice>
                              {tour.discount > 0 && (
                                <>
                                  <OriginalPrice>
                                    {formatCurrency(tour.startingPrice)}
                                  </OriginalPrice>
                                  <DiscountTag>{discountPct}% OFF</DiscountTag>
                                </>
                              )}
                            </PriceBlock>

                            <ViewDetailsButton
                              onClick={() => navigate(`/tour/${tour.slug}`)}
                            >
                              <span>View Details</span>
                              <ArrowRight size={16} />
                            </ViewDetailsButton>
                          </CardFooter>
                        </CardContent>
                      </TourCardWrapper>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </TourCardList>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PageButton
                disabled={filters.page <= 1}
                onClick={() => updateFilter("page", filters.page - 1)}
              >
                              {'Prev'}
              </PageButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PageButton
                    key={pageNum}
                    $active={filters.page === pageNum}
                    onClick={() => updateFilter("page", pageNum)}
                  >
                    {pageNum}
                  </PageButton>
                ),
              )}

              <PageButton
                disabled={filters.page >= totalPages}
                onClick={() => updateFilter("page", filters.page + 1)}
              >
                Next
              </PageButton>
            </PaginationContainer>
          )}
        </ResultsContainer>
      </MainLayout>
    </PageWrapper>
  );
}
