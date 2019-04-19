import React from "react";
import { Input } from "@salesforce/design-system-react";

const FormInput = ({ value = "", onChange, errorText, ...rest }) => (
  <Input
    {...rest}
    value={value}
    onChange={e => onChange(e.target.value)}
    errorText={errorText}
  />
);

export default FormInput;
