const subitoRoutes = [
  { name: "master account", module: "listview", corebosModule: "MasterAccount" },
  { name: "account", module: "listview", corebosModule: "Accounts" },
  { name: "task", module: "listview", corebosModule: "Task" },
  { name: "sales order", module: "listview", corebosModule: "SalesOrderMaster" },
  { name: "cases", module: "listview", corebosModule: "Cases" },
  { name: "account details", module: "listview", corebosModule: "AccountDetails" },
  { name: "term", module: "listview", corebosModule: "Term" },
  { name: "adoc master", module: "listview", corebosModule: "Adocmaster" }
];

const routes = [
  { name: "contact/:id", module: "detailview", corebosModule: "Contacts" },
  { name: "account/:id", module: "detailview", corebosModule: "Accounts" },
  { name: "account", module: "listview", corebosModule: "Accounts", sidebar: true },
  { name: "contact", module: "listview", corebosModule: "Contacts", sidebar: true },
  { name: "task", module: "listview", corebosModule: "Task", sidebar: true }
];

export default routes;
