import styled from "styled-components";

const Container = styled.section`
  padding: 32px;
`;

const SectionContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  grid-gap: 20px 4%;
  padding-bottom: 15px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 40px;
`;

const Label = styled.div`
  opacity: 0.7;
`;

const Value = styled.div``;

const Separator = styled.div`
  border-top: 1px solid #dddbda;
  height: 1px;
`;

const Image = styled.img`
  height: 200px;
`;

const RelatedList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 7px 0;
`;

const RelatedModule = styled.div`
  span {
    border-bottom: 1px dashed #ececec;
  }
`;

const PreviewContainer = styled.div`
  background-color: #ececec;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  top: ${props => props.top + 12}px;
  height: ${props => (props.show ? "auto" : 0)};
  overflow: ${props => (props.show ? "auto" : "hidden")};
  max-heigh: 400px;
`;

export {
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
};
