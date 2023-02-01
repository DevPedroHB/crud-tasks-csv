import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  // Create a new task
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Title is required." }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Description is required." }));
      }

      const task = database.insert("tasks", {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return res
        .writeHead(201)
        .end(JSON.stringify({ message: "Task created successfully.", task }));
    },
  },
  // List all tasks
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });

      return res.end(JSON.stringify(tasks));
    },
  },
  // Update a task by id
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title or description are required." })
          );
      }

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "There is no task with that id." }));
      }

      database.update("tasks", id, {
        title,
        description,
        updated_at: new Date(),
      });

      return res
        .writeHead(200)
        .end(JSON.stringify({ message: "Task updated successfully." }));
    },
  },
  // Delete a task by id
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "There is no task with that id." }));
      }

      database.delete("tasks", id);

      return res
        .writeHead(200)
        .end(JSON.stringify({ message: "Task deleted successfully." }));
    },
  },
];
