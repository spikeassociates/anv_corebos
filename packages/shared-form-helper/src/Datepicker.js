import React from "react";
import { Datepicker } from "@salesforce/design-system-react";

const FormDatepicker = ({ value, onChange, label, ...rest }) => {
  if (value) {
    value = new Date(value.date);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="slds-form-element__label">{label}</div>
      <Datepicker {...rest} value={value} onChange={(e, data) => onChange(data)} />
    </div>
  );
};
export default FormDatepicker;
