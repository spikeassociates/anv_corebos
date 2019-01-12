import styled from "styled-components";

const Image = styled.img`
  width: 350px;
  object-fit: cover;
  height: 200px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
`;

export { Image, Container };
