import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";
import { PersistentRepo } from "shared-repo";

const initialValues = module =>
  createSelector(
    module,
    ({ data }) => {
      const { currentModule, initial } = data;

      if (initial.id) {
        return initial;
      } else if (!currentModule) {
        return;
      } else {
        const userId = PersistentRepo.get("userId");
        let assignFields = Object.values(
          PersistentRepo.get("modules")[currentModule].fields
        )
          .filter(({ uitype }) => uitype == 53)
          .map(({ name }) => name);

        return assignFields.reduce((acc, name) => ({ ...acc, [name]: userId }), {});
      }
    }
  );

const fieldDependencies = module =>
  createSelector(
    module,
    ({ data }) => data.fieldDependencies
  );

const selectors = { initialValues, fieldDependencies };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
