import React from "react";
import { changeRoute } from "utils";

import { Link, Container } from "./styles";

export default () => (
  <Container>
    {GLOBALS.MODULES.map(moduleName => (
      <Link onClick={() => changeRoute({ view: "list", moduleName })} key={moduleName}>
        {moduleName}
      </Link>
    ))}
  </Container>
);
