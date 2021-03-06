import React, { useState } from "react";
import { CardWrapper, ButtonsContainer } from "./styles";
import ActionsExecutor from "./components/Actions";

import Modular from "modular-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import { setPath } from "utils";

import { mapToDispatch } from "shared-utils";
import data2 from "../data";
import NewForm from "./form";

import {
  Card,
  Tabs,
  TabsPanel,
  Button,
  Illustration
} from "@salesforce/design-system-react";
import { relative } from "path";

const FormBuilder = props => {
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({});
  const [data_form, setData_form] = useState(data2);
  const [tabIndex, setTabIndex] = useState(0);

  //used to dynamically add and delete rowEdit blocks
  const [rowEdit, setRowEdit] = useState({});

  const saveData = () => {
    const { actions, id } = props;
    // const { data } = this.state;
    const values = id ? { id, ...data } : data;

    (async () => {
      const rets = await Promise.all(
        Object.entries(data).forEach(([key, val]) => {
          val.map(x => {
            actions.saveItem({
              values,
              name: key,
              operation: id ? "UpdateWithValidation" : "CreateWithValidation"
            });
          });
        })
      );
      console.log(rets);
    })();
  };

  //Render Steps
  const renderStep = step => {
    const { modules } = props;
    let meta = modules[step.module];
    return step.blocks
      .sort((a, b) => {
        const aSequence = parseInt(a.sequence);
        const bSequence = parseInt(b.sequence);
        return aSequence - bSequence;
      })
      .map(({ blocktype, ...rest }) => {
        if (blocktype === "Fields") {
          return renderBlockFields({ meta, block: rest });
        } else if (blocktype === "RowEdit") {
          return renderBlockRowEdit({ meta, block: rest, step, blocktype });
        } else {
          const blocks = rest.steps
            .map(({ blocks }) => blocks)
            .reduce((acc, blockArr) => [...acc, ...blockArr], []);

          return (
            <>
              <div>
                {blocks.map(block => (
                  <div>renderBlockFields({(meta, block)})</div>
                ))}
              </div>
            </>
          );
        }
      });
  };

  //Render fields of blocktype=='Fields'
  const renderBlockRowEdit = ({ meta, block, step, blocktype }) => {
    // const { formData } = state;
    const id = `${block.blockid}x${step.stepid}`;
    const counter = rowEdit[id] || [1];
    const counter_length = counter.length;

    const onBlockData = (data, index) => {
      {
        const key = `rowEditx${id}x${index}`;
        setPath(formData, key, data);
        setFormData({ formData });
      }
    };

    const removeRow = index => {
      setRowEdit(prevState => ({
        ...prevState,
        rowEdit: {
          ...prevState.rowEdit,
          id: prevState.rowEdit[id].map((row, i) => (i === index ? 0 : row))
        }
      }));
    };

    return (
      <>
        <div className="slds-grid slds-wrap">
          {counter.map((item, index) => (
            <div key={index} style={{ width: "100%" }}>
              {item === 1 ? (
                <div className="slds-grid slds-gutters">
                  <div
                    className="slds-col slds-size_7-of-7"
                    style={{ position: "relative" }}
                    key={index}
                  >
                    {renderBlockFields({
                      meta,
                      block,
                      onFormChange: data => onBlockData(data, index),
                      blocktype
                    })}
                    {counter_length > 1 && (
                      <Button
                        key={index}
                        iconCategory="utility"
                        iconName="delete"
                        iconSize="large"
                        variant="icon"
                        style={{
                          position: "absolute",
                          right: "37px",
                          top: "86px"
                        }}
                        onClick={() => {
                          let rowData = [...rowEdit[id]];
                          rowData[index] = 0;
                          setRowEdit({
                            ...rowEdit,
                            [id]: rowData
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          <div className=" slds-align_absolute-center  slds-m-vertical_large">
            <Button
              label="Add Another Block"
              iconCategory="utility"
              iconName="add"
              iconSize="large"
              variant="icon"
              onClick={() =>
                setRowEdit({ ...rowEdit, [id]: [...(rowEdit[id] || [1]), 1] })
              }
            />
          </div>
        </div>
      </>
    );
  };

  //Render fields of blocktype=='Fields'
  const renderBlockFields = ({ meta, block, onFormChange, blocktype }) => {
    // const { formData } = this.state;
    let { fields, blockid, label, sequence } = block;
    if (blocktype == "RowEdit") {
      label = `${label} (Row Edit)`;
    }

    fields = fields
      .map(field => ({
        displaytype: "1",
        ...meta.fields[field.name],
        ...field,
        block: {
          blockid,
          blocksequence: sequence,
          blockname: label
        }
      }))
      .reduce((acc, field) => ({ ...acc, [field.name]: field }), {});
    meta = { ...meta, fields };

    return (
      <NewForm
        onFormChange={data => {
          onFormChange ? onFormChange(data) : setFormData({ ...formData, ...data });
        }}
        key={blockid}
        moduleMeta={meta}
      />
    );
  };

  const { steps } = data_form;

  //get length of steps so later we can use it for moving
  //through tabs, enabling and disabling them
  const numRows = steps.length;

  //To show "Next Step" only where there are more steps
  const nextStep = numRows - (tabIndex + 1);

  return (
    <div className="slds-m-around_medium">
      <Tabs id="tabs-example-default" selectedIndex={tabIndex}>
        {steps.map(step => (
          <TabsPanel
            key={step.stepid}
            label={step.stepname}
            disabled={tabIndex == step.stepid}
          >
            <div className="slds-p-horizontal_xx-large">
              <Illustration heading="Actions" />
              <ActionsExecutor />
            </div>
            <div className="slds-p-horizontal_xx-large">{renderStep(step)}</div>
          </TabsPanel>
        ))}
      </Tabs>
      <div className="slds-p-horizontal_large">
        <ButtonsContainer>
          {tabIndex != 0 && (
            <div>
              <Button
                className="slds-p-horizontal_medium"
                key="goback"
                label=" Go Back"
                iconName="back"
                iconSize="large"
                variant="icon"
                onClick={() => setTabIndex(tabIndex - 1)}
              />
            </div>
          )}

          {nextStep > 0 && (
            <div style={{ marginLeft: "auto" }}>
              <Button
                className="slds-p-horizontal_medium"
                key="nextstep"
                label=" Next Step"
                iconName="forward"
                iconSize="large"
                variant="icon"
                onClick={() => setTabIndex(tabIndex + 1)}
              />
            </div>
          )}
        </ButtonsContainer>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch, { Module }) => ({
  actions: mapToDispatch(dispatch, Module.actions)
});

export default compose(
  Modular.view,
  connect(
    null,
    mapDispatchToProps
  )
)(FormBuilder);
