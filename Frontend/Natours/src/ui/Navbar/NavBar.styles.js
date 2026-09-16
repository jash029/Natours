import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Nav = styled.nav`
  max-width: 100%;
  height: 60px;
  padding: 0 2rem;

  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);

  width: ${({ scroll }) => (scroll ? "70%" : "100%")};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
  /* backdrop-filter: blur(18px); */
  z-index: 1000;
  /* margin-top: 15px; */
  transition:
    width 0.6s ease,
    border-radius 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.205s ease,
    top 0.25s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid black;
  ${({ scroll }) => {
    if (scroll) {
      return `
     border-bottom:1px solid rgba(0,0,0,.08);
     border-radius: 35px;
      background: rgb(255,255,255);
     
      top: 2%;
      
     `;
    }
  }}
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-left: 2rem;
`;

export const LogoIcon = styled.img`
  position: relative;
  width: 3rem;
`;

export const NavMenu = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3.5rem;
`;

export const NavItem = styled.li`
  list-style: none;
`;

export const StyledLink = styled(NavLink)`
  text-decoration-line: none;
  color: black;
  font-family: 700;
  cursor: pointer;
  padding: 10px 16px;

  &:hover {
    color: #0621a9;
    text-decoration: underline #0621a9;
  }
`;

export const LoginButton = styled(NavLink)`
  text-decoration-line: none;
  font-weight: 500;
  font-size: 14px;
  padding: 12px;
  border: 1px solid black;
  border-radius: 12px;
  cursor: pointer;
  background-color: #1933b6;
  color: white;
  border: none;

  &:hover {
    background: linear-gradient(
      135deg,
      #60a5fa 0%,
      #2563eb 40%,
      #1d4ed8 75%,
      #0f172a 100%
    );
    color: #ffffff;
    transform: translateY(-2px);
  }
`;
