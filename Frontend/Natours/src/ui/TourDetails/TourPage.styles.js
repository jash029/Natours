import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/* ==========================================
   PAGE LAYOUT & CONTAINERS
   ========================================== */
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #0b0b0b;
  color: #f3f4f6;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  overflow-x: hidden;
  padding-bottom: 6rem;
`;

export const LoadingContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background-color: #0b0b0b;
  color: #9ca3af;
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const ErrorContainer = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  padding: 2rem;

  h2 {
    font-size: 2.4rem;
    color: #ef4444;
  }

  p {
    font-size: 1.4rem;
    color: #9ca3af;
  }
`;

/* ==========================================
   HERO BANNER (EXACTLY MATCHES HOMEPAGE HERO)
   ========================================== */
export const HeroWrapper = styled.section`
  width: 100%;
  background: #000;
  padding: 6rem 0;
`;

export const HeroSection = styled.section`
  position: relative;
  width: 87%;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 28px;
  background: black;
  top: 3rem;
`;

export const Background = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;
  filter: brightness(1.1) contrast(1.05);

  mask-image: linear-gradient(
    to bottom,
    black 45%,
    rgba(0, 0, 0, 0.6) 75%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    black 45%,
    rgba(0, 0, 0, 0.6) 75%,
    transparent 100%
  );

  will-change: transform, filter, opacity;

  z-index: 1;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;

  background:
    linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)),
    linear-gradient(
      to top,
      #000000 0%,
      rgba(0, 0, 0, 0.85) 20%,
      rgba(0, 0, 0, 0.4) 45%,
      transparent 75%
    );

  z-index: 2;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 110px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    mask-image: linear-gradient(to top, black 25%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 25%, transparent 100%);
    pointer-events: none;
  }
`;

export const Content = styled.div`
  position: absolute;

  inset: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  padding: 3rem;

  z-index: 5;
`;

export const HeroTitle = styled.h1`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);

  color: rgba(255, 255, 255, 0.95);
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  text-align: center;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.75);

  z-index: 10000;
  width: 100%;
  padding: 0 1rem;
`;

export const HeroSubtitle = styled.p`
  position: absolute;
  top: clamp(14.5rem, 24vw, 18.5rem);
  left: 50%;
  transform: translateX(-50%);

  color: rgba(255, 255, 255, 0.82);
  background-color: transparent;
  font-size: clamp(1.9rem, 1.6vw, 1.6rem);
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  max-width: 780px;
  width: 90%;
  z-index: 10000;
  text-shadow: 0 2px 12px rgba(160, 160, 160, 0.7);
`;

export const QuickMetaBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  position: absolute;
  bottom: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 90%;
`;

export const MetaPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: 1.35rem;
  font-weight: 500;
  color: #ffffff;
  max-width: 100%;

  svg {
    color: #3b82f6;
    font-size: 1.6rem;
    flex-shrink: 0;
  }
`;

/* ==========================================
   FULL WIDTH TOUR OVERVIEW SECTION
   ========================================== */
export const FullWidthContainer = styled.div`
  width: min(130rem, calc(100% - 4rem));
  margin: 3.5rem auto 0;
`;

export const OverviewCard = styled.div`
  background: #141413;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 3.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #ffffff 0%, #3b82f6 50%, #000000 100%);
  }

  @media (max-width: 768px) {
    padding: 2.2rem;
  }
`;

export const OverviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 1.5rem;
`;

export const ThemeTag = styled.span`
  padding: 0.5rem 1.4rem;
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: #030303ff;
  color: #ffffffff;
  border: 1px solid #ffffffff;
`;

export const OverviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

export const LeadParagraph = styled.p`
  font-size: clamp(1.65rem, 2vw, 1.95rem);
  line-height: 1.8;
  color: #f3f4f6;
  font-weight: 400;
  letter-spacing: -0.01em;
`;

