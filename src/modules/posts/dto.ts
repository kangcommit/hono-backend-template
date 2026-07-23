import type { z } from "zod";
import type { Post } from "../../generated/prisma/client.js";
import type { PostSchema } from "./schema.js";

export type PostDto = z.infer<typeof PostSchema>;

export function toPost(post: Post): PostDto {
	return {
		id: post.id,
		title: post.title,
		slug: post.slug,
		content: post.content,
		published: post.published,
		createdAt: post.createdAt.toISOString(),
		updatedAt: post.updatedAt.toISOString(),
	};
}
