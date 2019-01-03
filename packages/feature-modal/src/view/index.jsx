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
import { Form, Field } from "shared-form";
import {
  Input,
  Dropdown,
  Datepicker,
  Checkbox,
  Textarea,
  InputModal,
  MultiSelect
} from "shared-form-helper";
import {
  normalize,
  getExpandedSections,
  getSections,
  getFieldsGroupedBySection
} from "shared-utils";

import { FormRowContainer } from "./styles";

class FormModal extends Component {
  constructor(props) {
    super(props);

    const { moduleMeta } = props;
    const fields = Object.values(moduleMeta.fields).filter(
      ({ displaytype }) => ["1"].indexOf(displaytype) !== -1
    );

    this.state = {
      sections: getSections(fields),
      groupedFields: getFieldsGroupedBySection(fields),
      expandedSections: getExpandedSections(fields)
    };
  }

  normalizeField(uitype) {
    if (uitype === 7) {
      return normalize.number;
    }

    // 9 - percentage
    // 14 - time
    // 71, 72 - currency
  }

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  //uitype 27- 28 - to be implemented / reviewed
  //uitype 50 - to be implemented datetime
  //uitype 69 - to be implemented image picker
  //uitype 117 - to be checked
  //uitype 53 - assigned user api ready
  //uitype 77 is a picklist - to be reviewed
  //uitype 101 is a reference - to be revieweds
  renderField(field) {
    const uitype = parseInt(field.uitype);
    const isTextField = [1, 2, 4, 7, 9, 11, 13, 14, 17, 55, 71, 72, 85, 255].includes(
      uitype
    );
    const isTextArea = [19, 21, 22, 24].includes(uitype);
    const isPicklist = [15, 16, 26].includes(uitype);
    const isReference = [10, 51, 57, 73, 76, 78, 80].includes(uitype);

    let fieldOptions = {
      key: field.name,
      name: field.name,
      label: field.label,
      render: () => null,
      normalize: this.normalizeField(uitype)
    };

    if (isTextField) {
      fieldOptions = { ...fieldOptions, readOnly: uitype === 4, render: Input };
    } else if (uitype === 5) {
      fieldOptions = { ...fieldOptions, render: Datepicker };
    } else if (isPicklist) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.picklistValues,
        render: Dropdown
      };
    } else if (isTextArea) {
      fieldOptions = { ...fieldOptions, render: Textarea };
    } else if (isReference) {
      fieldOptions = {
        ...fieldOptions,
        refersTo: field.type.refersTo,
        render: InputModal
      };
    } else if (uitype === 33) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.picklistValues,
        render: MultiSelect
      };
    } else if (uitype === 53) {
      // console.log(field);
    } else if (uitype === 56) {
      fieldOptions = { ...fieldOptions, render: Checkbox };
    }

    return <Field {...fieldOptions} />;
  }

  saveData = () => {
    const { actions, moduleMeta } = this.props;
    const values = this.formApi.values();

    actions.saveItem({
      values,
      name: moduleMeta.name,
      operation: values.id ? "update" : "create"
    });
  };

  render() {
    const { sections, groupedFields, expandedSections } = this.state;
    const { moduleMeta, close, initialValues } = this.props;

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
          <Form
            formApi={formApi => (this.formApi = formApi)}
            initialValues={initialValues}
          >
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
                    {groupedFields[blockid].map(field => this.renderField(field))}
                  </FormRowContainer>
                </AccordionPanel>
              ))}
            </Accordion>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, ["busy"]);

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
