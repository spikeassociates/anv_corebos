import React, { Component } from "react";
import {
  PageHeader,
  Dropdown,
  DropdownTrigger,
  Button
} from "@salesforce/design-system-react";

import { HeaderActionRow } from "../styles";

export default class PageHeaderContainer extends Component {
  actions = [{ label: "Delete All", value: "delete" }];

  onSelect = selected => {
    const { handleDelete, item } = this.props;

    if (selected.value === "delete") {
      handleDelete();
    }
  };

  render() {
    const { filters, title, module } = this.props;

    return (
      <PageHeader
        variant="objectHome"
        iconCategory="standard"
        iconName="account"
        label={module}
        title={
          <h1 className="slds-page-header__title">
            <Dropdown value="all" options={filters}>
              <DropdownTrigger>
                <Button
                  className="slds-button--reset"
                  iconCategory="utility"
                  iconName="down"
                  iconPosition="right"
                  responsive
                  variant="base"
                  label={title}
                />
              </DropdownTrigger>
            </Dropdown>
          </h1>
        }
        navRight={
          <>
            <HeaderActionRow>
              <Dropdown options={this.actions} onSelect={this.onSelect}>
                <DropdownTrigger>
                  <Button
                    className="action-button"
                    iconCategory="utility"
                    iconName="down"
                    iconPosition="right"
                    responsive
                    label="Actions"
                  />
                </DropdownTrigger>
              </Dropdown>

              <Button
                className="new-record"
                iconCategory="utility"
                iconName="add"
                iconPosition="right"
                responsive
                label="Add Record"
              />
            </HeaderActionRow>
          </>
        }
      />
    );
  }
}
