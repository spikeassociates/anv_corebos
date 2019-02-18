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

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 3rem;
  bottom: 3rem;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export { FormRowContainer, Overlay };