export const RichDescription = styled.div`
  font-size: 1.6rem;
  line-height: 1.85;
  color: #d1d5db;

  p {
    margin-bottom: 1.2rem;
  }
`;

export const HighlightWord = styled.span`
  color: #ffffff;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  /* background: rgba(255, 255, 255, 0.08); */
`;

export const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.6rem;
  margin-top: 0.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

export const HighlightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.5rem 1.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  transition: all 0.25s ease;

  &:hover {
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }

  svg {
    font-size: 2.4rem;
    color: #3b82f6;
    flex-shrink: 0;
  }

  .label {
    display: block;
    font-size: 1.2rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .value {
    display: block;
    font-size: 1.5rem;
    color: #ffffff;
    font-weight: 700;
    margin-top: 0.2rem;
  }
`;

/* ==========================================
   MAIN CONTENT FULL-WIDTH LAYOUT
   ========================================== */
export const ContentWrapper = styled.div`
  width: min(130rem, calc(100% - 4rem));
  margin: 3.5rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
`;

/* ==========================================
   SECTION CARDS
   ========================================== */
export const SectionCard = styled.div`
  background: #141413;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 2.8rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 760px;
  margin: 2rem auto 3.5rem auto;
  gap: 1.2rem;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #5066d2ff;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  svg {
    color: #ffffff;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.6rem;
  line-height: 1.65;
  color: #9ca3af;
  max-width: 640px;
  margin: 0 auto;
  font-weight: 400;
  text-align: center;
`;

export const DescriptionText = styled.p`
  font-size: 1.55rem;
  line-height: 1.85;
  color: #d1d5db;
  white-space: pre-line;
`;

/* ==========================================
   PHOTO GALLERY
   ========================================== */
export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

export const GalleryItem = styled.div`
  position: relative;
  height: 195px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.05);
    will-change: transform;
    transform: translateZ(0);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.08) translateZ(0);
  }
`;

/* ==========================================
   SHORT-HEIGHTED HORIZONTAL ITINERARY TIMELINE
   ========================================== */
export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.6rem;
  overflow-x: auto;
  padding: 0.6rem 0.4rem 1.6rem 0.4rem;
  max-height: 250px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 999px;

    &:hover {
      background: #ffffff;
    }
  }
`;

export const TimelineItem = styled.div`
  min-width: 300px;
  max-width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
`;

export const DayHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const DayCircle = styled.div`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: #000000;
`;

export const DayCard = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 1.5rem 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 165px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-5px);
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const DayTitle = styled.h4`
  font-size: 1.55rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DayDesc = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: #d1d5db;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const DayLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.15rem;
  color: #9ca3af;
  margin-top: auto;
  font-weight: 500;

  svg {
    color: #ef4444;
  }
`;

/* ==========================================
   PACKAGES & INCLUSIONS (MONOCHROME LUXURY)
   ========================================== */
export const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;

export const PackageOptionCard = styled.div`
  background: ${({ $selected }) =>
    $selected ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.02)"};
  border: 2px solid
    ${({ $selected }) => ($selected ? "#ffffff" : "rgba(255, 255, 255, 0.12)")};
  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 20px rgba(59, 130, 246, 0.25)" : "none"};
  border-radius: 16px;
  padding: 2rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  cursor: pointer;
  transition: all 0.25s ease;
  outline: none;

  &:focus-visible {
    border-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }

  &:hover {
    border-color: #ffffff;
    transform: translateY(-2px);
  }
`;

export const SelectedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 8px;
  background: #4c59e4ff;
  color: #000000;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
  align-self: flex-start;

  svg {
    font-size: 1.3rem;
    color: #000000;
  }
`;

export const PackageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PackageName = styled.span`
  font-size: 1.7rem;
  font-weight: 700;
  color: #cececeff;
`;

export const PackagePriceTag = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const FeatureItem = styled.li`
  font-size: 1.3rem;
  color: #d1d5db;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  svg {
    color: #22c55e;
    flex-shrink: 0;
  }
