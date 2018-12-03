import React from "react";
import { Checkbox } from "@salesforce/design-system-react";

const FormCheckbox = ({ value, onChange, label, ...rest }) => {
  value = value == 1;

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="slds-form-element__label">{label}</div>
      <Checkbox
        {...rest}
        checked={value}
        onChange={checked => onChange(checked ? 1 : 0)}
      />
    </div>
  );
};
export default FormCheckbox;
