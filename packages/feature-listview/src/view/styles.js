import styled from "styled-components";

const Header = styled.header`
  font-size: 1.75rem;
  margin: 1.5rem 0;
`;

const LoaderContainer = styled.div`
  position: relative;
  padding: 40px 0;
`;

const HeaderActionRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
`;

const PreviewMenu = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
  width: ${props => (props.isOpen ? "550px" : "0")};
  transition: all 0.2s ease-in-out;
  box-shadow: -11px 0 10px 0 rgb(214, 204, 204);
  padding: ${props => (props.isOpen ? "20px" : "0")};
  overflow: scroll;

  @media (max-width: 750px) {
    width: ${props => (props.isOpen ? "85%" : "0")};
  }
`;

const PreviewHeader = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 25px;
`;

const PreviewHeaderRow = styled.div`
  display: flex;
`;

const PreviewTitle = styled.div`
  font-size: 1.5em;
`;

const PreviewHeaderLabel = styled.div`
  width: 150px;
  opacity: 0.8;
  flex-shrink: 0;
`;

const PreviewHeaderValue = styled.div`
  margin-left: 15px;
`;

const PreviewImage = styled.img`
  height: 250px;
  width: 100%;
  object-fit: cover;
`;

const TableContainer = styled.div``;

const ChangePage = styled.div`
  margin-top: 5px;
`;

const PreviewHeaderContainer = styled.div`
  display: flex;
`;

const ListViewContainer = styled.div`
  width: ${props => (props.hasData ? "inherit" : "100%")};
  display: ${props => (props.hasData ? "inline-block" : "inherit")};
  min-width: 100%;
`;

const FormRowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  grid-gap: 20px 4%;
  padding-bottom: 15px;
`;

export {
  Header,
  LoaderContainer,
  HeaderActionRow,
  PreviewMenu,
  PreviewHeader,
  PreviewHeaderRow,
  PreviewTitle,
  PreviewHeaderLabel,
  PreviewHeaderValue,
  PreviewImage,
  TableContainer,
  ChangePage,
  PreviewHeaderContainer,
  ListViewContainer,
  FormRowContainer
};
