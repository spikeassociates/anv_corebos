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

    const { options, value, error } = this.props;
    const optionKeys = Object.keys(options);
    this.state = {
      checked: optionKeys.reduce((acc, key) => {
        const valueExist = options[key].options
          .map(opt => opt.userid || opt.groupid)
          .find(item => item === value);

        return valueExist ? key : acc;
      }, optionKeys[0])
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { options } = nextProps;
    const { checked } = prevState;

    const dropdownOptions = options[checked].options.map(opt => ({
      value: opt.userid || opt.groupid,
      label: opt.username || opt.groupname
    }));

    return { ...prevState, dropdownOptions };
  }

  onRadioChange = e => {
    const { onChange } = this.props;

    this.setState({ checked: e.target.value });
    onChange("");
  };

  render() {
    const { value = "", onChange, options, label } = this.props;
    const { checked, dropdownOptions } = this.state;
    const selectedValue = dropdownOptions.find(opt => opt.value === value);

    return (
      <div>
        <div>{label}</div>
        <Container>
          <RadioGroup onChange={this.onRadioChange} labels={{error: this.props.error ? ' ' : undefined}}>
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
            <DropdownTrigger triggerClassName={ this.props.error ? 'slds-has-error' : '' }>
              <Button
                iconCategory="utility"
                iconName="down"
                iconPosition="right"
                label={selectedValue ? selectedValue.label : label}
                className={ this.props.error ? 'slds-input' : '' }
              />
            </DropdownTrigger>
          </Dropdown>
        </Container>

        { this.props.error ? (
          <div className="slds-has-error">
            <div className="slds-form-element__help">
              {this.props.error }
            </div>
          </div>
          ) : ''
        }

      </div>
    );
  }
}

export default FormInput;
