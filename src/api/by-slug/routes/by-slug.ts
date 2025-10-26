export default {
  routes: [
    {
      method: "GET",
      path: "/projects/by-slug/:id",
      handler: "by-slug.bySlug",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
