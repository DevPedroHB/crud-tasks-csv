import { buildRoutePath } from "./utils/build-route-path.js";

export const routes = [
  // Create a new task
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      return res.writeHead(201).end(JSON.stringify({ title, description }));
    },
  },
];
