import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { arrayToObject } from '@/utils/array_to_obj';
import { NotFoundError } from '@/utils/errors';
import { ActionDeposit } from '@vice_bank/models/action_deposit';
import { isArray } from 'tcheck';

class ActionDepositService extends FileDataService {
  protected _actionDeposits: Record<string, ActionDeposit> = {};

  get actionDepositString() {
    return JSON.stringify(Object.values(this._actionDeposits));
  }

  get actionDeposits() {
    return { ...this._actionDeposits };
  }

  async getActionDepositById(id: string): Promise<ActionDeposit> {
    const deposit = this._actionDeposits[id];

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    return deposit;
  }

  async getActionDepositsByUser(userId: string): Promise<ActionDeposit[]> {
    const deposits = Object.values(this._actionDeposits).filter(
      (deposit) => deposit.userId === userId,
    );

    return deposits;
  }

  async addActionDeposit(deposit: ActionDeposit): Promise<ActionDeposit> {
    const oldDeposit = this._actionDeposits[deposit.id];

    if (oldDeposit) {
      throw new Error('Deposit already exists');
    }

    this._actionDeposits[deposit.id] = deposit;

    await this.writeDepositsToFile();

    return deposit;
  }

  async updateActionDeposit(deposit: ActionDeposit): Promise<ActionDeposit> {
    const oldDeposit = this._actionDeposits[deposit.id];

    if (!oldDeposit) {
      throw new Error('Deposit not found');
    }

    this._actionDeposits[deposit.id] = deposit;

    await this.writeDepositsToFile();

    return oldDeposit;
  }

  async deleteActionDeposit(id: string): Promise<ActionDeposit> {
    const oldDeposit = this._actionDeposits[id];
    if (!oldDeposit) {
      throw new Error('Deposit not found');
    }

    delete this._actionDeposits[id];

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

      const actionDeposits: ActionDeposit[] = [];
      for (const dat of rawData) {
        const action = ActionDeposit.fromJSON(dat);
        actionDeposits.push(action);
      }

      this._actionDeposits = arrayToObject(actionDeposits, (a) => a.id);
    } catch (e) {
      console.error('Error parsing data', e);

      await this.clearFile();
    }
  }

  async clearFile() {
    return super.clearFile(this.filePath);
  }
}

const actionDepositService = new ActionDepositService(
  getBaseFilePath(),
  'action_deposits',
);
export async function initActionDeposits() {
  await actionDepositService.init();
}

export async function getActionDeposits(userId: string) {
  return actionDepositService.getActionDepositsByUser(userId);
}

export async function getActionDeposit(depositId: string, userId: string) {
  const deposit = await actionDepositService.getActionDepositById(depositId);

  if (deposit.userId !== userId) {
    throw new NotFoundError('Task not found');
  }

  return deposit;
}

export async function addActionDeposit(deposit: ActionDeposit) {
  return actionDepositService.addActionDeposit(deposit);
}

export async function updateActionDeposit(deposit: ActionDeposit) {
  return actionDepositService.updateActionDeposit(deposit);
}

export async function deleteActionDeposit(depositId: string) {
  return actionDepositService.deleteActionDeposit(depositId);
}

export async function clearActionDeposits() {
  return actionDepositService.clearFile();
}
