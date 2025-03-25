import { baseClient } from "../../../baseClient";

export const getHello = async () => {
  const res = await baseClient.hellos.$get({ query: { name: "Hono" } });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
};
