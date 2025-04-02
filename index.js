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
  .description("Create a task and add it to the list")
  .option("-n, --name <name>", "Name of the task")
  .option("-d, --details <details>", "Details about the task")
  .option("-p, --progress <progress>", "Task progress (pending, ongoing, done)")
  .action((options) =>
    addTodo({
      title: options.name,
      description: options.details,
      status: options.progress,
    })
  );

program
  .command("updateTodo")
  .description("Modify an existing task")
  .option("-i, --id <id>", "Task ID")
  .option("-n, --name <name>", "Updated task name")
  .option("-d, --details <details>", "Updated task details")
  .option("-p, --progress <progress>", "Updated task status")
  .action(updateTodo);

program
  .command("readTodos")
  .description("View all tasks or a specific one")
  .option("-i, --id <id>", "Task ID")
  .action(readTodos);

program
  .command("deleteTodo")
  .description("Remove a specific task from the list")
  .option("-i, --id <id>", "Task ID")
  .action(deleteTodo);

program
  .command("deleteAllTodos")
  .description("Erase all tasks (confirmation needed)")
  .action(deleteAllTodos);

program.parse(process.argv);
