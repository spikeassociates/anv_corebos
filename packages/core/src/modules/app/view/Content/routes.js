const subitoModules = [
  "MasterAccount",
  "Accounts",
  "Task",
  "SalesOrderMaster",
  "Cases",
  "AccountDetails",
  "Term",
  "Adocmaster"
];

const modules = ["Accounts", "Contacts", "Task"];

const routes = modules.reduce((acc, corebosModule) => {
  const moduleName = corebosModule.toLowerCase();

  return [
    ...acc,
    { name: `${moduleName}/:id`, module: "detailview", corebosModule },
    { name: moduleName, module: "listview", corebosModule, sidebar: true }
  ];
}, []);

export default routes;
