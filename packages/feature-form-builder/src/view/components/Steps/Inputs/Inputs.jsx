import React, { Component } from "react";

import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { mapToDispatch, mapToState } from "shared-utils";
import FormBuilder from "../../../../../../feature-form/src/view/formBuilder";

class Inputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  render() {
    return (
      <div>
        <FormBuilder
          fields={this.props.fields}
          onFormChange={data => this.setState({ data })}
        />
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
)(Inputs);
