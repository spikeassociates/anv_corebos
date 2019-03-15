import React from "react";
import { Input } from "@salesforce/design-system-react";

const FormInput = ({ value = "", error, onChange, ...rest }) => (
  <Input
    {...rest}
    errorText={error}
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

export default FormInput;
