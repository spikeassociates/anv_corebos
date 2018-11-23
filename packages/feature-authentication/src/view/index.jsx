import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import {} from "@salesforce/design-system-react";

import { mapToState, mapToDispatch } from "shared-utils";
import { Form, Field } from "shared-form";
import { Input } from "shared-form-helper";

import {} from "./styles";

class Authentication extends Component {
  handleLogin = () => {
    const { actions } = this.props;
    const data = this.formApi.values();
    const { username, accessKey } = data;
    console.log(username, accessKey);

    // actions.challenge({
    //   username: "admin",
    //   accessKey: "cdYTBpiMR9RfGgO"
    // });
  };

  render() {
    const { authenticated } = this.props;

    return (
      <Form formApi={formApi => (this.formApi = formApi)}>
        <Field name="username" render={Input} placeholder="My placeholder" />
        <Field name="accessKey" render={Input} placeholder="My placeholder" />
        <span onClick={this.handleLogin}>submit</span>
      </Form>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, ["authenticated"]);

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Authentication);
