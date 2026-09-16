import styled from "styled-components";
import { Link } from "react-router-dom";

// =======================================================
// PAGE
// =======================================================

export const Wrapper = styled.div`
  min-height: 100vh;

  background:
    radial-gradient(circle at top, rgba(8, 8, 8, 0.12), transparent 35%),
    #000;

  padding: 5rem 0 8rem;
`;

export const Container = styled.div`
  width: min(135rem, 92%);
  margin: 0 auto;
`;

// =======================================================
// HERO
// =======================================================

export const Hero = styled.section`
  margin-bottom: 5rem;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 0.9rem 1.7rem;

  border-radius: 999px;

  

  border: 1px solid rgba(249, 252, 255, 0.25);

  color: #ffffffff;

  font-size: 1.3rem;
  font-weight: 700;

  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin-top: 2.2rem;

  font-size: clamp(3.8rem, 5vw, 5.8rem);

  font-weight: 800;

  line-height: 1.15;

  color: white;
`;

export const Accent = styled.span`
  color: #2183eb;
`;

export const Description = styled.p`
  margin-top: 2rem;

  max-width: 75rem;

  font-size: 1.75rem;

  line-height: 1.9;

  color: #9ca3af;
`;

export const Updated = styled.div`
  margin-top: 3rem;

  display: inline-flex;
  align-items: center;
  gap: 0.8rem;

  padding: 1rem 1.5rem;

  border-radius: 1.2rem;

  background: #111;

  border: 1px solid #2b2b2b;

  font-size: 1.4rem;

  color: #cbd5e1;
`;

// =======================================================
// MAIN GRID
// =======================================================

export const Layout = styled.div`
  display: grid;

  grid-template-columns: 30rem 1fr;

  gap: 3rem;

  align-items: start;

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`;

// =======================================================
// SIDEBAR
// =======================================================

export const Sidebar = styled.aside`
  position: sticky;

  top: 11rem;

  background: #020202;

  border: 1px solid #2b2b2b;

  border-radius: 2rem;

  padding: 2.5rem;

  @media (max-width: 1050px) {
    position: relative;
    top: auto;
  }
`;

export const SidebarTitle = styled.h3`
  margin-bottom: 2rem;

  color: white;

  font-size: 2rem;

  font-weight: 700;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;

  gap: 0.8rem;
`;

export const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 1.2rem 1.4rem;

  border-radius: 1.2rem;

  color: #cbd5e1;

  font-size: 1.5rem;

  text-decoration: none;

  transition: 0.25s;

  svg {
    font-size: 1.7rem;

    color: #2183eb;

    flex-shrink: 0;
  }

  &:hover {
    background: rgba(33, 131, 235, 0.12);

    color: white;

    transform: translateX(4px);
  }
`;

// =======================================================
// CONTENT
// =======================================================

export const Content = styled.main`
  display: flex;
  flex-direction: column;

  gap: 3rem;
`;

export const BackButton = styled(Link)`
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 0.8rem;

  width: fit-content;

  margin-top: 4rem;

  padding: 1.4rem 2.5rem;

  border-radius: 1.4rem;

  background: white;

  color: black;

  font-size: 1.55rem;
  font-weight: 700;

  text-decoration: none;

  transition: 0.25s;

  &:hover {
    background: #2183eb;

    transform: translateY(-2px);
  }
`;

// =======================================================
// POLICY CARD
// =======================================================

export const PolicySection = styled.section`
  background: #020202;

  border: 1px solid #2b2b2b;
  border-radius: 2rem;

  padding: 3.5rem;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.25),
    0 18px 40px rgba(0, 0, 0, 0.4);

  scroll-margin-top: 12rem;

  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

export const PolicyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 2rem;

  margin-bottom: 2.8rem;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PolicyTitle = styled.h2`
  color: white;

  font-size: 2.7rem;
  font-weight: 700;

  line-height: 1.2;
`;

export const PolicyTag = styled.span`
  padding: 0.8rem 1.4rem;

  border-radius: 999px;

  background: rgba(33, 131, 235, 0.12);

  border: 1px solid rgba(33, 131, 235, 0.2);

  color: #2183eb;

  font-size: 1.25rem;
  font-weight: 700;

  text-transform: uppercase;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;

  margin: 3rem 0;

  background: #2b2b2b;
`;

// =======================================================
// TYPOGRAPHY
// =======================================================

export const Heading = styled.h3`
  margin-bottom: 1.6rem;

  color: white;

  font-size: 2rem;
  font-weight: 700;
`;

export const SubHeading = styled.h4`
  margin-top: 2rem;
  margin-bottom: 1rem;

  color: #ffffff;

  font-size: 1.75rem;
  font-weight: 600;
`;

export const Paragraph = styled.p`
  color: #d1d5db;

  font-size: 1.6rem;

  line-height: 2;

  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

export const Highlight = styled.span`
  color: #2183eb;

  font-weight: 700;
`;

// =======================================================
// LISTS
// =======================================================

export const List = styled.ul`
  display: flex;
  flex-direction: column;

  gap: 1.6rem;

  margin-top: 2rem;

  padding-left: 2.2rem;
`;

export const ListItem = styled.li`
  color: #d1d5db;

  font-size: 1.55rem;

  line-height: 1.9;

  &::marker {
    color: #2183eb;
  }
`;

export const OrderedList = styled.ol`
  display: flex;
  flex-direction: column;

  gap: 1.6rem;

  margin-top: 2rem;

  padding-left: 2.2rem;
`;

export const OrderedItem = styled.li`
  color: #d1d5db;

  font-size: 1.55rem;

  line-height: 1.9;

  &::marker {
    color: #2183eb;
    font-weight: 700;
  }
