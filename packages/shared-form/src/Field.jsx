import React, { Component } from "react";
import Context from "./Context";
import { validateField } from "../../shared-utils/validateField";

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = { errorText: "" };
  }
  handleChange(value, Form) {
    const { name, normalize, onChange, uitype } = this.props;
    if (normalize) {
      value = normalize(value);
    }
    const fieldValidated = validateField(value, uitype);
    this.setState({ errorText: fieldValidated });
    Form.setField(name, value).then(() => onChange && onChange(value));
  }

  render() {
    const { name, render, normalize, onChange, ...rest } = this.props;
    const Component = render;

    return (
      <Context.Form.Consumer>
        {Form => {
          Form._internal.storeComponent(name, this);

          return (
            <Component
              {...rest}
              name={name}
              value={Form.getField(name)}
              touched={Form.isTouched(name)}
              onChange={value => this.handleChange(value, Form)}
              errorText={this.state.errorText}
            />
          );
        }}
      </Context.Form.Consumer>
    );
  }
}

export default Field;
