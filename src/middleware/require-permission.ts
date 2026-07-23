import type { MiddlewareHandler } from "hono";
import type { AppPermissions } from "../auth/permissions.js";
import { ForbiddenError, UnauthorizedError } from "../errors/http-errors.js";
import { auth } from "../lib/auth.js";

export function requirePermission(
	permissions: AppPermissions,
): MiddlewareHandler {
	return async (c, next) => {
		const user = c.get("user");

		if (!user) {
			throw new UnauthorizedError();
		}

		const allowed = await auth.api.userHasPermission({
			body: {
				userId: user.id,
				permissions,
			},
		});

		if (!allowed.success) {
			throw new ForbiddenError();
		}

		await next();
	};
}
