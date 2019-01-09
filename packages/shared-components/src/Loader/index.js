import React from "react";
import { LoaderContainer } from "./styles";

export default ({ variant = "base" }) => (
  <LoaderContainer>
    <div className={`slds-spinner slds-spinner_medium slds-spinner--${variant}`}>
      <div className="slds-spinner__dot-a" />
      <div className="slds-spinner__dot-b" />
    </div>
  </LoaderContainer>
);
