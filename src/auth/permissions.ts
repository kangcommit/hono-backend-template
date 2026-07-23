import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	userAc,
} from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
	post: ["create", "read", "update", "delete"],
};

export const ac = createAccessControl(statement);

export const user = ac.newRole({
	...userAc.statements,
	post: ["create", "read", "update", "delete"],
});

export const admin = ac.newRole({
	...adminAc.statements,
	post: ["create", "read", "update", "delete"],
});

type Statement = typeof statement;

export type AppPermissions = {
	[K in keyof Statement]?: Statement[K][number][];
};
