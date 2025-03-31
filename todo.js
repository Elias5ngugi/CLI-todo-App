import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import readline from "readline";

const prisma = new PrismaClient();
const validStatuses = ["todo", "inprogress", "complete"];

export async function addTask({ title, description, status }) {
  if (!title || !description || !status) {
    console.log(chalk.bgRed.white(" Error: All fields are required! "));
    return;
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    console.log(chalk.bgMagenta.white(' Error: Status must be "todo", "inprogress", or "complete"! '));
    return;
  }

  const newTask = await prisma.todo.create({
    data: { title, description, status: status.toUpperCase() },
  });
  console.log(chalk.greenBright(`Task Added: ${chalk.bold(newTask.title)} - ${newTask.description} [${chalk.cyan(newTask.status)}]`));
}

export async function updateTask({ id, title, description, status }) {
  if (!id) {
    console.log(chalk.bgRed.white(" Error: Task ID is required! "));
    return;
  }

  if (status && !validStatuses.includes(status.toLowerCase())) {
    console.log(chalk.bgYellow.black(" Error: Invalid status! "));
    return;
  }

  await prisma.todo.update({
    where: { id },
    data: {
      title,
      description,
      status: status ? status.toUpperCase() : undefined,
    },
  });
  console.log(chalk.yellowBright("Task Updated Successfully!"));
}

export async function viewTasks({ id }) {
  if (id) {
    const task = await prisma.todo.findUnique({ where: { id } });
    if (!task) {
      console.log(chalk.bgRed.white(" Task not found! "));
      return;
    }
    console.log(chalk.blueBright(`${chalk.bold(task.title)} - ${task.description} [${chalk.green(task.status)}]`));
  } else {
    const tasks = await prisma.todo.findMany();
    tasks.forEach((task) => {
      console.log(`${chalk.magenta(task.id)} - ${chalk.bold(task.title)} - ${task.description} [${chalk.blue(task.status)}]`);
    });
  }
}

export async function removeTask({ id }) {
  if (!id) {
    console.log(chalk.bgRed.white(" Error: Task ID is required! "));
    return;
  }
  await prisma.todo.delete({ where: { id } });
  console.log(chalk.redBright("Task Removed Successfully!"));
}

export async function removeAllTasks() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(chalk.bgYellow.black(" Are you sure? (yes/no): "), async (answer) => {
    if (answer.toLowerCase() === "yes") {
      await prisma.todo.deleteMany();
      console.log(chalk.bgRed.white(" All tasks have been removed! "));
    } else {
      console.log(chalk.blueBright(" Operation cancelled. "));
    }
    rl.close();
  });
}
