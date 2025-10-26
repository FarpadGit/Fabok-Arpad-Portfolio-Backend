import type { Core } from "@strapi/strapi";
import type * as Nexus from "nexus";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Force the socket to be treated as encrypted for proxy setups
    strapi.server.use(async (ctx, next) => {
      if (ctx.req?.socket) {
        (ctx.req.socket as any).encrypted = true;
      }
      await next();
    });
    strapi.plugin("graphql").service("extension").use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};

// adds a new Query to GraphQL in the form of projectBySlug(slug: String)
const extension = ({
  nexus,
  strapi,
}: {
  nexus: typeof Nexus;
  strapi: Core.Strapi;
}) => ({
  types: [
    nexus.extendType({
      type: "Query",
      definition(t) {
        t.field("projectBySlug", {
          type: "Project",
          args: {
            slug: nexus.nonNull("String"),
          },
          resolve: async (parent, args, context) => {
            const project = await strapi.query("api::project.project").findOne({
              where: {
                $and: [
                  { slug: args.slug },
                  { publishedAt: { $notNull: true } },
                ],
              },
              populate: ["tags"],
            });

            return project ?? null;
          },
        });
      },
    }),
  ],
  resolversConfig: {
    "Query.projectBySlug": {
      auth: {
        scope: ["api::project.project.findOne"], // we give permission to use the new query for those who has findOne permission of Project content type
      },
    },
  },
});
