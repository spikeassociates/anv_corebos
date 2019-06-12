import React from "react";
import { Textarea } from "@salesforce/design-system-react";

const FormTextarea = ({ value = "", onChange, ...rest }) => (
  <Textarea errorText={rest.error} {...rest} value={value} onChange={e => onChange(e.target.value)} />
);

export default FormTextarea;
