import React from "react";
import { Switch } from "react-router-dom";
import Modular from "modular-redux";
import { Page } from "shared-components";
import { Redirect } from "react-router";

import routes from "./routes";
import { PageContainer, Container } from "./styles";
import Sidebar from "./Sidebar";

const sidebarRoutes = routes.filter(route => route.sidebar).map(route => route.name);

const Content = ({ Module }) => (
  <>
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

          <Redirect from="/" to={`/${sidebarRoutes[0]}`} />
          <Page.Route title="404" path="*" component={() => <span>404</span>} />
        </Switch>
      </PageContainer>
    </Container>
  </>
);

export default Modular.view(Content);
