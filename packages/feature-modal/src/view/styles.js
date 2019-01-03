import styled, { injectGlobal } from "styled-components";

injectGlobal`
.slds-modal__content {
  height: 100%
}
`;

const FormRowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  grid-gap: 20px 4%;
  padding-bottom: 15px;
  align-items: center;
`;

export { FormRowContainer };
