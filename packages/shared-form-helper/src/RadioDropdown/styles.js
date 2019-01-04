import styled from "styled-components";

const Container = styled.header`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  align-items: center;

  .slds-dropdown-trigger button {
    width: 100%;
  }

  fieldset .slds-form-element__control {
    display: flex;
  }
`;

export { Container };
