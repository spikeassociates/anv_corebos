import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: flex-end;

  .slds-form-element {
    width: 100%;
    margin-right: 10px;
  }

  .slds-icon_container {
    cursor: pointer;
  }

  .slds-dropdown-trigger {
    width: 100%;
    margin-right: 5px;

    button {
      width: 100%;
    }
  }
`;

export { Container };
