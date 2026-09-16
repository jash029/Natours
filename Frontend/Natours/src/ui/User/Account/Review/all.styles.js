import styled, { css } from "styled-components";

export const BottomContent = styled.section`
  width: min(140rem, 92%);
  margin: 2.5rem auto 5rem;
`;

export const AlertBox = styled.div`
  padding: 1.4rem;
  border-radius: 14px;

  text-align: center;

  font-size: 1.2rem;
  line-height: 1.6;

  background: ${({ $type }) => ($type === "error" ? "#fef2f2" : "#ffffff")};

  color: ${({ $type }) => ($type === "error" ? "#dc2626" : "#475569")};

  border: 1px solid
    ${({ $type }) => ($type === "error" ? "#fecaca" : "#e8edf3")};

  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
`;

export const EmptyStateWrapper = styled(AlertBox)`
  padding: 4rem 2rem;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.85rem 1.35rem;

  border-radius: 999px;

  border: 1px solid #e5e7eb;

  background: #fff;

  color: #0f172a;

  font-size: 1.15rem;
  font-weight: 600;

  cursor: pointer;

  margin-bottom: 2rem;

  transition: 0.25s ease;

  &:hover {
    background: #0f172a;
    color: #fff;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.35rem;
  }
`;

export const ReviewsGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 1.5rem;

  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.article`
  background: #131212ff;

  display: flex;
  flex-direction: column;

  height: 450px;

  border-radius: 16px;

  overflow: hidden;

  border: 1px solid #e8edf3;

  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.05),
    0 10px 24px rgba(15, 23, 42, 0.06);

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);

    box-shadow:
      0 8px 18px rgba(15, 23, 42, 0.08),
      0 18px 36px rgba(15, 23, 42, 0.1);
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

export const CoverWrapper = styled.div`
  position: relative;

  height: 160px;

  overflow: hidden;
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.4s ease;
`;

export const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.65));
`;

export const FloatingRating = styled.div`
  position: absolute;

  top: 1rem;
  right: 1rem;

  display: flex;
  align-items: center;
  gap: 0.35rem;

  padding: 0.4rem 0.7rem;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.96);

  font-size: 1rem;
  font-weight: 700;

  color: #111827;

  backdrop-filter: blur(8px);

  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);

  svg {
    color: #f59e0b;
    font-size: 1.1rem;
  }
`;

export const TourInfo = styled.div`
  position: absolute;

  left: 1.2rem;
  right: 1.2rem;
  bottom: 1.2rem;

  color: white;
`;

export const ReviewTourTitle = styled.h2`
  font-size: 1.4rem;

  font-weight: 700;

  line-height: 1.35;

  letter-spacing: -0.02em;

  margin-bottom: 0.35rem;
`;

export const ReviewSummary = styled.p`
  font-size: 1rem;

  line-height: 1.45;

  opacity: 0.92;

  display: -webkit-box;

  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;

  overflow: hidden;
`;

export const CardContent = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  padding: 1rem;
`;

export const MetaRow = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;

  flex-wrap: wrap;

  gap: 0.45rem;

  margin-bottom: 0.9rem;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;

  gap: 0.45rem;

  color: #ffffffff;

  font-size: 1rem;
  font-weight: 500;

  svg {
    color: #2563eb;
    font-size: 1.1rem;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;

  background: #edf2f7;

  margin: 1rem 0;
`;

export const ReviewTitle = styled.h3`
  color: #000000ff;

  font-size: 1.3rem;

  font-weight: 700;

  line-height: 1.35;

  margin-bottom: 0.45rem;
`;

export const ReviewText = styled.p`
  color: #111111ff;

  font-size: 1.08rem;

  line-height: 1.6;

  margin-bottom: 1rem;

  display: -webkit-box;

  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;

  overflow: hidden;
`;
export const SubRatingsGrid = styled.div`
  display: grid;

  gap: 0.55rem;

  margin-top: 0.2rem;
`;

export const SubRatingItem = styled.div`
  display: grid;

  grid-template-columns: 1fr auto;

  gap: 0.45rem;

  padding: 0.65rem 0.8rem;

  border-radius: 10px;

  background: #f8fafc;

  border: 1px solid #edf2f7;

  transition: all 0.25s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #dbe4ee;
  }

  span {
    color: #475569;

    font-size: 0.98rem;
    font-weight: 500;
  }

  strong {
    color: #0f172a;

    font-size: 0.98rem;
    font-weight: 700;
  }
`;

export const RatingBar = styled.div`
  grid-column: 1 / -1;

  height: 4px;

  margin-top: 0.2rem;

  background: #e2e8f0;

  border-radius: 999px;

  overflow: hidden;
`;

export const RatingFill = styled.div`
  width: ${({ value }) => value}%;

  height: 100%;

  border-radius: inherit;

  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 45%, #60a5fa 100%);

  transition: width 0.35s ease;
`;

export const Footer = styled.div`
  margin-top: 0.7rem;

  display: flex;

  justify-content: space-between;
  align-items: center;

  flex-wrap: wrap;

  gap: 0.5rem;

  padding-top: 0.5rem;

  border-top: 1px solid #edf2f7;
`;

export const FooterLeft = styled.div`
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 0.45rem;
`;

export const FooterRight = styled.div`
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 0.45rem;
`;

export const Badge = styled.div`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 0.3rem;

  padding: 0.3rem 0.65rem;

  border-radius: 999px;

  font-size: 0.88rem;
  font-weight: 600;

  white-space: nowrap;

  ${({ type }) =>
    type === "verified" &&
    css`
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    `}

  ${({ type }) =>
    type === "approved" &&
    css`
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    `}

  ${({ type }) =>
    type === "pending" &&
    css`
      background: #fff7ed;
      color: #ea580c;
      border: 1px solid #fed7aa;
    `}
`;

export const BookingChip = styled.div`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  padding: 0.3rem 0.65rem;

  border-radius: 999px;

  background: #f3f4f6;

  border: 1px solid #e5e7eb;

  color: #374151;

  font-size: 0.88rem;
  font-weight: 600;
`;

export const CreatedAt = styled.span`
  color: #94a3b8;

  font-size: 0.9rem;

  font-weight: 500;

  white-space: nowrap;
`;