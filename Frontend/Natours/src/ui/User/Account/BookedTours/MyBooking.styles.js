import styled from "styled-components";

export const Container = styled.div`
  width: min(130rem, 92%);
  margin: 5rem auto;
`;

export const Header = styled.div`
  margin-bottom: 3.5rem;
`;

export const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffffff;
`;

export const Subtitle = styled.p`
  margin-top: 0.8rem;
  color: #b5b7bcff;
  font-size: 1.7rem;
`;

export const Grid = styled.div`
  display: grid;
  gap: 2.5rem;
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 40vh;

  font-size: 2rem;
  font-weight: 600;
  color: #6b7280;
`;

export const EmptyState = styled.div`
  min-height: 45vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #fff;

  border-radius: 20px;

  padding: 5rem;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);

  h2 {
    font-size: 3rem;
    color: #111827;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.6rem;
    color: #6b7280;
    text-align: center;
    max-width: 45rem;
  }
`;
