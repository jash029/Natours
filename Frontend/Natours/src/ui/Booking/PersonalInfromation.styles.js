import styled from "styled-components";
import DatePicker from "react-datepicker";

export const Container = styled.div`
  width: min(120rem, 100%);
  margin: 0 auto;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

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
  margin-bottom: 2.5rem;

  font-size: 2rem;
  font-weight: 700;

  color: #e2e6ec;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 0.8rem;

  font-size: 1.3rem;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 0.08em;

  color: #d6d7d8;
`;

const InputStyles = `
  width:100%;
  height:5.2rem;

  padding:0 1.6rem;

  border:1px solid #3d4755;
  border-radius:1.4rem;

  background:#111111;

  color:#ffffff;

  font-size:1.5rem;
  font-family:inherit;

  transition:.25s;

  &:focus{
      outline:none;
      border-color:#2183eb;
      box-shadow:0 0 0 4px rgba(33,131,235,.18);
  }

  &::placeholder{
      color:#9ca3af;
  }
`;

export const Input = styled.input`
  ${InputStyles}

  &[type="file"] {
    padding: 0.9rem 1.2rem;
    cursor: pointer;
  }

  &::file-selector-button {
    border: none;
    background: #2183eb;
    color: white;
    padding: 0.7rem 1.3rem;
    border-radius: 0.8rem;
    cursor: pointer;
    margin-right: 1rem;
    font-weight: 600;
  }
`;

export const SelectOp = styled.select`
  ${InputStyles}
  cursor:pointer;
`;

export const StyledDatePicker = styled(DatePicker)`
  ${InputStyles}
`;

export const Error = styled.span`
  margin-top: 0.8rem;

  color: #ef4444;

  font-size: 1.25rem;
  font-weight: 500;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 2rem;
`;

export const BottomActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 1rem;

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
    background: #2183ebff;
  
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
