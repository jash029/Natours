import { Link } from "react-router-dom";
import styled from "styled-components";

export const OfferBlock = styled.div`
  position: relative;
  padding: 2.5rem 1.5rem;
  margin-bottom: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  width: 100%;
  background: #171716;
  border-radius: 2rem;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px; /* Border thickness */
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.35),
      rgba(255, 255, 255, 0.08)
    );

    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    filter: blur(8px);
    opacity: 0.8;
    pointer-events: none;
  }
`;

export const HeaderTrending = styled.h3`
  margin-bottom: 1.5rem;
  margin-left: 0.5rem;
  font-size: 1.8rem;
  font-weight: 400;
  padding: 0.7rem 1.6rem;
  border-radius: 12px;
  align-self: flex-start;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: black;
  background: ${({ $variant }) =>
    $variant === "trending"
      ? `linear-gradient(50deg, blue 10%, #ffffffff 70%)`
      : $variant === "adventure"
        ? `linear-gradient(50deg, #19c1feff 10%, #ffffffff 50%)`
        : `linear-gradient(50deg, #854efaff 10%, #ffffffff 50%)`};
`;

export const Explore = styled(Link)`
  font-size: 1.75rem;
  padding: 1.5rem;
  text-decoration: none;
  border-radius: 10px;
  align-self: center;

  color: ${({ $themes }) => ($themes === "white" ? "#111827" : "#ffffff")};

  &:hover {
    text-decoration: underline;
  }
`;
