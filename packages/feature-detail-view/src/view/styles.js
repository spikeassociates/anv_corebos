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

export { Container, SectionContainer, FieldContainer, Value, Label, Separator, Image };
