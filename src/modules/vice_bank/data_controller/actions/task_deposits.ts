import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { arrayToObject } from '@/utils/array_to_obj';
import { TaskDeposit } from '@vice_bank/models/task_deposit';
import { isArray } from 'tcheck';

class TaskDepositService extends FileDataService {
  protected _taskDeposits: Record<string, TaskDeposit> = {};

  get actionDepositString() {
    return JSON.stringify(Object.values(this._taskDeposits));
  }

  get taskDeposits() {
    return { ...this._taskDeposits };
  }

  async getTaskDepositById(id: string): Promise<TaskDeposit> {
    const deposit = this._taskDeposits[id];

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    return deposit;
  }

  async getTaskDepositsByUser(userId: string): Promise<TaskDeposit[]> {
    const deposits = Object.values(this._taskDeposits).filter(
      (deposit) => deposit.userId === userId,
    );

    return deposits;
  }

  async addTaskDeposit(deposit: TaskDeposit): Promise<TaskDeposit> {
    const oldDeposit = this._taskDeposits[deposit.id];

    if (oldDeposit) {
      throw new Error('Deposit already exists');
    }

    this._taskDeposits[deposit.id] = deposit;

    await this.writeDepositsToFile();

    return deposit;
  }

  async updateTaskDeposit(deposit: TaskDeposit): Promise<TaskDeposit> {
    const oldDeposit = this._taskDeposits[deposit.id];

    if (!oldDeposit) {
      throw new Error('Deposit not found');
    }

    this._taskDeposits[deposit.id] = deposit;

    await this.writeDepositsToFile();

    return oldDeposit;
  }

  async deleteTaskDeposit(id: string): Promise<TaskDeposit> {
    const oldDeposit = this._taskDeposits[id];
    if (!oldDeposit) {
      throw new Error('Deposit not found');
    }

    delete this._taskDeposits[id];

    await this.writeDepositsToFile();

    return oldDeposit;
  }

  async writeDepositsToFile() {
    await this.writeDataToFile({
      path: this.filePath,
      filename: `${this.baseFilename}.json`,
      content: this.actionDepositString,
    });
  }

  async init() {
    const dataStr = await this.readFile(this.filePath);

    try {
      const rawData = JSON.parse(dataStr);

      if (!isArray(rawData)) {
        throw new Error('Data is not an array');
      }

      const taskDeposits: TaskDeposit[] = [];

      for (const dat of rawData) {
        const task = TaskDeposit.fromJSON(dat);
        taskDeposits.push(task);
      }

      this._taskDeposits = arrayToObject(taskDeposits, (a) => a.id);
    } catch (e) {
      console.error('Error parsing data', e);

      await this.clearFile();
    }
  }

  async clearFile() {
    return super.clearFile(this.filePath);
  }
}

const taskDepositService = new TaskDepositService(
  getBaseFilePath(),
  'task_deposit',
);
export async function initActions() {
  await taskDepositService.init();
}

export async function getTaskDeposits(userId: string) {
  return taskDepositService.getTaskDepositsByUser(userId);
}

export async function getTaskDeposit(depositId: string, userId: string) {
  const deposit = await taskDepositService.getTaskDepositById(depositId);

  if (deposit.userId !== userId) {
    throw new Error('Deposit not found for this user');
  }

  return deposit;
}

export async function addTaskDeposit(deposit: TaskDeposit) {
  return taskDepositService.addTaskDeposit(deposit);
}

export async function updateTaskDeposit(deposit: TaskDeposit) {
  return taskDepositService.updateTaskDeposit(deposit);
}

export async function deleteTaskDeposit(depositId: string) {
  return taskDepositService.deleteTaskDeposit(depositId);
}

export async function clearTaskDeposits() {
  return taskDepositService.clearFile();
}
