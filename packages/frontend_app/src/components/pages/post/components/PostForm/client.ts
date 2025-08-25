import { baseClient } from "../../../../../baseClient";

export const createPost = async (content: string) => {
  const res = await baseClient.posts.$post({
    json: { content },
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return res.json();
};
