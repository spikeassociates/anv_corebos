import styled, { injectGlobal } from "styled-components";

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #44ef34;
  border-left: 1px solid #44ef34;
  padding-top: 15px;
  padding-bottom: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 0px 20px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
`;

const FormRowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  grid-gap: 20px 4%;
  padding-bottom: 15px;
  align-items: center;
`;

const Loading = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #cef;
    border-color: #cef transparent #cef transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CardWrapper = styled.div`
  display: grid;
  border-top: 1px solid #02e5ce;
  border-left: 1px solid #02e5ce;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
  grid-gap: 20px 4%;
  overflow: hidden;
  padding: 20px 20px 32px;
  margin: 48px auto 0;
  width: 100%;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 0px 20px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
`;
const ActionCardWrapper = styled.div`
  display: grid;
  border-top: 1px solid #dd0f73;
  border-left: 1px solid #dd0f73;
  overflow: hidden;
  margin: 10px auto 20px;
  width: 100%;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 0px 20px rgba(0, 0, 0, 0.08);
  border-radius: 15px;
`;

const CardHeader = styled.header`
  padding-top: 32px;
  padding-bottom: 32px;
`;

const CardHeading = styled.h1`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const CardBody = styled.div`
  padding-right: 32px;
  padding-left: 32px;
`;

const CardFieldset = styled.fieldset`
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;

  & + & {
    margin-top: 24px;
  }

  &:nth-last-of-type(2) {
    margin-top: 32px;
  }

  &:last-of-type {
    text-align: center;
  }
`;

const CardInput = styled.input`
  padding: 7px 0;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #ddd;
  border-left: 0;
  transition: border-bottom-color 0.25s ease-in;

  &:focus {
    border-bottom-color: #e5195f;
    outline: 0;
  }
`;

const CardIcon = styled.span`
  color: #666;
  cursor: pointer;
  opacity: .25;
  transition: opacity .25s ease-in;

  &:hover {
    opacity: .95;
  }

  ${props =>
    props.big &&
    css`
      font-size: 26px;
    `}

  ${props =>
    props.eye &&
    css`
      position: absolute;
      top: 8px;
      right: 0;
    `}

  ${props =>
    props.small &&
    css`
      font-size: 14px;
    `}
`;

const CardOptionsNote = styled.small`
  padding-top: 8px;
  display: block;
  width: 100%;
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
`;

const CardOptions = styled.ul`
  padding: 0;
  margin: 10px 0 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  list-style-type: none;
`;

const CardOptionsItem = styled.li`
  &:nth-of-type(n + 2) {
    margin-left: 16px;
  }
`;

const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #e5195f;
  border: 0;
  border-radius: 35px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);

  &:hover {
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.16);
    transform: translate(0, -5px);
  }
`;

const CardLink = styled.a`
  display: inline-block;
  font-size: 12px;
  text-decoration: none;
  color: #aaa;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: color 0.25s ease-in;

  &:hover {
    color: #777;
  }
`;

injectGlobal`
.slds-modal__content {
  height: 100%
}
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 3rem;
  bottom: 3rem;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export {
  FormRowContainer,
  Overlay,
  CardBody,
  CardHeading,
  CardHeader,
  CardWrapper,
  ActionCardWrapper,
  Loading,
  ButtonsContainer
};
