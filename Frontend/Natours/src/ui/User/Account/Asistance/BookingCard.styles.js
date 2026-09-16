import styled, { css } from "styled-components";

export const Card = styled.div`
  width: 100%;
  background: #0b0b0b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.2rem;
  color: white;
  transition: 0.25s;

  &:hover {
    border-color: white;
    transform: translateY(-4px);
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const Title = styled.h3`
  font-size: 2.2rem;
  font-weight: 700;
`;

export const Category = styled.p`
  color: #9ca3af;
  font-size: 1.4rem;
  margin-top: 0.5rem;
`;

export const Status = styled.div`
  padding: 0.7rem 1.4rem;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 600;

  ${({ status }) =>
    status === "Open" &&
    css`
      background: #1d4ed8;
      color: white;
    `}

  ${({ status }) =>
    status === "Resolved" &&
    css`
      background: #16a34a;
      color: white;
    `}

  ${({ status }) =>
    status === "Closed" &&
    css`
      background: #404040;
      color: white;
    `}
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 2rem;
  align-items: center;
`;

export const Label = styled.div`
  color: #8f8f8f;
  font-size: 1.4rem;
`;

export const Value = styled.div`
  font-size: 1.45rem;
  word-break: break-all;
`;

export const ResponseCount = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  width: 32px;
  height: 32px;

  border-radius: 50%;
  background: white;
  color: black;
  font-weight: 700;
`;

export const Message = styled.div`
  margin-top: 1rem;
  padding: 2rem;
  border-radius: 16px;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);

  p {
    margin-top: 1rem;
    line-height: 1.8;
    color: #d1d5db;
    font-size: 1.45rem;
    white-space: pre-wrap;
  }
`;

export const EmptyResponse = styled.div`
  padding: 1.4rem;
  border-radius: 12px;
  background: #111827;
  color: #cbd5e1;
  font-size: 1.35rem;
`;

export const Footer = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  display: flex;
  justify-content: space-between;
  gap: 2rem;
`;

export const DateText = styled.div`
  color: #9ca3af;
  font-size: 1.3rem;
  line-height: 1.7;
`;
