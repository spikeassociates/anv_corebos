import React from "react";
import { Dropdown, DropdownTrigger, Button } from "@salesforce/design-system-react";

import { DropdownContainer } from "./styles";

const FormDropdown = ({ value = "", onChange, label, options = [], ...rest }) => {
  const fallbackLabel = "Please select an option";
  const selectedOption = options.find(opt => opt.value === value);

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
        <DropdownTrigger triggerClassName={ rest.error ? 'slds-has-error' : '' }>
          <Button
            iconCategory="utility"
            iconName="down"
            iconPosition="right"
            label={selectedOption ? selectedOption.label : fallbackLabel}
            className={ rest.error ? 'slds-input' : '' }
          />
        </DropdownTrigger>
      </Dropdown>

      { rest.error ? (
        <div className="slds-has-error">
          <div className="slds-form-element__help">
            { rest.error }
          </div>
        </div>
        ) : ''
      }
    </DropdownContainer>
  );
};

export default FormDropdown;
