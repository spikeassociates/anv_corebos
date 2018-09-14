import styled from "styled-components";
import { NavLink } from "react-router-dom";

const StyledSidebar = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20%;
  overflow: hidden;
  z-index: 1;
  background: #04579b;
  text-transform: capitalize;

  @media (max-width: 750px) {
    position: initial;
    width: 100%;
  }
`;

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
  padding: 0.3rem 2rem;
  margin: 0.5rem 0;
  color: #fff;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    color: #fff;
    text-decoration: none;
  }

  @media (max-width: 750px) {
    padding: 0;
  }
`;

const Navigation = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 750px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;
  }
`;

export { Link, Logo, Navigation, StyledSidebar };
