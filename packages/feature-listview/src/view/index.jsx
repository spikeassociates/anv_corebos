import React, { Component } from "react";
import {
  DataTable,
  DataTableColumn,
  DataTableCell
} from "@salesforce/design-system-react";

import { cbClient, phpSerialize, phpUnserialize } from "shared-utils";
import { LinkCell, ModalForm } from "shared-components";

import { ActionCell, PageHeader, Loader, Preview, Cell } from "./components";
import { PreviewMenu, ListViewContainer, TableContainer } from "./styles";
import "./style.css";

ActionCell.displayName = DataTableCell.displayName;
LinkCell.displayName = DataTableCell.displayName;
Cell.displayName = DataTableCell.displayName;

class ListView extends Component {
  defaultData = {
    data: [],
    moduleInfo: {
      fields: {}
    },
    fields: [],
    linkfields: [],
    selectedRows: [],
    pageLimit: 0,
    page: 1,
    sort: {
      property: "id",
      direction: "asc"
    },
    loading: false,
    isMenuOpen: false,
    previewData: {
      data: {},
      title: "",
      headerData: [],
      bodyData: [],
      index: ""
    },
    showModal: false
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.defaultData,
      module: props.moduleName
    };
  }

  componentDidUpdate(prevState) {
    const { moduleName } = this.props;
    const prevModuleName = prevState.moduleName;

    if (moduleName && prevModuleName && moduleName !== prevModuleName) {
      this.setState({ module: moduleName }, () => this.loadModuleData());
    }
  }

  async componentDidMount() {
    window.addEventListener("click", this.handleClick);

    const client = await cbClient();
    this.setState({ client }, () => this.loadModuleData());
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
  }

  handleClick = e => {
    const { isMenuOpen } = this.state;

    if (isMenuOpen && !this.previewMenu.contains(e.target)) {
      this.setState({ isMenuOpen: false });
      document.body.style.overflow = "auto";
    }
  };

  loadModuleData = async () => {
    const { client, module } = this.state;

    const pageLimit = await client.doInvoke(
      "SearchGlobalVar",
      {
        gvname: "Application_ListView_PageSize",
        gvmodule: module
      },
      "get"
    );

    this.setState({ ...this.defaultData, pageLimit }, () => this.loadData());
  };

  loadData = () => {
    this.setState({ loading: true });

    const { pageLimit, module, client, sort } = this.state;
    const { property, direction } = sort;
    const page = this.state.page - 1;
    let { fields, linkfields, moduleInfo } = this.state;
    const offset = page * pageLimit;

    const requests = [
      client.doQuery(
        `select * from ${module} order by ${property} ${direction} limit ${offset}, ${pageLimit}`
      )
    ];

    if (!fields.length) {
      requests.push(client.doInvoke("getfilterfields", { module }));
      requests.push(client.doDescribe(module));
    }

    Promise.all(requests).then(res => {
      const reqData = res[0].map(row => ({ ...row, actions: "" }));

      if (!fields.length) {
        linkfields = res[1].linkfields;
        moduleInfo = {
          fields: res[2].fields.reduce((acc, field) => {
            return { ...acc, [field.name]: field };
          }, {})
        };
        fields = res[1].fields.map(field => ({
          key: field,
          label: moduleInfo.fields[field].label
        }));
      }

      this.setState({
        data: reqData,
        fields,
        linkfields,
        moduleInfo,
        loading: false
      });
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
      this.setState({ page, data: [] }, () => this.loadData());
    }
  };

  deleteRow = id => {
    const { data, client } = this.state;

    return new Promise((resolve, reject) => {
      client
        .doDelete(id)
        .then(res => {
          if (res.status === "successful") {
            resolve(data.findIndex(row => row.id === id));
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  };

  formatValue = (field, data, referenceValues) => {
    const { moduleInfo } = this.state;
    const type = moduleInfo.fields[field].type.name;
    const isReference = type === "reference" || type === "owner";

    if (isReference && data[field]) {
      const id = data[field];
      return referenceValues[id].reference;
    } else if (type === "boolean" && data[field] !== "") {
      return data[field] == 0 ? "No" : "Yes";
    }

    return data[field];
  };

  previewRow = async (data, index) => {
    const { linkfields, fields, moduleInfo, client, module } = this.state;

    let meta = await client.doQuery(
      `select contentjson from cbMap where mapname='${module}_ListColumns'`
    );

    meta = JSON.parse(meta[0].contentjson);

    const headerFields = meta.summary.header.fields.field.map(field => field.name);
    const bodyFields = meta.summary.body.fields.field.map(field => field.name);
    const avaiableFields = Object.values(moduleInfo.fields).filter(field => {
      const isHeader = headerFields.some(hField => hField === field.name);
      const isBody = bodyFields.some(bField => bField === field.name);

      return isHeader || isBody;
    });

    const referenceFields = avaiableFields
      .filter(field => {
        const type = field.type.name;
        const hasValue = data[field.name];
        const isReference = type === "reference" || type === "owner";

        return isReference && hasValue;
      })
      .map(field => data[field.name]);
    const hasImage = avaiableFields.some(field => field.uitype == 69 && data[field.name]);

    let requests = [];
    let images = [];
    let referenceValues = [];

    if (hasImage) {
      requests.push(client.doInvoke("getRecordImages", { id: data.id }, "get"));
    }

    if (referenceFields.length) {
      requests.push(
        client.doInvoke(
          "getReferenceValue",
          {
            id: phpSerialize(referenceFields)
          },
          "post"
        )
      );
    }
    const response = await Promise.all(requests);

    if (referenceFields.length) {
      referenceValues = phpUnserialize(response[0]);
    }

    images = response[1] || {};

    const previewData = {
      data,
      index,
      title: linkfields.map(field => data[field]).join(" "),
      headerData: headerFields.map(field => ({
        label: moduleInfo.fields[field].label,
        value: this.formatValue(field, data, referenceValues)
      })),
      bodyData: bodyFields.map(field => ({
        ...moduleInfo.fields[field],
        images,
        label: moduleInfo.fields[field].label,
        value: this.formatValue(field, data, referenceValues)
      }))
    };

    document.body.style.overflow = "hidden";
    this.setState({ isMenuOpen: true, previewData });
  };

  handleSingleDelete = id => {
    const { data } = this.state;

    this.deleteRow(id).then(res => {
      this.setState({ data: data.filter(row => row.id !== id) });
    });
  };

  handleMultiDelete = () => {
    const { selectedRows, data } = this.state;

    Promise.all(selectedRows.map(row => this.deleteRow(row.id))).then(res => {
      this.setState({ data: data.filter((row, index) => !res.includes(index)) });
    });
  };

  changeItem = change => {
    const { data, previewData } = this.state;
    let index = previewData.index + change;
    index = Math.min(Math.max(index, 0), data.length - 1);
    this.previewRow(data[index], index);
  };

  onRowClick = item => {
    const { selectRow } = this.props;

    selectRow && selectRow(item);
  };

  renderField = field => {
    const { linkfields } = this.state;
    const { match } = this.props;

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
    const {
      module,
      data = [],
      fields,
      selectedRows,
      isMenuOpen,
      previewData,
      page,
      loading,
      showModal,
      moduleInfo
    } = this.state;
    const { match } = this.props;

    return (
      <ListViewContainer hasData={!!data.length}>
        {false && <ModalForm meta={Object.values(moduleInfo.fields)} module={module} />}

        <PageHeader
          page={page}
          module={module}
          filters={[{ label: `All ${module}`, value: "all" }]}
          title={`All ${module}`}
          handleDelete={this.handleMultiDelete}
          handlePageChange={this.handlePageChange}
        />

        <TableContainer>
          <DataTable
            selectRows
            fixedLayout
            items={data}
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

            {fields.map(field => this.renderField(field))}
          </DataTable>
        </TableContainer>

        {loading && <Loader />}

        <PreviewMenu isOpen={isMenuOpen} innerRef={menu => (this.previewMenu = menu)}>
          <Preview
            itemUrl={`${match.url}/${previewData.data.id}`}
            previewData={previewData}
            changeItem={this.changeItem}
          />
        </PreviewMenu>
      </ListViewContainer>
    );
  }
}

export default ListView;
