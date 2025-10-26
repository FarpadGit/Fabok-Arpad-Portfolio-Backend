/**
 * A set of functions called "actions" for `by-slug`
 */

import { type Context, type Next } from "koa";

export default {
  bySlug: async (ctx: Context, next: Next) => {
    try {
      const project = await strapi
        .query("api::project.project")
        .findOne({ where: { slug: ctx.params.id }, populate: ["tags"] });
      ctx.body = { data: project };
    } catch (err) {
      ctx.body = err;
    }
  },
};
