import styled from "styled-components";

const PageContainer = styled.div`
  margin-left: 20%;
  height: 100%;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 750px) {
    margin: 0;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export { PageContainer, Container };