`;

// =======================================================
// INFO BOX
// =======================================================

export const InfoBox = styled.div`
  margin: 3rem 0;

  padding: 2.2rem;

  border-radius: 1.6rem;

  background: rgba(33, 131, 235, 0.08);

  border: 1px solid rgba(33, 131, 235, 0.25);
`;

export const InfoTitle = styled.h4`
  margin-bottom: 1rem;

  color: #4da3ff;

  font-size: 1.8rem;

  font-weight: 700;
`;

export const InfoText = styled.p`
  color: #dbeafe;

  font-size: 1.55rem;

  line-height: 1.9;
`;

// =======================================================
// WARNING BOX
// =======================================================

export const WarningBox = styled.div`
  margin: 3rem 0;

  padding: 2.2rem;

  border-radius: 1.6rem;

  background: rgba(245, 158, 11, 0.08);

  border: 1px solid rgba(245, 158, 11, 0.25);
`;

export const WarningTitle = styled.h4`
  margin-bottom: 1rem;

  color: #f59e0b;

  font-size: 1.8rem;

  font-weight: 700;
`;

export const WarningText = styled.p`
  color: #fde68a;

  font-size: 1.55rem;

  line-height: 1.9;
`;

// =======================================================
// SUCCESS BOX
// =======================================================

export const SuccessBox = styled.div`
  margin: 3rem 0;

  padding: 2.2rem;

  border-radius: 1.6rem;

  background: rgba(16, 185, 129, 0.08);

  border: 1px solid rgba(16, 185, 129, 0.25);
`;

export const SuccessTitle = styled.h4`
  margin-bottom: 1rem;

  color: #10b981;

  font-size: 1.8rem;

  font-weight: 700;
`;

export const SuccessText = styled.p`
  color: #bbf7d0;

  font-size: 1.55rem;

  line-height: 1.9;
`;


// =======================================================
// TABLE
// =======================================================

export const Table = styled.table`
  width: 100%;

  margin: 3rem 0;

  border-collapse: collapse;

  overflow: hidden;

  border-radius: 1.6rem;

  border: 1px solid #2b2b2b;
`;

export const TableHead = styled.thead`
  background: rgba(33, 131, 235, 0.12);
`;

export const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #2b2b2b;
  }

  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

export const TableHeading = styled.th`
  padding: 1.6rem;

  text-align: left;

  color: white;

  font-size: 1.45rem;
  font-weight: 700;
`;

export const TableCell = styled.td`
  padding: 1.6rem;

  color: #d1d5db;

  font-size: 1.5rem;

  line-height: 1.7;
`;

// =======================================================
// FAQ
// =======================================================

export const FAQ = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2rem;
`;

export const FAQItem = styled.div`
  padding: 2rem;

  border-radius: 1.6rem;

  background: #111;

  border: 1px solid #2b2b2b;
`;

export const Question = styled.h4`
  color: white;

  font-size: 1.75rem;
  font-weight: 700;

  margin-bottom: 1rem;
`;

export const Answer = styled.p`
  color: #cbd5e1;

  font-size: 1.55rem;

  line-height: 1.9;
`;

// =======================================================
// CONTACT
// =======================================================

export const ContactCard = styled.div`
  margin-top: 4rem;

  padding: 3rem;

  border-radius: 2rem;

  background: linear-gradient(
    135deg,
    rgba(33, 131, 235, 0.08),
    rgba(33, 131, 235, 0.02)
  );

  border: 1px solid rgba(33, 131, 235, 0.25);
`;

export const ContactTitle = styled.h3`
  color: white;

  font-size: 2.2rem;

  margin-bottom: 1rem;
`;

export const ContactText = styled.p`
  color: #cbd5e1;

  font-size: 1.6rem;

  line-height: 1.8;

  margin-bottom: 2rem;
`;

export const ContactButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 1.4rem 2.5rem;

  border-radius: 1.2rem;

  background: #2183eb;

  color: white;

  font-size: 1.5rem;
  font-weight: 700;

  text-decoration: none;

  transition: 0.25s;

  &:hover {
    background: #1b6fd0;

    transform: translateY(-2px);
  }
`;

// =======================================================
// FOOTER
// =======================================================

export const Footer = styled.footer`
  margin-top: 5rem;

  padding-top: 3rem;

  border-top: 1px solid #2b2b2b;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Copyright = styled.p`
  color: #94a3b8;

  font-size: 1.4rem;
`;

export const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  flex-wrap: wrap;
`;

export const FooterLink = styled(Link)`
  color: #2183eb;

  text-decoration: none;

  font-size: 1.45rem;
  font-weight: 600;

  transition: 0.2s;

  &:hover {
    color: #4da3ff;
  }
`;

// =======================================================
// SCROLL TO TOP
// =======================================================

export const ScrollTop = styled.button`
  position: fixed;

  right: 3rem;
  bottom: 3rem;

  width: 5rem;
  height: 5rem;

  border: none;
  border-radius: 50%;

  background: #2183eb;

  color: white;

  cursor: pointer;

  font-size: 2rem;

  box-shadow: 0 10px 30px rgba(33, 131, 235, 0.35);

  transition: 0.25s;

  &:hover {
    transform: translateY(-4px);

    background: #1b6fd0;
  }
`;

// =======================================================
// SHARED
// =======================================================

export const Spacer = styled.div`
  height: 2rem;
`;

export const Small = styled.small`
  color: #94a3b8;

  font-size: 1.3rem;
`;

export const Code = styled.code`
  padding: 0.3rem 0.7rem;

  border-radius: 0.6rem;

  background: #111;

  color: #4da3ff;

  font-family: monospace;

  font-size: 1.35rem;
`;

export const HorizontalRule = styled.hr`
  margin: 4rem 0;

  border: none;

  border-top: 1px solid #2b2b2b;
`;