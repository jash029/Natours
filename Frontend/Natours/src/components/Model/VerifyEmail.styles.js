import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const popup = keyframes`
  from {
    opacity: 0;
    transform: translateY(2rem) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2rem;

  background: rgba(0, 0, 0, 0.65);

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  animation: ${fadeIn} 0.25s ease;
`;

export const Modal = styled.div`
  width: min(46rem, 92vw);

  animation: ${popup} 0.3s ease;
`;
export const Card = styled.div`
  position: relative;

  width: 100%;

  padding: 4rem;

  border-radius: 2.8rem;

  background: linear-gradient(
    180deg,
    rgba(24, 24, 24, 0.98),
    rgba(18, 18, 18, 0.98)
  );

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 4rem 10rem rgba(0, 0, 0, 0.65),
    inset 0 1px rgba(255, 255, 255, 0.04);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  margin-bottom: 1rem;

  color: #ffffff;

  font-size: 3.2rem;
  font-weight: 700;

  letter-spacing: -0.03em;

  text-align: center;

  @media (max-width: 600px) {
    font-size: 2.8rem;
  }
`;

export const Description = styled.p`
  width: 90%;

  margin: 0 auto;

  color: #9ca3af;

  font-size: 1.55rem;

  line-height: 1.7;

  text-align: center;
`;

export const Email = styled.p`
  margin: 1.5rem 0 3.5rem;

  color: #ffffff;

  font-size: 1.8rem;
  font-weight: 600;

  text-align: center;

  word-break: break-word;
`;

export const OTPContainer = styled.div`
  display: flex;
  justify-content: center;

  gap: 1.2rem;

  margin-bottom: 2rem;

  @media (max-width: 600px) {
    gap: 0.8rem;
  }
`;

export const OTPInput = styled.input`
  width: 5.8rem;
  height: 6.6rem;

  border: 1px solid #303030;
  border-radius: 1.6rem;

  background: #1b1b1b;

  color: white;

  font-size: 2.6rem;
  font-weight: 700;

  text-align: center;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #505050;
  }

  &:focus {
    outline: none;

    background: #202020;

    border-color: #2563eb;

    transform: translateY(-2px);

    box-shadow:
      0 0 0 4px rgba(37, 99, 235, 0.15),
      0 1rem 2rem rgba(37, 99, 235, 0.18);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    width: 4.6rem;
    height: 5.4rem;

    font-size: 2rem;

    border-radius: 1.2rem;
  }
`;

export const ErrorMessage = styled.p`
  min-height: 2rem;

  margin-bottom: 2rem;

  color: #ff6b6b;

  font-size: 1.35rem;
  font-weight: 500;

  text-align: center;
`;

export const VerifyButton = styled.button`
  margin-top: 0.5rem;

  width: 100%;

  padding: 1.6rem;

  border: none;
  border-radius: 1.5rem;

  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);

  color: white;

  font-size: 1.6rem;
  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);

    box-shadow: 0 1.5rem 3rem rgba(37, 99, 235, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1.8rem;
  right: 1.8rem;

  width: 4rem;
  height: 4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background: transparent;

  color: #8b8b8b;
  font-size: 2.2rem;

  cursor: pointer;

  transition: all 0.25s ease;

  &:hover {
    color: #fff;
    background: #242424;
    transform: rotate(90deg);
  }

  &:active {
    transform: scale(0.95);
  }
`;