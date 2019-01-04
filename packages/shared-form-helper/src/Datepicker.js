import React from "react";
import { Datepicker } from "@salesforce/design-system-react";
import moment from "moment";

const FormDatepicker = ({ value, onChange, label, ...rest }) => {
  value = value ? new Date(value) : new Date();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="slds-form-element__label">{label}</div>
      <Datepicker
        {...rest}
        value={value}
        relativeYearFrom={-100}
        relativeYearTo={100}
        onChange={(e, data) => {
          const date = moment(data.date).format("YYYY-MM-DD");
          onChange(date);
        }}
      />
    </div>
  );
};
export default FormDatepicker;
