import styled from "styled-components";

const DropdownContainer = styled.header`
  .slds-dropdown-trigger {
    &,
    button {
      width: 100% !important;
    }

    .slds-dropdown {
      left: 0 !important;
      right: 0 !important;
      max-width: inherit !important;
    }
  }
`;

export { DropdownContainer };
