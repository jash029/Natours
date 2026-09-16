import styled from "styled-components";

export const Wrapper = styled.div`
  width: min(120rem, 100%);
  margin: 0 auto;
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

export const Header = styled.div`
  padding-bottom: 2.4rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eceff3;
`;

export const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  color: #7495dfff;
`;

export const Description = styled.p`
  margin-top: 1rem;

  max-width: 75rem;

  font-size: 1.55rem;
  line-height: 1.8;

  color: #6b7280;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.8rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Section = styled.section`
  background: #020202ff;

  border: 1px solid #e9e2e2ff;
  border-radius: 2rem;

  padding: 3rem;

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 12px 30px rgba(15, 23, 42, 0.06);
`;

export const SectionTitle = styled.h2`
  margin-bottom: 2.8rem;

  font-size: 2rem;
  font-weight: 700;

  color: #e2e6ecff;
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InfoRow = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.6rem;

  padding: 1.8rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f3f5;
  }
`;

export const Label = styled.span`
  font-size: 1.2rem;

  font-weight: 700;

  letter-spacing: 0.08em;

  text-transform: uppercase;

  color: #d6d7d8ff;
`;

export const Value = styled.div`
  font-size: 1.65rem;

  font-weight: 600;

  color: #5088c5ff;

  line-height: 1.7;
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Chip = styled.span`
  padding: 0.8rem 1.4rem;

  border-radius: 999px;

  background: #2183ebff;

  border: 1px solid #e2e8f0;

  font-size: 1.35rem;
  font-weight: 700;

  color: #000000ff;
`;

export const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.4rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 1.2rem 1.4rem;

  background: #2183ebff;

  border-radius: 1.2rem;

  border: 1px solid #edf2f7;

  font-size: 1.45rem;
  font-weight: 700;
  color: #000000ff;

  svg {
    color: #fbfffeff;
    font-size: 1.8rem;
    flex-shrink: 0;
  }
`;

export const PaymentCard = styled(Section)`
  position: sticky;
  top: 12rem;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.4rem 0;

  font-size: 1.55rem;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f3f5;
  }
`;

export const PriceLabel = styled.span`
  color: #6199e3ff;
`;

export const PriceValue = styled.span`
  font-weight: 600;
  color: #ffffffc7;
`;

export const TotalRow = styled(PriceRow)`
  margin-top: 2rem;
  padding-top: 2.4rem;


  border-bottom: none;

  ${PriceLabel} {
    font-size: 1.6rem;
    font-weight: 600;
    color: #abceffff;
  }

  ${PriceValue} {
    font-size: 2.6rem;
    font-weight: 700;
  }
`;

export const Button = styled.button`
  width: 100%;

  margin-top: 3rem;

  padding: 1.7rem;

  border: none;
  border-radius: 1.4rem;

  background: #dfe1e3ff;

  color: black;

  font-size: 1.6rem;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s,
    box-shadow 0.2s;

  &:hover {
    background: #2183ebff;
    box-shadow: 0 10px 24px rgba(17, 24, 39, 0.18);
  }
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  padding: 1.4rem 1.8rem;

  border: 1px solid ${({ $error }) => ($error ? "#ef4444" : "#d1d5db")};

  border-radius: 14px;
 
  background: #fff;

  transition: all 0.25s;

  &:focus-within {
    border-color: var(--color-primary);

    box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
  }

  svg {
    font-size: 2rem;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;

    font-size: 1.5rem;
    color: var(--color-grey-900);
    font-family: inherit;
  }

  .react-datepicker__input-container input::placeholder {
    color: var(--color-grey-500);
  }
`;

export const HelperText = styled.p`
  margin-top: 1rem;
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

export const ErrorMessage = styled.p`
  margin-top: 0.8rem;
  color: #ef4444;
  font-size: 1.3rem;
  font-weight: 500;
`;

export const Radio = styled.input`cursor:pointer`;