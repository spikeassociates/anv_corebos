import React, { Component } from "react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { mapToDispatch, mapToState } from "shared-utils";

import { Button } from "@salesforce/design-system-react";
import { Form, Field } from "shared-form";

import Inputs from "../Inputs/Inputs";
//import data from "../../data/data";
import RowEdit from "../Inputs/RowEdit";

import Tabs from "../Tabs";

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldsGot: false,
      fields: []
    };
  }

  //Get Fields only once from Row Edit Block
  getRowEditFields() {
    if (this.state.fieldsGot == false) {
      const fieldss = this.props.fields;
      this.setState({
        fieldsGot: true,
        fields: fieldss
      });
    }
  }
  render() {
    return (
      <>
        {this.props.blocktype == "Fields" ? (
          //When type of block is "Fields"(render normal fields)
          <div className="slds-grid slds-wrap">
            <Inputs fields={this.props.fields} />
          </div>
        ) : this.props.blocktype == "DocumentForm" ? (
          <div className="slds-grid slds-wrap">
            <Tabs steps={this.props.fields} stepids={this.props.stepid} />
          </div>
        ) : (
          //TODO
          // TODO can be simplified and faster
          <div>
            <div className="slds-grid slds-wrap">
              {this.props.fields.map((field, i) => (
                <div className="slds-col slds-size_1-of-2" style={{ marginTop: "10px" }}>
                  <RowEdit
                    stepids={this.props.stepids}
                    blockid={this.props.blockid}
                    fieldid={field.fieldid}
                    cbfield={field.label}
                    value={field.value}
                    removeRow={this.props.removeRow}
                  />
                </div>
              ))}
              <Button
                assistiveText={{ icon: "Icon Border-filled medium" }}
                iconCategory="utility"
                iconName="add"
                iconVariant="border-filled"
                variant="icon"
              />
            </div>
            <div>
              <Button
                style={{ marginTop: "20px" }}
                label="Add Block of Fields"
                variant="brand"
                onClick={() => {
                  this.props.addRow(
                    this.props.stepids,
                    this.props.blockid,
                    this.state.fields
                  );
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, [
    "busy",
    "shown",
    "initialValues",
    "fieldDependencies"
  ]);

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Block);
