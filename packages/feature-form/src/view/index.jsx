import React, { Component } from "react";
import { Accordion, AccordionPanel } from "@salesforce/design-system-react";
import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";

import { Loader } from "shared-components";
import { Form, Field } from "shared-form";
import {
  Input,
  Dropdown,
  Datepicker,
  Checkbox,
  Textarea,
  InputModal,
  MultiSelect,
  RadioDropdown,
  FilePicker
} from "shared-form-helper";
import {
  normalize,
  getExpandedSections,
  getSections,
  getFieldsGroupedBySection,
  mapToDispatch,
  mapToState
} from "shared-utils";

import { FormRowContainer, Overlay } from "./styles";

class FormModal extends Component {
  constructor(props) {
    super(props);

    const { moduleMeta, id, actions } = props;
    const fields = Object.values(moduleMeta.fields).filter(
      ({ displaytype }) => ["1"].indexOf(displaytype) !== -1
    );

    this.state = {
      sections: getSections(fields),
      groupedFields: getFieldsGroupedBySection(fields),
      expandedSections: getExpandedSections(fields),
      hidden: [],
      readOnly: [],
      showOptions: {},
      hideOptions: {}
    };

    actions.setData("currentModule", moduleMeta.name);
    if (id) {
      actions.doRetrieve({ id: `${moduleMeta.idPrefix}x${id}`, moduleMeta });
    } else {
      actions.setShown("form");
    }
  }

  componentDidMount() {
    const { actions, moduleMeta } = this.props;

    actions.getFieldDependencies(moduleMeta.name);
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.setShown("form", false);
    actions.setData("initial", {});
  }

  componentDidUpdate = prevProps => {
    const prevInitial = prevProps.initialValues || {};
    const { initialValues = {}, onFormChange, fieldDependencies } = this.props;

    if (!prevProps.fieldDependencies && fieldDependencies) {
      Object.values(fieldDependencies).map(dependencies => {
        dependencies.forEach(async dependency => {
          const { actions, conditions } = dependency;

          const isValid = this.evaluateConditions(conditions);

          for (let key in actions) {
            await this.excecuteAction(isValid, [key, actions[key]]);
          }
        });
      });
    }

    if (Object.keys(prevInitial).length !== Object.keys(initialValues).length) {
      onFormChange(initialValues);
    }
  };

  normalizeField(uitype) {
    if (uitype === 7) {
      return normalize.number;
    }
  }

  toggleSection = blockId => {
    const expandedSections = { ...this.state.expandedSections };
    expandedSections[blockId] = !expandedSections[blockId];

    this.setState({ expandedSections });
  };

