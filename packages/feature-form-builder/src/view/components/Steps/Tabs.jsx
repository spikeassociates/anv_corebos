import React from "react";
import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";
import customSprite from "@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import doctypeSprite from "@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg";

import { IconSettings, Tabs, TabsPanel } from "@salesforce/design-system-react";
import Blocks from "./Blocks/Blocks";

class TabsSteps extends React.Component {
  static displayName = "TabsExample";
  constructor(props) {
    super(props);
    this.state = {
      expandedPanels: {
        1: true
      }
    };
  }

  // addStep = () => {
  //   console.log("u futem");
  //   this.setState(prevState => ({
  //     steps: [
  //       ...prevState.steps,
  //       {
  //         stepid: 2,
  //         formid: "sf",
  //         stepname: `Step ${prevState.steps.length + 1}`,
  //         stepdesc: "New layout for Accounts",
  //         sequence: "1",
  //         backpermitted: "F",
  //         backaction: "",
  //         nextpermitted: "T",
  //         nextaction: "if accountname contains 'me' then ab else ac endif",
  //         nextsave: "F",
  //         fielddep: "",
  //         fieldmap: "",
  //         validation: ""
  //       }
  //     ]
  //   }));
  // };

  render() {
    return (
      <IconSettings
        standardSprite={standardSprite}
        utilitySprite={utilitySprite}
        actionSprite={actionSprite}
        doctypeSprite={doctypeSprite}
        customSprite={customSprite}
      >
        <Tabs id="tabs-example-default">
          {this.props.steps.map(step => (
            <TabsPanel className="slds-m-horizontal_x-large" label={step.stepname}>
              <div className="slds-grid slds-gutters">
                <div className="slds-col slds-size_3-of-3">
                  <Blocks
                    stepids={step.stepid}
                    blocks={step.blocks}
                    removeRow={this.props.removeRow}
                    addRow={this.props.addRow}
                  />
                </div>
              </div>
            </TabsPanel>
          ))}
        </Tabs>
        {/* <ActionButtons /> */}
        {/* <Button
          label="Add another step"
          onClick={this.addStep}
          variant="brand"
        /> */}
      </IconSettings>
    );
  }
}

export default TabsSteps;
