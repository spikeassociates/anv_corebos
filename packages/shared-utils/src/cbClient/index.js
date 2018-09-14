import cbClient from "./WSClientp";

export default async () => {
  const client = new cbClient(GLOBALS.COREBOS_API);
  await client.doLogin(GLOBALS.COREBOS_USERNAME, GLOBALS.COREBOS_TOKEN);

  return client;
};
