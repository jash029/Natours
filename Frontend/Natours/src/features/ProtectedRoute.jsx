import { Navigate, Outlet } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import useUser from "./hooks/UserHooks/useUser";

function ProtectedRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/user/login" replace />;

  return <Outlet />;
}

function Spinner() {
  return (
    <SpinnerContainer>
      <Loader />
    </SpinnerContainer>
  );
}

export default ProtectedRoute;

/* ===========================
   Styled Components
=========================== */

const SpinnerContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #0c0c0c;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  width: 5rem;
  height: 5rem;

  border: 4px solid rgba(14, 13, 13, 0.15);
  border-top-color: #ffffff;
  border-radius: 50%;

  animation: ${rotate} 0.8s linear infinite;
`;
