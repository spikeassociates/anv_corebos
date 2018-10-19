import React, { Component } from "react";
import Context from "./Context";

class Field extends Component {
  handleChange(value, Form) {
    const { name, normalize, onChange } = this.props;

    if (normalize) {
      value = normalize(value);
    }

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
            />
          );
        }}
      </Context.Form.Consumer>
    );
  }
}

export default Field;
