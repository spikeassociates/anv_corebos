import React from "react";
import { withRouter, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { injectGlobal } from "styled-components";

import { Page } from "shared-components";
import { mapToState, mapToDispatch } from "shared-utils";

import Sidebar from "./Sidebar";
import { PageContainer, Container } from "./styles";
import routes from "./routes";

injectGlobal`
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  #app {
    height: 100%;
    width: 100%;
  }
`;

class App extends React.Component {
  getChildContext() {
    return { assetBasePath: "" };
  }

  componentDidMount() {
    const { actions } = this.props;

    actions.getModules();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  getModuleMeta = moduleName => {
    const { modules } = this.props;

    const defaultModule = {
      filterFields: {
        fields: [],
        linkfields: [],
        pagesize: 0
      },
      fields: [],
      label: ""
    };

    return modules[moduleName] || defaultModule;
  };

  renderRoute = route => {
    const { Module, authenticated } = this.props;

    return (
      <Page.Route
        title={route.name}
        key={route.module}
        path={`/${route.name}`}
        condition={authenticated}
        render={props => {
          const ModuleComponent = Module.view[route.module];
          return (
            <ModuleComponent
              {...props}
              moduleMeta={this.getModuleMeta(route.corebosModule)}
            />
          );
        }}
      />
    );
  };

  render() {
    const { Module, authenticated, modules } = this.props;

    const sidebarLinks = routes
      .filter(route => route.sidebar)
      .map(route => route.corebosModule);

    const defaultRoute = routes.find(
      route => route.corebosModule === GLOBALS.MODULES[0] && route.module === "listview"
    );

    return (
      <Container>
        {authenticated && <Sidebar links={sidebarLinks} />}

        <PageContainer>
          <Switch>
            {routes.map(route => this.renderRoute(route))}

            <Page.Route
              title={defaultRoute.corebosModule}
              condition={!authenticated}
              path="/"
              redirect={`/${defaultRoute.name}`}
              component={Module.view.authentication}
            />

            <Page.Route
              title="login"
              path="/login"
              condition={!authenticated}
              render={Module.view.authentication}
            />

            <Page.Route title="404" path="*" render={() => <span>404</span>} />
          </Switch>
        </PageContainer>
      </Container>
    );
  }
}

App.childContextTypes = {
  assetBasePath: PropTypes.string
};

const mapStateToProps = (state, { Module }) => ({
  authenticated: Module.selectors.authentication.authenticated(state),
  ...mapToState(state, Module.selectors, ["modules"])
});

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  withRouter,
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
