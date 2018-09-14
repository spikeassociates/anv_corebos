import React from "react";
import { LoaderContainer } from "../styles";

export default () => (
  <LoaderContainer>
    <div className="slds-spinner slds-spinner_medium">
      <div className="slds-spinner__dot-a" />
      <div className="slds-spinner__dot-b" />
    </div>
  </LoaderContainer>
);
