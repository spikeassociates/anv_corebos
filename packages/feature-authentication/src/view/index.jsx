import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { Button } from "@salesforce/design-system-react";

import { mapToState, mapToDispatch } from "shared-utils";
import { Form, Field } from "shared-form";
import { Input } from "shared-form-helper";

import { LoginFormContainer } from "./styles";

class Authentication extends Component {
  handleLogin = () => {
    const { actions } = this.props;
    const data = this.formApi.values();
    const { username, accessKey } = data;

    actions.challenge({ username, accessKey });
  };

  render() {
    return (
      <LoginFormContainer>
        <Form
          initialValues={{
            username: GLOBALS.COREBOS_USERNAME,
            accessKey: GLOBALS.COREBOS_TOKEN
          }}
          formApi={formApi => (this.formApi = formApi)}
        >
          <div>Log In to coreBOS</div>
          <Field name="username" render={Input} placeholder="Username" />
          <Field name="accessKey" render={Input} placeholder="Access Key" />
          <Button onClick={this.handleLogin}>Submit</Button>
        </Form>
      </LoginFormContainer>
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
