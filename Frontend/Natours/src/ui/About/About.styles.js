import styled, { createGlobalStyle, keyframes } from "styled-components";

// ==========================================
// ANIMATIONS & KEYFRAMES
// ==========================================
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const floatAnim = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

export const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.08);
  }
  50% {
    box-shadow: 0 0 35px rgba(129, 140, 248, 0.18);
  }
`;

// ==========================================
// GLOBAL STYLES & RESET
// ==========================================
export const GlobalStyle = createGlobalStyle`


  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
    background-color: #050505;
    color: #FFFFFF;
  }

  body {
    background-color: #050505;
    color: #FFFFFF;
    overflow-x: hidden;
    line-height: 1.6;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #050505;
  }
  ::-webkit-scrollbar-thumb {
    background: #171717;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #262626;
  }

  h1, h2, h3, h4, .editorial-heading {
    letter-spacing: -0.02em;
  }
`;

// ==========================================
// AURORA BLUE TEXT ACCENT
// ==========================================
export const AuroraText = styled.span`
  background: linear-gradient(135deg, #38bdf8 0%, #3a4bdcff 50%, #162be8ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
`;

// ==========================================
// CORE CONTAINERS
// ==========================================
export const PageWrapper = styled.div`
  background-color: #050505;
  color: #ffffff;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const Section = styled.section`
  padding: 40px 0;
  position: relative;
  background-color: ${(props) => props.$bg || "transparent"};
  border-bottom: ${(props) =>
    props.$border ? "1px solid rgba(255, 255, 255, 0.08)" : "none"};

  @media (max-width: 1024px) {
    padding: 90px 0;
  }

  @media (max-width: 768px) {
    padding: 65px 0;
  }
`;

export const SectionHeader = styled.div`
  text-align: ${(props) => props.$align || "center"};
  max-width: ${(props) => props.$maxWidth || "760px"};
  margin: ${(props) =>
    props.$align === "left" ? "0 0 56px 0" : "0 auto 64px auto"};

  @media (max-width: 768px) {
    margin-bottom: 44px;
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 24px;
  backdrop-filter: blur(12px);
`;

export const SectionTitle = styled.h2`
  font-size: clamp(3rem, 4.2vw, 5.6rem);
  font-weight: 600;
  color: #ffffffff;
  line-height: 1.15;
  margin-bottom: 20px;
`;

export const SectionSubtitle = styled.p`
  font-size: clamp(1.5rem, 1.2vw, 1.15rem);
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.75;
  font-weight: 300;
`;

// ==========================================
// BUTTONS (MINIMAL ELEGANT WITH THIN BORDERS)
// ==========================================
export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background-color: #ffffff;
  color: #050505;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #ffffff;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: #050505;
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background-color: transparent;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.16);
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.4);

  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
`;

// ==========================================
// SECTION 1: HERO
// ==========================================
export const HeroSection = styled.section`
  min-height: 92vh;
  padding: 150px 0 90px 0;
  display: flex;
  align-items: center;
  position: relative;
  background: radial-gradient(
    circle at 75% 25%,
    rgba(23, 23, 23, 0.6) 0%,
    rgba(5, 5, 5, 1) 75%
  );

  @media (max-width: 992px) {
    padding: 120px 0 70px 0;
    min-height: auto;
  }
`;

export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

export const HeroContent = styled.div`
  animation: ${fadeIn} 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  h1 {
    font-size: clamp(7rem, 10vw, 5rem);
    font-weight: 600;
    line-height: 1.1;
    color: #ffffff;
    margin-bottom: 60px;
  }

  p {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.8;
    margin-bottom: 38px;
    max-width: 580px;
    font-weight: 300;
  }
`;

export const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const HeroMainImage = styled.div`
  width: 100%;
  max-width: 500px;
  height: 500px;
  border-radius: 28px;
  overflow: hidden;
  
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 420px;
  }
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(5, 5, 5, 0.75) 0%,
    rgba(5, 5, 5, 0.05) 50%
  );
`;



// ==========================================
// SECTION 2: OUR STORY
// ==========================================
export const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

export const StoryImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 580px;
  border-radius: 28px;
  overflow: hidden;
 

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }

  &:hover img {
    transform: scale(1.04);
  }

  /* Bottom blur */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 160px;

   

    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.82),
      transparent
    );

    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: 380px;
  }
