import React from "react";
import { withRouter } from "react-router-dom";
import { injectGlobal } from "styled-components";
import PropTypes from "prop-types";

import Content from "./Content";

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
    return <Content />;
  }
}

App.childContextTypes = {
  assetBasePath: PropTypes.string
};

export default withRouter(App);
