import styled from "styled-components";
import { getElemStyle } from "shared-utils";

const PageContainer = styled.div`
  height: 100%;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 750px) {
    margin: 0;
  }
`;

const Container = styled.div`
  position: relative;
  left: ${getElemStyle("#app-content", "marginLeft")};
  right: 0;
  top: ${getElemStyle("#channel-header", "height")};
  bottom: 0;
  background-color: #fff;
  z-index: 7;
  overflow: auto;

  @media (max-width: 768px) {
    left: 0;
    top: ${getElemStyle("nav#navbar", "height")};
  }
`;

export { PageContainer, Container };
