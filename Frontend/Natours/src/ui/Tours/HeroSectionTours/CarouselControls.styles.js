import styled from "styled-components";

export const Controls = styled.div`
  position: absolute;
  right: 6%;
  bottom: 10px;

  z-index: 20;

  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const NavButton = styled.button`
  width: 58px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);

  color: white;
  font-size: 1.4rem;

  cursor: pointer;

  transition: all 0.35s ease;

  &:hover {
    background: linear-gradient(135deg, #010e2c, #02091e);

    /* border-color: transparent; */

    /* transform: translateY(-5px); */

    box-shadow: 0 16px 40px rgba(37, 99, 235, 0.35);
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    transition: transform 0.6s ease;
  }

  &:hover svg {
    transform: scale(1.15);
  }
`;

export const Counter = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.45rem;

  color: white;

  span {
    font-size: 1.4rem;
    font-weight: 700;
  }

  small {
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.95rem;
  }
`;
