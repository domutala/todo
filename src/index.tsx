import { serve } from "bun";
import index from "./index.html";
import { todo } from "./todo";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/todo": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },

      async PUT(req) {
        const { title, id } = await req.json();
        const $todo = todo.create({ title: title });

        return Response.json($todo);
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production",

  port: 4500,
});

console.log(`🚀 Server running at ${server.url}`);
