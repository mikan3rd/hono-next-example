import { baseClient } from "../../../baseClient";

export const queryKey = ["posts"];

export const getPosts = async () => {
  const res = await baseClient.posts.$get();
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return res.json();
};

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

export const deletePost = async (id: number) => {
  const res = await baseClient.posts[":id"].$delete({
    param: { id: id.toString() },
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return res.json();
};