  renderField = field => {
    const { hidden, readOnly, showOptions, hideOptions } = this.state;
    const { initialValues, fieldDependencies = {}, onFormChange, errors } = this.props;

    const uitype = parseInt(field.uitype); //need to add suppord for 1026, 70, 111
    const isTextField = [1, 2, 4, 7, 9, 11, 13, 14, 17, 55, 71, 72, 85, 255].includes(
      uitype
    );
    const isTextArea = [19, 21, 22, 24].includes(uitype);
    const isPicklist = [15, 16, 26, 77, 117].includes(uitype);
    const isReference = [10, 51, 57, 73, 76, 78, 80, 101].includes(uitype);
    const isDate = [5, 23].includes(uitype);

    let fieldOptions = {
      key: field.name,
      name: field.name,
      label: field.label,
      uitype: field.uitype,
      render: () => null,
      normalize: this.normalizeField(uitype),
      error: errors[field.name] ? errors[field.name][0] : undefined
      //error: `${field.name.toUpperCase()} - errors will appear here.`
    };

    if (isTextField) {
      fieldOptions = { ...fieldOptions, readOnly: uitype === 4, render: Input };
    } else if (isPicklist) {
      let options = field.type.picklistValues;
      const activeOptions = showOptions[field.name];
      const inactiveOptions = hideOptions[field.name];

      if (activeOptions) {
        options = options.filter(({ value }) => activeOptions.includes(value));
      }

      if (inactiveOptions) {
        options = options.filter(({ value }) => !inactiveOptions.includes(value));
      }

      fieldOptions = {
        ...fieldOptions,
        options,
        render: Dropdown
      };
    } else if (isTextArea) {
      fieldOptions = { ...fieldOptions, render: Textarea };
    } else if (isReference) {
      const fieldRef = initialValues[`${field.name}ename`];
      fieldOptions = {
        ...fieldOptions,
        refersTo: field.type.refersTo,
        render: InputModal,
        valueLabel: fieldRef ? fieldRef.reference : ""
      };
    } else if (isDate) {
      fieldOptions = { ...fieldOptions, defaultValue: field.default, render: Datepicker };
    } else if (uitype === 27) {
      fieldOptions = {
        ...fieldOptions,
        options: [{ value: "I", label: "Internal" }, { value: "E", label: "External" }],
        render: Dropdown,
        onChange: () => {
          this.formApi.setField("filename");
        }
      };
    } else if (uitype === 28) {
      fieldOptions = {
        ...fieldOptions,
        render: props => {
          const { Form } = props;
          const fileLocation = Form.getField("filelocationtype");

          return fileLocation === "I" ? <FilePicker {...props} /> : <Input {...props} />;
        }
      };
    } else if (uitype === 33) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.picklistValues,
        render: MultiSelect
      };
    } else if (uitype === 53) {
      fieldOptions = {
        ...fieldOptions,
        options: field.type.assignto,
        render: RadioDropdown
      };
    } else if (uitype === 56) {
      fieldOptions = { ...fieldOptions, render: Checkbox };
    } else if (uitype === 69) {
      const imageInfo = initialValues[`${field.name}imageinfo`];
      fieldOptions = {
        ...fieldOptions,
        fieldName: field.name,
        name: "attachments",
        imageInfo,
        render: FilePicker
      };
    } else {
      fieldOptions = { ...fieldOptions, render: () => <span><b>uitype:</b> {uitype}</span> };
    }

    if (hidden.includes(field.name)) {
      fieldOptions.render = () => null;
    }

    if (readOnly.includes(field.name)) {
      fieldOptions.readOnly = true;
      fieldOptions.render = Input;
    }

    const dependencies = fieldDependencies[field.name];

    if (dependencies) {
      fieldOptions.onChange = () => {
        dependencies.forEach(dependency => {
          const { actions, conditions } = dependency;

          const isValid = this.evaluateConditions(conditions);
          Object.entries(actions).forEach(action => this.excecuteAction(isValid, action));
        });
      };
    }

    const onChangeEvent = value => {
      onFormChange(this.formApi.values());

      if (!!fieldOptions.onChange) {
        fieldOptions.onChange(value);
      }
    };

    return <Field {...fieldOptions} onChange={onChangeEvent} />;
  };

  excecuteAction = (isValid, [type, target]) => {
    const {
      hidden,
      sections,
      expandedSections,
      readOnly,
      showOptions,
      hideOptions
    } = this.state;
    const targetField = target.field;
    const targetValue = target.value;

    return new Promise(resolve => {
      if ((type === "collapse" || type === "open") && isValid) {
        const section = sections.find(({ blocklabel }) => blocklabel === targetField);

        this.setState(
          {
            expandedSections: { ...expandedSections, [section.blockid]: type === "open" }
          },
          () => resolve()
        );
      }

      if ((type === "hide" && isValid) || (type === "show" && !isValid)) {
        this.setState({ hidden: [...hidden, targetField] }, () => resolve());
      } else if ((type === "hide" && !isValid) || (type === "show" && isValid)) {
        this.setState({ hidden: hidden.filter(field => field !== targetField) }, () =>
          resolve()
        );
      }

      if (type === "change" && isValid) {
        this.formApi.setField(targetField, targetValue).then(() => resolve());
      }

      if (type === "readonly") {
        if (isValid) {
          this.setState({ readOnly: [...readOnly, targetField] }, () => resolve());
        } else {
          this.setState(
            { readOnly: readOnly.filter(field => field !== targetField) },
            () => resolve()
          );
        }
      }

      if (type === "setoptions") {
        if (isValid) {
          this.setState(
            { showOptions: { ...showOptions, [targetField]: targetValue } },
            () => resolve()
          );
        } else {
          delete showOptions[targetField];
          this.setState({ showOptions }, () => resolve());
        }
      }

      if (type === "deloptions") {
        if (isValid) {
          this.setState(
            { hideOptions: { ...hideOptions, [targetField]: targetValue } },
            () => resolve()
          );
        } else {
          delete hideOptions[targetField];
          this.setState({ hideOptions }, () => resolve());
        }
      }
    });
  };

  evaluateConditions = conditions => {
    const comparatorToSymbol = {
      l: "<",
      g: ">",
      b: "<",
      a: ">",
      e: "==",
      n: "!=",
      m: "<=",
      h: ">="
    };

    const result = conditions.reduce(
      (acc, condition) => {
        const { name, value, operator, comparator } = condition;
        const fieldValue = this.formApi.getField(name);

        let comparision = `"${fieldValue}" # "${value}"`;
        comparision = comparision.replace("#", comparatorToSymbol[comparator]);

        if (acc.operator === "or" && acc.value) {
          return acc;
        }

        if (comparator === "l" || comparator === "g") {
          comparision = comparision.replace(/undefined/g, "");
          comparision = comparision.replace(/""/g, 0);
          comparision = comparision.replace(/"/g, "");
        }

        comparision = eval(comparision);

        if (acc.operator === "and") {
          comparision = comparision && acc.value;
        }

        return { value: comparision, operator };
      },
      { value: false, operator: "or" }
    );

    return result.value;
  };

  render() {
    const { sections, groupedFields, expandedSections } = this.state;
    const { initialValues, shown, busy, loading, moduleMeta } = this.props;
    const selectInitial = Object.values(moduleMeta.fields)
      .filter(({ uitype }) => [15, 16, 26, 77, 117].includes(parseInt(uitype)))
      .reduce(
        (acc, { name, type }) => ({ ...acc, [name]: type.picklistValues[0].value }),
        {}
      );

    if (!shown.form || !initialValues) {
      return <div />;
    }

    return (
      <Form
        formApi={formApi => (this.formApi = formApi)}
        initialValues={{ ...selectInitial, ...initialValues }}
      >
        {(busy.form || loading) && (
          <Overlay>
            <Loader variant="inverse" />
          </Overlay>
        )}

        <Accordion>
          {sections.map(({ blockid, blockname }) => (
            <AccordionPanel
              id={blockid}
              key={blockid}
              expanded={!!expandedSections[blockid]}
              onTogglePanel={() => this.toggleSection(blockid)}
              summary={blockname}
              className="slds-p-around--large"
            >
              <FormRowContainer>
                {groupedFields[blockid].map(this.renderField)}
              </FormRowContainer>
            </AccordionPanel>
          ))}
        </Accordion>
      </Form>
    );
  }
}

const mapStateToProps = (state, { Module }) =>
  mapToState(state, Module.selectors, [
    "busy",
    "shown",
    "initialValues",
    "fieldDependencies"
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
)(FormModal);
