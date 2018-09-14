import React, { Component } from "react";

class ErrorHandler extends Component {
  state = { error: false };

  componentDidCatch(...args) {
    const { onError = () => {} } = this.props;
    this.setState({ error: true });
    onError(...args);
  }

  render() {
    const { error } = this.state;
    const { children, render = () => <h1>Something went wrong.</h1> } = this.props;

    return error ? render() : children;
  }
}

export default ErrorHandler;
