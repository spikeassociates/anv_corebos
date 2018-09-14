import React, { Component } from "react";
import { capitalize } from "shared-utils";
import { Route as ReactRouterRoute, Redirect } from "react-router-dom";

class Route extends Component {
  static getDerivedStateFromProps(nextProps) {
    const { title } = nextProps;
    document.title = title ? `coreBOS ${capitalize(title)}` : document.title;

    return null;
  }

  render() {
    const { title, condition = true, redirect = "/", path, ...rest } = this.props;

    if (condition) {
      return <ReactRouterRoute {...rest} />;
    }

    return <Redirect from={path} to={redirect} />;
  }
}

export default Route;
