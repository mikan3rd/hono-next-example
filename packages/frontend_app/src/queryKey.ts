export const QueryKey = {
  posts: {
    all: ["posts"] as const,
    lists: () => [...QueryKey.posts.all, "list"] as const,
    list: (filters: string) =>
      [...QueryKey.posts.lists(), { filters }] as const,
    details: () => [...QueryKey.posts.all, "detail"] as const,
    detail: (id: string) => [...QueryKey.posts.details(), id] as const,
  },
} as const;
