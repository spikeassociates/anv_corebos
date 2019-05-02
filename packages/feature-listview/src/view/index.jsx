import React, { Component } from "react";
import {
  DataTable,
  DataTableColumn,
  DataTableCell
} from "@salesforce/design-system-react";
import { compose } from "redux";
import { connect } from "react-redux";
import Modular from "modular-redux";

import { mapToDispatch, mapToState } from "shared-utils";
import { LinkCell, Loader } from "shared-components";

import { ActionCell, PageHeader, Preview, Cell } from "./components";
import { PreviewMenu, ListViewContainer, TableContainer } from "./styles";
import "./style.css";

ActionCell.displayName = DataTableCell.displayName;
LinkCell.displayName = DataTableCell.displayName;
Cell.displayName = DataTableCell.displayName;

class ListView extends Component {
  state = {
    selectedRows: [],
    page: 1,
    sort: {
      property: "id",
      direction: "asc"
    },
    modalInitialValues: {},
    filterData: {}
  };

  componentDidUpdate(prevState) {
    const { name } = this.props.moduleMeta;
    const prevModuleName = prevState.moduleMeta.name;

    if (name !== prevModuleName) {
      this.setState({ page: 1 }, this.loadData());
    }
  }

  async componentDidMount() {
    this.loadData();
    window.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
  }

  handleClick = e => {
    const { actions, shown } = this.props;

    if (shown.preview && !this.previewMenu.contains(e.target)) {
      actions.setShown("preview", false);
      document.body.style.overflow = "auto";
    }
  };

  loadData = () => {
    const { page, sort, filterData } = this.state;
    const { actions, moduleMeta } = this.props;

    actions.doQuery({
      moduleName: moduleMeta.name,
      pageLimit: moduleMeta.filterFields.pagesize,
      page,
      sort,
      filterData
    });
    actions.getRowsCount(moduleMeta.name);

    actions.getFilters(moduleMeta.name);
  };

  handleSelect = (e, selectedRows) => {
    this.setState({ selectedRows: selectedRows.selection });
  };

  handleSort = sortColumn => {
    const { property, sortDirection } = sortColumn;

    this.setState({ sort: { property, direction: sortDirection }, page: 1, filterData }, () =>
      this.loadData()
    );
  };

  handlePageChange = page => {
    if (page != this.state.page) {
      this.setState({ page }, () => this.loadData());
    }
  };

  previewRow = async data => {
    const { actions, moduleMeta } = this.props;

    actions.doRetrieve({ id: data.id, moduleMeta });
  };

  handleSingleDelete = id => {
    const { actions } = this.props;

    actions.doDelete(id);
  };

  handleMultiDelete = () => {
    const { actions } = this.props;
    const { selectedRows } = this.state;

    const ids = selectedRows.map(({ id }) => id).join();

    actions.doDelete(ids);
  };

  handleEdit = item => {
    const { actions } = this.props;
    this.setState({ modalInitialValues: item }, () => actions.setShown("modal"));
  };

  changeItem = change => {
    const { listviewData, preview, moduleMeta, actions } = this.props;
    let index = listviewData.findIndex(item => item.id == preview.id);
    index = Math.min(Math.max(index + change, 0), listviewData.length - 1);

    actions.doRetrieve({ id: listviewData[index].id, moduleMeta });
  };

  onRowClick = item => {
    const { selectRow } = this.props;

    selectRow && selectRow(item);
  };

  renderField = field => {
    const { moduleMeta, isPrimary } = this.props;
    const { linkfields } = moduleMeta.filterFields;

    if (linkfields.indexOf(field.key) === -1 || !isPrimary) {
      return (
        <DataTableColumn
          key={field.key}
          property={field.key}
          label={field.label}
          sortable
        >
          <Cell handleClick={this.onRowClick} />
        </DataTableColumn>
      );
    }

    return (
      <DataTableColumn key={field.key} property={field.key} label={field.label} sortable>
        <LinkCell moduleName={moduleMeta.name} />
      </DataTableColumn>
    );
  };

  showCreateModal = () => {
    const { actions } = this.props;
    this.setState({ modalInitialValues: {} }, () => actions.setShown("modal"));
  };

  handleFilterChange = filterData => {
    if (filterData != this.state.filterData) {
      this.setState({ filterData, page:1 }, () => this.loadData());
    }
  };

  render() {
    const { selectedRows, page, modalInitialValues } = this.state;
    const {
      listviewData,
      busy,
      shown,
      moduleMeta,
      preview,
      actions,
      isPrimary,
      Module,
      totalRowsCount,
      filters,
      filterData
    } = this.props;
    const { id } = modalInitialValues;

    return (
      <ListViewContainer hasData={!!listviewData.length}>
        {isPrimary && shown.modal && (
          <Module.view.modal
            id={id ? id.split("x")[1] : id}
            moduleMeta={moduleMeta}
            close={() => actions.setShown("modal", false)}
          />
        )}

        <PageHeader
          isPrimary={isPrimary}
          page={page}
          moduleName={moduleMeta.label}
          filterData={filterData}
          filters={filters}
          title={`All ${moduleMeta.label}`}
          handleDelete={this.handleMultiDelete}
          handlePageChange={this.handlePageChange}
          handleFilterChange={this.handleFilterChange}
          showModal={this.showCreateModal}
          lastPage={Math.ceil(totalRowsCount / moduleMeta.filterFields.pagesize)}
        />

        <TableContainer>
          <DataTable
            selectRows={isPrimary}
            fixedLayout
            items={busy.listview ? [] : listviewData}
            selection={selectedRows}
            onRowChange={this.handleSelect}
            onSort={this.handleSort}
          >
            {isPrimary && (
              <DataTableColumn key="actions" property="actions" width="40px">
                <ActionCell
                  handleDelete={this.handleSingleDelete}
                  handlePreview={this.previewRow}
                  handleEdit={this.handleEdit}
                />
              </DataTableColumn>
            )}

            {moduleMeta.filterFields.fields.map(field => this.renderField(field))}
          </DataTable>
        </TableContainer>

        {busy.listview && <Loader />}

        {isPrimary && (
          <PreviewMenu
            isOpen={shown.preview}
            innerRef={menu => (this.previewMenu = menu)}
          >
            <Preview
              moduleName={moduleMeta.name}
              previewData={preview}
              changeItem={this.changeItem}
            />
          </PreviewMenu>
        )}
      </ListViewContainer>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, [
    "busy",
    "shown",
    "listviewData",
    "preview",
    "totalRowsCount",
    "filters"
  ]);

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ListView);
