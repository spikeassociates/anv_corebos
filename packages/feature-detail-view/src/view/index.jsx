import React, { Component } from "react";
import {
  PageHeader,
  Accordion,
  AccordionPanel,
  Tabs,
  TabsPanel
} from "@salesforce/design-system-react";

import { cbClient, phpSerialize, phpUnserialize } from "shared-utils";
import {
  Container,
  SectionContainer,
  FieldContainer,
  Value,
  Label,
  Separator,
  Image
} from "./styles";
import "./styles.css";

class Module extends Component {
  constructor(props) {
    super(props);

    const { moduleName, match } = this.props;

    this.state = {
      id: match.params.id,
      data: {},
      module: moduleName,
      meta: {},
      groupedFields: {},
      sections: [],
      headerMeta: {},
      expandedSections: {},
      collapseHeader: false
    };
  }

  async componentDidMount() {
    const client = await cbClient();
    this.setState({ client }, () => this.loadData());
  }

  loadData = () => {
    const { client, module, id } = this.state;

    const requests = [
      client.doRetrieve(id),
      client.doQuery(
        `select contentjson from cbMap where mapname='${module}_ListColumns'`
      ),
      client.doDescribe(module)
    ];

    Promise.all(requests).then(async res => {
      let [data, headerMeta, meta] = res;

      if (headerMeta.length) {
        headerMeta = JSON.parse(headerMeta[0].contentjson);
      }

      meta = this.transformMeta(meta);
      data = await this.transformData(data, meta);

      this.setState({ headerMeta, data, ...meta });
    });
  };

  transformData = async (data, meta) => {
    const { client } = this.state;
    const transformedData = { ...data };

    const hasImage = Object.values(meta.meta.fields).some(
      field => field.uitype == 69 && data[field.name]
    );

    const referenceFields = meta.meta.fields.reduce((acc, field) => {
      const value = data[field.name];
      const type = field.type.name;
      const isReference = type === "reference" || type === "owner";

      return isReference && value ? { ...acc, [value]: field.name } : acc;
    }, {});

    let requests = [
      client.doInvoke(
        "getReferenceValue",
        { id: phpSerialize(Object.keys(referenceFields)) },
        "post"
      )
    ];

    if (hasImage) {
      requests.push(client.doInvoke("getRecordImages", { id: data.id }, "get"));
    }

    const response = await Promise.all(requests);
    const referenceValues = phpUnserialize(response[0]);
    const images = response[1] || {};

    Object.keys(referenceFields).forEach(field => {
      const fieldName = referenceFields[field];
      const fieldValue = referenceValues[field].reference;
      transformedData[fieldName] = fieldValue;
    });

    transformedData.images = images.images || [];

    meta.meta.fields
      .filter(field => field.type.name === "boolean")
      .map(field => field.name)
      .forEach(name => {
        transformedData[name] = transformedData[name] == 0 ? "No" : "Yes";
      });

    return transformedData;
  };

  transformMeta = meta => {
    let { fields, ...rest } = meta;
    fields = fields.filter(
      ({ displaytype }) => ["1", "2", "4"].indexOf(displaytype) !== -1
    );

    const groupedFields = fields.filter(field => field.block).reduce((acc, field) => {
      const blockId = field.block.blockid;
      const blockFields = acc[blockId] || [];
      return { ...acc, [blockId]: [...blockFields, field] };
    }, {});

    const sections = Object.values(groupedFields)
      .map(items => items[0].block)
      .sort((a, b) => (a.blocksequence > b.blocksequence ? 1 : -1));

    const expandedSections = Object.keys(groupedFields).reduce(
      (acc, id) => ({
        ...acc,
        [id]: true
      }),
      {}
    );

    return { meta: { fields, ...rest }, sections, groupedFields, expandedSections };
  };

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  getTitle = () => {
    const { headerMeta, data } = this.state;

    if (headerMeta.summary) {
      return headerMeta.summary.title
        .split(",")
        .map(field => data[field])
        .join(" ");
    }

    return "";
  };

  getHeaderFields = () => {
    const { headerMeta, data } = this.state;

    if (headerMeta.summary) {
      const headerFields = headerMeta.summary.header.fields.field.map(field => {
        return { ...field, content: data[field.name] };
      });

      return headerFields;
    }

    return [];
  };

  renderField = field => {
    const { data } = this.state;
    const { name, label, uitype } = field;

    if (uitype == 69) {
      return (
        <div key={name}>
          {data.images.map(image => (
            <Image src={image.fullpath} key={image.id} />
          ))}
        </div>
      );
    }

    return (
      <FieldContainer key={name}>
        <Label>{label}</Label>
        <Value>{data[name]}</Value>
        <Separator />
      </FieldContainer>
    );
  };

  render() {
    const {
      meta,
      expandedSections,
      groupedFields,
      sections,
      collapseHeader
    } = this.state;

    return (
      <Container>
        <PageHeader
          variant={collapseHeader ? "objectHome" : "recordHome"}
          iconCategory="standard"
          iconName="account"
          label={meta.label}
          title={this.getTitle()}
          details={this.getHeaderFields()}
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
          </TabsPanel>
          <TabsPanel label="Related">Related</TabsPanel>
        </Tabs>
      </Container>
    );
  }
}

export default Module;
