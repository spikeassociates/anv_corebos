import React from "react";
import { Checkbox } from "@salesforce/design-system-react";

const FormCheckbox = ({ value = false, onChange, label, ...rest }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="slds-form-element__label">{label}</div>
      <Checkbox {...rest} checked={value} onChange={checked => onChange(checked)} />
    </div>
  );
};
export default FormCheckbox;
