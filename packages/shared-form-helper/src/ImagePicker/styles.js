import styled from "styled-components";

const Image = styled.img`
  width: 350px;
  object-fit: cover;
  height: 100%;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 200px;
`;

export { Image, Container };
