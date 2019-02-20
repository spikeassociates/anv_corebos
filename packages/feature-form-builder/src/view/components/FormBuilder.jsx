import React, { Component } from "react";

import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";
import customSprite from "@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import doctypeSprite from "@salesforce-ux/design-system/assets/icons/doctype-sprite/svg/symbols.svg";
// import FormInfo from "./FormInfo";
import Tabs from "./Steps/Tabs";
import { IconSettings, Accordion, AccordionPanel } from "@salesforce/design-system-react";
import data from "../../data";
import update from "immutability-helper";
const id = 1;

class GeneralForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedPanels: {
        1: true
      },
      items: [
        {
          id: "1",
          summary: "General Form"
        },
        {
          id: "2",
          summary: "Steps"
        }
      ],
      FormData: data
    };
  }

  togglePanel(event, data) {
    this.setState(state => ({
      ...state,
      expandedPanels: {
        ...state.expandedPanels,
        [data.id]: !state.expandedPanels[data.id]
      }
    }));
  }

  changeStep(id) {
    console.log("lslsls   " + id);
  }

  addRow = (stepid, blockid, fields2) => {
    const fields3 = fields2;
    const indexToRemove = this.state.FormData.steps[stepid].blocks[blockid].fields.length;

    let newState = update(this.state, {
      FormData: {
        steps: {
          [stepid]: {
            blocks: {
              [blockid]: {
                fields: {
                  $push: fields3
                }
              }
            }
          }
        }
      }
    });
    this.setState(newState);
    // this.setState({
    //   fields: this.state.FormData.steps[].blocks[].fields[].filter(
    //     (s, sidx) => idx !== sidx
    //   )
    // });
  };

  //Delete rows at RowEdit
  removeRow = (stepid, blockid, fieldid) => {
    //find index of each row
    const indexToRemove = this.state.FormData.steps[stepid].blocks[
      blockid
    ].fields.findIndex(field => field.fieldid === fieldid);

    let newState = update(this.state, {
      FormData: {
        steps: {
          [stepid]: {
            blocks: {
              [blockid]: {
                fields: {
                  $splice: [[indexToRemove, 1]]
                }
              }
            }
          }
        }
      }
    });
    this.setState(newState);
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
        <div className="slds-text-heading_large slds-m-bottom_xx-large">
          Form Builder for coreBOS.
        </div>

        {this.state.items.map((item, i) => (
          <Accordion id={i} className="slds-card">
            <ul className="slds-accordion">
              <AccordionPanel
                expanded={!this.state.expandedPanels[item.id]}
                id={item.id}
                key={item.id}
                onTogglePanel={event => this.togglePanel(event, item)}
                summary={item.summary}
              >
                <div className="slds-p-horizontal_xx-large" />
                {item.id == 1 ? (
                  <div>
                    {/* <FormInfo testProps={this.changeStep} itemId={item.id} /> */}
                  </div>
                ) : (
                  <div>
                    <Tabs
                      steps={this.state.FormData.steps}
                      removeRow={this.removeRow}
                      addRow={this.addRow}
                    />
                  </div>
                )}
              </AccordionPanel>
            </ul>
          </Accordion>
        ))}
      </IconSettings>
    );
  }
}

GeneralForm.displayName = "AccordionExample";

export default GeneralForm;
