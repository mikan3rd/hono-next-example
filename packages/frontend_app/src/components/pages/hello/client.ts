import { baseClient } from "../../../baseClient";

export const getHello = async () => {
  const res = await baseClient.hellos.$get({ query: { name: "Hono" } });
  return res.json();
};
