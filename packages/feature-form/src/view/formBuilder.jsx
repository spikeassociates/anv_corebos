import React, { Component } from "react";
import { Accordion, AccordionPanel } from "@salesforce/design-system-react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { Loader } from "shared-components";
import { Form, Field } from "shared-form";
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
  getFieldsGroupedBySection,
  mapToDispatch,
  mapToState
} from "shared-utils";

import { FormRowContainer, Overlay } from "./styles";

class RenderFieldsFormBuilder extends Component {
  constructor(props) {
    super(props);

    const { field } = props;

    // const fields = Object.values(moduleMeta.fields).filter(
    //   ({ displaytype }) => ["1"].indexOf(displaytype) !== -1
    // );

    this.state = {
      //   sections: getSections(fields),
      //   groupedFields: getFieldsGroupedBySection(fields),
      //   expandedSections: getExpandedSections(fields),
      hidden: [],
      readOnly: []
    };
  }

  normalizeField(uitype) {
    if (uitype === 7) {
      return normalize.number;
    }
  }

  componentDidUpdate(prevProps) {
    const prevInitial = prevProps.initialValues || {};
    const { initialValues = {}, onFormChange } = this.props;

    if (Object.keys(prevInitial).length !== Object.keys(initialValues).length) {
      onFormChange(initialValues);
    }
  }

  renderField = field => {
    const { hidden, readOnly } = this.state;
    const { initialValues, fieldDependencies = {}, onFormChange } = this.props;

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
      render: () => null,
      normalize: this.normalizeField(uitype)
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

    const onChangeEvent = value => {
      onFormChange(this.formApi.values());

      if (!!fieldOptions.onChange) {
        fieldOptions.onChange(value);
      }
    };

    return <Field {...fieldOptions} onChange={onChangeEvent} />;
  };

  render() {
    const { sections, groupedFields, expandedSections } = this.state;
    const { initialValues, shown, busy } = this.props;
    return (
      <Form formApi={formApi => (this.formApi = formApi)} initialValues={initialValues}>
        {busy.form && (
          <Overlay>
            <Loader variant="inverse" />
          </Overlay>
        )}
        <div>
          {this.props.fields.map((field, i) => (
            <div className="slds-col " style={{ marginTop: "10px" }}>
              {this.renderField(field)}
            </div>
          ))}
          <div onClick={this.saveData}>click</div>
        </div>
      </Form>
    );
  }

  saveData = () => {
    let moduleMetaname = "Contacts";
    const { actions, id } = this.props;
    const formValues = this.formApi.values();
    const values = id ? { id, ...formValues } : formValues;
    console.log(JSON.stringify(values));

    actions.saveItem({
      values,
      name: moduleMetaname,
      operation: id ? "UpdateWithValidation" : "CreateWithValidation"
    });
  };
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, [
    "busy",
    "shown",
    "initialValues",
    "fieldDependencies"
  ]);

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RenderFieldsFormBuilder);
