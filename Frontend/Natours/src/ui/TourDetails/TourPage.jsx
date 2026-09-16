import { useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

import useUser from "../../features/hooks/UserHooks/useUser";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineCheck,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiOutlineTruck,
  HiOutlineTicket,
  HiCheckCircle,
  HiOutlinePhone,
  HiOutlineBookmark,
  HiOutlineHome,
} from "react-icons/hi2";

import useTourDetail from "../../features/hooks/TourHooks/useTourDetail";
import useAddBookmark from "../../features/hooks/UserHooks/useAddBookmark";
import useRemoveBookmark from "../../features/hooks/UserHooks/useRemoveBookmark";
import MapItinerary from "./MapItinerary";
import GridMotionGallery from "./GridMotionGallery";
import {
  PageContainer,
  LoadingContainer,
  Spinner,
  ErrorContainer,
  HeroWrapper,
  HeroSection,
  Background,
  Overlay,
  Content,
  HeroTitle,
  QuickMetaBar,
  MetaPill,
  OverviewCard,
  OverviewHeader,
  ThemeTag,
  OverviewContent,
  LeadParagraph,
  RichDescription,
  HighlightWord,
  HighlightsGrid,
  HighlightBox,
  ContentWrapper,
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  TimelineContainer,
  TimelineItem,
  DayHeaderRow,
  DayCircle,
  DayCard,
  DayTitle,
  DayDesc,
  DayLocation,
  PackageGrid,
  PackageOptionCard,
  SelectedBadge,
  PackageHeader,
  PackageName,
  PackagePriceTag,
  FeatureList,
  FeatureItem,
  HotelCard,
  BookingPackagesRow,
  BookingCard,
  PriceHeader,
  PriceRow,
  PriceCurrent,
  PriceOriginal,
  DiscountBadge,
  DepositBox,
  BookButton,
  TrustList,
  TrustItem,
  SectionHeader,
  StickyNavWrapper,
  StickyNavContainer,
  StickyNavItem,
  MobileStickyBar,
  MobilePriceInfo,
  MobileBookButton,
  BookmarkButton,
 
} from "./TourPage.styles";

import {
  Title,
  Subtitle,
  AuroraText,
  Badge,
} from "../Grid/GridComponent.styles";

