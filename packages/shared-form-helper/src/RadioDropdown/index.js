import React, { Component } from "react";
import {
  RadioGroup,
  Radio,
  Dropdown,
  DropdownTrigger,
  Button
} from "@salesforce/design-system-react";

import { Container } from "./styles";

class FormInput extends Component {
  constructor(props) {
    super(props);

    this.state = { checked: Object.keys(props.options)[0] };
  }

  onRadioChange = e => {
    const { onChange } = this.props;

    this.setState({ checked: e.target.value });
    onChange("");
  };

  render() {
    const { value = "", onChange, options, label } = this.props;
    const { checked } = this.state;
    const dropdownOptions = options[checked].options.map(opt => ({
      value: opt.userid || opt.groupid,
      label: opt.username || opt.groupname
    }));
    const selectedValue = dropdownOptions.find(opt => opt.value === value);

    return (
      <Container>
        <RadioGroup onChange={this.onRadioChange}>
          {Object.entries(options).map(([key, opt]) => (
            <Radio
              key={key}
              label={opt.label_raw}
              value={key}
              checked={checked === key}
              variant="base"
            />
          ))}
        </RadioGroup>

        <Dropdown
          tabIndex="-1"
          align="right"
          options={dropdownOptions}
          onSelect={item => onChange(item.value)}
        >
          <DropdownTrigger>
            <Button
              iconCategory="utility"
              iconName="down"
              iconPosition="right"
              label={selectedValue ? selectedValue.label : label}
            />
          </DropdownTrigger>
        </Dropdown>
      </Container>
    );
  }
}

export default FormInput;
