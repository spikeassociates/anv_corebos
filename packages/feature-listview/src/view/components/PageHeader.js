import React, { Component } from "react";
import {
  PageHeader,
  Dropdown,
  DropdownTrigger,
  Button,
  Input
} from "@salesforce/design-system-react";

import { HeaderActionRow, PaginationContainer } from "../styles";

export default class PageHeaderContainer extends Component {
  actions = [{ label: "Delete All", value: "delete" }];

  constructor(props) {
    super(props);

    this.state = { page: props.page };
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props;

    if (prevProps.page !== page) {
      this.setState({ page });
    }
  }

  onSelect = selected => {
    const { handleDelete, item } = this.props;

    if (selected.value === "delete") {
      handleDelete();
    }
  };

  onPageChange = page => {
    const { handlePageChange } = this.props;
    page = Math.max(1, page);
    this.setState({ page }, handlePageChange(page));
  };

  render() {
    const { filters, title, module } = this.props;
    const { page } = this.state;

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
              <PaginationContainer>
                <Button
                  iconCategory="utility"
                  iconName="chevronleft"
                  iconSize="small"
                  iconVariant="bare"
                  onClick={() => this.onPageChange(page - 1)}
                  variant="icon"
                />

                <Input
                  maxLength="3"
                  value={String(page)}
                  onChange={e => this.setState({ page: e.target.value })}
                  onBlur={() => this.onPageChange(page)}
                />

                <Button
                  iconCategory="utility"
                  iconName="chevronright"
                  iconSize="small"
                  iconVariant="bare"
                  onClick={() => this.onPageChange(page + 1)}
                  variant="icon"
                />
              </PaginationContainer>

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
