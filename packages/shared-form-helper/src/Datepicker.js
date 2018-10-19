import React from "react";
import { Datepicker } from "@salesforce/design-system-react";

const FormDatepicker = ({ value = "", onChange, label, ...rest }) => (
  <div>
    <div>{label}</div>
    <Datepicker value={value} onChange={(e, data) => onChange(data)} />
  </div>
);

export default FormDatepicker;
