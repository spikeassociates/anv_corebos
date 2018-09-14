import React from "react";
import { Nav, Link } from "./styles";

const PageNav = ({ data = [] }) => (
  <Nav>
    {data.map((item, index) => (
      <Link key={index} to={item.link}>
        {item.title}
      </Link>
    ))}
  </Nav>
);

export default PageNav;
