import React, { Component } from "react";
import {
  Input,
  Dropdown,
  Datepicker,
  Checkbox,
  Textarea,
  InputModal,
  MultiSelect,
  RadioDropdown,
  FilePicker
} from "shared-form-helper";
import { Form, Field } from "shared-form";

class FieldUI extends Component {
  componentDidMount() {
    const { field, value } = this.props;

    if (value && this.formApi) {
      this.formApi.setField(field.name, value);
    }
  }

  componentDidUpdate(prevProps) {
    const { field, value } = this.props;

    if (value !== prevProps.value) {
      this.formApi.setField(field.name, value);
    }
  }

  render() {
    const { field, initialValues = {}, value, onChange } = this.props;
    const uitype = parseInt(field.uitype);
    const isTextField = [1, 2, 4, 7, 9, 11, 13, 14, 17, 55, 71, 72, 85, 255].includes(
      uitype
    );
    const isTextArea = [19, 21, 22, 24].includes(uitype);
    const isPicklist = [15, 16, 26, 77, 117].includes(uitype);
    const isReference = [10, 51, 57, 73, 76, 78, 80, 101].includes(uitype);
    const isDate = [5, 23].includes(uitype);

    let fieldOptions = {
      key: field.name,
      name: field.name,
      label: field.label,
      uitype: field.uitype,
      render: () => null,
      value,
      onChange
    };

    if (isTextField) {
      fieldOptions = { ...fieldOptions, readOnly: uitype === 4, render: Input };
    } else if (isPicklist) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.picklistValues,
        render: Dropdown
      };
    } else if (isTextArea) {
      fieldOptions = { ...fieldOptions, render: Textarea };
    } else if (isReference) {
      const fieldRef = initialValues[`${field.name}ename`];
      fieldOptions = {
        ...fieldOptions,
        refersTo: field.type.refersTo,
        render: InputModal,
        valueLabel: fieldRef ? fieldRef.reference : ""
      };
    } else if (isDate) {
      fieldOptions = { ...fieldOptions, defaultValue: field.default, render: Datepicker };
    } else if (uitype === 33) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.picklistValues,
        render: MultiSelect
      };
    } else if (uitype === 53) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.assignto,
        render: RadioDropdown
      };
    } else if (uitype === 56) {
      fieldOptions = { ...fieldOptions, render: Checkbox };
    } else if (uitype === 69) {
      // const imageInfo = initialValues[`${field.name}imageinfo`];
      // fieldOptions = {
      //   ...fieldOptions,
      //   fieldName: field.name,
      //   name: "attachments",
      //   imageInfo,
      //   render: FilePicker
      // };
    } else {
      fieldOptions = { ...fieldOptions, render: () => <span>{uitype}</span> };
    }

    return (
      <Form formApi={formApi => (this.formApi = formApi)} initialValues={initialValues}>
        <Field {...fieldOptions} />
      </Form>
    );
  }
}

export default FieldUI;
