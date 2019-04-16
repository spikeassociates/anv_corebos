import React, { Component } from "react";
import { Modal, Button } from "@salesforce/design-system-react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { mapToDispatch, mapToState } from "shared-utils";

class FormModal extends Component {
  state = { data: {} };

  componentWillUnmount = () => {
    const { actions } = this.props;

    actions.setData("errors", {});
    actions.setBusy("updated", false);
  };

  componentDidUpdate = prevProps => {
    const { busy, close } = this.props;
    const prevUpdated = prevProps.busy.updated;

    if (!prevUpdated && busy.updated) {
      close();
    }
  };

  saveData = () => {
    const { actions, moduleMeta, id, reRenderComponent } = this.props;
    const { data } = this.state;
    const values = id ? { id, ...data } : data;

    actions.saveItem({
      values,
      name: moduleMeta.name,
      operation: id ? "UpdateWithValidation" : "CreateWithValidation"
    });
    setTimeout(function() {
      window.location.reload();
    }, 1000);
  };

  render() {
    const { moduleMeta, close, Module, id, errors, busy } = this.props;

    return (
      <div>
        <Modal
          isOpen
          dismissible={false}
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
            errors={errors}
            loading={busy.form}
          />
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, ["errors", "busy"]);

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormModal);
