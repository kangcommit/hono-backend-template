import { OpenAPIHono } from "@hono/zod-openapi";
import { authRouter } from "../modules/auth/router.js";
import { meRouter } from "../modules/me/router.js";
import { postsRouter } from "../modules/posts/router.js";
import { systemRouter } from "../modules/system/router.js";

const routes = new OpenAPIHono();

routes.route("/", systemRouter);
routes.route("/", authRouter);
routes.route("/me", meRouter);
routes.route("/posts", postsRouter);

export default routes;
