import styled, { css } from "styled-components";

export const Page = styled.div`
  width: min(95rem, 100%);
  margin: 0 auto;

  padding: 4rem 0 6rem;
`;

export const Header = styled.div`
  margin-bottom: 3rem;
`;

export const Title = styled.h1`
  font-size: 3.4rem;
  font-weight: 700;

  color: #ffffff;

  margin-bottom: 0.8rem;
`;

export const Subtitle = styled.p`
  font-size: 1.6rem;
  color: #9e9e9e;
  line-height: 1.6;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  margin-bottom: 3rem;
`;

export const Tab = styled.button`
  border: none;
  outline: none;

  cursor: pointer;

  padding: 1.3rem 2rem;

  border-radius: 1.2rem;

  font-size: 1.5rem;
  font-weight: 600;

  transition: all 0.25s;

  background: #171717;
  color: #bdbdbd;

  &:hover {
    background: #232323;
    color: white;
  }

  ${(props) =>
    props.active &&
    css`
      background: #2563eb;
      color: white;
    `}

  ${(props) =>
    props.danger &&
    !props.active &&
    css`
      &:hover {
        background: #991b1b;
        color: white;
      }
    `}

  ${(props) =>
    props.danger &&
    props.active &&
    css`
      background: #dc2626;
      color: white;
    `}
`;

export const Content = styled.div`
  background: transparent;

  border: 1px solid #252525;
  border-radius: 2rem;

  padding: 3rem;

  min-height: 55rem;

  color: white;
`;
