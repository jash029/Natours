import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  padding-top: 8rem;
  padding-bottom: 5rem;
  background: black;
  color: #ffffff;
  overflow-x: hidden;
`;

export const HeroContainer = styled.section`
  margin-top: 2rem;
  text-align: center;
  max-width: 960px;
  margin: 0 auto 3rem auto;
  padding: 0 1.5rem;
`;

export const HeroTitle = styled.h1`
  margin-bottom: 1.2rem;
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 1.09;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffffd0;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const HeroSubtitle = styled.p`
  max-width: 720px;
  margin: 0 auto 2.5rem auto;
  font-size: 1.35rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const SearchBarContainer = styled.div`
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(18, 18, 24, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid
    ${(props) => (props.$isFocused ? "#ffffffff" : "rgba(255, 255, 255, 0.12)")};
  box-shadow: ${(props) =>
    props.$isFocused
      ? "0 0 25px rgba(59, 130, 246, 0.25), 0 10px 30px rgba(0, 0, 0, 0.5)"
      : "0 10px 30px rgba(0, 0, 0, 0.4)"};
  border-radius: 9999px;
  padding: 0.85rem 1.75rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const SearchIconWrapper = styled.div`
  color: ${(props) => (props.$isFocused ? "#327bf0ff" : "#8c8c8c")};
  display: flex;
  align-items: center;
  margin-right: 0.85rem;
  transition: color 0.25s ease;
`;

export const SearchInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 400;

  &::placeholder {
    color: #888888;
  }
`;

export const ClearSearchButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #b5b5b5;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    transform: scale(1.05);
  }
`;

export const SuggestionsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background-color: rgba(14, 14, 18, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
  z-index: 100;
  text-align: left;
  max-height: 400px;
  overflow-y: auto;
`;

export const SuggestionCategory = styled.div`
  margin-bottom: 1.2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SuggestionHeader = styled.div`
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffffff;
  margin-bottom: 0.6rem;
  font-weight: 700;
`;

export const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  color: #ffffffff;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(59, 130, 246, 0.15);
    color: #ffffff;
    transform: translateX(4px);
  }
`;

export const MainLayout = styled.div`
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  align-items: flex-start;

  @media (max-width: 1024px) {
    padding: 0 1.25rem;
  }
`;

export const SidebarOverlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(6px);
    z-index: 190;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
    transition: opacity 350ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }
`;

export const SidebarContainer = styled.aside`
  /* Desktop smooth expandable/collapsible sidebar */
  @media (min-width: 1025px) {
    width: ${(props) => (props.$isOpen ? "320px" : "0px")};
    max-width: ${(props) => (props.$isOpen ? "320px" : "0px")};
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    transform: ${(props) => (props.$isOpen ? "translateX(0)" : "translateX(-20px)")};
    margin-right: ${(props) => (props.$isOpen ? "2rem" : "0px")};
    padding: ${(props) => (props.$isOpen ? "1.5rem" : "0px")};
    border: ${(props) => (props.$isOpen ? "1px solid rgba(255, 255, 255, 0.08)" : "none")};
    overflow-y: ${(props) => (props.$isOpen ? "auto" : "hidden")};
    pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
    background-color: #0b0b0f;
    border-radius: 24px;
    height: fit-content;
    position: sticky;
    top: 6rem;
    max-height: calc(100vh - 7rem);
    flex-shrink: 0;
    transition: width 380ms cubic-bezier(0.22, 0.61, 0.36, 1),
      max-width 380ms cubic-bezier(0.22, 0.61, 0.36, 1),
      opacity 300ms cubic-bezier(0.22, 0.61, 0.36, 1),
      transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1),
      margin 380ms cubic-bezier(0.22, 0.61, 0.36, 1),
      padding 380ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  /* Tablet and Mobile Backdrop Drawer */
  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 200;
    width: 85%;
    max-width: 360px;
    height: 100vh;
    background-color: #0b0b0f;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0 24px 24px 0;
    padding: 1.75rem;
    max-height: 100vh;
    overflow-y: auto;
    box-shadow: 10px 0 40px rgba(0, 0, 0, 0.85);
    transform: ${(props) => (props.$isOpen || props.$isMobileOpen ? "translateX(0)" : "translateX(-100%)")};
    opacity: ${(props) => (props.$isOpen || props.$isMobileOpen ? 1 : 0)};
    pointer-events: ${(props) => (props.$isOpen || props.$isMobileOpen ? "auto" : "none")};
    transition: transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1),
      opacity 300ms cubic-bezier(0.22, 0.61, 0.36, 1);
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  h2 {
    font-size: 1.7rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &:last-of-type {
    border-bottom: none;
  }
`;

export const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  user-select: none;
  margin-bottom: ${(props) => (props.$isOpen ? "1rem" : "0")};
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
`;

export const FilterOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #b5b5b5;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }

  input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    background-color: #121216;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:checked {
      background-color: #ffffffff;
      border-color: #fbfcffff;
      
    }

    &:checked::after {
      content: "";
      position: absolute;
      left: 5px;
      top: 2px;
      width: 5px;
      height: 9px;
      border: solid black;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;

export const PriceSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.5rem;


  span {
    color: #e1e3e7ff;
  }
`;

export const RangeSlider = styled.input`
  width: 100%;
  accent-color: #3b82f6;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  height: 6px;
  border-radius: 3px;
`;

export const ClearAllButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #ffffffff;
  font-weight: 600;
  font-size: 1.2rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #ffffffff;
    color: #000000ff;
   
  }
