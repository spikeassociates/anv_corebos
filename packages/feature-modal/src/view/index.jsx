import React, { Component } from "react";
import { Modal, Button } from "@salesforce/design-system-react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { mapToDispatch } from "shared-utils";

class FormModal extends Component {
  state = { data: {} };

  saveData = () => {
    const { actions, moduleMeta, id } = this.props;
    const { data } = this.state;
    const values = id ? { id, ...data } : data;

    actions.saveItem({
      values,
      name: moduleMeta.name,
      operation: id ? "UpdateWithValidation" : "CreateWithValidation"
    });
  };

  render() {
    const { moduleMeta, close, Module, id } = this.props;

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
          <Module.view.formview
            id={id}
            moduleMeta={moduleMeta}
            onFormChange={data => this.setState({ data })}
          />
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    null,
    mapDispatchToProps
  )
)(FormModal);
