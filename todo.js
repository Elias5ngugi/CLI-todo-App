import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import readline from "readline";

const db = new PrismaClient();
const taskStatuses = ["pending", "ongoing", "done"];

export async function createTask({ name, details, progress }) {
  if (!name || !details || !progress) {
    console.log(chalk.red("Error: All fields must be filled!"));
    return;
  }

  if (!taskStatuses.includes(progress.toLowerCase())) {
    console.log(
      chalk.red('Error: Progress should be "pending", "ongoing", or "done"!')
    );
    return;
  }

  const task = await db.todo.create({
    data: { title: name, description: details, status: progress.toUpperCase() },
  });
  console.log(
    chalk.green(
      `Task added: ${task.title} - ${task.description} [${task.status}]`
    )
  );
}

export async function modifyTask({ taskId, name, details, progress }) {
  if (!taskId) {
    console.log(chalk.red("Error: Task ID is required!"));
    return;
  }

  if (progress && !taskStatuses.includes(progress.toLowerCase())) {
    console.log(chalk.red("Error: Invalid progress value!"));
    return;
  }

  await db.todo.update({
    where: { id: taskId },
    data: {
      title: name,
      description: details,
      status: progress ? progress.toUpperCase() : undefined,
    },
  });
  console.log(chalk.yellow("Task updated successfully!"));
}

export async function viewTasks({ taskId }) {
  if (taskId) {
    const task = await db.todo.findUnique({ where: { id: taskId } });
    if (!task) {
      console.log(chalk.red("Task not found!"));
      return;
    }
    console.log(
      chalk.blue(`${task.title} - ${task.description} [${task.status}]`)
    );
  } else {
    const tasks = await db.todo.findMany();
    tasks.forEach((task) => {
      console.log(
        `${chalk.magenta(task.id)} - ${task.title} - ${task.description} [${task.status}]`
      );
    });
  }
}

export async function removeTask({ taskId }) {
  if (!taskId) {
    console.log(chalk.red("Error: Task ID is required!"));
    return;
  }
  await db.todo.delete({ where: { id: taskId } });
  console.log(chalk.red("Task removed!"));
}

export async function clearAllTasks() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(chalk.red("Do you really want to delete everything? (yes/no): "), async (response) => {
    if (response.toLowerCase() === "yes") {
      await db.todo.deleteMany();
      console.log(chalk.red("All tasks erased!"));
    } else {
      console.log(chalk.blue("Action aborted."));
    }
    rl.close();
  });
}
