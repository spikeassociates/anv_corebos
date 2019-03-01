import React, { Component } from "react";
import {
  PageHeader,
  Accordion,
  AccordionPanel,
  Tabs,
  TabsPanel,
  DataTable,
  DataTableColumn,
  Button
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
import { changeRoute } from "utils";

import { Widget } from "./components";
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
  PreviewContainer
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
      previewTopDistance: 0
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

  handleClick = e => {
    const { actions, shown } = this.props;
    const clickedInsidePreview = this.preview.contains(e.target);

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

  renderField = field => {
    const { item } = this.props;
    const { name, label, uitype } = field;
    const value = item.data[name];

    if (uitype == 69 && value) {
      return (
        <div key={name}>
          <Image src={value} />
        </div>
      );
    }

    return (
      <FieldContainer key={name}>
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
    const { item, moduleMeta, id, relatedRecords, shown, widgets } = this.props;
    const { fields } = moduleMeta;
    const sections = getSections(fields);
    const groupedFields = getFieldsGroupedBySection(fields);
    const relatedModules = Object.values(moduleMeta.relatedModules);

    return (
      <Container>
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
                onClick={() =>
                  changeRoute({ view: "edit", id, moduleName: moduleMeta.name })
                }
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
  mapToState(state, Module.selectors, ["item", "relatedRecords", "shown", "widgets"]);

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
