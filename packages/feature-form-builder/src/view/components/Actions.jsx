import React, { useState, useEffect } from "react";
import { Card, Button } from "@salesforce/design-system-react";
import Icon from "@salesforce/design-system-react";
import {
  CardWrapper,
  CardHeader,
  CardHeading,
  CardBody,
  CardFieldset,
  ActionCardWrapper,
  Loading
} from "../styles";

const ActionsExecutor = props => {
  const [isExecuted, setIsExcecuted] = useState(false);
  const [excecutedStatus, setExcecutedStatus] = useState(false);
  const [icon, setIcon] = useState("fallback");
  const [loading, setLoading] = useState(0);

  //will handle button click. In the future it will make API call to run the action and based
  //on the response it will update the icon
  const handleClick = () => {
    setLoading(1);
    let timer1 = setTimeout(() => setLoading(0), 2000);
    let icon = setTimeout(() => setIcon("check"), 2000);
  };
  const actionName = "Run Action id nr 10";

  //   useEffect({});

  return (
    <ActionCardWrapper>
      <div className="slds-grid slds-gutters">
        <div className="slds-col slds-size_5-of-7">
          <CardHeader>
            <CardHeading>{actionName}</CardHeading>
          </CardHeader>
        </div>
        <div className="slds-col slds-size_2-of-7 slds-align_absolute-center">
          {loading === 1 ? (
            <Loading />
          ) : (
            <Button
              label="Execute"
              assistiveText={{ icon: "Icon More large" }}
              iconCategory="utility"
              iconName={icon}
              iconSize="large"
              variant="icon"
              onClick={handleClick}
            />
          )}
        </div>
      </div>
    </ActionCardWrapper>
  );
};

export default ActionsExecutor;
