export const POST_SORT_FIELDS = ["title", "createdAt", "updatedAt"] as const;
export type PostSortField = (typeof POST_SORT_FIELDS)[number];

export const DEFAULT_POST_SORT_FIELD: PostSortField = "createdAt";
export const DEFAULT_POST_SORT_ORDER = "desc";

export const POST_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