`;

export const HotelCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1rem 1.4rem;
  gap: 6px;
  border-radius: 10px;
  font-size: 1.35rem;

  span {
    color: #f3f4f6;
    font-weight: 600;
  }

  div {
    color: #f59e0b;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

/* ==========================================
   SIDE-BY-SIDE BOOKING & PACKAGES ROW
   ========================================== */
export const BookingPackagesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  align-items: start;
  width: 100%;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

/* ==========================================
   SIDEBAR BOOKING WIDGET (STICKY DESKTOP MONOCHROME)
   ========================================== */
export const BookingCard = styled.div`
  background: #141413;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 9rem;
  align-self: start;
`;

export const PriceHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

export const PriceCurrent = styled.span`
  font-size: 3.2rem;
  font-weight: 900;
  color: #ffffff;
`;

export const PriceOriginal = styled.span`
  font-size: 1.8rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

export const DiscountBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  background: #4c59e4ff;
  color: #1a1919ff;
  font-weight: 800;
  font-size: 1.2rem;
  align-self: flex-start;
`;

export const DepositBox = styled.div`
  background: rgba(19, 19, 19, 1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 1.35rem;

  .deposit-title {
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .deposit-amount {
    font-size: 2.2rem;
    font-weight: 800;
    color: #ffffff;
  }

  .deposit-desc {
    color: #9a9a9aff;
    font-size: 1.25rem;
    line-height: 1.5;
  }
`;

export const BookButton = styled.button`
  width: 100%;
  padding: 1.6rem;
  border: 1px solid #ffffff;
  border-radius: 14px;
  background: #ebe6e6ff;
  color: #131313ff;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:hover:not(:disabled) {
    background: #000000;
    color: #ffffff;
    border-color: #ffffff;
    
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TrustList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 1.5rem;
`;

export const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;
  color: #9ca3af;

  svg {
    color: #22c55e;
    font-size: 1.6rem;
  }
`;

/* ==========================================
   STICKY ANCHOR NAVIGATION HEADER (MONOCHROME)
   ========================================== */
export const StickyNavWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 900;
  background: rgba(11, 11, 11, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.8rem 0;
`;

export const StickyNavContainer = styled.div`
  width: min(130rem, calc(100% - 4rem));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StickyNavItem = styled.button`
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#000000" : "#9ca3af")};
  border: 1px solid ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
  }
`;

/* ==========================================
   MOBILE STICKY BOTTOM BOOKING BAR
   ========================================== */
export const MobileStickyBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(20, 20, 19, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1.2rem 2rem;
  z-index: 9999;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.6);

  @media (max-width: 1080px) {
    display: flex;
  }
`;

export const MobilePriceInfo = styled.div`
  display: flex;
  flex-direction: column;

  .price {
    font-size: 2rem;
    font-weight: 800;
    color: #ffffff;
  }

  .label {
    font-size: 1.15rem;
    color: #9ca3af;
  }
`;

export const MobileBookButton = styled.button`
  padding: 1.2rem 2.4rem;
  border-radius: 12px;
  background: #ffffff;
  color: #000000;
  font-size: 1.5rem;
  font-weight: 800;
  border: 1px solid #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &:hover {
    background: #000000;
    color: #ffffff;
  }
`;

/* ==========================================
   BOOKMARK BUTTON (HERO OVERLAY)
   ========================================== */
export const BookmarkButton = styled.button`
  position: absolute;
  top: 2.2rem;
  right: 2.2rem;
  z-index: 10001;

  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.75rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    font-size: 1.9rem;
    color: ${(p) => (p.$active ? "#facc15" : "#ffffff")};
    transition: color 0.2s ease, transform 0.2s ease;
  }

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.75);
    border-color: rgba(255, 255, 255, 0.45);
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

    svg {
      transform: scale(1.08);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
