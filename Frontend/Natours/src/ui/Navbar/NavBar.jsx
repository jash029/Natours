import { useState, useEffect } from "react";
import styled from "styled-components";

import {
  LoginButton,
  Logo,
  Nav,
  NavItem,
  NavMenu,
  StyledLink,
  LogoIcon,
} from "./NavBar.styles";
import svg from "../../assets/tourist-bag-svgrepo-com.svg";
import { NavLink } from "react-router-dom";
import useUser from "../../features/hooks/UserHooks/useUser";

const Span = styled(NavLink)`
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #1933b6 30%, #0f172a 45%, #0f172a 25%);
  font-family: "Outfit", sans-serif;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function NavBar() {
  const { user } = useUser();

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Nav scroll={scrolled}>
      <Logo>
        <LogoIcon src={svg} />
        <Span to="/">Natours</Span>
      </Logo>

      <NavMenu>
        <NavItem>
          <StyledLink to="/">Home</StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink to="/tours">Tours</StyledLink>
        </NavItem>

        <NavItem>
          <StyledLink to="/about">About</StyledLink>
        </NavItem>

        {console.log(user)}
        {!user && (
          <NavItem>
            <LoginButton to="/user/login">Login</LoginButton>
          </NavItem>
        )}

        {user && (
          <NavItem>
            <LoginButton to="/user">User</LoginButton>
          </NavItem>
        )}
      </NavMenu>
    </Nav>
  );
}

export default NavBar;
