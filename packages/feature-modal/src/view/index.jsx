import React, { Component } from "react";
import {
  Modal,
  Button,
  Accordion,
  AccordionPanel
} from "@salesforce/design-system-react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { mapToDispatch, mapToState } from "shared-utils";
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
  getFieldsGroupedBySection
} from "shared-utils";

import { FormRowContainer, Overlay } from "./styles";

class FormModal extends Component {
  constructor(props) {
    super(props);

    const { moduleMeta, id, actions } = props;
    const fields = Object.values(moduleMeta.fields).filter(
      ({ displaytype }) => ["1"].indexOf(displaytype) !== -1
    );

    this.state = {
      sections: getSections(fields),
      groupedFields: getFieldsGroupedBySection(fields),
      expandedSections: getExpandedSections(fields),
      hidden: [],
      readOnly: []
    };

    if (id) {
      actions.doRetrieve({ id: `${moduleMeta.idPrefix}x${id}`, moduleMeta });
    } else {
      actions.setShown("form");
    }
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getFieldDependencies();
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.setShown("form", false);
    actions.setData("initial", {});
  }

  normalizeField(uitype) {
    if (uitype === 7) {
      return normalize.number;
    }
  }

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  renderField = field => {
    const { hidden, readOnly } = this.state;
    const { initialValues, fieldDependencies = {} } = this.props;

    const uitype = parseInt(field.uitype);
    const isTextField = [1, 2, 4, 7, 9, 11, 13, 14, 17, 55, 71, 72, 85, 255].includes(
      uitype
    );
    const isTextArea = [19, 21, 22, 24].includes(uitype);
    const isPicklist = [15, 16, 26, 77, 117].includes(uitype);
    const isReference = [10, 51, 57, 73, 76, 78, 80, 101].includes(uitype);

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

  excecuteAction = (isValid, [type, target]) => {
    const { hidden, sections, expandedSections, readOnly } = this.state;
    const targetField = target.field;

    if (type === "collapse" && isValid) {
      const section = sections.find(({ blocklabel }) => blocklabel === targetField);

      this.setState({
        expandedSections: { ...expandedSections, [section.blockid]: false }
      });
    }

    if (type === "hide") {
      if (isValid) {
        this.setState({ hidden: [...hidden, targetField] });
      } else {
        this.setState({ hidden: hidden.filter(field => field !== targetField) });
      }
    }

    if (type === "change" && isValid) {
      this.formApi.setField(targetField, target.value);
    }

    if (type === "readonly") {
      if (isValid) {
        this.setState({ readOnly: [...readOnly, targetField] });
      } else {
        this.setState({ readOnly: readOnly.filter(field => field !== targetField) });
      }
    }
  };

  evaluateConditions = conditions => {
    const comparatorToSymbol = {
      l: "<",
      g: ">",
      e: "=="
    };

    const result = conditions.reduce(
      (acc, condition) => {
        const { name, value, operator, comparator } = condition;
        const fieldValue = this.formApi.getField(name);
        let comparision = `"${fieldValue}" # "${value}"`;
        comparision = comparision.replace("#", comparatorToSymbol[comparator]);

        if (acc.operator === "or" && acc.value) {
          return acc;
        }

        if (comparator === "l" || comparator === "g") {
          comparision = comparision.replace(/undefined/g, "");
          comparision = comparision.replace(/""/g, 0);
          comparision = comparision.replace(/"/g, "");
        }

        comparision = eval(comparision);

        if (acc.operator === "and") {
          comparision = comparision && acc.value;
        }

        return { value: comparision, operator };
      },
      { value: false, operator: "or" }
    );

    return result.value;
  };

  renderForm() {
    const { sections, groupedFields, expandedSections } = this.state;
    const { initialValues, shown, busy } = this.props;

    if (!shown.form) {
      return <div />;
    }

    return (
      <Form formApi={formApi => (this.formApi = formApi)} initialValues={initialValues}>
        {busy.form && (
          <Overlay>
            <Loader variant="inverse" />
          </Overlay>
        )}

        <Accordion>
          {sections.map(({ blockid, blockname }) => (
            <AccordionPanel
              id={blockid}
              key={blockid}
              expanded={!!expandedSections[blockid]}
              onTogglePanel={() => this.toggleSection(blockid)}
              summary={blockname}
              className="slds-p-around--large"
            >
              <FormRowContainer>
                {groupedFields[blockid].map(this.renderField)}
              </FormRowContainer>
            </AccordionPanel>
          ))}
        </Accordion>
      </Form>
    );
  }

  saveData = () => {
    const { actions, moduleMeta, id } = this.props;
    const formValues = this.formApi.values();
    const values = id ? { id, ...formValues } : formValues;
    console.log(JSON.stringify(values));

    console.log(moduleMeta.name);

    actions.saveItem({
      values,
      name: moduleMeta.name,
      operation: id ? "UpdateWithValidation" : "CreateWithValidation"
    });
  };

  render() {
    const { moduleMeta, close } = this.props;

    return (
      <div>
        <Modal
          isOpen
          ariaHideApp={false}
          containerClassName="form-modal"
          title={`New ${moduleMeta.label}`}
          onRequestClose={close}
          footer={[
            <Button key="cancel" label="Cancel" onClick={close} />,
            <Button key="save" label="Save" variant="brand" onClick={this.saveData} />
          ]}
        >
          {this.renderForm()}
        </Modal>
      </div>
    );
  }
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
)(FormModal);