`;

export const StoryContent = styled.div`
  p {
    font-size: 1.55rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.8;
    margin-bottom: 20px;
    font-weight: 300;
  }
`;

export const MiniFeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 36px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const MiniFeatureCard = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.16rem;
  font-weight: 600;
  color: #ffffff;
  transition: all 0.3s ease;

  .icon-wrap {
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: #171717;
    border-color: rgba(255, 255, 255, 0.16);
    transform: translateY(-3px);
  }
`;

// ==========================================
// SECTION 3: OUR PHILOSOPHY
// ==========================================
export const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ValueCard = styled.div`
  background: #000000ff;
  border: 1px solid rgba(255, 255, 255, 0.91);
  border-radius: 22px;
  padding: 42px 34px;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  .icon-box {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: #171717;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    margin-bottom: 26px;
    transition: all 0.3s ease;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
  }

  p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.7;
    font-weight: 300;
  }

  &:hover {
    transform: translateY(-8px);
    background: #ffffffff;
    border-color: rgba(0, 0, 0, 0.16);

    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);

    .icon-box {
      color: #fafafaff;
      transform: scale(1.06);
    }

    h3 {
      color: #000000ff;
    }

    p {
      color: #050505;
    }
  }
`;

// ==========================================
// SECTION 4: TRAVEL GALLERY (ASYMMETRICAL)
// ==========================================
export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 290px;
  gap: 20px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 250px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    grid-auto-rows: 270px;
  }
`;

export const GalleryItem = styled.div`
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 1);
  cursor: pointer;

  ${(props) =>
    props.$size === "large" &&
    `
    grid-column: span 2;
    grid-row: span 2;
  `}

  ${(props) =>
    props.$size === "medium" &&
    `
    grid-column: span 2;
    grid-row: span 1;
  `}

  @media (max-width: 992px) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .gallery-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(5, 5, 5, 0.9) 0%,
      rgba(5, 5, 5, 0) 65%
    );
    opacity: 0.85;
    transition: opacity 0.4s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 26px;
  }

  .tag {
    font-size: 1rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
    margin-bottom: 4px;
    font-weight: 500;
  }

  .title {
   
    font-size: 1.5rem;
    color: #ffffff;
    font-weight: 600;
  }

  &:hover {
    img {
      transform: scale(1.08);
    }

    .gallery-overlay {
      opacity: 1;
      background: linear-gradient(
        to top,
        rgba(5, 5, 5, 0.95) 0%,
        rgba(5, 5, 5, 0.2) 80%
      );
    }
  }
`;

// ==========================================
// SECTION 5: OUR IMPACT (STATISTICS)
// ==========================================
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 30px 22px;
  text-align: center;
  transition: all 0.3s ease;

  .number {
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    margin-bottom: 14px;
  }

  .label {
    font-size: 1.8rem;
    color: rgba(255, 255, 255, 0.72);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
    transform: translateY(-5px);
    background: #000000ff;
  }
`;

// ==========================================
// SECTION 6: WHY TRAVELERS TRUST US
// ==========================================
export const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 72px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 44px;
  }
`;

export const TrustContent = styled.div`
  .trust-heading {
    font-size: clamp(6rem, 4vw, 4rem);
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 24px;
    line-height: 1.2;
  }
`;

export const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 32px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;

  .check-icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: rgba(16, 16, 16, 1);
    border: 1px solid rgba(174, 172, 172, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffffff;
    flex-shrink: 0;
  }
`;

export const TrustImageWrapper = styled.div`
  height: 540px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }
  

  &::after 
  {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 160px;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.82),
      transparent
    );
  }
 

  &:hover img {
    transform: scale(1.04);
  }

  @media (max-width: 768px) {
    height: 360px;
  }
`;

