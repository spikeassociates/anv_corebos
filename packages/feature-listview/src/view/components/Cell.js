import React, { Component } from "react";
import { DataTableCell } from "@salesforce/design-system-react";

export default class Cell extends Component {
  render() {
    const { children, handleClick, ...props } = this.props;

    return (
      <DataTableCell>
        <div onClick={() => handleClick(props.item)}>{children}</div>
      </DataTableCell>
    );
  }
}
