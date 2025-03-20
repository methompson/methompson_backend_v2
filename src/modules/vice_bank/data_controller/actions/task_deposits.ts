import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { TaskDeposit } from '@vice_bank/models/task_deposit';

class TaskDepositService extends FileDataService<TaskDeposit> {
  parseData(data: unknown): TaskDeposit {
    return TaskDeposit.fromJSON(data);
  }

  async getTaskDepositsByUser(userId: string): Promise<TaskDeposit[]> {
    const deposits = Object.values(this._data).filter(
      (deposit) => deposit.userId === userId,
    );

    return deposits;
  }
}

const taskDepositService = new TaskDepositService(
  getBaseFilePath(),
  'task_deposit',
);
export async function initTaskDeposits() {
  await taskDepositService.init();
}

export async function getTaskDeposits(userId: string) {
  return taskDepositService.getTaskDepositsByUser(userId);
}

export async function getTaskDeposit(depositId: string, userId: string) {
  const deposit = await taskDepositService.getDataById(depositId);

  if (deposit.userId !== userId) {
    throw new Error('Deposit not found for this user');
  }

  return deposit;
}

export async function addTaskDeposit(deposit: TaskDeposit) {
  return taskDepositService.addData({ data: deposit });
}

export async function updateTaskDeposit(deposit: TaskDeposit) {
  return taskDepositService.updateData({ data: deposit });
}

export async function deleteTaskDeposit(depositId: string) {
  return taskDepositService.deleteData({ id: depositId });
}

export async function clearTaskDeposits() {
  return taskDepositService.clearFile();
}
