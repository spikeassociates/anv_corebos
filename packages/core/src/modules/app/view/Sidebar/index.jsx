import React from "react";
import { getQs } from "shared-utils";

import { Link, Container } from "./styles";

export default () => {
  const { origin, pathname } = window.location;
  const url = `${origin}${pathname}`;

  return (
    <Container>
      {GLOBALS.MODULES.map(moduleName => (
        <Link
          onClick={() => {
            const path = url + getQs({ view: "listview", moduleName });
            window.history.pushState({ path }, "", path);
          }}
          key={moduleName}
        >
          {moduleName}
        </Link>
      ))}
    </Container>
  );
};
