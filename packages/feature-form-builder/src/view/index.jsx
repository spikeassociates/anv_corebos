import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { mapToDispatch, mapToState } from "shared-utils";

class FormBuilder extends Component {
  render() {
    const { name, actions } = this.props;

    return (
      <div>
        <div>Form Builder {name}</div>
        <div onClick={() => actions.rename("wow")}>Change Name</div>
      </div>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, ["name"]);

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormBuilder);
