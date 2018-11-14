import Modular from "modular-redux";
import { PersistentRepo } from "shared-repo";

const initialState = {
  data: {
    isLoggedIn: !!PersistentRepo.get("token")
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default Modular.reducer(reducer);
