import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { setPath } from "utils";
import update from "immutability-helper";

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
      tabIndex: 0
    };
  }

  saveData = () => {
    const { actions, id } = this.props;
    const { data } = this.state;
    const values = id ? { id, ...data } : data;

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
    return step.blocks
      .sort((a, b) => {
        const aSequence = parseInt(a.sequence);
        const bSequence = parseInt(b.sequence);
        return aSequence - bSequence;
      })
      .map(({ blocktype, ...rest }) => {
        if (blocktype === "Fields") {
          return this.renderBlockFields({ meta, block: rest });
        } else if (blocktype === "RowEdit") {
          return this.renderBlockRowEdit({ meta, block: rest, step, blocktype });
        } else {
          const blocks = rest.steps
            .map(({ blocks }) => blocks)
            .reduce((acc, blockArr) => [...acc, ...blockArr], []);

          return (
            <div>{blocks.map(block => this.renderBlockFields({ meta, block }))}</div>
          );
        }
      });
  };

  //Render fields of blocktype=='Fields'
  renderBlockRowEdit = ({ meta, block, step, blocktype }) => {
    const { formData } = this.state;
    const id = `${block.blockid}x${step.stepid}`;
    const counter = this.state[id] || [1];
    const counter_length = counter.length;

    const onBlockData = (data, index) => {
      {
        const key = `rowEditx${id}x${index}`;
        setPath(formData, key, data);
        this.setState({ formData });
      }
    };

    return (
      <>
        <div className="slds-grid slds-wrap">
          {counter.map((item, index) => (
            <div style={{ width: "100%" }}>
              {item == 1 && (
                <div className="slds-grid slds-gutters">
                  <div className="slds-col slds-size_6-of-7">
                    {this.renderBlockFields({
                      meta,
                      block,
                      onFormChange: data => onBlockData(data, index),
                      blocktype
                    })}
                  </div>
                  {counter_length > 1 && (
                    <div className="slds-col slds-size_1-of-7 slds-align_absolute-center">
                      <Button
                        iconCategory="utility"
                        iconName="delete"
                        iconSize="large"
                        variant="icon"
                        //this.state.id.filter((_, i) => i !== index)
                        // this.setState((prevState) => ({
                        //   id: prevState.id.filter((_, i) => i !== index)
                        // }));
                        onClick={() =>
                          this.setState({
                            id: [...id.slice(0, index), ...id.slice(index + 1)]
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className=" slds-align_absolute-center  slds-m-vertical_large">
            <Button
              label="Add Another Block"
              iconCategory="utility"
              iconName="add"
              iconSize="large"
              variant="icon"
              // counter[index] = 0;
              onClick={() => this.setState({ [id]: [...counter, 1] })}
            />
          </div>
        </div>
      </>
    );
  };

  //Render fields of blocktype=='Fields'
  renderBlockFields = ({ meta, block, onFormChange, blocktype }) => {
    const { formData } = this.state;
    let { fields, blockid, label, sequence } = block;
    if (blocktype == "RowEdit") {
      label = `${label} (Row Edit)`;
    }

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
      tabIndex
    } = this.state;
    const numRows = steps.length;
    const nextStep = numRows - (tabIndex + 1);
    console.log(numRows);

    return (
      <div>
        <Tabs id="tabs-example-default" selectedIndex={tabIndex}>
          {steps.map(step => (
            <TabsPanel
              key={step.stepid}
              label={step.stepname}
              disabled={tabIndex == step.stepid}
            >
              <div className="slds-p-horizontal_xx-large">{this.renderStep(step)}</div>
            </TabsPanel>
          ))}
        </Tabs>
        <div className="slds-m-left_xx-large">
          <div style={{ textAlign: "left" }}>
            {tabIndex != 0 && (
              <Button
                key="goback"
                label=" Go Back"
                iconName="back"
                iconSize="large"
                variant="icon"
                onClick={() =>
                  this.setState(prevState => ({
                    tabIndex: prevState.tabIndex - 1
                  }))
                }
              />
            )}
          </div>
        </div>
        <div className="slds-m-bottom_xx-large">
          <div className="slds-m-right_xx-large">
            <div style={{ textAlign: "right" }}>
              {nextStep > 0 && (
                <Button
                  key="nextstep"
                  label="Next Step"
                  iconName="forward"
                  iconSize="large"
                  variant="icon"
                  onClick={() =>
                    this.setState(prevState => ({
                      tabIndex: prevState.tabIndex + 1
                    }))
                  }
                />
              )}
            </div>
          </div>
        </div>
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
