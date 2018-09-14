import React, { Component } from "react";
import { DataTableCell, Dropdown } from "@salesforce/design-system-react";

export default class ActionsCell extends Component {
  onSelect = selected => {
    const { handleDelete, handlePreview, item, items } = this.props;

    if (selected.value === "delete") {
      handleDelete(item.id);
    } else if (selected.value === "preview") {
      const index = items.findIndex(row => row === item);

      handlePreview(item, index);
    }
  };

  render() {
    const { children, rest } = this.props;

    return (
      <DataTableCell {...rest}>
        <Dropdown
          buttonClassName="lv-action-button"
          iconCategory="utility"
          iconName="custom_apps"
          iconSize="small"
          options={[
            { label: "Edit", value: "edit" },
            { label: "Preview", value: "preview" },
            { label: "Delete", value: "delete" }
          ]}
          onSelect={this.onSelect}
        />
      </DataTableCell>
    );
  }
}
