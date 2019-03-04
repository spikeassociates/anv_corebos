import React, { Component } from "react";
import { Input, IconSettings, Button } from "@salesforce/design-system-react";
import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";
import customSprite from "@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import doctypeSprite from "@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg";

class RowEdit extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {};
  }

  addRow = () => {
    alert("hey");
  };

  render() {
    return (
      <IconSettings
        standardSprite={standardSprite}
        utilitySprite={utilitySprite}
        actionSprite={actionSprite}
        doctypeSprite={doctypeSprite}
        customSprite={customSprite}
      >
        <div className="slds-grid slds-gutters">
          <div className="slds-col slds-size_3-of-6">
            <label htmlFor={this.props.fieldid}>{this.props.cbfield}</label>
            <Input
              id={this.props.fieldid}
              required
              placeholder=""
              value={this.props.value}
            />
          </div>
          <div className="slds-col slds-size_1-of-6" style={{ marginTop: "20px" }}>
            <Button
              assistiveText={{ icon: "Icon Border-filled medium" }}
              iconCategory="utility"
              iconName="delete"
              iconVariant="border-filled"
              variant="icon"
              onClick={() =>
                this.props.removeRow(
                  this.props.stepids,
                  this.props.blockid,
                  this.props.fieldid
                )
              }
            />
            <Button
              assistiveText={{ icon: "Icon Border-filled medium" }}
              iconCategory="utility"
              iconName="add"
              iconVariant="border-filled"
              variant="icon"
            />
          </div>
        </div>
      </IconSettings>
    );
  }
}

export default RowEdit;
