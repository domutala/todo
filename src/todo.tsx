import { Database } from "bun:sqlite";
import { Todo } from "./interfaces/Todo";

const db = new Database("todo.sqlite", { create: true });
db.run(`
  CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
`);

export const todo = {
  create({ title }: { title: string }) {
    // Insert a new todo into the database.

    const stmt = db.prepare("INSERT INTO todo (title) VALUES (?)").as(Todo);
    const change = stmt.run(title);
    stmt.finalize();

    const $todo = db
      .query("SELECT * FROM todo WHERE id = $id LIMIT 1")
      .as(Todo)
      .get(change.lastInsertRowid);

    return $todo;
  },

  remove() {},

  get() {},

  list() {},
};
