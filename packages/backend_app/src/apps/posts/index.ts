import { HTTPException } from "hono/http-exception";
import {
  createPost,
  deletePostByPublicId,
  findPostWithUserById,
  findPostWithUserByPublicId,
  listPostsWithUser,
  type PostAccessError,
  updatePostByPublicId,
} from "../../application/posts";
import { userMiddleware } from "../../middlewares/user";
import { createApp } from "../factory";
import { transformPostWithUser } from "./dto";
import {
  deletePostRoute,
  getPostsRoute,
  postPostRoute,
  updatePostRoute,
} from "./route";

function throwIfPostAccessDenied(error: PostAccessError): never {
  if (error === "not_found") {
    throw new HTTPException(404, {
      message: "Post is not found",
    });
  }
  throw new HTTPException(403, {
    message: "Forbidden",
  });
}

const postApp = createApp();

postApp.post("/", userMiddleware);
postApp.use("/:id", userMiddleware);

const routes = postApp
  .openapi(getPostsRoute, async (c) => {
    const posts = await listPostsWithUser();
    return c.json({ posts: posts.map(transformPostWithUser) }, 200);
  })
  .openapi(postPostRoute, async (c) => {
    const { content } = c.req.valid("json");
    const user = c.get("user");
    const created = await createPost({ userId: user.id, content });
    if (!created.ok) {
      throw new HTTPException(500, {
        message: "Failed to create post",
      });
    }
    const post = await findPostWithUserById(created.id);
    if (!post) {
      throw new HTTPException(500, {
        message: "Failed to fetch created post",
      });
    }
    return c.json({ post: transformPostWithUser(post) }, 200);
  })
  .openapi(updatePostRoute, async (c) => {
    const { public_id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    const user = c.get("user");

    const updated = await updatePostByPublicId({
      publicId: public_id,
      actorUserId: user.id,
      content,
    });

    if (!updated.ok) {
      if (updated.error === "not_found" || updated.error === "forbidden") {
        throwIfPostAccessDenied(updated.error);
      }
      throw new HTTPException(500, {
        message: "Failed to update post",
      });
    }

    const post = await findPostWithUserByPublicId(public_id);
    if (!post) {
      throw new HTTPException(500, {
        message: "Failed to fetch updated post",
      });
    }

    return c.json({ post: transformPostWithUser(post) }, 200);
  })
  .openapi(deletePostRoute, async (c) => {
    const { public_id } = c.req.valid("param");
    const user = c.get("user");

    const result = await deletePostByPublicId({
      publicId: public_id,
      actorUserId: user.id,
    });

    if (!result.ok) {
      throwIfPostAccessDenied(result.error);
    }

    return c.json(null, 200);
  });

export { routes as postApp };
