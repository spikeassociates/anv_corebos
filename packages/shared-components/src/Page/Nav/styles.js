import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";

const Link = styled(NavLink)`
  ${props => {
    const { colors, typography, text } = props.theme;

    return css`
      text-transform: capitalize;
      font-size: ${typography.sizes.smaller};
      font-weight: ${typography.weights.normal};
      color: ${text.default.color};
      display: block;
      text-decoration: none;
      padding: 0.5em 0;
      margin-right: 3.5em;
      border-bottom: 2px solid transparent;
      transition: color 0.2s, border-color 0.2s;
      margin-bottom: -1px;

      &:hover {
        color: ${colors.black.darkest};
        border-color: ${colors.black.darkest};
      }

      &.active {
        color: ${colors.primary.default};
        border-color: ${colors.primary.default};
      }

      &.active:hover {
        color: ${colors.primary.lighter};
        border-color: ${colors.primary.lighter};
      }
    `;
  }};
`;

const Nav = styled.nav`
  ${props => {
    const { colors } = props.theme;

    return css`
      display: flex;
      border-bottom: 1px solid ${colors.gray.dark};
    `;
  }};
`;

export { Link, Nav };
