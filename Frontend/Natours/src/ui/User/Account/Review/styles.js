import styled, { css } from "styled-components";

export const BottomContent = styled.section`
  width: min(145rem, 92%);
  margin: 6rem auto 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2rem;
`;

export const SectionHeader = styled.div`
  max-width: 80rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const MainTitle = styled.h2`
  font-size: clamp(3.2rem, 4vw, 5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #4a65eaff;
`;

export const SubTitle = styled.p`
  font-size: 1.6rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.72);
`;

export const FeaturesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(27rem, 1fr));
  gap: 2rem;
`;

export const FeatureCard = styled.div`
  padding: 2.5rem;
  border-radius: 2rem;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
`;

export const FeatureIcon = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 1.6rem;
`;

export const FeatureTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.8rem;
`;

export const FeatureText = styled.p`
  font-size: 1.45rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
`;

export const Select = styled.select`
  width: 100%;
  padding: 1.3rem 1.6rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1.45rem;
  outline: none;
  cursor: pointer;
  transition: 0.25s;

  &:focus {
    border-color: white;
  }

  option {
    background: #101010;
    color: white;
  }
`;

export const AlertBox = styled.div`
  width: min(90rem, 100%);
  padding: 1.6rem 2rem;
  border-radius: 1.4rem;
  font-size: 1.45rem;

  ${({ $type }) =>
    $type === "error"
      ? css`
          color: #ffb4b4;
          background: rgba(255, 0, 0, 0.08);
          border: 1px solid rgba(255, 0, 0, 0.25);
        `
      : css`
          color: #d7f3ff;
          background: rgba(0, 140, 255, 0.08);
          border: 1px solid rgba(0, 140, 255, 0.2);
        `}
`;

export const EmptyStateWrapper = styled.div`
  width: 100%;
  padding: 5rem;
  text-align: center;
  border-radius: 2rem;
  font-size: 1.7rem;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.04);
`;

export const ReviewsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(36rem, 1fr));
  gap: 2.5rem;
`;

export const ReviewCard = styled.article`
  padding: 2.5rem;
  border-radius: 2rem;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
  transition: 0.3s;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`;

export const UserAvatarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.3rem;
`;

export const AvatarCircle = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: white;
  color: black;
  font-size: 1.8rem;
  font-weight: 700;
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.h4`
  font-size: 1.7rem;
  color: white;
`;

export const ReviewDate = styled.span`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const StatusBadge = styled.div`
  padding: 0.6rem 1.2rem;
  border-radius: 5rem;
  font-size: 1.2rem;
  font-weight: 600;

  ${({ $type }) =>
    $type === "success" &&
    css`
      color: #54ff99;
      background: rgba(84, 255, 153, 0.12);
      border: 1px solid rgba(84, 255, 153, 0.3);
    `}
`;

export const ReviewTourTitle = styled.h3`
  font-size: 2rem;
  color: white;
  font-weight: 700;
`;

export const StarSpan = styled.span`
  font-size: 2rem;
  margin-right: 0.25rem;
  color: ${({ $active }) => ($active ? "#fbbf24" : "rgba(255,255,255,.18)")};
`;

export const SubRatingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

export const SubRatingItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);

  span {
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.82);
  }
`;

