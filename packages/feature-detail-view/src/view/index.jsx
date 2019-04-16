import React, { Component } from "react";
import {
  PageHeader,
  Accordion,
  AccordionPanel,
  Tabs,
  TabsPanel,
  DataTable,
  DataTableColumn,
  Button,
  Spinner
} from "@salesforce/design-system-react";
import { compose } from "redux";
import { connect } from "react-redux";
import Modular from "modular-redux";

import { LinkCell } from "shared-components";
import {
  getFieldsGroupedBySection,
  getSections,
  getExpandedSections,
  mapToDispatch,
  mapToState
} from "shared-utils";

import { Widget, Field } from "./components";
import {
  Container,
  SectionContainer,
  FieldContainer,
  Value,
  Label,
  Separator,
  Image,
  RelatedList,
  RelatedModule,
  PreviewContainer,
  InlineField,
  SpinnerContainer
} from "./styles";
import "./styles.css";

class DetailView extends Component {
  constructor(props) {
    super(props);

    const { moduleMeta, id } = this.props;

    this.state = {
      id: `${moduleMeta.idPrefix}x${id}`,
      expandedSections: getExpandedSections(moduleMeta.fields),
      collapseHeader: moduleMeta.headerFields.length === 0,
      previewModule: { relatedModule: "", fields: [] },
      previewTopDistance: 0,
      inlineEdit: {}
    };
  }

