import React from "react";

import Content from "./Content";
import Nav from "./Nav";
import Title from "./Title";
import Route from "./Route";
import { StyledPage } from "./styles";

const Page = ({ children = [] }) => <StyledPage>{children}</StyledPage>;

Page.Content = Content;
Page.Nav = Nav;
Page.Title = Title;
Page.Route = Route;

export default Page;
