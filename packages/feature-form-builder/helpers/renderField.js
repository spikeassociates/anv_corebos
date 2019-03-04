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
import {
  normalize,
  getExpandedSections,
  getSections,
  getFieldsGroupedBySection
} from "shared-utils";

renderField = field => {
  // const { hidden, readOnly } = this.state;
  const { initialValues, fieldDependencies = {} } = this.props;

  const uitype = parseInt(field.uitype);
  const isTextField = [1, 2, 4, 7, 9, 11, 13, 14, 17, 55, 71, 72, 85, 255].includes(
    uitype
  );
  const isTextArea = [19, 21, 22, 24].includes(uitype);
  const isPicklist = [15, 16, 26, 77, 117].includes(uitype);
  const isReference = [10, 51, 57, 73, 76, 78, 80, 101].includes(uitype);

  let fieldOptions = {
    key: field.cbfield,
    name: field.cbfield,
    label: field.label,
    render: () => null
    // normalize: this.normalizeField(uitype)
  };

  if (isTextField) {
    console.log("popopo");
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
  } else if (uitype === 5) {
    fieldOptions = { ...fieldOptions, render: Datepicker };
  } else if (uitype === 27) {
    fieldOptions = {
      ...fieldOptions,
      options: [{ value: "I", label: "Internal" }, { value: "E", label: "External" }],
      render: Dropdown,
      onChange: () => {
        this.formApi.setField("filename");
      }
    };
  } else if (uitype === 28) {
    fieldOptions = {
      ...fieldOptions,
      render: props => {
        const { Form } = props;
        const fileLocation = Form.getField("filelocationtype");

        return fileLocation === "I" ? <FilePicker {...props} /> : <Input {...props} />;
      }
    };
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
    const imageInfo = initialValues[`${field.name}imageinfo`];
    fieldOptions = {
      ...fieldOptions,
      fieldName: field.name,
      name: "attachments",
      imageInfo,
      render: FilePicker
    };
  } else {
    fieldOptions = { ...fieldOptions, render: () => <span>{uitype}</span> };
  }

  if (hidden.includes(field.name)) {
    fieldOptions.render = () => null;
  }

  if (readOnly.includes(field.name)) {
    fieldOptions.readOnly = true;
  }

  const dependencies = fieldDependencies[field.name];

  if (dependencies) {
    const { actions, conditions } = dependencies;

    fieldOptions.onChange = () => {
      const isValid = this.evaluateConditions(conditions);
      Object.entries(actions).forEach(action => this.excecuteAction(isValid, action));
    };
  }

  return <Field {...fieldOptions} />;
};

export default renderField;
