import { Task } from '@vice_bank/models/task';
import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';
import { isArray } from 'tcheck';
import { arrayToObject } from '@/utils/array_to_obj';

class TaskDataService extends FileDataService {
  protected _tasks: Record<string, Task> = {};

  get taskString() {
    return JSON.stringify(Object.values(this._tasks));
  }

  get tasks() {
    return { ...this._tasks };
  }

  async getTaskById(Id: string): Promise<Task> {
    const task = this._tasks[Id];

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    const tasks = Object.values(this._tasks).filter(
      (task) => task.userId === userId,
    );

    return tasks;
  }

  async addTask(task: Task): Promise<Task> {
    const oldTask = this._tasks[task.id];

    if (oldTask) {
      throw new Error('Task already exists');
    }

    this._tasks[task.id] = task;

    await this.writeTasksToFile();

    return task;
  }

  async updateTask(task: Task): Promise<Task> {
    const oldTask = this._tasks[task.id];

    if (!oldTask) {
      throw new NotFoundError('Task not found');
    }

    this._tasks[task.id] = task;

    await this.writeTasksToFile();

    return oldTask;
  }

  async deleteTask(taskId: string): Promise<Task> {
    const oldTask = this._tasks[taskId];

    if (!oldTask) {
      throw new NotFoundError('Task not found');
    }

    delete this._tasks[taskId];

    await this.writeTasksToFile();

    return oldTask;
  }

  async writeTasksToFile() {
    await this.writeDataToFile({
      path: this.filePath,
      filename: `${this.baseFilename}.json`,
      content: this.taskString,
    });
  }

  async init() {
    const dataStr = await this.readFile(this.filePath);

    try {
      const rawData = JSON.parse(dataStr);

      if (!isArray(rawData)) {
        throw new Error('Data is not an array');
      }

      const tasks: Task[] = [];

      for (const dat of rawData) {
        const task = Task.fromJSON(dat);
        tasks.push(task);
      }

      this._tasks = arrayToObject(tasks, (a) => a.id);
    } catch (e) {
      console.error('Error parsing data', e);

      await this.clearFile();
    }
  }

  async clearFile() {
    return super.clearFile(this.filePath);
  }
}

const actionService = new TaskDataService(getBaseFilePath(), 'actions');
export async function initActions() {
  await actionService.init();
}

export async function getTasks(userId: string) {
  return actionService.getTasksByUser(userId);
}

export async function getTask(taskId: string, userId: string) {
  const task = await actionService.getTaskById(taskId);

  if (task.userId !== userId) {
    throw new NotFoundError('Task not found');
  }

  return task;
}

export async function addTask(task: Task) {
  return actionService.addTask(task);
}

export async function updateTask(task: Task) {
  return actionService.updateTask(task);
}

export async function deleteTask(taskId: string) {
  return actionService.deleteTask(taskId);
}

export async function clearTasks() {
  return actionService.clearFile();
}