`;

export const ResultsContainer = styled.main`
  flex: 1 1 0%;
  min-width: 0;
  width: 100%;
  transition: all 380ms cubic-bezier(0.22, 0.61, 0.36, 1);
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(14, 14, 18, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

export const ToolbarLeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 640px) {
    justify-content: space-between;
    width: 100%;
  }
`;

export const ToolbarRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const TotalCountText = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;

  span {
    color: #8c8c8c;
    font-weight: 400;
    font-size: 1.2rem;
    margin-left: 0.5rem;
  }

  @media (max-width: 640px) {
    font-size: 1rem;
    span {
      display: none;
    }
  }
`;

export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background:rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: #ffffff;
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  

  &:hover {
    background: black;
    color: #ffffff;
    border-color: white;
   
  }

  svg {
    color: ${(props) => (props.$isOpen ? "#ffffff" : "#60a5fa")};
  }
`;

export const FilterBadge = styled.span`
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.2rem;
`;

export const MobileControls = styled.div`
  display: none;
  gap: 0.75rem;

  @media (max-width: 1024px) {
    display: none; /* Handled gracefully by FilterToggleButton in Toolbar */
  }
`;

export const MobileControlButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #101010;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;

export const SortSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #ffffffff;
  font-size: 1.2rem;

  select {
    background-color: #121216;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 0.65rem 1.1rem;
    font-size: 1.2rem;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 12px rgba(59, 130, 246, 0.25);
    }
  }
`;

export const ActiveChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.75rem;
`;

export const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 1);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.2);
  }

  button {
    background: none;
    border: none;
    color: #60a5fa;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.2s ease;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const ClearChipsLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #60a5fa;
  }
`;

export const TourCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const TourCardWrapper = styled.div`
  background-color: #0e0e12;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: #0f0f0fff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 22px 45px rgba(0, 0, 0, 0.75), 0 0 20px rgba(59, 130, 246, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CardImageContainer = styled.div`
  flex: 0 0 38%;
  position: relative;
  overflow: hidden;
  min-height: 240px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${TourCardWrapper}:hover img {
    transform: scale(1.08);
  }

  @media (max-width: 768px) {
    height: 220px;
    flex: none;
  }
`;

export const BadgeContainer = styled.div`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
`;

export const Badge = styled.span`
  background: rgba(6, 6, 6, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 1);
  color: #edf1f6ff;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

export const CardContent = styled.div`
  flex: 1;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 1rem;
`;

export const TourName = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

export const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background-color: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(8px);
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.08);

  svg {
    color: #ffffffff;
  }

  span {
    color: #8c8c8c;
    font-weight: 400;
    font-size: 0.75rem;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.35rem;
  color: #b5b5b5;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;

  svg {
    color: #3b82f6;
  }
`;

export const TourSummary = styled.p`
  color: #a0a0ab;
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
`;

export const PriceBlock = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

export const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
`;

export const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #8c8c8c;
  text-decoration: line-through;
`;

export const DiscountTag = styled.span`
  background-color: rgba(0, 0, 0, 0.15);
  color: #ffffffff;
  border: 1px solid rgba(255, 255, 255, 1);
  font-size: 1rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
`;

export const ViewDetailsButton = styled.button`
  background: white;
  color: #000000ff;
  border: 1px solid #000000ff;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1.4rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &:hover {
    background-color: black;
    color: white;
    border: 1px solid white;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 3.5rem;
  margin-bottom: 2rem;
`;

export const PageButton = styled.button`
  background-color: ${(props) => (props.$active ? "#000000ff" : "#0e0e12")};
  color: #ffffffff;
  border: 1px solid
    ${(props) => (props.$active ? "#fefeffff" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.$active ? "0 4px 15px rgba(25, 101, 222, 0.35)" : "none"};

  &:hover {
    background-color: ${(props) => (props.$active ? "#000000ff" : "#000000ff")};
    border-color: #3b82f6;
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
`;

export const EmptyStateContainer = styled.div`
  background-color: #0e0e12;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 4.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 520px;
  margin: 2rem auto;

  svg {
    color: #3b82f6;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.6rem;
  }

  p {
    color: #a0a0ab;
    font-size: 1.2rem;
    margin-bottom: 1.75rem;
  }
`;

export const SkeletonCard = styled.div`
  background-color: #0e0e12;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  height: 240px;
  display: flex;
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.04) 20%,
      rgba(255, 255, 255, 0.08) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 2s infinite;
    content: "";
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;
