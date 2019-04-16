const transformDependencies = dependencies =>
  dependencies.dependency.reduce((acc, { field, condition, actions }) => {
    let conditions = condition ? JSON.parse(condition) : [];
    conditions = conditions.map(({ comparator, value, columncondition, columnname }) => ({
      name: columnname.match(/vtiger_\w+:(\w+)/)[1],
      value,
      comparator,
      operator: columncondition
    }));
    const dependency = { field, actions, conditions };

    return { ...acc, [field]: [...(acc[field] || []), dependency] };
  }, {});

export { transformDependencies };
