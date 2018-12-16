import styled from "styled-components";

const Link = styled.div`
  color: rgba(255, 255, 255, 0.6);
  padding: 7px 15px;
  cursor: pointer;

  &:hover {
    background-color: rgb(69, 120, 191);
  }
`;

const Container = styled.div`
  margin-top: 15px;
`;

export { Link, Container };
