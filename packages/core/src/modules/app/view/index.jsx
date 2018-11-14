import React from "react";
import { withRouter, Switch } from "react-router-dom";
import { injectGlobal } from "styled-components";
import PropTypes from "prop-types";
import Modular from "modular-redux";

import { Page } from "shared-components";

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

  render() {
    const { Module } = this.props;
    const sidebarLinks = routes.filter(route => route.sidebar).map(route => route.name);

    return (
      <Container>
        <Sidebar links={sidebarLinks} />
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
              render={props => <Module.view.login {...props} />}
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

export default withRouter(Modular.view(App));
