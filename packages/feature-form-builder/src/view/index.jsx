import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import Form from "./components/FormBuilder";
import data2 from "../data";
import NewForm from "./form";

import { Tabs, TabsPanel, Button } from "@salesforce/design-system-react";
import update from "immutability-helper";

class FormBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      data: data2
    };

    this.addRow = this.addRow.bind(this);
  }

  //Used for blocktype='RowEdit' to make it dynamic
  addRow = () => {
    let newState = update(this.state, {
      data: {
        steps: {
          [0]: {
            blocks: {
              [0]: {
                fields: {
                  $push: [
                    {
                      uitype: 1,
                      fieldid: "f011",
                      blockid: "ba",
                      name: "firstname",
                      sequence: "10",
                      label: "Added"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    });
    this.setState(newState);
  };

  //Main Render
  render() {
    const { steps } = this.state.data;
    console.log(steps);
    return (
      <div>
        <Tabs id="tabs-example-default">
          {steps.map(step => (
            <TabsPanel key={step.stepid} label={step.stepname}>
              <div className="slds-p-horizontal_xx-large">{this.renderStep(step)}</div>
            </TabsPanel>
          ))}
        </Tabs>
        {/* <div>{name}</div>
          <div onClick={() => actions.rename("wow")}>Change Name</div> */}
      </div>
    );
  }

  //Render Steps
  renderStep = step => {
    const { modules } = this.props;
    console.log(step);
    console.log("----");

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

  //Render fields of blocktype=='Fields'
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
      <>
        <NewForm
          onFormChange={data => this.setState({ formData: { ...formData, ...data } })}
          key={blockid}
          moduleMeta={meta}
        />
        <Button onClick={this.addRow} label="Add new" variant="brand" />
      </>
    );
  };

  //Render fields of blocktype=='Fields'
  renderBlockRowEdit = (meta, block) => {
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
