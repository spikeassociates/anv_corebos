import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import Form from "./components/FormBuilder";
import data from "../data";
import NewForm from "./form";

import { mapToDispatch, mapToState } from "shared-utils";

class FormBuilder extends Component {
  state = {
    formData: {}
  };

  renderBlockFields = (meta, block) => {
    const { formData } = this.state;
    let { fields, blockid, label, sequence } = block;
    fields = fields
      .map(field => ({
        displaytype: "1",
        ...meta.fields[field.name],
        ...field,
        block: {
          blockid,
          blocksequence: sequence,
          blockname: label
        }
      }))
      .reduce((acc, field) => ({ ...acc, [field.name]: field }), {});
    meta = { ...meta, fields };

    return (
      <NewForm
        onFormChange={data => this.setState({ formData: { ...formData, ...data } })}
        key={blockid}
        moduleMeta={meta}
      />
    );
  };

  renderStep = step => {
    const { modules } = this.props;
    let meta = modules[step.module];

    return step.blocks
      .sort((a, b) => {
        const aSequence = parseInt(a.sequence);
        const bSequence = parseInt(b.sequence);
        return aSequence - bSequence;
      })
      .map(({ blocktype, ...rest }) => {
        if (blocktype === "Fields") {
          return this.renderBlockFields(meta, rest);
        }
      });
  };

  render() {
    const step = data.steps[0];

    return (
      <div>
        {this.renderStep(step)}
        {/* <div>{name}</div>
        <div onClick={() => actions.rename("wow")}>Change Name</div> */}
      </div>
    );
  }
}

// const mapStateToProps = (state, { Module }) =>
//   mapToState(state, Module.selectors, ["name"]);

// const mapDispatchToProps = (dispatch, { Module }) => ({
//   actions: mapToDispatch(dispatch, Module.actions)
// });

// export default compose(
//   Modular.view,
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )
// )(FormBuilder);
export default FormBuilder;
