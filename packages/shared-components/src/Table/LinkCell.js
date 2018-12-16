import React from "react";
import { DataTableCell } from "@salesforce/design-system-react";
import { Link } from "react-router-dom";

import { getQs } from "shared-utils";

export default props => {
  const { moduleName, item, children } = props;

  return (
    <DataTableCell>
      <Link
        to={{
          search: getQs({
            view: "detail",
            moduleName,
            id: item.id
          })
        }}
      >
        {children}
      </Link>
    </DataTableCell>
  );
};
