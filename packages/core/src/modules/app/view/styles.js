import styled from "styled-components";
import { getElemStyle } from "shared-utils";

const PageContainer = styled.div.attrs(props => ({
  id: "client-page-container",
}))`
  height: 100%;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 750px) {
    margin: 0;
  }
`;

let containerLeft = getElemStyle("#app-content", "marginLeft");
let containerTop  = getElemStyle("#channel-header", "height");

containerLeft = containerLeft=="0px" ? "220px" : containerLeft;
containerTop = containerTop=="0px" ? "60px" : containerTop;

const Container = styled.div.attrs(props => ({
  id: "client-app-container",
}))`
  position: absolute;
  left: ${containerLeft};
  right: 0;
  top: ${containerTop};
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
