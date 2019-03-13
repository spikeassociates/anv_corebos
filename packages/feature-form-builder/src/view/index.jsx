import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { setPath } from "utils";

import { mapToDispatch } from "shared-utils";
import Form from "./components/FormBuilder";
import data2 from "../data";
import NewForm from "./form";

import { Tabs, TabsPanel, Button } from "@salesforce/design-system-react";

class FormBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      formData: {},
      data_form: data2,
      renderRowEdit: 0
    };
  }

  saveData = () => {
    const { actions, id } = this.props;
    const { data } = this.state;
    const values = id ? { id, ...data } : data;
    console.log(values);

    actions.saveItem({
      values,
      name: "Contacts",
      operation: id ? "UpdateWithValidation" : "CreateWithValidation"
    });
  };

  //Render Steps
  renderStep = step => {
    const { modules } = this.props;
    let meta = modules[step.module];
    return (
      step.blocks
        // .sort((a, b) => {
        //   const aSequence = parseInt(a.sequence);
        //   const bSequence = parseInt(b.sequence);
        //   return aSequence - bSequence;
        // })
        .map(({ blocktype, ...rest }) => {
          if (blocktype === "Fields") {
            return this.renderBlockFields({ meta, block: rest });
          } else if (blocktype === "RowEdit") {
            return this.renderBlockRowEdit({ meta, block: rest, step });
          }
        })
    );
  };

  //Render fields of blocktype=='Fields'
  renderBlockRowEdit = ({ meta, block, step }) => {
    const { formData } = this.state;
    const id = `${block.blockid}x${step.stepid}`;
    const counter = this.state[id] || [1];

    const onBlockData = (data, index) => {
      {
        const key = `rowEditx${id}x${index}`;
        setPath(formData, key, data);
        this.setState({ formData });
      }
    };

    return (
      //Add here for loop for RowEdit to render it as many times as the button + is pressed
      //There should be two buttons, one in side of each block, and one in bottom
      //to add more blocks(arrays)
      <>
        <div className="slds-grid slds-gutters">
          {counter.map((_, index) => (
            <div style={{ width: "100%" }}>
              <div className="slds-col slds-size_5-of-7">
                {this.renderBlockFields({
                  meta,
                  block,
                  onFormChange: data => onBlockData(data, index)
                })}
              </div>

              <div className="slds-col slds-size_2-of-7 slds-align_absolute-center">
                <Button
                  iconCategory="utility"
                  iconName="delete"
                  iconSize="large"
                  variant="icon"
                  onClick={() => {
                    // counter[index] = 0;
                    // this.setState({ id: counter });
                  }}
                />
              </div>
            </div>
          ))}

          <div>
            <Button
              label="Add"
              variant="brand"
              onClick={() => this.setState({ [id]: [...counter, 1] })}
            />
          </div>
        </div>
      </>
    );
  };

  //Render fields of blocktype=='Fields'
  renderBlockFields = ({ meta, block, onFormChange }) => {
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
        onFormChange={data => {
          onFormChange
            ? onFormChange(data)
            : this.setState({ formData: { ...formData, ...data } });
        }}
        key={blockid}
        moduleMeta={meta}
      />
    );
  };

  //Main Render
  render() {
    const {
      data_form: { steps },
      formData
    } = this.state;
    console.log(formData);

    return (
      <div>
        <Tabs id="tabs-example-default">
          {steps.map(step => (
            <TabsPanel key={step.stepid} label={step.stepname}>
              <div className="slds-p-horizontal_xx-large">{this.renderStep(step)}</div>
            </TabsPanel>
          ))}
        </Tabs>
        <Button key="save" label="Save" variant="brand" onClick={this.saveData} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    null,
    mapDispatchToProps
  )
)(FormBuilder);
