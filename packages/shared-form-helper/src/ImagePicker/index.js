import React, { Component } from "react";

import { Image, Container } from "./styles";

class ImagePicker extends Component {
  handleChange = e => {
    const { onChange, value = {}, fieldName } = this.props;
    const file = e.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const content = reader.result;
      const imageData = {
        name: file.name,
        size: file.size,
        type: file.type,
        content: content.split(",")[1]
      };

      onChange({ ...value, [fieldName]: imageData });
    };
  };

  render() {
    const { value = {}, imageInfo, fieldName } = this.props;
    const imagePath = imageInfo ? imageInfo.fullpath : "";
    const attachment = value[fieldName];
    const image = attachment
      ? `data:${attachment.type};base64,${attachment.content}`
      : imagePath;

    return (
      <Container>
        {image && <Image src={image} />}
        <input type="file" onChange={this.handleChange} />
      </Container>
    );
  }
}

export default ImagePicker;