// ==========================================
// SECTION 7: OUR JOURNEY (TIMELINE)
// ==========================================
export const Timeline = styled.div`
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.16) 15%,
      rgba(255, 255, 255, 0.16) 85%,
      transparent
    );
    transform: translateX(-50%);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

export const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 60px;
  display: flex;
  justify-content: ${(props) => (props.$isEven ? "flex-end" : "flex-start")};
  width: 100%;

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 52px;
  }
`;

export const TimelineDot = styled.div`
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 4px solid #050505;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  z-index: 2;

  @media (max-width: 768px) {
    left: 20px;
  }
`;

export const TimelineContent = styled.div`
  width: 44%;
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 45px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
  }

  .year {

    font-size: 2.2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
  }

  .description {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.65;
    font-weight: 300;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
    transform: translateY(-4px);
    background: #171717;
  }
`;

// ==========================================
// SECTION 8: MEET OUR EXPERTS
// ==========================================
export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const TeamCard = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 34px 24px;
  text-align: center;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  .avatar-wrap {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    margin: 0 auto 22px auto;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  .name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 4px;
  }

  .position {
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 14px;
    font-weight: 500;
  }

  .bio {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.6;
    font-weight: 300;
  }

  &:hover {
    transform: translateY(-8px);
    background: #171717;
    border-color: rgba(255, 255, 255, 0.16);

    .avatar-wrap img {
      transform: scale(1.1);
    }
  }
`;

// ==========================================
// SECTION 9: OUR PROMISE
// ==========================================
export const PromiseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 52px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const PromiseCard = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 34px 26px;
  text-align: center;
  transition: all 0.3s ease;

  .icon-wrap {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #171717;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
    color: #ffffff;
  }

  h4 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.65;
    font-weight: 300;
  }

  &:hover {
    background: #171717;
    border-color: rgba(255, 255, 255, 0.16);
    transform: translateY(-5px);
  }
`;

// ==========================================
// SECTION 10: FINAL CTA
// ==========================================
export const CTASection = styled.section`
  position: relative;
  padding: 200px 0;
  border-radius: 30px;
  overflow: hidden;
  margin: 60px 0 100px 0;
 

  .cta-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    transition: transform 10s ease;
  }

  &:hover .cta-bg {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 90px 20px;
    border-radius: 24px;
    margin: 40px 0 60px 0;
  }
`;

export const CTAOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at bottom,
    rgba(5, 5, 5, 1) 0%,
    rgba(5, 5, 5, 0.17) 100%
  );
  z-index: 2;
`;

export const CTAContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  max-width: 780px;
  margin: 0 auto;
  top: 18rem;



  
 

  h2 {
    font-size: clamp(2.4rem, 4.8vw, 4rem);
    font-weight: 600;
    color: #ffffffff;
    margin-bottom: 22px;
    line-height: 1.15;
  }

  p {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.75;
    margin-bottom: 42px;
    font-weight: 300;
  }
`;

// ==========================================
// HEADER & FOOTER STYLED COMPONENTS
// ==========================================
export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 22px 0;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$scrolled ? "rgba(5, 5, 5, 0.88)" : "transparent"};
  backdrop-filter: ${(props) => (props.$scrolled ? "blur(16px)" : "none")};
  border-bottom: ${(props) =>
    props.$scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "none"};
`;

export const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.a`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.55rem;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-size: 0.62rem;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    display: block;
    margin-top: -2px;
  }
`;

export const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 36px;

  a {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover,
    &.active {
      color: #ffffff;
    }
  }

  @media (max-width: 868px) {
    display: none;
  }
`;

export const Footer = styled.footer`
  background-color: #030303;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 85px 0 45px 0;
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 50px;
  margin-bottom: 60px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterCol = styled.div`
  h5 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 20px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  p {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.9rem;
    line-height: 1.7;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 12px;

      a {
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s ease;

        &:hover {
          color: #ffffff;
        }
      }
    }
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

// ==========================================
// MODALS
// ==========================================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${fadeIn} 0.3s ease forwards;
`;

export const ModalCard = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 28px;
  max-width: 680px;
  width: 100%;
  padding: 42px;
  position: relative;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9);
  max-height: 90vh;
  overflow-y: auto;

  .close-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: #ffffff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: 576px) {
    padding: 26px;
  }
`;
