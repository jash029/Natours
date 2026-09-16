import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

export const StyledForm = styled.form`
  width: 100%;
  max-width: 460px;
  min-height: 440px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  z-index: 1000;

  ${({ type }) => {
    if (type !== "login" && type !== "signup") {
      return `
        gap: 3rem;
        padding: 2rem;
      `;
    } else if (type === "resetPassword") {
      return `
        gap: 1.2rem;
        padding: 4rem;
      `;
    }

    return `
      gap: 1.2rem;
      padding: 3rem;
    `;
  }}

  background: linear-gradient(
      155deg,
      #151515 0%,
      #1c1c1c 22%,
      #1f1f20 45%,
      #1933b6 72%,
      /* #2d74da 92%, */
      #0b3f91 100%,
       #2d74da 92%
    );

  /* background-color: #1933b6; */
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 30px;

  box-shadow:
    0 35px 70px rgba(0, 0, 0, 0.16),
    0 10px 25px rgba(0, 0, 0, 0.08);

  overflow: hidden;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #f8faff;
  text-align: center;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #a8b1cf;
  margin-top: -1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #dee4ec;
  font-weight: 600;
`;

export const Input = styled.input`
  padding: 0.95rem 1rem;

  border: 1px solid #d1d5db;
  border-radius: 12px;

  background: #1f1f20;

  color: #ffffff;

  font-size: 1rem;

  transition: all 0.25s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;

    border-color: #dee1e7;
    background: #2b2b2d;

    box-shadow: 0 0 0 4px rgba(32, 32, 32, 0.12);
  }
`;

export const Error = styled.p`
  color: #ff4d00;
  font-size: 1.06rem;
  font-weight: 400;
`;

export const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledLink = styled(Link)`
  color: #ffffff;

  text-decoration: none;

  font-weight: 500;

  transition: color 0.25s ease;

  &:hover {
    color: #fefeff;
    text-decoration: underline;
  }
`;

export const LoginButton = styled.button`
  border: none;

  padding: 1rem;

  border-radius: 12px;

  background: #020610dd;

  color: #ffffff;
 
  font-size: 1.25rem;

  font-weight: 400;

  cursor: pointer;

  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);

    background: #fdfdfffa;
    color:  #111827;

    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const BottomText = styled.p`
  text-align: center;

  color: #ffffff;

  font-size: 1.15rem;
`;
