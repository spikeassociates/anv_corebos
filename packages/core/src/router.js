import React, { Component } from "react";
import { ConnectedRouter } from "react-router-redux";

import { history } from "./store";
import App from "./modules";

class Router extends Component {
  state = { route: window.location.search };

  componentDidMount() {
    setInterval(() => {
      const { route } = this.state;
      const newRoute = window.location.search;

      if (route !== newRoute) {
        this.setState({ route: window.location.search });
      }
    }, 500);
  }

  render() {
    const { route } = this.state;

    return (
      <ConnectedRouter history={history}>
        <App.view route={route} />
      </ConnectedRouter>
    );
  }
}
export default Router;
