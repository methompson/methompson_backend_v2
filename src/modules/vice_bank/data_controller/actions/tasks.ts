import { Task } from '@vice_bank/models/task';
import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';

class TaskDataService extends FileDataService<Task> {
  parseData(data: unknown): Task {
    return Task.fromJSON(data);
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    const tasks = Object.values(this._data).filter(
      (task) => task.userId === userId,
    );

    return tasks;
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
  const task = await actionService.getDataById(taskId);

  if (task.userId !== userId) {
    throw new NotFoundError('Task not found');
  }

  return task;
}

export async function addTask(task: Task) {
  return actionService.addData({ data: task });
}

export async function updateTask(task: Task) {
  return actionService.updateData({ data: task });
}

export async function deleteTask(taskId: string) {
  return actionService.deleteData({ id: taskId });
}

export async function clearTasks() {
  return actionService.clearFile();
}
