import React, { Component } from "react";
import Modular from "modular-redux";
import {
  Input,
  Icon,
  Modal,
  Dropdown,
  DropdownTrigger,
  Button
} from "@salesforce/design-system-react";

import { Repo } from "shared-repo";

import { Container } from "./styles";

class FormInputModal extends Component {
  constructor(props) {
    super(props);

    const refersTo = props.refersTo.map(item => ({ label: item, value: item }));

    this.state = {
      isModalOpen: false,
      modules: Repo.get("store").getState().app._module.data.modules,
      label: props.valueLabel || "",
      referModules: refersTo,
      selectedModule: refersTo[0]
    };
  }

  toggleModal = (isModalOpen = true) => {
    this.setState({ isModalOpen });
  };

  handleRowClick = item => {
    const { onChange } = this.props;
    const { modules, selectedModule } = this.state;
    const label = modules[selectedModule.value].labelFields
      .split(",")
      .map(field => item[field])
      .join(" ");

    onChange(item.id);
    this.setState({ label });
    this.toggleModal(false);
  };

  handleModuleChange = item => {
    const { onChange } = this.props;

    this.setState({ selectedModule: item, label: "" });
    onChange("");
  };

  render() {
    const { value = "", onChange, Module, ...rest } = this.props;
    const { isModalOpen, modules, label, referModules, selectedModule } = this.state;

    return (
      <Container>
        <Modal
          ariaHideApp={false}
          dismissOnClickOutside
          containerClassName="form-modal"
          isOpen={isModalOpen}
          title={`Select one`}
          onRequestClose={() => this.toggleModal(false)}
        >
          <Module.view.listview
            moduleMeta={modules[selectedModule.value]}
            selectRow={this.handleRowClick}
          />
        </Modal>

        <Input {...rest} readOnly value={label} />

        {referModules.length > 1 && (
          <Dropdown
            align="right"
            options={referModules}
            value={selectedModule.value}
            onSelect={this.handleModuleChange}
          >
            <DropdownTrigger>
              <Button
                iconCategory="utility"
                iconName="down"
                iconPosition="right"
                label={selectedModule.label}
              />
            </DropdownTrigger>
          </Dropdown>
        )}

        <div onClick={e => this.toggleModal()}>
          <Icon category="action" name="new" size="xx-small" />
        </div>
      </Container>
    );
  }
}

export default Modular.view(FormInputModal);
