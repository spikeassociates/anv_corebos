import React from "react";
import { withRouter, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { injectGlobal } from "styled-components";

import { Page } from "shared-components";
import { mapToState } from "shared-utils";

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
    return {
      assetBasePath: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  renderRoute = route => {
    const { Module } = this.props;

    return (
      <Page.Route
        title={route.corebosModule}
        key={route.module}
        path={`/${route.name}`}
        render={props => {
          const ModuleComponent = Module.view[route.module];
          return <ModuleComponent {...props} moduleName={route.corebosModule} />;
        }}
      />
    );
  };

  render() {
    const { Module, isLoggedIn } = this.props;
    const sidebarLinks = routes.filter(route => route.sidebar).map(route => route.name);

    return (
      <Container>
        <Sidebar links={sidebarLinks} />
        <PageContainer>
          <Switch>
            {isLoggedIn && routes.map(route => this.renderRoute(route))}

            {!isLoggedIn && (
              <Page.Route
                title="login"
                path="/login"
                render={props => <Module.view.login {...props} />}
              />
            )}

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

const mapStateToProps = (state, { Module }) => {
  return mapToState(state, Module.selectors, ["isLoggedIn"]);
};

export default compose(
  withRouter,
  Modular.view,
  connect(mapStateToProps)
)(App);
