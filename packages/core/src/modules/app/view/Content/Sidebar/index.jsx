import React from "react";

import routes from "../routes";
import { Link, Logo, Navigation, StyledSidebar } from "./styles";

const links = routes.filter(route => route.sidebar).map(route => route.name);

const Sidebar = () => (
  <StyledSidebar>
    <Logo src="./subito.png" />
    <Navigation>
      {links.map(link => (
        <Link key={link} to={"/" + link}>
          {link}
        </Link>
      ))}
    </Navigation>
  </StyledSidebar>
);

export default Sidebar;
