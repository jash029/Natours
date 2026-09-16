import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    background-color: #050505;
    color: #FFFFFF;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }
`;

export const Page = styled.div`
  max-width: 1450px;
  width: 92%;
  margin: auto;
  padding: 4rem 0;

  @media (max-width: 768px) {
    width: 95%;
    padding: 2rem 0;
  }
`;

export const Section = styled.section`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 12px;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SectionTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 0.35rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.6rem 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 170px 1fr;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
`;

export const Label = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Value = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  word-break: break-word;
`;

export const LinkValue = styled.a`
  font-size: 0.95rem;
  font-weight: 500;
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: rgba(255, 255, 255, 0.3);
  transition:
    text-decoration-color 0.2s ease,
    color 0.2s ease;
  word-break: break-all;

  &:hover {
    color: #ffffff;
    text-decoration-color: #ffffff;
  }
`;

export const DocumentCard = styled.div`
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

export const DocumentImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background-color: #080808;
`;

export const DocumentImagePlaceholder = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: #0d0d0d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.8rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #ffffff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: fit-content;
`;

export const Divider = styled.hr`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  margin: 2rem 0;
`;

export const HeaderSection = styled.div`
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2.5rem;
  align-items: center;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 12px;
  }
`;

export const HeaderCoverImage = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background-color: #080808;

  @media (max-width: 1024px) {
    height: 220px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeaderTitle = styled.h1`
  font-size: 2.1rem;
  font-weight: 700;
  line-height: 1.25;
  color: #ffffff;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const HeaderMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const HeaderBadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

export const TravelerCard = styled.div`
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const TravelerTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DocumentsSubTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin: 1.75rem 0 1.25rem 0;
  letter-spacing: 0.02em;
`;

export const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const DocumentTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.01em;
`;

export const DocumentDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  gap: 0.5rem;
`;

export const DocumentDetailLabel = styled.span`
  color: rgba(255, 255, 255, 0.45);
`;

export const DocumentDetailValue = styled.span`
  color: #ffffff;
  font-weight: 500;
`;

export const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #ffffff;
`;

export const CheckIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
`;
