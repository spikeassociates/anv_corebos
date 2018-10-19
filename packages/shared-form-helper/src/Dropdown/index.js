import React from "react";
import { Dropdown, DropdownTrigger, Button } from "@salesforce/design-system-react";

import { DropdownContainer } from "./styles";

const FormDropdown = ({ value = "", onChange, label, options = [], ...rest }) => {
  const fallbackLabel = options.length ? options[0].value : "";

  return (
    <DropdownContainer>
      <div>{label}</div>
      <Dropdown
        {...rest}
        tabIndex="-1"
        align="right"
        options={options}
        onSelect={item => onChange(item.value)}
      >
        <DropdownTrigger>
          <Button
            iconCategory="utility"
            iconName="down"
            iconPosition="right"
            label={value || fallbackLabel}
          />
        </DropdownTrigger>
      </Dropdown>
    </DropdownContainer>
  );
};

export default FormDropdown;
