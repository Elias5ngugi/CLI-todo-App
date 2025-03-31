import { program } from "commander";
import { addTask, updateTask, viewTasks, removeTask, removeAllTasks } from "./todo.js";

program
  .command("addTask")
  .description("Create a task and add it to the list")
  .option("-n, --name <name>", "Name of the task")
  .option("-d, --details <details>", "Details about the task (optional)")
  .option("-p, --progress <progress>", "Task progress (TODO, INPROGRESS, COMPLETE)")
  .action((options) => {
    if (!options.name || !options.progress) {
      console.error("Error: Name and progress fields are required!");
      process.exit(1);
    }

    console.log("Received options:", options);

    addTask({
      title: options.name,
      description: options.details || "No details provided",
      status: options.progress.toUpperCase(),
    });
  });

program
  .command("updateTask")
  .description("Modify an existing task")
  .option("-i, --id <id>", "Task ID")
  .option("-n, --name <name>", "Updated task name")
  .option("-d, --details <details>", "Updated task details")
  .option("-p, --progress <progress>", "Updated task status (TODO, INPROGRESS, COMPLETE)")
  .action((options) => {
    if (!options.id) {
      console.error("Error: Task ID is required for updating.");
      process.exit(1);
    }
    updateTask(options);
  });

program
  .command("viewTasks")
  .description("View all tasks or a specific one")
  .option("-i, --id <id>", "Task ID")
  .action(viewTasks);

program
  .command("removeTask")
  .description("Remove a specific task from the list")
  .option("-i, --id <id>", "Task ID")
  .action((options) => {
    if (!options.id) {
      console.error("Error: Task ID is required for removal.");
      process.exit(1);
    }
    removeTask(options);
  });

program
  .command("removeAllTasks")
  .description("Erase all tasks (confirmation needed)")
  .action(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Are you sure you want to delete all tasks? (yes/no) ", (answer) => {
      if (answer.toLowerCase() === "yes") {
        removeAllTasks();
      } else {
        console.log("Operation cancelled.");
      }
      readline.close();
    });
  });

program.parse(process.argv);
