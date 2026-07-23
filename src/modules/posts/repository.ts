import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { buildWhere } from "./filters.js";
import type { PostListQuery } from "./schema.js";

async function findMany(
	query: Pick<PostListQuery, "search" | "published">,
	options: {
		skip: number;
		take: number;
		orderBy: Prisma.PostOrderByWithRelationInput;
	},
) {
	return prisma.post.findMany({
		where: buildWhere(query),
		orderBy: options.orderBy,
		skip: options.skip,
		take: options.take,
	});
}

async function count(query: Pick<PostListQuery, "search" | "published">) {
	return prisma.post.count({
		where: buildWhere(query),
	});
}

async function findById(id: string) {
	return prisma.post.findUnique({
		where: { id },
	});
}

async function create(data: Prisma.PostCreateInput) {
	return prisma.post.create({
		data,
	});
}

async function update(id: string, data: Prisma.PostUpdateInput) {
	return prisma.post.update({
		where: { id },
		data,
	});
}

async function remove(id: string) {
	return prisma.post.delete({
		where: { id },
	});
}

async function findOwnedById(id: string, authorId: string) {
	return prisma.post.findFirst({
		where: {
			id,
			authorId,
		},
	});
}

export const postRepository = {
	findMany,
	count,
	findById,
	create,
	update,
	delete: remove,
	findOwnedById,
};
