const CDN = "";
const now = new Date();

const BASE = {
  BUILD: {
    DATE: now.toJSON().slice(0, 10),
    TIME: now.toJSON().slice(11, 19)
  },

  RESOURCES: {
    img: {
      logo: CDN + ""
    }
  },

  MATTERMOST_PLUGIN: "com.corebos.app"
};

module.exports = BASE;
