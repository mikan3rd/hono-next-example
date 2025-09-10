import { baseClient } from "../../../baseClient";

export const getPosts = async () => {
  const res = await baseClient.posts.$get();
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return res.json();
};
