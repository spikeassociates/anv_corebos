import React from "react";
import { DataTableCell } from "@salesforce/design-system-react";
import { Link } from "react-router-dom";

export default props => {
  const { route, item, children } = props;

  return (
    <DataTableCell>
      <Link to={`${route}/${item.id}`}>{children}</Link>
    </DataTableCell>
  );
};
