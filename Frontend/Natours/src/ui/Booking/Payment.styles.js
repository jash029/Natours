import styled, { css, keyframes } from "styled-components";

const spin = keyframes`
  from{
    transform:rotate(0deg);
  }

  to{
    transform:rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from{
    opacity:0;
  }

  to{
    opacity:1;
  }
`;

const pop = keyframes`
  0%{
    transform:scale(.7);
    opacity:0;
  }

  100%{
    transform:scale(1);
    opacity:1;
  }
`;

export const Wrapper = styled.div`
  min-height: 100vh;
  padding: 4rem 0 8rem;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 12px;

`;

export const Container = styled.div`
  width: min(140rem, 92%);
  margin: 0 auto;
`;

export const Header = styled.header`
  margin-bottom: 4rem;
`;



export const Title = styled.h1`
  color: white;
  font-size: 4.4rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
`;

export const Subtitle = styled.p`
  color: #d6d3d3ff;
  font-size: 1.6rem;
  max-width: 65rem;
  line-height: 1.8;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 36rem 1fr;
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = css`
  background-color: #020202;

  border: 1px solid rgba(255, 250, 250, 0.83);

  border-radius: 24px;

  padding: 3rem;

  backdrop-filter: blur(12px);

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
`;

export const SummaryCard = styled.div`
  ${Card}
`;

export const PaymentCard = styled.div`
  ${Card}
`;

export const CardTitle = styled.h2`
  color: white;
  font-size: 2.2rem;
  margin-bottom: 2.5rem;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.2rem 0;

  color: #c6d1e7ff;
  font-size: 1.5rem;

  strong {
    color: white;
    font-weight: 600;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 254, 254, 1);
  margin: 2rem 0;
`;

export const TotalRow = styled(SummaryRow)`
  font-size: 1.9rem;

  strong {
    color: #c6dcffff;
    font-size: 2.2rem;
  }
`;

export const MethodGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

export const MethodButton = styled.button`
  flex: 1;

  min-width: 15rem;

  border: none;

  border-radius: 16px;

  padding: 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  cursor: pointer;

  font-size: 1.5rem;
  font-weight: 600;

  transition: 0.3s;

  ${({ active }) =>
    active
      ? css`
          background: #ffffffff;
          color: black;
          border: 1px solid white;
        `
      : css`
          background-color: transparent;
          color: #fdfeffff;
          border: 1px solid white;

          &:hover {
            background: rgba(255, 255, 255, 0.09);
          }
        `}
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  p {
    color: #ef4444;
    font-size: 1.3rem;
    margin-top: -1rem;
  }
`;

export const Label = styled.label`
  color: white;
  font-size: 1.45rem;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;

  padding: 1.45rem 1.6rem;

  border-radius: 14px;

  background: rgba(255, 255, 255, 0.04);

  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;

  font-size: 1.5rem;

  transition: 0.25s;

  &:focus {
    outline: none;

    border-color: #2563eb;

    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
  }

  &::placeholder {
    color: #64748b;
  }

  option {
    color: black;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

export const Half = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;

  color: #cbd5e1;

  cursor: pointer;

  margin-top: 1rem;
`;

export const Checkbox = styled.input`
  width: 1.8rem;
  height: 1.8rem;
`;

export const SecureBox = styled.div`
  margin-top: 2rem;

  display: flex;
  gap: 1.5rem;

  padding: 2rem;

  border-radius: 18px;

  background: rgba(34, 197, 94, 0.08);

  border: 1px solid rgba(34, 197, 94, 0.2);

  svg {
    color: #22c55e;
    font-size: 2.8rem;
    flex-shrink: 0;
  }

  strong {
    display: block;
    color: white;
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
  }

  p {
    color: #94a3b8;
    line-height: 1.7;
    font-size: 1.45rem;
  }
`;

export const PayButton = styled.button`
  margin-top: 2.5rem;

  border: none;

  border-radius: 16px;

  padding: 1.7rem;

  background: white;

  color: black;

  font-size: 1.7rem;
  font-weight: 700;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  cursor: pointer;

  transition: 0.3s;

  &:hover {
    background: #2183ebff;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ProcessingOverlay = styled.div`
  position: fixed;
  inset: 0;

  z-index: 1000;

  background: rgba(3, 7, 18, 0.88);

  backdrop-filter: blur(10px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  animation: ${fadeIn} 0.25s;

  h2 {
    color: white;
    margin-top: 2rem;
    font-size: 3rem;
  }

  p {
    color: #94a3b8;
    margin-top: 1rem;
    font-size: 1.6rem;
  }
`;

export const Spinner = styled.div`
  width: 7rem;
  height: 7rem;

  border-radius: 50%;

  border: 6px solid rgba(255, 255, 255, 0.08);

  border-top-color: #2563eb;

  animation: ${spin} 1s linear infinite;
`;

export const SuccessIcon = styled.div`
  width: 9rem;
  height: 9rem;

  border-radius: 50%;

  background: rgba(34, 197, 94, 0.15);

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${pop} 0.4s;

  svg {
    color: #22c55e;
    font-size: 5rem;
  }
`;
