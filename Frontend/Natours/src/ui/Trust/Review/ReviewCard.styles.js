// ReviewCard.styles.js

import styled from "styled-components";

export const Card = styled.article`
  width: 100%;
  height: 100%;

  background: #fff;
  border-radius: 2rem;

  padding: 1.2rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: all 0.3s ease;
  cursor: pointer;

 
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  min-width: 0;
`;

export const Avatar = styled.img`
  width: 3.8rem;
  height: 3.8rem;

  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  min-width: 0;
`;

export const Name = styled.h4`
  font-size: 1.35rem;
  font-weight: 700;
  color: #111;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Social = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  font-size: 1.8rem;
  color: #666;
`;

export const Review = styled.p`
  margin-top: 1rem;

  color: #555;
  font-size: 1.2rem;
  line-height: 1.55;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: auto;
  padding-top: 1rem;
`;

export const Stars = styled.div`
  display: flex;
  gap: 0.2rem;

  color: #6133e0;
  font-size: 1.25rem;
`;

export const Time = styled.span`
  font-size: 1.1rem;
  color: #999;
`;
