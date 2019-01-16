import React from "react";
import { DataTableCell } from "@salesforce/design-system-react";
import { Link } from "react-router-dom";
import { getQs } from "utils";

export default props => {
  const { moduleName, item, children } = props;
  const id = item.id ? item.id.split("x")[1] : undefined;

  return (
    <DataTableCell>
      <Link
        to={{
          search: getQs({
            view: "detail",
            moduleName,
            id
          })
        }}
      >
        {children}
      </Link>
    </DataTableCell>
  );
};
