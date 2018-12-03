import React, { Component } from "react";
import {
  Modal,
  Button,
  Accordion,
  AccordionPanel
} from "@salesforce/design-system-react";
import Modular from "modular-redux";

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

  uitypeToNormalize = {
    7: normalize.number
  };

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  renderField(field) {
    const uitype = parseInt(field.uitype);
    const isTextField = [1, 2, 4, 7, 9, 11, 13, 14, 17, 55, 71, 85, 255].includes(uitype);
    let fieldOptions = {
      key: field.name,
      name: field.name,
      label: field.label,
      render: () => (
        <div>
          {field.label} {uitype}
        </div>
      ),
      normalize: this.uitypeToNormalize[uitype]
    };

    if (isTextField) {
      fieldOptions = { ...fieldOptions, readOnly: uitype === 4, render: Input };
    } else if (uitype === 5) {
      fieldOptions = { ...fieldOptions, render: Datepicker };
    } else if (uitype === 15) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.picklistValues,
        render: Dropdown
      };
    } else if (uitype === 21 || uitype === 19) {
      fieldOptions = { ...fieldOptions, render: Textarea };
    } else if (uitype === 10 || uitype === 51 || uitype === 57) {
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
    const { saveItem, moduleMeta } = this.props;
    const values = this.formApi.values();
    console.log(values);

    // saveItem({
    //   values,
    //   name: moduleMeta.name,
    //   operation: values.id ? "update" : "create"
    // });
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

export default Modular.view(FormModal);