import useCurrencyDetector from "../../Services/useCurrencyDetector";
// Helper component for rich typography and highlighted words
function RichTextFormatter({ text }) {
  if (!text) return null;

  const paragraphs = text.split("\n").filter(Boolean);

  const highlightKeyTerms = (str) => {
    // Regex matching numbers, durations, locations, and key travel terms
    const regex =
      /\b(\d+\s*(?:days|nights|hours|km|m)|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      parts.push(<HighlightWord key={match.index}>{match[0]}</HighlightWord>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts;
  };

  return (
    <OverviewContent>
      {paragraphs.map((para, idx) =>
        idx === 0 ? (
          <LeadParagraph key={idx}>{highlightKeyTerms(para)}</LeadParagraph>
        ) : (
          <RichDescription key={idx}>
            <p>{highlightKeyTerms(para)}</p>
          </RichDescription>
        ),
      )}
    </OverviewContent>
  );
}

function TourPage() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrencyDetector();
  const { tour, isPending, error } = useTourDetail();
  const { slug: routeSlug } = useParams();
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [isBooking, setIsBooking] = useState(false);

  const { user: isLoggedIn } = useUser();
  const [bookmarkTour, isBookmarkPending] = useAddBookmark({
    onSuccess: () => {
      
    },
    onError: (err) => {
      const serverMessage =
        err?.response?.data?.message || err?.response?.data?.error?.message;
      const status = err?.response?.status;
      const fallback = status
        ? `Could not bookmark this tour (HTTP ${status}).`
        : "Could not bookmark this tour. Please check your connection and try again.";
      toast.error(serverMessage || fallback);
    },
  });

  const { removeBookmarkTour, isPending: isRemovePending } = useRemoveBookmark({
    onSuccess() {
     
    },
    onError(err) {
      toast.error(err.response?.data?.message || "Failed to remove bookmark.");
    },
  });

  if (isPending) {
    return (
      <LoadingContainer>
        <Spinner />
        <p>Loading tour details...</p>
      </LoadingContainer>
    );
  }

  if (error || !tour) {
    return (
      <ErrorContainer>
        <h2>Tour Not Found</h2>
        <p>
          {error?.message || "We couldn't load the requested tour details."}
        </p>
      </ErrorContainer>
    );
  }

  const {
    name,
    description,
    destinations = [],
    startLocation,
    duration = {},
    startingPrice = 0,
    discount = 0,
    advanceBookingAmount = 2000,
    packages = [],
    imageCover,
    images = [],
    itinerary = [],
    ratingsAverage = 4.5,
    ratingsQuantity = 0,
    theme,
  } = tour;

  // Price calculations
  const selectedPackage = packages[selectedPackageIndex] || packages[0];
  const basePrice = selectedPackage?.price || startingPrice;
  const effectivePrice = Math.max(0, basePrice - discount);
  const discountPercent =
    basePrice > 0 ? Math.round((discount / basePrice) * 100) : 0;
  const offlineBalance = Math.max(0, effectivePrice - advanceBookingAmount);

  // Formatted location string
  const locationString =
    destinations
      .map((d) => `${d.city || d.state || ""}, ${d.country}`)
      .join(" • ") || "Worldwide";

  // Smooth scroll helper for anchor navigation
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Keyboard accessibility handler for package cards
  const handlePackageKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedPackageIndex(idx);
    }
  };

  // Interactive booking handler
  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
    navigate(
      `/user/booking/${tourSlug}/tour-information?package=${encodeURIComponent(
        selectedPackage.name,
      )}`,
    );
    }, 1200);
  };

  // Bookmark helpers
  // Prefer the URL slug — that's the same identifier used to fetch the tour,
  // so the server is guaranteed to resolve it. Fall back to the tour's own
  // slug, then to its _id (in case the route was hit with an ObjectId).
  const tourSlug =
    routeSlug ||
    tour?.slug ||
    (typeof tour?._id === "string" ? tour._id : null);
  const bookmarkedTours = isLoggedIn?.bookmarkedTours || [];
  const isBookmarked = bookmarkedTours.some((entry) => {
    const ref = entry?.tour_id;
    if (!ref) return false;
    if (typeof ref === "string") {
      return ref === tourSlug || ref === tour?._id;
    }
    return ref?._id === tour?._id || ref?.slug === tourSlug;
  });

  const handleBookmark = () => {


    if (!isLoggedIn) {
      toast.error("Please log in to bookmark tours.");
      return;
    }
    if (!tourSlug) {
      toast.error("This tour cannot be bookmarked right now.");
      return;
    }

    if (isBookmarked) {
       removeBookmarkTour(tourSlug);
     
    }
    else {
      bookmarkTour(tourSlug);
    }
   
  };

  return (
    <PageContainer>
      {/* ==========================================
          HERO BANNER
         ========================================== */}
      <HeroWrapper>
        <HeroSection>
          {imageCover && <Background src={imageCover} alt={name} />}

          <Overlay />

          <Content>
            <HeroTitle>{name}</HeroTitle>

            <BookmarkButton
              type="button"
              onClick={handleBookmark}
              disabled={isBookmarkPending || isRemovePending}
              $active={isBookmarked}
              aria-pressed={isBookmarked}
              aria-label={
                isBookmarked ? "Remove bookmark" : "Bookmark this tour"
              }
              title={
                !isLoggedIn
                  ? "Login to bookmark"
                  : isBookmarked
                    ? "Already bookmarked"
                    : "Save this tour"
              }
            >
              <HiOutlineBookmark />
              {isBookmarked ? "Saved" : "Save"}
            </BookmarkButton>

            <QuickMetaBar>
              <MetaPill>
                <HiOutlineMapPin /> {locationString}
              </MetaPill>
              <MetaPill>
                <HiOutlineClock /> {duration.days || 1} Days /{" "}
                {duration.nights || 0} Nights
              </MetaPill>
              <MetaPill>
                <HiOutlineStar /> {ratingsAverage.toFixed(1)} ({ratingsQuantity}{" "}
                reviews)
              </MetaPill>
              {startLocation && (
                <MetaPill>
                  <HiOutlineTicket /> Starts: {startLocation}
                </MetaPill>
              )}
            </QuickMetaBar>
          </Content>
        </HeroSection>
      </HeroWrapper>

      {/* ==========================================
          STICKY ANCHOR NAVIGATION HEADER
         ========================================== */}
      <StickyNavWrapper>
        <StickyNavContainer>
          <StickyNavItem
            $active={activeSection === "overview"}
            onClick={() => scrollToSection("overview")}
          >
            Overview
          </StickyNavItem>
          {itinerary.length > 0 && (
            <StickyNavItem
              $active={activeSection === "itinerary"}
              onClick={() => scrollToSection("itinerary")}
            >
              Itinerary
            </StickyNavItem>
          )}
          {itinerary.length > 0 && (
            <StickyNavItem
              $active={activeSection === "map"}
              onClick={() => scrollToSection("map")}
            >
              Route Map
            </StickyNavItem>
          )}
          {images.length > 0 && (
            <StickyNavItem
              $active={activeSection === "gallery"}
              onClick={() => scrollToSection("gallery")}
            >
              Gallery
            </StickyNavItem>
          )}
          <StickyNavItem
            $active={activeSection === "booking"}
            onClick={() => scrollToSection("booking")}
          >
            Packages & Booking
          </StickyNavItem>
        </StickyNavContainer>
      </StickyNavWrapper>

      {/* ==========================================
          FULL WIDTH CONTENT STACK (MAIN LANDMARK)
         ========================================== */}
      <ContentWrapper as="main">
        {/* 1. TOUR OVERVIEW SECTION */}
        <OverviewCard id="overview">
          <OverviewHeader>
            <SectionTitle>
              <HiOutlineSparkles /> Tour Overview
            </SectionTitle>
            {theme && <ThemeTag>{theme}</ThemeTag>}
          </OverviewHeader>

          <RichTextFormatter text={description} />

          <HighlightsGrid>
            <HighlightBox>
              <HiOutlineMapPin />
              <div>
                <span className="label">Destinations</span>
                <span className="value">{locationString}</span>
              </div>
            </HighlightBox>
            <HighlightBox>
              <HiOutlineClock />
              <div>
                <span className="label">Duration</span>
                <span className="value">
                  {duration.days || 1} Days / {duration.nights || 0} Nights
                </span>
              </div>
            </HighlightBox>
            <HighlightBox>
              <HiOutlineStar />
              <div>
                <span className="label">Overall Rating</span>
                <span className="value">
                  {ratingsAverage.toFixed(1)} / 5.0 ({ratingsQuantity} reviews)
                </span>
              </div>
            </HighlightBox>
          </HighlightsGrid>
        </OverviewCard>

        {/* 2. DAY-BY-DAY ITINERARY */}
        {itinerary.length > 0 && (
          <SectionCard id="itinerary">
            <SectionTitle>Swipe Left to Explore</SectionTitle>
            <TimelineContainer>
              {itinerary.map((dayItem, idx) => (
                <TimelineItem
                  key={idx}
                  as={motion.div}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <DayHeaderRow>
                    <DayCircle>D{dayItem.day || idx + 1}</DayCircle>
                    <DayTitle>{dayItem.title}</DayTitle>
                  </DayHeaderRow>
                  <DayCard>
                    <DayDesc>{dayItem.description}</DayDesc>
                    {dayItem.location && (
                      <DayLocation>
                        <HiOutlineMapPin />
                        {[
                          dayItem.location.city,
                          dayItem.location.state,
                          dayItem.location.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </DayLocation>
                    )}
                  </DayCard>
                </TimelineItem>
              ))}
            </TimelineContainer>
          </SectionCard>
        )}

        {/* 3. JOURNEY MAP */}
        {itinerary.length > 0 && (
          <div id="map">
            <MapItinerary itinerary={itinerary} />
          </div>
        )}

        {/* 4. REACT BITS GRID MOTION GALLERY */}
        {images.length > 0 && (
          <div id="gallery">
            <GridMotionGallery images={images} />
          </div>
        )}

        {/* 5 & 6. PACKAGES AND BOOKING SIDE-BY-SIDE */}
        <SectionHeader
          id="booking"
          as={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <Badge>FIND YOUR PERFECT PLAN</Badge>

          <Title>
            Choose
            <br />
            <AuroraText>Your Perfect Deal</AuroraText>
          </Title>

          <Subtitle>
            Compare packages, explore inclusions, and book the experience that
            suits you best.
          </Subtitle>
        </SectionHeader>

        <BookingPackagesRow>
          {packages.length > 0 && (
            <SectionCard>
              <SectionTitle>
                <HiOutlineSparkles /> Choose Package Tier
              </SectionTitle>
              <SectionSubtitle style={{ marginBottom: "1.5rem" }}>
                Compare available package options, hotel stays, and
                transportation benefits.
              </SectionSubtitle>
              <PackageGrid role="radiogroup" aria-label="Tour Package Tiers">
                {packages.map((pkg, idx) => {
                  const isSelected = selectedPackageIndex === idx;
                  return (
                    <PackageOptionCard
                      key={idx}
                      role="radio"
                      tabIndex={0}
                      aria-checked={isSelected}
                      $selected={isSelected}
                      onClick={() => setSelectedPackageIndex(idx)}
                      onKeyDown={(e) => handlePackageKeyDown(e, idx)}
                    >
                      {isSelected && (
                        <SelectedBadge>
                          <HiCheckCircle /> SELECTED PLAN
                        </SelectedBadge>
                      )}

                      <PackageHeader>
                        <PackageName>{pkg.name} Tier</PackageName>
                        <PackagePriceTag>
                          {formatCurrency(pkg.price)}
                        </PackagePriceTag>
                      </PackageHeader>

                      {pkg.hotels && pkg.hotels.length > 0 && (
                        <FeatureList>
                          {pkg.hotels.map((hotel, hIdx) => (
                            <HotelCard key={hIdx}>
                              <span>
                                <HiOutlineBuildingOffice2 />{" "}
                                <a
                                  href={hotel.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {hotel.name}
                                </a>
                              </span>
                              <div>
                                <HiOutlineStar /> {hotel.rating}
                              </div>
                              <div>
                                <HiOutlineHome /> {hotel.roomType}  
                              </div>
                            </HotelCard>
                          ))}
                        </FeatureList>
                      )}

                      <FeatureList>
                        {pkg.transportation && (
                          <FeatureItem>
                            <HiOutlineTruck /> {pkg.transportation}
                          </FeatureItem>
                        )}
                        {pkg.assistance && (
                          <FeatureItem>
                            <HiOutlineCheck /> {pkg.assistance}
                          </FeatureItem>
                        )}
                        {pkg.meals && pkg.meals.length > 0 && (
                          <FeatureItem>
                            <HiOutlineCheck /> Meals: {pkg.meals.join(", ")}
                          </FeatureItem>
                        )}
                        {pkg.extraFacilities &&
                          pkg.extraFacilities.length > 0 && (
                            <FeatureItem>
                              <HiOutlineCheck />{" "}
                              {pkg.extraFacilities.join(", ")}
                            </FeatureItem>
                          )}
                      </FeatureList>
                    </PackageOptionCard>
                  );
                })}
              </PackageGrid>
            </SectionCard>
          )}

          <BookingCard>
            <PriceHeader>
              {discount > 0 && (
                <DiscountBadge>
                  {discountPercent}% OFF • SAVE TODAY
                </DiscountBadge>
              )}
              <PriceRow>
                <PriceCurrent>{formatCurrency(effectivePrice)}</PriceCurrent>
                {discount > 0 && (
                  <PriceOriginal>{formatCurrency(basePrice)}</PriceOriginal>
                )}
              </PriceRow>
            </PriceHeader>

            <DepositBox>
              <div className="deposit-title">Pay Deposit Online</div>
              <div className="deposit-amount">
                {formatCurrency(advanceBookingAmount)}
              </div>
              <div className="deposit-desc">
                Reserve your slot online now. Pay remaining{" "}
                <strong style={{ color: "#ffffff" }}>
                  {formatCurrency(offlineBalance)}
                </strong>{" "}
                offline when tour starts.
              </div>
            </DepositBox>

            <BookButton
              type="button"
              onClick={handleBooking}
              disabled={isBooking || !isLoggedIn}
              aria-label={`Book ${name} now for ${formatCurrency(effectivePrice)}`}
            >
              {isBooking ? (
                <>
                  <Spinner style={{ width: "20px", height: "20px" }} />
                  Processing...
                </>
              ) : (
                `${isLoggedIn ? "Book Now" : "Login to Book"}`
              )}
            </BookButton>

            <TrustList>
              <TrustItem>
                <HiOutlineCheck /> Instant Booking Confirmation
              </TrustItem>
              <TrustItem>
                <HiOutlineShieldCheck /> 100% Verified Local Guides
              </TrustItem>
              <TrustItem>
                <HiOutlineSparkles /> Flexible Cancellation Options
              </TrustItem>
              <TrustItem>
                <HiOutlinePhone /> For More Details : +79 321 456 7890
              </TrustItem>
            </TrustList>
          </BookingCard>
        </BookingPackagesRow>
      </ContentWrapper>

      {/* ==========================================
          MOBILE STICKY BOTTOM BOOKING BAR
         ========================================== */}
      <MobileStickyBar>
        <MobilePriceInfo>
          <span className="price">{formatCurrency(effectivePrice)}</span>
          <span className="label">
            {selectedPackage?.name
              ? `${selectedPackage.name} Tier`
              : "Standard"}
          </span>
        </MobilePriceInfo>
        <MobileBookButton
          type="button"
          onClick={handleBooking}
          disabled={isBooking}
        >
          {isBooking ? "Reserving..." : "Book Now"}
        </MobileBookButton>
      </MobileStickyBar>
    </PageContainer>
  );
}

export default TourPage;
