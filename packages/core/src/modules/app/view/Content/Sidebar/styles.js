import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Logo = styled.img`
  margin: 2.5rem 2.5rem 1.5rem 2.5rem;
  display: block;
  width: 95px;
  object-fit: cover;

  @media (max-width: 750px) {
    margin: 1rem auto;
  }
`;

const Link = styled(NavLink)`
  text-transform: uppercase;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none !important;
  }
`;

const WaffleContainer = styled.div`
  height: 100% !important;
  display: flex !important;
  align-items: center;
`;

export { Logo, Link, WaffleContainer };