  async componentDidMount() {
    const { id } = this.state;
    const { actions, moduleMeta } = this.props;

    actions.doRetrieve({ id, moduleMeta });
    actions.getWidgets({ module: moduleMeta.name });
    window.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClick);
  }

  componentDidUpdate(prevProps) {
    const prevFieldUpdate = prevProps.busy.fieldUpdate;
    const { fieldUpdate } = this.props.busy;

    Object.entries(prevFieldUpdate)
      .filter(([key, value]) => value && !fieldUpdate[key])
      .forEach(([key]) => this.clearInlineEdit(key));
  }

  handleClick = ({ target }) => {
    const { actions, shown } = this.props;
    const clickedInsidePreview = this.preview.contains(target);

    if (!clickedInsidePreview && shown.relatedRecords) {
      actions.setShown("relatedRecords", false);
    }
  };

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  getHeaderFields = () => {
    const { item } = this.props;

    return item.headerData.map(({ label, value }) => ({ label, content: value }));
  };

  submitFieldValue = name => {
    const { inlineEdit } = this.state;
    const { actions, moduleMeta, item } = this.props;

    actions.updateField({
      fieldName: name,
      values: { id: item.id, [name]: inlineEdit[name] },
      moduleMeta
    });
  };

  clearInlineEdit = name => {
    const { inlineEdit } = this.state;
    delete inlineEdit[name];
    this.setState({ inlineEdit });
  };

  updateFieldValue = (name, value) => {
    const { inlineEdit } = this.state;

    this.setState({ inlineEdit: { ...inlineEdit, [name]: value } });
  };

  renderField = field => {
    const { inlineEdit } = this.state;
    const { item, busy, original } = this.props;
    const { name, label, uitype } = field;
    const value = item.data[name];

    if (inlineEdit.hasOwnProperty(name)) {
      return (
        <InlineField key={name}>
          <FieldContainer>
            <Field
              field={field}
              onChange={fieldValue => this.updateFieldValue(name, fieldValue)}
              initialValues={original}
            />
          </FieldContainer>
          {!busy.fieldUpdate[name] && (
            <>
              <Button
                style={{ backgroundColor: "#00c6b7" }}
                iconCategory="action"
                iconName="approval"
                iconVariant="border"
                variant="icon"
                inverse
                onClick={() => this.submitFieldValue(name)}
              />

              <Button
                style={{ backgroundColor: "#ef6e64" }}
                iconCategory="action"
                iconName="close"
                iconVariant="border"
                variant="icon"
                inverse
                onClick={() => this.clearInlineEdit(name)}
              />
            </>
          )}
          {busy.fieldUpdate[name] && (
            <SpinnerContainer>
              <Spinner size="small" variant="base" />
            </SpinnerContainer>
          )}
        </InlineField>
      );
    }

    if (uitype == 69 && value) {
      return (
        <div key={name}>
          <Image src={value} />
        </div>
      );
    }

    return (
      <FieldContainer
        key={name}
        onClick={() => {
          if (uitype != 4 && Object.keys(inlineEdit).length === 0) {
            this.setState({ inlineEdit: { ...inlineEdit, [name]: value } });
          }
        }}
      >
        <Label>{label}</Label>
        <Value>{value}</Value>
        <Separator />
      </FieldContainer>
    );
  };

  renderTableField = field => {
    const { previewModule } = this.state;
    const { linkfields, relatedModule } = previewModule;

    if (linkfields.indexOf(field) === -1) {
      return <DataTableColumn key={field} property={field} label={field} sortable />;
    }

    return (
      <DataTableColumn key={field} property={field} label={field} sortable>
        <LinkCell route={`/${relatedModule.toLowerCase()}`} />
      </DataTableColumn>
    );
  };

  previewRelatedModule = (e, moduleInfo) => {
    const { id } = this.state;
    const { actions, moduleMeta } = this.props;
    const relatedModule = moduleInfo.related_module;

    actions.getRelatedRecords({ id, module: moduleMeta.name, relatedModule });

    this.setState({
      previewModule: { ...moduleInfo.filterFields, relatedModule },
      previewTopDistance: e.clientY
    });
  };

  handleSort = sortColumn => {
    const { id, previewModule } = this.state;
    const { actions, moduleMeta } = this.props;
    const orderBy = `${sortColumn.property} ${sortColumn.sortDirection}`;

    actions.getRelatedRecords({
      id,
      module: moduleMeta.name,
      relatedModule: previewModule.relatedModule,
      queryParameters: { orderby: orderBy }
    });
  };

  render() {
    const {
      expandedSections,
      collapseHeader,
      previewModule,
      previewTopDistance
    } = this.state;
    const {
      item,
      moduleMeta,
      id,
      relatedRecords,
      shown,
      widgets,
      actions,
      Module
    } = this.props;
    const { fields } = moduleMeta;
    const sections = getSections(fields);
    const groupedFields = getFieldsGroupedBySection(fields);
    const relatedModules = Object.values(moduleMeta.relatedModules);

    return (
      <Container>
        {shown.modal && (
          <Module.view.modal
            id={id}
            initialValues={item}
            moduleMeta={moduleMeta}
            close={() => actions.setShown("modal", false)}
          />
        )}

        <PreviewContainer
          innerRef={preview => (this.preview = preview)}
          top={previewTopDistance}
          show={shown.relatedRecords}
        >
          <DataTable fixedLayout items={relatedRecords} onSort={this.handleSort}>
            {previewModule.fields.map(field => this.renderTableField(field))}
          </DataTable>
        </PreviewContainer>

        <PageHeader
          variant={collapseHeader ? "objectHome" : "recordHome"}
          iconCategory="standard"
          iconName="account"
          label={moduleMeta.label}
          title={item.title}
          details={this.getHeaderFields()}
          navRight={
            <>
              <Button
                label="Edit record"
                onClick={() => actions.setShown("modal")}
                iconCategory="utility"
                iconName="edit"
                iconPosition="right"
                responsive
              />
            </>
          }
        />

        <Tabs className="tabs-container">
          <TabsPanel label="Details">
            <Accordion>
              {sections.map(({ blockid, blockname }) => (
                <AccordionPanel
                  id={blockid}
                  key={blockid}
                  expanded={!!expandedSections[blockid]}
                  onTogglePanel={() => this.toggleSection(blockid)}
                  summary={blockname}
                >
                  <SectionContainer>
                    {groupedFields[blockid].map(field => this.renderField(field))}
                  </SectionContainer>
                </AccordionPanel>
              ))}
            </Accordion>

            {Object.values(widgets).map((html, index) => (
              <Widget key={index} html={html} />
            ))}
          </TabsPanel>

          <TabsPanel label="Related">
            <RelatedList>
              {relatedModules.map(item => (
                <RelatedModule
                  key={item.relationId}
                  onClick={e => this.previewRelatedModule(e, item)}
                >
                  <span>{item.label}</span>
                </RelatedModule>
              ))}
            </RelatedList>
          </TabsPanel>
        </Tabs>
      </Container>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, [
    "item",
    "relatedRecords",
    "shown",
    "widgets",
    "busy",
    "original"
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
)(DetailView);
