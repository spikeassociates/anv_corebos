const routes = GLOBALS.MODULES.reduce((acc, corebosModule) => {
  const moduleName = corebosModule.toLowerCase();

  return [
    ...acc,
    { name: `${moduleName}/:id`, module: "detailview", corebosModule },
    { name: moduleName, module: "listview", corebosModule, sidebar: true }
  ];
}, []);

export default routes;
