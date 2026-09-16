import styled from "styled-components";
import { Link } from "react-router-dom";

// =======================================================
// CONTAINER
// =======================================================

export const Container = styled.div`
  width: min(120rem, 100%);
  margin: 0 auto;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

// =======================================================
// SECTION
// =======================================================

export const Section = styled.section`
  background: #020202;

  border: 1px solid #e9e2e2;
  border-radius: 2rem;

  padding: 3rem;

  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 12px 30px rgba(15, 23, 42, 0.06);
`;

export const SectionTitle = styled.h2`
  margin-bottom: 1rem;

  font-size: 2.2rem;
  font-weight: 700;

  color: #ffffff;
`;

export const Description = styled.p`
  margin-bottom: 3rem;

  font-size: 1.55rem;
  line-height: 1.8;

  color: #b5bdc8;

  max-width: 70rem;
`;

// =======================================================
// POLICY LIST
// =======================================================

export const PolicyList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PolicyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 2rem;

  padding: 2rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #2c2c2c;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PolicyLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

export const PolicyIcon = styled.div`
  width: 4.6rem;
  height: 4.6rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 1.2rem;

  background: rgba(33, 131, 235, 0.12);

  svg {
    font-size: 2rem;
    color: #2183eb;
  }
`;

export const PolicyContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PolicyTitle = styled.h4`
  font-size: 1.65rem;
  font-weight: 700;

  color: white;
`;

export const PolicySubtitle = styled.p`
  margin-top: 0.35rem;

  font-size: 1.4rem;
  line-height: 1.6;

  color: #9ca3af;
`;

// =======================================================
// VIEW LINK
// =======================================================

export const ViewLink = styled(Link)`
  color: #2183eb;

  font-size: 1.45rem;
  font-weight: 600;

  text-decoration: none;

  transition: 0.2s;

  &:hover {
    color: #4da3ff;
  }
`;

// =======================================================
// AGREEMENT
// =======================================================

export const AgreementBox = styled.div`
  margin-top: 3rem;

  padding: 2rem;

  border-radius: 1.6rem;

  background: rgba(33, 131, 235, 0.06);

  border: 1px solid rgba(33, 131, 235, 0.25);
`;

export const AgreementRow = styled.label`
  display: flex;
  align-items: flex-start;

  gap: 1.6rem;

  cursor: pointer;
`;

export const Checkbox = styled.input`
  width: 2rem;
  height: 2rem;

  margin-top: 0.2rem;

  accent-color: #2183eb;

  cursor: pointer;

  flex-shrink: 0;
`;

export const AgreementText = styled.p`
  font-size: 1.5rem;
  line-height: 1.8;

  color: #d1d5db;

  strong {
    color: white;
  }
`;

// =======================================================
// ERROR
// =======================================================

export const Error = styled.p`
  margin-top: 1.4rem;

  color: #ef4444;

  font-size: 1.35rem;
  font-weight: 600;
`;

// =======================================================
// BUTTONS
// =======================================================

export const BottomActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.6rem;

    button {
      width: 100%;
    }
  }
`;

const ButtonStyles = `
  padding:1.5rem 2.8rem;

  border:none;
  border-radius:1.4rem;

  font-size:1.55rem;
  font-weight:600;

  cursor:pointer;

  transition:.25s;

  &:active{
    transform:scale(.98);
  }
`;

export const PrimaryButton = styled.button`
  ${ButtonStyles}

  background: white;
  color: black;

  &:hover {
    background: #2183eb;
  }
`;

export const SecondaryButton = styled.button`
  ${ButtonStyles}

  background:#2b2b2b;
  color: white;

  border: 1px solid #3d4755;

  &:hover {
    background: #3a3a3a;
  }
`;
