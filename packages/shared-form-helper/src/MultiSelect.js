import React, { Component } from "react";
import { Combobox } from "@salesforce/design-system-react";

class FormMultiSelect extends Component {
  render() {
    let { value = "", onChange, label, options, ...rest } = this.props;
    value = value.split(" |##| ");
    options = options.map(item => ({ ...item, id: item.value }));
    const selectedOptions = options.filter(opt => value.indexOf(opt.value) !== -1);
    options = options.filter(opt => value.indexOf(opt.value) === -1);

    return (
      <Combobox
        errorText={rest.error}
        {...rest}
        events={{
          onRequestRemoveSelectedOption: (event, data) => {
            const toStay = data.selection.map(item => item.value);
            const newValue = selectedOptions
              .filter(item => toStay.indexOf(item.value) !== -1)
              .map(item => item.value)
              .join(" |##| ");

            onChange(newValue);
          },
          onSelect: (event, data) => {
            const newValue = data.selection.map(opt => opt.value).join(" |##| ");
            onChange(newValue);
          }
        }}
        labels={{
          label: label,
          placeholder: "Select one or more of the options"
        }}
        multiple
        options={options}
        selection={selectedOptions}
        variant="inline-listbox"
      />
    );
  }
}

export default FormMultiSelect;
