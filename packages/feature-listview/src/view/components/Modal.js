import React, { Component } from "react";
import {
  Modal,
  Button,
  Accordion,
  AccordionPanel
} from "@salesforce/design-system-react";
import { Form, Field } from "shared-form";
import { Input, Dropdown, Datepicker } from "shared-form-helper";

import { FormRowContainer } from "../styles";

export default class ModuleModal extends Component {
  constructor(props) {
    super(props);

    const { meta, ...rest } = props;
    const fields = meta.filter(({ displaytype }) => ["1"].indexOf(displaytype) !== -1);

    const groupedFields = fields.filter(field => field.block).reduce((acc, field) => {
      const blockId = field.block.blockid;
      const blockFields = acc[blockId] || [];
      return { ...acc, [blockId]: [...blockFields, field] };
    }, {});

    const sections = Object.values(groupedFields)
      .map(items => items[0].block)
      .sort((a, b) => (a.blocksequence > b.blocksequence ? 1 : -1));

    const expandedSections = Object.keys(groupedFields).reduce(
      (acc, id) => ({
        ...acc,
        [id]: true
      }),
      {}
    );

    this.state = { isOpen: true, sections, groupedFields, expandedSections };
  }

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  renderField(field) {
    const uitype = parseInt(field.uitype);
    const isTextField = [1, 2, 55, 255, 4, 11, 13].indexOf(uitype) !== -1;
    let fieldOptions = {};

    if (isTextField) {
      return (
        <Field
          key={field.name}
          name={field.name}
          label={field.label}
          readOnly={uitype === 4}
          render={Input}
        />
      );
    } else if (uitype === 5) {
      return (
        <Field
          key={field.name}
          name={field.name}
          label={field.label}
          render={Datepicker}
        />
      );
    } else if (uitype === 15) {
      return (
        <Field
          key={field.name}
          name={field.name}
          label={field.label}
          options={field.type.picklistValues}
          render={Dropdown}
        />
      );
    }

    return (
      <div key={field.name}>
        {field.name} {uitype} {[1, 55, 255, 4].indexOf(uitype)}
      </div>
    );
  }

  render() {
    const { sections, groupedFields, expandedSections } = this.state;

    return (
      <Modal
        ariaHideApp={false}
        containerClassName="form-modal"
        isOpen={this.state.isOpen}
        footer={[
          <Button key="cancel" label="Cancel" onClick={this.toggleOpen} />,
          <Button
            key="save"
            label="Save"
            variant="brand"
            onClick={() => {
              console.log(this.formApi.values());
            }}
          />
        ]}
        onRequestClose={this.toggleOpen}
        title="New Opportunity"
      >
        <Form formApi={formApi => (this.formApi = formApi)}>
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
    );
  }
}
