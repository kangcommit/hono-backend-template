import type { Prisma } from "../../generated/prisma/client.js";
import type { PostListQuery } from "./schema.js";

export function buildWhere(
	query: Pick<PostListQuery, "search" | "published">,
): Prisma.PostWhereInput {
	const { search, published } = query;

	return {
		...(published !== undefined && { published }),
		...(search && {
			OR: [
				{
					title: {
						contains: search,
						mode: "insensitive",
					},
				},
				{
					content: {
						contains: search,
						mode: "insensitive",
					},
				},
			],
		}),
	};
}
