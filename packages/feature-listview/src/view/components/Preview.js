import React from "react";
import { Icon, Button } from "@salesforce/design-system-react";
import { Link } from "react-router-dom";

import {
  PreviewHeader,
  PreviewHeaderRow,
  PreviewTitle,
  PreviewHeaderLabel,
  PreviewHeaderValue,
  PreviewImage,
  ChangePage,
  PreviewHeaderContainer
} from "../styles";

const PreviewValue = ({ field }) => {
  if (field.uitype == 69) {
    return (
      <div>
        {field.images.map(image => (
          <PreviewImage src={image.fullpath} key={image.id} />
        ))}
      </div>
    );
  }
  return <PreviewHeaderValue>{field.value}</PreviewHeaderValue>;
};

export default ({ previewData, changeItem, itemUrl }) => {
  const { title, headerData, bodyData } = previewData;

  return (
    <>
      <PreviewHeaderContainer>
        <Icon
          category="standard"
          name="account"
          size="large"
          containerClassName={["preview-icon"]}
        />
        <PreviewHeader>
          <PreviewTitle>{title}</PreviewTitle>
          {headerData.map((field, index) => (
            <PreviewHeaderRow key={index}>
              <PreviewHeaderLabel>{field.label}:</PreviewHeaderLabel>
              <PreviewHeaderValue>{field.value}</PreviewHeaderValue>
            </PreviewHeaderRow>
          ))}
          <ChangePage>
            <Button
              iconCategory="utility"
              iconName="left"
              iconVariant="border"
              variant="icon"
              onClick={() => changeItem(-1)}
            />
            <Button
              iconCategory="utility"
              iconName="right"
              iconVariant="border"
              variant="icon"
              onClick={() => changeItem(1)}
            />
          </ChangePage>
        </PreviewHeader>
      </PreviewHeaderContainer>

      <Link to={itemUrl} onClick={() => (document.body.style.overflow = "auto")}>
        <Button variant="success" className="view-details">
          View Details
        </Button>
      </Link>

      <div>
        <PreviewTitle>Details</PreviewTitle>
        {bodyData.map((field, index) => (
          <PreviewHeaderRow key={index}>
            <PreviewHeaderLabel>{field.label}:</PreviewHeaderLabel>
            <PreviewValue field={field} />
          </PreviewHeaderRow>
        ))}
      </div>
    </>
  );
};
