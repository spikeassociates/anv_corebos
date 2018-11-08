import React, { Component } from "react";
import { Switch } from "react-router-dom";
import Modular from "modular-redux";
import { Redirect } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";

import { mapToState } from "shared-utils";
import { Page } from "shared-components";

import Sidebar from "./Sidebar";
import { PageContainer, Container } from "./styles";
import routes from "./routes";

class Content extends Component {
  render() {
    const { Module } = this.props;

    return (
      <Container>
        <Sidebar />
        <PageContainer>
          <Switch>
            {routes.map(route => (
              <Page.Route
                title={route.corebosModule}
                key={route.module}
                path={`/${route.name}`}
                render={props => {
                  const ModuleComponent = Module.view[route.module];
                  return <ModuleComponent {...props} moduleName={route.corebosModule} />;
                }}
              />
            ))}

            <Page.Route
              title="login"
              path="/login"
              component={props => <Module.view.login {...props} />}
            />

            <Page.Route title="404" path="*" component={() => <span>404</span>} />
          </Switch>
        </PageContainer>
      </Container>
    );
  }
}

function mapStateToProps(state, { Module }) {
  return {
    isLoggedIn: Module.selectors.test(state)
  };
}

export default compose(
  Modular.view,
  connect(mapStateToProps)
)(Content);
