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
import { LinkCell, ModalForm } from "shared-components";

import { ActionCell, PageHeader, Loader, Preview, Cell } from "./components";
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
    }
  };

  componentDidUpdate(prevState) {
    const { name } = this.props.moduleMeta;
    const prevModuleName = prevState.moduleMeta.name;

    if (name !== prevModuleName) {
      this.loadData();
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
    const { page, sort } = this.state;
    const { actions, moduleMeta } = this.props;

    actions.doQuery({
      moduleName: moduleMeta.name,
      pageLimit: moduleMeta.filterFields.pagesize,
      page,
      sort
    });
  };

  handleSelect = (e, selectedRows) => {
    this.setState({ selectedRows: selectedRows.selection });
  };

  handleSort = sortColumn => {
    const { property, sortDirection } = sortColumn;

    this.setState({ sort: { property, direction: sortDirection }, page: 1 }, () =>
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
    const { selectedRows } = this.state;

    selectedRows.forEach(row => this.handleSingleDelete(row.id));
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
    const { match, moduleMeta } = this.props;
    const { linkfields } = moduleMeta.filterFields;

    if (linkfields.indexOf(field.key) === -1) {
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
        <LinkCell route={match.path} />
      </DataTableColumn>
    );
  };

  render() {
    const { selectedRows, page } = this.state;
    const { match, listviewData, busy, shown, moduleMeta, preview, actions } = this.props;

    return (
      <ListViewContainer hasData={!!listviewData.length}>
        <ModalForm
          isOpen={shown.modal}
          moduleMeta={moduleMeta}
          close={() => actions.setShown("modal", false)}
        />

        <PageHeader
          page={page}
          moduleName={moduleMeta.label}
          filters={[{ label: `All ${moduleMeta.label}`, value: "all" }]}
          title={`All ${moduleMeta.label}`}
          handleDelete={this.handleMultiDelete}
          handlePageChange={this.handlePageChange}
          showModal={() => actions.setShown("modal")}
        />

        <TableContainer>
          <DataTable
            selectRows
            fixedLayout
            items={busy.listview ? [] : listviewData}
            selection={selectedRows}
            onRowChange={this.handleSelect}
            onSort={this.handleSort}
          >
            <DataTableColumn key="actions" property="actions" width="200px">
              <ActionCell
                handleDelete={this.handleSingleDelete}
                handlePreview={this.previewRow}
              />
            </DataTableColumn>

            {moduleMeta.filterFields.fields.map(field => this.renderField(field))}
          </DataTable>
        </TableContainer>

        {busy.listview && <Loader />}

        <PreviewMenu isOpen={shown.preview} innerRef={menu => (this.previewMenu = menu)}>
          <Preview
            itemUrl={`${match.url}/${preview.id}`}
            previewData={preview}
            changeItem={this.changeItem}
          />
        </PreviewMenu>
      </ListViewContainer>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, ["busy", "shown", "listviewData", "preview"]);

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
