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
let navigationTop = getElemStyle("nav#navbar", "height");

containerLeft = GLOBALS.MODE === "PROD" && containerLeft=="0px" ? "220px" : containerLeft;
containerTop  = GLOBALS.MODE === "PROD" && containerTop =="0px" ? "60px"  : containerTop;
navigationTop = GLOBALS.MODE === "PROD" && navigationTop=="0px" ? "60px"  : navigationTop;

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
    top: ${navigationTop};
  }
`;

export { PageContainer, Container };
