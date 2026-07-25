import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";
import { DEFAULT_PASSWORD, POSTS, USERS } from "./seed-data.js";

async function seedUsers() {
	for (const user of USERS) {
		const existing = await prisma.user.findUnique({
			where: {
				email: user.email,
			},
		});

		if (!existing) {
			await auth.api.createUser({
				body: {
					email: user.email,
					name: user.name,
					password: DEFAULT_PASSWORD,
					role: user.role,
				},
			});
		}
	}

	const users = await prisma.user.findMany({
		where: {
			email: {
				in: USERS.map((user) => user.email),
			},
		},
	});

	return new Map(users.map((user) => [user.email, user.id]));
}

async function seedPosts(userIds: Map<string, string>) {
	for (const post of POSTS) {
		const authorId = userIds.get(post.authorEmail);

		if (!authorId) {
			throw new Error(`User not found: ${post.authorEmail}`);
		}

		await prisma.post.upsert({
			where: {
				slug: post.slug,
			},
			update: {
				title: post.title,
				content: post.content,
				published: post.published,
			},
			create: {
				title: post.title,
				slug: post.slug,
				content: post.content,
				published: post.published,
				author: {
					connect: {
						id: authorId,
					},
				},
			},
		});
	}
}

async function main() {
	console.log("🌱 Seeding database...");

	const userIds = await seedUsers();
	console.log("✓ Users seeded");

	await seedPosts(userIds);
	console.log("✓ Posts seeded");

	console.log("🌱 Database seeded successfully.");
}

try {
	await main();
} catch (error) {
	console.error("❌ Failed to seed database.");
	console.error(error);
	process.exitCode = 1;
} finally {
	await prisma.$disconnect();
}
