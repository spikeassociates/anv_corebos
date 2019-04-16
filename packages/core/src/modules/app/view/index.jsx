import React from "react";
import { withRouter } from "react-router-dom";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { decodeQs, changeRoute } from "utils";

import { mapToState, mapToDispatch } from "shared-utils";
import { PageContainer, Container } from "./styles";

class App extends React.Component {
  componentDidMount() {
    const { actions } = this.props;

    actions.getModules();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  getView = () => {
    const { Module, modules, route, authenticated } = this.props;
    const { view, moduleName, id } = decodeQs(route);
    const moduleMeta = modules[moduleName];

    const props = { moduleMeta, isPrimary: true };

    // return <Module.view.formbuilder modules={modules} />;

    if (!(authenticated && Object.keys(modules).length)) {
      return <Module.view.authentication />;
    } else if (!moduleName) {
      return null;
    }

    if (view === "list") {
      return <Module.view.listview {...props} />;
    } else if (view === "detail" && id) {
      return <Module.view.detailview {...props} id={id} />;
    } else if (view === "create") {
      return (
        <Module.view.modal
          moduleMeta={moduleMeta}
          close={() => changeRoute({ view: "list", moduleName: moduleMeta.name })}
        />
      );
    } else if (view === "edit") {
      return (
        <Module.view.modal
          moduleMeta={moduleMeta}
          id={id}
          close={() => changeRoute({ view: "list", moduleName: moduleMeta.name })}
        />
      );
    }
  };

  render() {
    const content = this.getView();

    if (!content) {
      return null;
    }

    return (
      <Container>
        <PageContainer>{content}</PageContainer>
      </Container>
    );
  }
}

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
