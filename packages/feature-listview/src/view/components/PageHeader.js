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

    this.state = { page: props.page, currentFilter:props.currentFilter };
  }

  componentDidUpdate(prevProps) {
    const { page, currentFilter } = this.props;

    if (prevProps.page !== page) {
      this.setState({ page });
    }

    if (prevProps.currentFilter !== currentFilter) {
      this.setState({ currentFilter });
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

  onFilterChange = selected => {
    const { handleFilterChange } = this.props;
    this.setState({ currentFilter:selected }, handleFilterChange(selected));
  }

  render() {
    const { filters, title, moduleName, showModal, isPrimary, lastPage } = this.props;
    const { page, currentFilter } = this.state;
    const filterLabel = currentFilter ? currentFilter.label : null;

    return (
      <PageHeader
        variant="objectHome"
        iconCategory="standard"
        iconName="account"
        label={moduleName}
        title={
          <h1 className="slds-page-header__title">
            <Dropdown value="all"
              options={filters}
              onSelect={this.onFilterChange}
              >
              <DropdownTrigger>
                <Button
                  className="slds-button--reset"
                  iconCategory="utility"
                  iconName="down"
                  iconPosition="right"
                  responsive
                  variant="base"
                  label={filterLabel || title}
                />
              </DropdownTrigger>
            </Dropdown>
          </h1>
        }
        navRight={
          <>
            <HeaderActionRow>
              <PaginationContainer
                className={ (lastPage && lastPage == 1) ? 'slds-hide' : ''} >
                <Arrows
                  onClick={() => this.onPageChange(1)}
                  className={ (page <= 2 || !page) ? 'slds-hide' : ''} >
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
                  disabled={ (page <= 1 || !page) ? true : false}
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
                  disabled={ (page >= lastPage || !lastPage) ? true : false}
                />

                <Arrows
                  onClick={() => this.onPageChange(lastPage)}
                  className={ (page >= lastPage || !lastPage) ? 'slds-hide' : ''} >
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
