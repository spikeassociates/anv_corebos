import React, { Component } from "react";
import { Input } from "@salesforce/design-system-react";
class Inputs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="slds-col slds-size_4-of-6">
        <label htmlFor={this.props.fieldid}>{this.props.cbfield}</label>
        <Input id={this.props.fieldid} required placeholder="" value={this.props.value} />
      </div>
    );
  }
}

export default Inputs;
