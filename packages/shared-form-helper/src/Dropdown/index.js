import React from "react";
import { Dropdown, DropdownTrigger, Button } from "@salesforce/design-system-react";

import { DropdownContainer } from "./styles";

const FormDropdown = ({ value = "", onChange, label, options = [], ...rest }) => {
  const selectedOption = options.find(opt => opt.value === value);
  const fallbackLabel = options.length ? options[0].label : "";

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
            label={selectedOption ? selectedOption.label : fallbackLabel}
          />
        </DropdownTrigger>
      </Dropdown>
    </DropdownContainer>
  );
};

export default FormDropdown;
