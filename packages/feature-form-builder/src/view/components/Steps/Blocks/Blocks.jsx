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
import Block from "./Block";

class Blocks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedPanels: {}
    };
    const blockid = this.props.blockid;
  }

  togglePanel(data) {
    this.setState(state => ({
      ...state,
      expandedPanels: {
        ...state.expandedPanels,
        [data.id]: !state.expandedPanels[data.id]
      }
    }));
  }

  render() {
    return (
      <IconSettings
        standardSprite={standardSprite}
        utilitySprite={utilitySprite}
        actionSprite={actionSprite}
        doctypeSprite={doctypeSprite}
        customSprite={customSprite}
      >
        <Accordion id="base-example-accordion">
          {this.props.blocks.map(block => (
            <AccordionPanel
              expanded={!this.state.expandedPanels[block.id]}
              id={block.id}
              key={block.id}
              onTogglePanel={() => this.togglePanel(block)}
              summary={block.label}
            >
              <Block
                blockid={block.blockid}
                blocktype={block.blocktype}
                fields={block.fields}
                stepids={this.props.stepids}
                removeRow={this.props.removeRow}
                addRow={this.props.addRow}
              />
            </AccordionPanel>
          ))}
        </Accordion>
      </IconSettings>
    );
  }
}

export default Blocks;
