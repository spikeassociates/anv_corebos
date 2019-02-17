const b64DecodeUnicode = str =>
  decodeURIComponent(
    atob(str)
      .split("")
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

const b64EncodeUnicode = str =>
  btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode("0x" + p1)
    )
  );

const createRepo = () => {
  let state = {};

  return {
    set: (key, val) => {
      state[key] = val;
    },

    get: key => state[key],

    delete: key => {
      delete state[key];
    },

    clear: () => {
      state = {};
    }
  };
};

const createPersistentRepo = () => {
  const id =
    process.env.NODE_ENV === "production"
      ? `corebos:${GLOBALS.BUILD.DATE}`
      : `corebos:dev:${GLOBALS.BUILD.DATE}`;

  const globalState = localStorage;

  const encrypt = string => "=" + b64EncodeUnicode(string);
  const decrypt = string => b64DecodeUnicode(string.substring(1));

  const resetState = () => {
    const timestamp = new Date().toISOString();
    setState({ timestamp });
  };

  const getState = () => {
    if (!globalState.getItem(id)) {
      resetState();
    }

    return JSON.parse(decrypt(globalState.getItem(id)));
  };

  const setState = state => globalState.setItem(id, encrypt(JSON.stringify(state)));

  if (!globalState.getItem(id)) {
    const timestamp = new Date().toISOString();
    setState({ timestamp });
  }

  return {
    set: (key, val) => {
      const state = getState();
      state[key] = val;
      setState(state);
    },

    get: key => getState()[key],

    delete: key => {
      const state = getState();
      delete state[key];
      setState(state);
    },

    clear: () => {
      globalState.clear(id);
    }
  };
};

const Repo = createRepo();
const PersistentRepo = createPersistentRepo();

if (process.env.NODE_ENV === "development") {
  window.Repo = Repo;
  window.PersistentRepo = PersistentRepo;
}

export { Repo, PersistentRepo };
