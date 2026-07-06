import {
  getGetPostsResponseMock,
  getGetUserLoginResponseMock,
} from "../../client/index.msw";
import type { GetPosts200PostsItem, User } from "../../client/index.schemas";

export const STORY_CREATED_AT = "2025-01-01T00:00:00.000Z";
export const STORY_UPDATED_AT = "2025-01-02T12:00:00.000Z";

export const STORY_POST_CONTENT =
  "Sample post content for visual regression testing.";

export const storyOwnerUser: User = {
  public_id: "story-user-owner-0001",
  display_name: "Alice Example",
};

export const storyAnotherUser: User = {
  public_id: "story-user-other-0002",
  display_name: "Bob Example",
};

export const storyNotOwnerUser: User = {
  public_id: "story-user-not-owner-0099",
  display_name: "Charlie Example",
};

export function createStoryUser(overrides: Partial<User> = {}): User {
  return getGetUserLoginResponseMock({
    public_id: storyOwnerUser.public_id,
    display_name: storyOwnerUser.display_name,
    ...overrides,
  });
}

export function createStoryPost(
  overrides: Partial<GetPosts200PostsItem> = {},
): GetPosts200PostsItem {
  const [post] = getGetPostsResponseMock({
    posts: [
      {
        public_id: "story-post-0001",
        content: STORY_POST_CONTENT,
        created_at: STORY_CREATED_AT,
        updated_at: null,
        user: storyOwnerUser,
        ...overrides,
      },
    ],
  }).posts;

  if (!post) {
    throw new Error("Failed to build story post mock");
  }

  return post;
}

export function createStoryPosts(count = 4): GetPosts200PostsItem[] {
  return getGetPostsResponseMock({
    posts: Array.from({ length: count }, (_, i) => ({
      public_id: `story-post-${String(i + 1).padStart(4, "0")}`,
      content:
        count === 1 ? STORY_POST_CONTENT : `${STORY_POST_CONTENT} #${i + 1}`,
      created_at: STORY_CREATED_AT,
      updated_at: i === 1 ? STORY_UPDATED_AT : null,
      user: i % 2 === 0 ? storyOwnerUser : storyAnotherUser,
    })),
  }).posts;
}
