import styled from "styled-components";

export const BookMarkContainer = styled.section`
  width: min(145rem, 92%);
  margin: 4rem auto 8rem;
`;

export const BookMarkGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  gap: 2.4rem;

  align-items: stretch;

  justify-items: center;

  & > * {
    width: 100%;
    max-width: 320px;
    min-width: 0;
    flex: unset;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    gap: 1.8rem;

    & > * {
      max-width: 100%;
    }
  }
`;

