import React from "react";
import { Input } from "@salesforce/design-system-react";
const FormInput = ({ value = "", onChange, ...rest }) => (
  <Input {...rest} value={value} onChange={e => onChange(e.target.value)} />
);

export default FormInput;
