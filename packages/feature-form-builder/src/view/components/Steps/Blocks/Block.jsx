import React, { Component } from "react";

import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";
import customSprite from "@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import doctypeSprite from "@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg";
import {
  IconSettings,
  Accordion,
  AccordionPanel,
  Button
} from "@salesforce/design-system-react";

import Inputs from "../Inputs/Inputs";
// import data from "../../data/data";
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

  componentDidMount() {
    this.getRowEditFields();
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
          <div className="slds-grid slds-wrap">
            {this.props.fields.map((field, i) => (
              <div className="slds-col slds-size_1-of-2" style={{ marginTop: "10px" }}>
                <Inputs
                  // fieldid={field.fieldid}
                  // cbfield={field.label}
                  // value={field.value}
                  field={field}
                />
              </div>
            ))}
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

export default Block;
