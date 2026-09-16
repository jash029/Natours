// ImageCard.styles.js

import { Link } from "react-router-dom";
import styled from "styled-components";

export const Card = styled.article`
  width: 100%;
  height: 100%;

  border-radius: 2rem;

  background: #f0eded;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  gap: 1.2rem;
`;

export const Heading = styled.h2`
  color: black;

  font-size: 3rem;
  font-weight: 700;
  line-height: 1.15;

  letter-spacing: -0.03em;
`;

export const ExploreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 1.1rem 2rem;

  border: 1px solid black;
  border-radius: 999px;

  background: #0f0f10;
  color: white;

  font-size: 1.35rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
   
    background: #f8f9fa;
    color : black;
  }
`;
