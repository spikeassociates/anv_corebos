import { getModuleReferenceFields } from "shared-utils";
import { PersistentRepo } from "shared-repo";

const transformQueryResult = (data, moduleName) => {
  const referenceFields = getModuleReferenceFields(moduleName);
  const modules = PersistentRepo.get("modules");
  const moduleMeta = modules[moduleName];

  const ownerField = Object.values(moduleMeta.fields).find(({ uitype }) => uitype == 53);
  const ownerFieldName = ownerField.name;
  const ownerValues = Object.values(ownerField.type.assignto).reduce(
    (acc, { options }) => {
      options = options.reduce(
        (acc, { userid, groupid, username, groupname }) => ({
          ...acc,
          [userid || groupid]: username || groupname
        }),
        {}
      );
      return { ...acc, ...options };
    },
    {}
  );

  return data.map(row => {
    const referenceValues = Object.entries(referenceFields).reduce(
      (acc, [name, { targetFields, targetModule }]) => {
        const targetValues = targetFields.map(
          field => row[`${targetModule.toLowerCase()}${field}`]
        );

        return { ...acc, [name]: targetValues.join(" ") };
      },
      {}
    );

    return {
      ...row,
      ...referenceValues,
      [ownerFieldName]: ownerValues[row[ownerFieldName]]
    };
  });
};

export { transformQueryResult };
