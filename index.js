import { program } from "commander";
import {
  addTodo,
  updateTodo,
  readTodos,
  deleteTodo,
  deleteAllTodos,
} from "./todos.js";

program
  .command("addTodo")
  .description("Add a new todo")
  .option("-t, --title <title>", "Title of the todo")
  .option("-d, --description <description>", "Description of the todo")
  .option(
    "-s, --status <status>",
    "Status of the todo (todo, inprogress, complete)",
  )
  .action((options) =>
    addTodo({
      title: options.title,
      description: options.description,
      status: options.status,
    }),
  );

program
  .command("updateTodo")
  .description("Update a todo item")
  .option("-i, --id <id>", "ID of the todo")
  .option("-t, --title <title>", "New title")
  .option("-d, --description <description>", "New description")
  .option("-s, --status <status>", "New status (todo, inprogress, complete)")
  .action(updateTodo);

program
  .command("readTodos")
  .description("Read all todos or a specific one")
  .option("-i, --id <id>", "ID of the todo")
  .action(readTodos);

program
  .command("deleteTodo")
  .description("Delete a specific todo")
  .option("-i, --id <id>", "ID of the todo")
  .action(deleteTodo);

program
  .command("deleteAllTodos")
  .description("Delete all todos and asks for confirmation")
  .action(deleteAllTodos);

program.parse(process.argv);
