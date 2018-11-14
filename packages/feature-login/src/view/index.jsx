import React, { Component } from "react";
import Modular from "modular-redux";
import {} from "@salesforce/design-system-react";
import { compose } from "redux";
import { connect } from "react-redux";

import { mapToState, mapToDispatch } from "shared-utils";

import {} from "./styles";

class Module extends Component {
  handleLogin = () => {
    const { actions } = this.props;

    actions.challenge({
      username: "admin",
      accessKey: "cdYTBpiMR9RfGgO"
    });
  };

  render() {
    return <span onClick={this.handleLogin}>login</span>;
  }
}

const mapStateToProps = (state, { Module }) => {
  return mapToState(state, Module.selectors, []);
};

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Module);
