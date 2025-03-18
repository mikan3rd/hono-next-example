import { baseClient } from "../../../baseClient";

export const getHello = async () => {
  const res = await baseClient.hellos.$get();
  return res.json();
};
