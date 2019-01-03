import React from "react";
import { getQs, changeRoute } from "shared-utils";

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
