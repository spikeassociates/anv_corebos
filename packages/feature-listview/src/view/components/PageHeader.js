import React, { Component } from "react";
import {
  PageHeader,
  Dropdown,
  DropdownTrigger,
  Button,
  Input,
  Icon
} from "@salesforce/design-system-react";

import { HeaderActionRow, PaginationContainer, Arrows } from "../styles";

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
    const { filters, title, moduleName, showModal, isPrimary, lastPage } = this.props;
    const { page } = this.state;

    return (
      <PageHeader
        variant="objectHome"
        iconCategory="standard"
        iconName="account"
        label={moduleName}
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
                <Arrows onClick={() => this.onPageChange(1)}>
                  <Icon category="utility" name="chevronleft" size="x-small" />
                  <Icon category="utility" name="chevronleft" size="x-small" />
                </Arrows>

                <Button
                  iconCategory="utility"
                  iconName="chevronleft"
                  iconSize="small"
                  iconVariant="bare"
                  onClick={() => this.onPageChange(Math.max(page - 1, 1))}
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
                  onClick={() => this.onPageChange(Math.min(page + 1, lastPage))}
                  variant="icon"
                />

                <Arrows onClick={() => this.onPageChange(lastPage)}>
                  <Icon category="utility" name="chevronright" size="x-small" />
                  <Icon category="utility" name="chevronright" size="x-small" />
                </Arrows>
              </PaginationContainer>

              {isPrimary && (
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
              )}

              {isPrimary && (
                <Button
                  className="new-record"
                  iconCategory="utility"
                  iconName="add"
                  iconPosition="right"
                  responsive
                  label="Add Record"
                  onClick={showModal}
                />
              )}
            </HeaderActionRow>
          </>
        }
      />
    );
  }
}
